import {
  DENOMINATIONS,
  type RowData,
  calcRowTotal,
  calcColumnTotal,
  calcGrandTotal,
} from "@/config/denominations"

function getTimestamp(): { date: string; filename: string } {
  const now = new Date()
  const y = now.getFullYear()
  const mo = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const h = String(now.getHours()).padStart(2, "0")
  const mi = String(now.getMinutes()).padStart(2, "0")
  return {
    date: `${y}-${mo}-${d} ${h}:${mi}`,
    filename: `${y}${mo}${d}_${h}${mi}`,
  }
}

function padRight(str: string, len: number): string {
  // For CJK characters, each takes ~2 columns width
  let width = 0
  for (const ch of str) {
    width += ch.charCodeAt(0) > 127 ? 2 : 1
  }
  const padding = Math.max(0, len - width)
  return str + " ".repeat(padding)
}

export function exportTxt(rows: RowData[]): void {
  const { date, filename } = getTimestamp()
  const denomLabels = DENOMINATIONS.map((d) => `${d.value}`)
  
  let txt = "紅包點鈔表\n"
  txt += `日期：${date}\n`
  txt += `幣別：TWD\n`
  txt += `面額：${denomLabels.join(", ")}\n\n`
  txt += "明細：\n"

  // Header
  const nameCol = 12
  const numCol = 8
  let header = padRight("稱謂/姓名", nameCol)
  for (const d of DENOMINATIONS) {
    header += "| " + padRight(`${d.value}張`, numCol)
  }
  header += "| " + padRight("小計", numCol)
  txt += header + "\n"

  // Rows
  for (const row of rows) {
    let line = padRight(row.name || "(未填)", nameCol)
    for (const d of DENOMINATIONS) {
      line += "| " + padRight(String(row.counts[d.value] || 0), numCol)
    }
    line += "| " + padRight(String(calcRowTotal(row)), numCol)
    txt += line + "\n"
  }

  // Separator
  const totalWidth = nameCol + (DENOMINATIONS.length + 1) * (numCol + 2)
  txt += "-".repeat(totalWidth) + "\n"

  // Total row
  let totalLine = padRight("總計", nameCol)
  for (const d of DENOMINATIONS) {
    totalLine += "| " + padRight(String(calcColumnTotal(rows, d.value)), numCol)
  }
  totalLine += "| " + padRight(String(calcGrandTotal(rows)), numCol)
  txt += totalLine + "\n\n"

  txt += "備註：張數為鈔票數量；小計/總計為金額（元）。\n"

  downloadFile(`hongbao_${filename}.txt`, txt, "text/plain;charset=utf-8")
}

export function exportJson(rows: RowData[]): void {
  const { date, filename } = getTimestamp()

  const data = {
    meta: {
      title: "紅包點鈔表",
      date,
      currency: "TWD",
      denominations: DENOMINATIONS.map((d) => ({
        value: d.value,
        label: d.label,
      })),
    },
    rows: rows.map((row) => ({
      name: row.name || "(未填)",
      counts: Object.fromEntries(
        DENOMINATIONS.map((d) => [d.value, row.counts[d.value] || 0])
      ),
      subtotal: calcRowTotal(row),
    })),
    totals: {
      counts: Object.fromEntries(
        DENOMINATIONS.map((d) => [d.value, calcColumnTotal(rows, d.value)])
      ),
      grandTotal: calcGrandTotal(rows),
    },
  }

  const json = JSON.stringify(data, null, 2)
  downloadFile(`hongbao_${filename}.json`, json, "application/json;charset=utf-8")
}

function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
