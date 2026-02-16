import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type RowData, createEmptyRow, calcGrandTotal, calcColumnTotal, DENOMINATIONS } from "@/config/denominations"
import { HongbaoTable } from "@/components/HongbaoTable"

function App() {
  const [rows, setRows] = useState<RowData[]>([
    createEmptyRow(),
    createEmptyRow(),
  ])
  const [confirmClearAll, setConfirmClearAll] = useState(false)

  const grandTotal = calcGrandTotal(rows)

  const handleClearAll = () => {
    setRows([createEmptyRow(), createEmptyRow()])
    setConfirmClearAll(false)
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="bg-gradient-to-b from-red-700 via-red-700 to-red-800 pt-8 pb-14 px-4 text-center relative">
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          <div className="absolute top-3 left-6 opacity-30 text-3xl sm:text-4xl">🏮</div>
          <div className="absolute top-3 right-6 opacity-30 text-3xl sm:text-4xl">🏮</div>
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20 20 40 0 20z' fill='%23FFD700' fill-opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "20px 20px",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl sm:text-6xl mb-3">🧧</div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-gold-300 tracking-widest"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            >
              紅包點鈔管理系統
            </h1>
            <p className="text-gold-200/60 text-xs sm:text-sm mt-2 tracking-wide">
              Red Envelope Cash Counter
            </p>
          </motion.div>
        </div>
        <div className="bg-red-800 relative">
          <svg viewBox="0 0 1440 50" className="w-full block -mb-px" preserveAspectRatio="none">
            <path d="M0,0 C480,50 960,50 1440,0 L1440,50 L0,50 Z" fill="var(--color-cream-50, #fefcf7)" />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-md rounded-2xl border border-gold-300/20 shadow-xl shadow-gold-900/5 p-4 sm:p-6"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2
                className="text-lg font-bold text-[#5a3e2b] flex items-center gap-2"
                style={{ fontFamily: "'Noto Serif TC', serif" }}
              >
                <span className="text-xl">💰</span>
                點鈔明細
              </h2>
              <p className="text-xs text-[#a08a6e] mt-0.5">
                點擊鈔票圖片可快速加張數，或直接鍵入數字
              </p>
            </div>
          </div>

          {/* Table */}
          <HongbaoTable rows={rows} setRows={setRows} />

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            {rows.length > 0 && (
              <div className="relative">
                {confirmClearAll ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600 font-medium">確定清空？</span>
                    <button
                      onClick={handleClearAll}
                      className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      確定
                    </button>
                    <button
                      onClick={() => setConfirmClearAll(false)}
                      className="text-xs bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClearAll(true)}
                    className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all font-medium"
                  >
                    🗑️ 清空全部
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Total — Clean & Simple */}
        <div className="mt-6">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

          <div className="bg-gradient-to-b from-red-800 via-red-700 to-red-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl shadow-red-900/30 border border-gold-400/20">
            <div className="absolute inset-2 border border-gold-400/20 rounded-xl pointer-events-none" />
            <div className="relative z-10">
              <p className="text-gold-300/70 text-sm tracking-[0.3em] font-display mb-3">🧧 合計 🧧</p>

              <motion.div
                key={grandTotal}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span
                  className="font-mono text-4xl sm:text-5xl font-black tracking-tight"
                  style={{
                    background: "linear-gradient(180deg, #ffd700 0%, #f5c118 40%, #daa520 70%, #b8860b 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))",
                  }}
                >
                  $ {grandTotal.toLocaleString()}
                </span>
              </motion.div>

              {/* Denomination breakdown */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-5">
                {DENOMINATIONS.map((d) => {
                  const count = calcColumnTotal(rows, d.value)
                  return (
                    <div
                      key={d.value}
                      className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gold-400/15"
                    >
                      <span className="text-gold-200/60 text-xs">{d.value}元：</span>
                      <span className="text-gold-300 font-bold text-sm ml-0.5">{count}</span>
                      <span className="text-gold-200/60 text-xs ml-0.5">張</span>
                    </div>
                  )
                })}
              </div>

              {/* Blessing — only when > 0 */}
              <AnimatePresence>
                {grandTotal > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="mt-5 text-gold-300/90 text-sm tracking-[0.2em] font-display whitespace-nowrap"
                  >
                    🧧 紅包到位　福氣歸位 ✨
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-xs text-[#b8a080]">
          <p className="opacity-60">
            純前端應用 — 資料僅存於瀏覽器，不會上傳
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
