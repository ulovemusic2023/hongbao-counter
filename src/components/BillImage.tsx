import type { Denomination } from "@/config/denominations"

interface BillImageProps {
  denomination: Denomination
  height?: number
}

export function BillImage({ denomination, height = 48 }: BillImageProps) {
  const width = Math.round(height * 2.2)

  return (
    <div
      className="relative overflow-hidden rounded-sm shadow-md flex-shrink-0"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: denomination.gradient,
      }}
    >
      {/* Security thread line */}
      <div
        className="absolute top-0 bottom-0 opacity-20"
        style={{
          left: "30%",
          width: "2px",
          background: `linear-gradient(180deg, transparent 0%, ${denomination.accentColor} 20%, transparent 40%, ${denomination.accentColor} 60%, transparent 80%, ${denomination.accentColor} 100%)`,
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.1) 3px,
            rgba(255,255,255,0.1) 4px
          )`,
        }}
      />

      {/* Corner ornaments */}
      <div
        className="absolute top-1 left-1.5 opacity-30"
        style={{ fontSize: `${height * 0.18}px`, color: "#fff", fontFamily: "serif" }}
      >
        ❧
      </div>
      <div
        className="absolute bottom-1 right-1.5 opacity-30 rotate-180"
        style={{ fontSize: `${height * 0.18}px`, color: "#fff", fontFamily: "serif" }}
      >
        ❧
      </div>

      {/* Value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-bold text-white drop-shadow-lg tracking-wider"
          style={{
            fontSize: `${height * 0.32}px`,
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            fontFamily: "'Noto Serif TC', serif",
          }}
        >
          NT${denomination.value}
        </span>
      </div>

      {/* Bottom label */}
      <div
        className="absolute bottom-0.5 left-0 right-0 text-center text-white/50"
        style={{ fontSize: `${height * 0.14}px` }}
      >
        新臺幣
      </div>

      {/* Glossy sheen */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 70%)",
        }}
      />
    </div>
  )
}
