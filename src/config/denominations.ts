export interface Denomination {
  value: number
  label: string
  color: string       // Primary color for the bill
  accentColor: string // Secondary/accent color
  gradient: string    // CSS gradient for bill placeholder
}

export const DENOMINATIONS: Denomination[] = [
  {
    value: 1000,
    label: "1000元",
    color: "#1a5276",
    accentColor: "#2980b9",
    gradient: "linear-gradient(135deg, #1a5276 0%, #154360 30%, #1a6894 50%, #1a5276 70%, #0e3d5c 100%)",
  },
  {
    value: 500,
    label: "500元",
    color: "#6b3a2a",
    accentColor: "#a0522d",
    gradient: "linear-gradient(135deg, #6b3a2a 0%, #5c3322 30%, #8b5e3c 50%, #6b3a2a 70%, #4a2a1e 100%)",
  },
  {
    value: 100,
    label: "100元",
    color: "#8b1a1a",
    accentColor: "#c0392b",
    gradient: "linear-gradient(135deg, #8b1a1a 0%, #7b1818 30%, #a82020 50%, #8b1a1a 70%, #6d1515 100%)",
  },
]

export interface RowData {
  id: string
  name: string
  counts: Record<number, number> // denomination value -> count
}

export function createEmptyRow(): RowData {
  return {
    id: crypto.randomUUID(),
    name: "",
    counts: Object.fromEntries(DENOMINATIONS.map((d) => [d.value, 0])),
  }
}

export function calcRowTotal(row: RowData): number {
  return DENOMINATIONS.reduce((sum, d) => sum + (row.counts[d.value] || 0) * d.value, 0)
}

export function calcColumnTotal(rows: RowData[], denomValue: number): number {
  return rows.reduce((sum, row) => sum + (row.counts[denomValue] || 0), 0)
}

export function calcGrandTotal(rows: RowData[]): number {
  return rows.reduce((sum, row) => sum + calcRowTotal(row), 0)
}
