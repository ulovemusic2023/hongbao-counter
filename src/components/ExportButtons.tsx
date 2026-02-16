import { motion } from "framer-motion"
import { FileText, FileJson } from "lucide-react"
import { exportTxt, exportJson } from "@/lib/export"
import type { RowData } from "@/config/denominations"

interface ExportButtonsProps {
  rows: RowData[]
}

export function ExportButtons({ rows }: ExportButtonsProps) {
  const disabled = rows.length === 0

  return (
    <div className="flex flex-wrap gap-3">
      <motion.button
        whileHover={disabled ? {} : { scale: 1.03 }}
        whileTap={disabled ? {} : { scale: 0.97 }}
        onClick={() => !disabled && exportTxt(rows)}
        disabled={disabled}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5a3e2b] to-[#7a5a42] text-cream-50 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FileText size={16} />
        匯出 TXT
      </motion.button>

      <motion.button
        whileHover={disabled ? {} : { scale: 1.03 }}
        whileTap={disabled ? {} : { scale: 0.97 }}
        onClick={() => !disabled && exportJson(rows)}
        disabled={disabled}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-700 text-cream-50 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FileJson size={16} />
        匯出 JSON
      </motion.button>
    </div>
  )
}
