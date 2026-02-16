import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, AlertTriangle } from "lucide-react"
import {
  DENOMINATIONS,
  type RowData,
  createEmptyRow,
  calcRowTotal,
} from "@/config/denominations"
import { BillImage } from "./BillImage"

interface HongbaoTableProps {
  rows: RowData[]
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>
}

export function HongbaoTable({ rows, setRows }: HongbaoTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const updateName = useCallback(
    (id: string, name: string) => {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)))
    },
    [setRows]
  )

  const updateCount = useCallback(
    (id: string, denomValue: number, raw: string) => {
      const parsed = parseInt(raw, 10)
      const value = isNaN(parsed) || parsed < 0 ? 0 : Math.floor(parsed)
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, counts: { ...r.counts, [denomValue]: value } }
            : r
        )
      )
    },
    [setRows]
  )

  const incrementCount = useCallback(
    (id: string, denomValue: number) => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, counts: { ...r.counts, [denomValue]: (r.counts[denomValue] || 0) + 1 } }
            : r
        )
      )
    },
    [setRows]
  )

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, createEmptyRow()])
  }, [setRows])

  const deleteRow = useCallback(
    (id: string) => {
      setRows((prev) => prev.filter((r) => r.id !== id))
      setConfirmDeleteId(null)
    },
    [setRows]
  )

  return (
    <div className="w-full">
      {/* Desktop/Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gold-400/30">
              <th className="text-left py-3 px-3 font-display text-sm font-semibold text-[#5a3e2b] min-w-[120px]">
                稱謂/姓名
              </th>
              {DENOMINATIONS.map((d) => (
                <th key={d.value} className="py-3 px-2 text-center min-w-[140px]">
                  <span className="text-xs font-semibold text-[#5a3e2b]/70">
                    {d.label}
                  </span>
                </th>
              ))}
              <th className="py-3 px-3 text-center font-display text-sm font-semibold text-[#5a3e2b] min-w-[90px]">
                小計
              </th>
              <th className="py-3 px-2 w-10" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {rows.map((row, idx) => {
                const rowTotal = calcRowTotal(row)
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    className="border-b border-gold-400/10 hover:bg-gold-50/40 transition-colors group"
                  >
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateName(row.id, e.target.value)}
                        placeholder="輸入姓名..."
                        className="w-full bg-transparent border-b border-gold-300/40 focus:border-gold-500 outline-none py-1.5 px-1 text-sm text-[#3d2e1f] placeholder:text-[#b8a080] transition-colors font-medium"
                      />
                    </td>
                    {DENOMINATIONS.map((d) => (
                      <td key={d.value} className="py-2 px-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => incrementCount(row.id, d.value)}
                            className="relative cursor-pointer group/bill transition-transform hover:scale-105 active:scale-90 shrink-0"
                            title={`點擊 +1 張 ${d.label}`}
                          >
                            <BillImage denomination={d} height={32} />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center opacity-0 group-hover/bill:opacity-100 transition-opacity shadow-sm">
                              +1
                            </div>
                          </button>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={row.counts[d.value] || ""}
                            onChange={(e) => updateCount(row.id, d.value, e.target.value)}
                            onFocus={(e) => e.target.select()}
                            placeholder="0"
                            className="w-14 bg-white/60 border border-gold-300/30 rounded-lg text-center py-1.5 text-sm font-mono text-[#3d2e1f] placeholder:text-[#ccc] focus:border-gold-500 focus:ring-2 focus:ring-gold-300/30 outline-none transition-all hover:border-gold-400/50"
                          />
                        </div>
                      </td>
                    ))}
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`font-mono text-lg font-black transition-colors ${
                          rowTotal > 0 ? "text-red-700" : "text-[#bbb]"
                        }`}
                      >
                        ${rowTotal.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      {confirmDeleteId === row.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                          >
                            確定
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(row.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all p-1 rounded hover:bg-red-50"
                          title="刪除"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {rows.map((row, idx) => {
            const rowTotal = calcRowTotal(row)
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl border border-gold-300/20 p-3 shadow-sm overflow-hidden"
              >
                {/* Row 1: Name */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateName(row.id, e.target.value)}
                    placeholder="輸入姓名..."
                    className="w-full bg-transparent border-b border-gold-300/40 focus:border-gold-500 outline-none py-1 text-base text-[#3d2e1f] placeholder:text-[#b8a080] font-semibold"
                  />
                </div>

                {/* Row 2: Bill buttons + inputs */}
                <div className="grid grid-cols-3 gap-2">
                  {DENOMINATIONS.map((d) => (
                    <div key={d.value} className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => incrementCount(row.id, d.value)}
                        className="relative cursor-pointer transition-transform active:scale-90"
                        title={`+1 張 ${d.label}`}
                      >
                        <BillImage denomination={d} height={28} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                          +1
                        </div>
                      </button>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={row.counts[d.value] || ""}
                        onChange={(e) => updateCount(row.id, d.value, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        placeholder="0"
                        className="w-full bg-white/80 border border-gold-300/30 rounded-lg text-center py-1 text-sm font-mono text-[#3d2e1f] placeholder:text-[#ccc] focus:border-gold-500 focus:ring-2 focus:ring-gold-300/30 outline-none"
                      />
                      <span className="text-[10px] text-[#a08a6e] leading-tight">{d.label}</span>
                    </div>
                  ))}
                </div>

                {/* Row 3: Subtotal + Delete — same line, inside card */}
                <div className="mt-3 pt-2 border-t border-gold-200/30 flex items-center justify-between">
                  {/* Delete */}
                  <div className="shrink-0">
                    {confirmDeleteId === row.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="text-[11px] bg-red-600 text-white px-2 py-1 rounded-md"
                        >
                          確定刪除
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[11px] bg-gray-200 text-gray-600 px-2 py-1 rounded-md"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(row.id)}
                        className="text-red-300 hover:text-red-500 p-1 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        <span className="text-[11px]">刪除</span>
                      </button>
                    )}
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs text-[#8a7460]">小計　</span>
                    <span
                      className={`font-mono text-lg font-black ${
                        rowTotal > 0 ? "text-red-700" : "text-[#bbb]"
                      }`}
                    >
                      ${rowTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Add row button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={addRow}
        className="w-full mt-4 py-3 bg-gradient-to-r from-red-700/10 to-gold-500/10 border-2 border-dashed border-gold-400/40 rounded-xl text-[#8a5e3a] hover:border-gold-500 hover:from-red-700/15 hover:to-gold-500/15 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
      >
        🧧 新增一位
      </motion.button>

      {rows.length === 0 && (
        <div className="text-center py-12 text-[#b8a080]">
          <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">尚未新增任何紅包記錄</p>
          <p className="text-xs mt-1 opacity-70">點擊上方按鈕開始記錄</p>
        </div>
      )}
    </div>
  )
}
