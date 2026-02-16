import { useState } from "react"
import { motion } from "framer-motion"
import { type RowData, createEmptyRow } from "@/config/denominations"
import { HongbaoTable } from "@/components/HongbaoTable"
import { ExportButtons } from "@/components/ExportButtons"

function App() {
  const [rows, setRows] = useState<RowData[]>([
    createEmptyRow(),
    createEmptyRow(),
  ])

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="relative overflow-hidden">
        {/* Red banner background */}
        <div className="bg-gradient-to-b from-red-700 via-red-700 to-red-800 pt-8 pb-14 px-4 text-center relative">
          {/* Decorative gold border at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

          {/* Lantern decorations */}
          <div className="absolute top-3 left-6 opacity-30 text-3xl sm:text-4xl">🏮</div>
          <div className="absolute top-3 right-6 opacity-30 text-3xl sm:text-4xl">🏮</div>

          {/* Subtle pattern */}
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

        {/* Curved bottom edge */}
        <div className="bg-red-800 relative">
          <svg
            viewBox="0 0 1440 50"
            className="w-full block -mb-px"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C480,50 960,50 1440,0 L1440,50 L0,50 Z"
              fill="var(--color-cream-50, #fefcf7)"
            />
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
          {/* Title bar inside card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2
                className="text-lg font-bold text-[#5a3e2b] flex items-center gap-2"
                style={{ fontFamily: "'Noto Serif TC', serif" }}
              >
                <span className="text-xl">💰</span>
                點鈔明細
              </h2>
              <p className="text-xs text-[#a08a6e] mt-0.5">
                記錄每位長輩的紅包金額，即時計算總額
              </p>
            </div>
            <ExportButtons rows={rows} />
          </div>

          {/* Table */}
          <HongbaoTable rows={rows} setRows={setRows} />
        </motion.div>

        {/* Footer */}
        <footer className="text-center mt-8 text-xs text-[#b8a080]">
          <p>🧧 恭喜發財・紅包拿來 🧧</p>
          <p className="mt-1 opacity-60">
            純前端應用 — 資料僅存於瀏覽器，不會上傳
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
