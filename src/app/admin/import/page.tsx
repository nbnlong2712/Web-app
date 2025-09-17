'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { importToolsFromCSV, validateAdminAccessKey } from './actions';
import { parseCSVLine, normalizeHeader, generateSlug } from './utils';

// Define types for our CSV data
interface CSVRow {
  name: string;
  slug?: string;
  description?: string;
  homepage_url?: string;
  affiliate_url?: string;
  primary_tag?: string;
  tags?: string;
  pricing?: 'free' | 'freemium' | 'paid';
  platform?: 'web' | 'api' | 'desktop';
  language?: string;
  no_signup?: boolean;
  status?: string;
}

interface ImportError {
  row: number;
  errors: string[];
}

export default function AdminImportPage() {
  const [accessKey, setAccessKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<CSVRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [importResults, setImportResults] = useState<{ created: number; updated: number; errors: ImportError[] } | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if access key is valid
  const handleAuthentication = async () => {
    try {
      const isValid = await validateAdminAccessKey(accessKey);
      if (isValid) {
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError('Invalid access key');
      }
    } catch (error) {
      setError('Authentication error');
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  // Validate CSV structure
  const validateCSVStructure = (headers: string[]): boolean => {
    // Check if required headers are present
    const requiredHeaders = ['name'];
    return requiredHeaders.every(header => 
      headers.includes(header) || 
      headers.includes(header.replace('_', ' ')) ||
      headers.includes(header.replace('_', '-'))
    );
  };

  // Validate a single CSV row
  const validateCSVRow = (row: CSVRow): string[] => {
    const errors: string[] = [];
    
    // Check required fields
    if (!row.name) {
      errors.push('Missing required field: name');
    }
    
    // Validate pricing values
    if (row.pricing && !['free', 'freemium', 'paid'].includes(row.pricing)) {
      errors.push(`Invalid pricing value: ${row.pricing}. Must be free, freemium, or paid.`);
    }
    
    // Validate platform values
    if (row.platform && !['web', 'api', 'desktop'].includes(row.platform)) {
      errors.push(`Invalid platform value: ${row.platform}. Must be web, api, or desktop.`);
    }
    
    // Validate URLs
    if (row.homepage_url && !isValidUrl(row.homepage_url)) {
      errors.push(`Invalid homepage URL: ${row.homepage_url}`);
    }
    
    if (row.affiliate_url && !isValidUrl(row.affiliate_url)) {
      errors.push(`Invalid affiliate URL: ${row.affiliate_url}`);
    }
    
    return errors;
  };

  // Helper function to validate URLs
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Parse CSV file
  const parseCSV = (file: File): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');
          const headers = parseCSVLine(lines[0]);
          
          // Validate CSV structure
          if (!validateCSVStructure(headers)) {
            throw new Error('CSV structure is invalid. Required columns are missing.');
          }
          
          const normalizedHeaders = headers.map(normalizeHeader);
          
          const rows: CSVRow[] = [];
          const errors: ImportError[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = parseCSVLine(lines[i]);
            const row: CSVRow = {} as CSVRow;
            
            normalizedHeaders.forEach((header, index) => {
              const value = values[index];
              if (!value) return;
              
              switch (header) {
                case 'name':
                  row.name = value;
                  // Generate slug if missing
                  if (!row.slug) {
                    row.slug = generateSlug(value);
                  }
                  break;
                case 'slug':
                  row.slug = value;
                  break;
                case 'description':
                  row.description = value;
                  break;
                case 'homepage_url':
                  row.homepage_url = value;
                  break;
                case 'affiliate_url':
                  row.affiliate_url = value;
                  break;
                case 'primary_tag':
                  row.primary_tag = value;
                  break;
                case 'tags':
                  // Normalize tags from semicolon-separated values
                  row.tags = value;
                  break;
                case 'pricing':
                  if (['free', 'freemium', 'paid'].includes(value)) {
                    row.pricing = value as 'free' | 'freemium' | 'paid';
                  }
                  break;
                case 'platform':
                  if (['web', 'api', 'desktop'].includes(value)) {
                    row.platform = value as 'web' | 'api' | 'desktop';
                  }
                  break;
                case 'language':
                  row.language = value;
                  break;
                case 'no_signup':
                  row.no_signup = value.toLowerCase() === 'true' || value === '1';
                  break;
                case 'status':
                  row.status = value;
                  break;
              }
            });
            
            // Only add rows with a name
            if (row.name) {
              // Validate the row
              const rowErrors = validateCSVRow(row);
              if (rowErrors.length > 0) {
                errors.push({ row: i + 1, errors: rowErrors });
              } else {
                rows.push(row);
              }
            }
          }
          
          // If there are critical errors, reject the promise
          if (rows.length === 0 && errors.length > 0) {
            reject(new Error('All rows failed validation. Please check the errors and try again.'));
          }
          
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  // Handle file upload and preview
  const handleUploadAndPreview = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate processing progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const data = await parseCSV(file);
      clearInterval(interval);
      setProgress(100);

      // Show first 10 rows for preview
      setPreviewData(data.slice(0, 10));
      setShowPreview(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Error parsing CSV: ${error.message}`);
      } else {
        setError('Error parsing CSV: Unknown error occurred');
      }
      setIsProcessing(false);
    }
  };

  // Confirm import
  const handleConfirmImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setShowPreview(false);
    setProgress(0);
    setError(null);

    try {
      // Parse the CSV file first
      const csvData = await parseCSV(file);
      
      // Update progress
      setProgress(50);
      
      // Call the server action to import the data
      const result = await importToolsFromCSV(csvData as any);
      
      // Update progress
      setProgress(100);
      
      // Set the import results
      setImportResults(result);
      
      setIsProcessing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Error during import: ${error.message}`);
      } else {
        setError('Error during import: Unknown error occurred');
      }
      setIsProcessing(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setFile(null);
    setPreviewData([]);
    setShowPreview(false);
    setImportResults(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // If not authenticated, show access key input
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Import</CardTitle>
            <CardDescription>Enter access key to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="accessKey">Access Key</Label>
                <Input
                  id="accessKey"
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter admin access key"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleAuthentication} className="w-full">
                Authenticate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Import</CardTitle>
          <CardDescription>Import tools via CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!importResults ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a CSV file with tool data. The first row should contain headers.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-center text-sm text-muted-foreground">
                      Processing... {progress}%
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleUploadAndPreview}
                    disabled={!file || isProcessing}
                  >
                    Upload and Preview
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isProcessing}
                  >
                    Reset
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>Import Complete</AlertTitle>
                  <AlertDescription>
                    <p>Created: {importResults.created} tools</p>
                    <p>Updated: {importResults.updated} tools</p>
                    {importResults.errors.length > 0 && (
                      <p>Errors: {importResults.errors.length} rows</p>
                    )}
                  </AlertDescription>
                </Alert>

                {importResults.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Import Errors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Row</TableHead>
                            <TableHead>Errors</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importResults.errors.map((error, index) => (
                            <TableRow key={index}>
                              <TableCell>{error.row}</TableCell>
                              <TableCell>
                                <ul className="list-disc pl-4">
                                  {error.errors.map((err, errIndex) => (
                                    <li key={errIndex}>{err}</li>
                                  ))}
                                </ul>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handleReset} className="w-full">
                  Import Another File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Import Data</DialogTitle>
            <DialogDescription>
              Review the first 10 rows of your CSV file before importing
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Homepage URL</TableHead>
                  <TableHead>Affiliate URL</TableHead>
                  <TableHead>Primary Tag</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>No Signup</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name || ''}</TableCell>
                    <TableCell>{row.slug || ''}</TableCell>
                    <TableCell>{row.description || ''}</TableCell>
                    <TableCell>{row.homepage_url || ''}</TableCell>
                    <TableCell>{row.affiliate_url || ''}</TableCell>
                    <TableCell>{row.primary_tag || ''}</TableCell>
                    <TableCell>{row.tags || ''}</TableCell>
                    <TableCell>{row.pricing || ''}</TableCell>
                    <TableCell>{row.platform || ''}</TableCell>
                    <TableCell>{row.language || ''}</TableCell>
                    <TableCell>{row.no_signup?.toString() || ''}</TableCell>
                    <TableCell>{row.status || ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Column Mapping</h3>
              <p className="text-sm text-muted-foreground">
                The system will automatically map your CSV columns to the database schema. 
                Required column: Name. Optional columns: Slug, Description, Homepage URL, 
                Affiliate URL, Primary Tag, Tags, Pricing, Platform, Language, No Signup, Status.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmImport}>Confirm and Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}