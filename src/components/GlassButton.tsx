"use client"

import { Button, ButtonProps } from "@/components/ui/button"

interface GlassButtonProps extends ButtonProps {
  children: React.ReactNode
}

export function GlassButton({ children, className = "", ...props }: GlassButtonProps) {
  return (
    <Button 
      className={`glass ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}