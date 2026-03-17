"use client"
import { ChevronUp } from "lucide-react"

export interface TableColumn {
  id: string
  label: string
  align?: "left" | "center" | "right"
  sortable?: boolean
}

export interface TableRow {
  id: string
  [key: string]: any
}

export interface DataTableProps {
  columns: TableColumn[]
  rows: TableRow[]
  onRowClick?: (row: TableRow) => void
  pagination?: {
    current: number
    total: number
    pageSize: number
  }
}

export function DataTable({ columns, rows, onRowClick, pagination }: DataTableProps) {
  const getAlignClass = (align?: "left" | "center" | "right") => {
    const alignMap: Record<"left" | "center" | "right", string> = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }
    return alignMap[align || "left"]
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th key={col.id} className={`px-6 py-4 font-semibold text-foreground ${getAlignClass(col.align)}`}>
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable && <ChevronUp className="h-3 w-3 opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.id} className={`px-6 py-4 ${getAlignClass(col.align)}`}>
                    {row[col.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(pagination.current - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} results
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded hover:bg-muted transition-colors">← Previous</button>
            <button className="px-3 py-1 rounded hover:bg-muted transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}
