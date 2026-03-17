import type React from "react"
export interface PageContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function PageContainer({ children, title, description }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      {title && (
        <div className="border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </div>
  )
}
