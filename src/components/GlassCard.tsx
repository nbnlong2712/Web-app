"use client"

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GlassCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function GlassCard({ title, description, children, className = "" }: GlassCardProps) {
  return (
    <div className={`glass ${className}`}>
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
          {description && <CardDescription className="text-foreground/80">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}