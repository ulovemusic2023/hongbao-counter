import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Plus, AlertTriangle } from "lucide-react"
import {
  DENOMINATIONS,
  type RowData,
  createEmptyRow,
  calcRowTotal,
  calcColumnTotal,
  calcGrandTotal,
} from "@/config/denominations"
import { BillImage } from "./BillImage"

interface HongbaoTableProps {
  rows: RowData[]
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>
  activeRowId: string | null
  setActiveRowId: (id: string | null) => void
  onBillClick: (denomValue: number) => void
}

export function HongbaoTable({ rows, setRows, activeRowId, setActiveRowId, onBillClick }: HongbaoTableProps) {
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

  const addRow = useCallback(() => {
    const newRow = createEmptyRow()
    setRows((prev) => [...prev, newRow])
    setActiveRowId(newRow.id)
  }, [setRows, setActiveRowId])

  const deleteRow = useCallback(
    (id: string) => {
      setRows((prev) => prev.filter((r) => r.id !== id))
      if (activeRowId === id) setActiveRowId(null)
      setConfirmDeleteId(null)
    },
    [setRows, activeRowId, setActiveRowId]
  )

  const grandTotal = calcGrandTotal(rows)

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
                <th key={d.value} className="py-3 px-2 text-center min-w-[120px]">
                  <button
                    type="button"
                    onClick={() => onBillClick(d.value)}
                    className="flex flex-col items-center gap-1.5 mx-auto cursor-pointer group transition-transform hover:scale-105 active:scale-95"
                    title={`點擊加一張 ${d.label}`}
                  >
                    <div className="relative">
                      <BillImage denomination={d} height={44} />
                      {/* +1 indicator on hover */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        +1
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#5a3e2b]/70">
                      {d.label}
                    </span>
                  </button>
                </th>
              ))}
              <th className="py-3 px-3 text-center font-display text-sm font-semibold text-[#5a3e2b] min-w-[100px]">
                小計
              </th>
              <th className="py-3 px-2 w-10" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {rows.map((row, idx) => {
                const rowTotal = calcRowTotal(row)
                const isActive = activeRowId === row.id
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    onClick={() => setActiveRowId(row.id)}
                    className={`border-b border-gold-400/10 transition-all cursor-pointer group ${
                      isActive
                        ? "bg-gold-100/50 ring-2 ring-gold-400/40 ring-inset"
                        : "hover:bg-gold-50/40"
                    }`}
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        {/* Active indicator */}
                        <span className={`text-red-600 text-xs transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}>
                          ▶
                        </span>
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateName(row.id, e.target.value)}
                          onFocus={() => setActiveRowId(row.id)}
                          placeholder="輸入姓名..."
                          className="w-full bg-transparent border-b border-gold-300/40 focus:border-gold-500 outline-none py-1.5 px-1 text-sm text-[#3d2e1f] placeholder:text-[#b8a080] transition-colors font-medium"
                        />
                      </div>
                    </td>
                    {DENOMINATIONS.map((d) => (
                      <td key={d.value} className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={row.counts[d.value] || ""}
                          onChange={(e) => updateCount(row.id, d.value, e.target.value)}
                          onFocus={() => setActiveRowId(row.id)}
                          placeholder="0"
                          className="w-16 mx-auto bg-white/60 border border-gold-300/30 rounded-lg text-center py-1.5 text-sm font-mono text-[#3d2e1f] placeholder:text-[#ccc] focus:border-gold-500 focus:ring-2 focus:ring-gold-300/30 outline-none transition-all hover:border-gold-400/50"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`font-mono text-base font-black transition-colors ${
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
                            onClick={(e) => { e.stopPropagation(); deleteRow(row.id) }}
                            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                          >
                            確定
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null) }}
                            className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(row.id) }}
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
          <tfoot>
            <tr className="border-t-2 border-gold-500/40 bg-gradient-to-r from-gold-50/50 to-red-50/30">
              <td className="py-3 px-3 font-display font-bold text-sm text-[#5a3e2b]">
                合計
              </td>
              {DENOMINATIONS.map((d) => (
                <td key={d.value} className="py-3 px-2 text-center">
                  <span className="font-mono text-sm font-bold text-[#5a3e2b]">
                    {calcColumnTotal(rows, d.value)} 張
                  </span>
                </td>
              ))}
              <td className="py-3 px-3 text-center">
                <motion.span
                  key={grandTotal}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-mono text-base font-black text-red-700"
                >
                  ${grandTotal.toLocaleString()}
                </motion.span>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {/* Mobile bill click bar */}
        <div className="flex justify-center gap-3 pb-2 border-b border-gold-300/20">
          {DENOMINATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => onBillClick(d.value)}
              className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-90 hover:scale-105"
              title={`點擊加一張 ${d.label}`}
            >
              <div className="relative">
                <BillImage denomination={d} height={36} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  +1
                </div>
              </div>
              <span className="text-[10px] text-[#8a7460]">{d.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {rows.map((row, idx) => {
            const rowTotal = calcRowTotal(row)
            const isActive = activeRowId === row.id
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                onClick={() => setActiveRowId(row.id)}
                className={`rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-gold-100/60 border-gold-400/40 ring-2 ring-gold-400/30 shadow-md"
                    : "bg-white/70 backdrop-blur-sm border-gold-300/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className={`text-red-600 text-xs transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}>
                      ▶
                    </span>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => updateName(row.id, e.target.value)}
                      onFocus={() => setActiveRowId(row.id)}
                      placeholder="輸入姓名..."
                      className="flex-1 bg-transparent border-b border-gold-300/40 focus:border-gold-500 outline-none py-1 text-base text-[#3d2e1f] placeholder:text-[#b8a080] font-semibold"
                    />
                  </div>
                  {confirmDeleteId === row.id ? (
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteRow(row.id) }}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg"
                      >
                        刪除
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null) }}
                        className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-lg"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(row.id) }}
                      className="ml-2 text-red-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DENOMINATIONS.map((d) => (
                    <div key={d.value} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-[#a08a6e]">{d.label}</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={row.counts[d.value] || ""}
                        onChange={(e) => updateCount(row.id, d.value, e.target.value)}
                        onFocus={() => setActiveRowId(row.id)}
                        placeholder="0"
                        className="w-full bg-white/80 border border-gold-300/30 rounded-lg text-center py-1.5 text-sm font-mono text-[#3d2e1f] placeholder:text-[#ccc] focus:border-gold-500 focus:ring-2 focus:ring-gold-300/30 outline-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-gold-200/30 text-right">
                  <span className="text-xs text-[#8a7460]">小計：</span>
                  <span
                    className={`font-mono text-base font-black ml-1 ${
                      rowTotal > 0 ? "text-red-700" : "text-[#bbb]"
                    }`}
                  >
                    ${rowTotal.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Mobile total bar */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-xl p-4 text-white shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-display font-bold">合計</span>
            <motion.span
              key={grandTotal}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              className="font-mono text-xl font-black"
            >
              ${grandTotal.toLocaleString()}
            </motion.span>
          </div>
          <div className="flex justify-between text-xs text-white/70">
            {DENOMINATIONS.map((d) => (
              <span key={d.value}>
                {d.value}元：{calcColumnTotal(rows, d.value)}張
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add row button — red-gold upgrade */}
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
