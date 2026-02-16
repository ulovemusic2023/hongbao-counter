import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GoldIngotTreasuryProps {
  fillLevel: number      // 0 to 1
  burstTrigger: number   // increments each time a bill is added
}

// Individual gold ingot (元寶) rendered as CSS
function GoldIngot({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block select-none ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
    >
      🪙
    </span>
  )
}

// Flying ingot that pops up and falls into the treasury
function FlyingIngot({ id, onComplete }: { id: number; onComplete: (id: number) => void }) {
  // Random horizontal offset
  const xOffset = (Math.random() - 0.5) * 120
  const startY = -20
  const rotation = (Math.random() - 0.5) * 60

  return (
    <motion.div
      initial={{ opacity: 1, y: startY, x: xOffset, scale: 1.3, rotate: rotation }}
      animate={{ opacity: 0, y: 40, x: xOffset * 0.3, scale: 0.5, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-20"
    >
      <span className="text-2xl">🪙</span>
    </motion.div>
  )
}

export function GoldIngotTreasury({ fillLevel, burstTrigger }: GoldIngotTreasuryProps) {
  const [flyingIngots, setFlyingIngots] = useState<number[]>([])

  // Spawn flying ingots on burst trigger
  useEffect(() => {
    if (burstTrigger > 0) {
      // Add 1-3 flying ingots depending on how full
      const count = fillLevel > 0.5 ? 3 : fillLevel > 0.2 ? 2 : 1
      const newIds = Array.from({ length: count }, () => Date.now() + Math.random() * 1000)
      setFlyingIngots((prev) => [...prev, ...newIds])
    }
  }, [burstTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

  const removeFlyingIngot = (id: number) => {
    setFlyingIngots((prev) => prev.filter((i) => i !== id))
  }

  // Calculate how many ingots to show in the treasury (0-15)
  const treasuryIngotCount = Math.floor(fillLevel * 15)

  // Treasury bowl layers
  const rows = []
  let remaining = treasuryIngotCount

  // Build rows from bottom (widest) to top (narrowest)
  // Row 1 (bottom): up to 5
  // Row 2: up to 4
  // Row 3: up to 3
  // Row 4 (top): up to 3
  const rowSizes = [5, 4, 3, 3]
  for (const maxInRow of rowSizes) {
    if (remaining <= 0) break
    const count = Math.min(remaining, maxInRow)
    rows.push(count)
    remaining -= count
  }
  rows.reverse() // display top row first in DOM

  return (
    <div className="relative inline-block mx-auto my-2">
      {/* Flying ingots */}
      <AnimatePresence>
        {flyingIngots.map((id) => (
          <FlyingIngot key={id} id={id} onComplete={removeFlyingIngot} />
        ))}
      </AnimatePresence>

      {/* Treasury bowl */}
      <div className="relative w-48 sm:w-56 mx-auto">
        {/* Ingot stack */}
        <div className="flex flex-col items-center gap-0 min-h-[60px] justify-end">
          {treasuryIngotCount === 0 ? (
            <div className="text-gold-400/30 text-xs font-display mb-2">空空如也...</div>
          ) : (
            rows.map((count, rowIdx) => (
              <motion.div
                key={rowIdx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: rowIdx * 0.05 }}
                className="flex justify-center gap-0"
              >
                {Array.from({ length: count }).map((_, i) => (
                  <GoldIngot
                    key={`${rowIdx}-${i}`}
                    size={rowIdx === rows.length - 1 ? 22 : 18}
                    className={rowIdx === rows.length - 1 ? "" : "-mb-1"}
                  />
                ))}
              </motion.div>
            ))
          )}
        </div>

        {/* Bowl base */}
        <div className="relative mt-0">
          <svg viewBox="0 0 200 40" className="w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#daa520" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#b8860b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8b6508" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Bowl shape */}
            <path
              d="M20,5 Q30,0 100,0 Q170,0 180,5 Q185,10 175,30 Q165,38 100,38 Q35,38 25,30 Q15,10 20,5Z"
              fill="url(#bowlGrad)"
              stroke="#daa520"
              strokeWidth="1"
              opacity="0.7"
            />
            {/* Bowl rim shine */}
            <path
              d="M25,5 Q35,2 100,2 Q165,2 175,5"
              fill="none"
              stroke="#ffd700"
              strokeWidth="1.5"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Fill level indicator */}
        {fillLevel > 0 && (
          <div className="text-center mt-1">
            <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-0.5">
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #b8860b, #ffd700, #daa520)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${fillLevel * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
              <span className="text-[10px] text-gold-400/60">
                {Math.round(fillLevel * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
