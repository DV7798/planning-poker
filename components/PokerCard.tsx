interface PokerCardProps {
  value: number | string
  onClick?: () => void
  isSelected?: boolean
  disabled?: boolean
}

export default function PokerCard({ value, onClick, isSelected, disabled }: PokerCardProps) {
  const isNumber = typeof value === 'number'
  const displayValue = value === '?' ? '?' : value === '☕' ? '☕' : value
  const isSpecial = value === '?' || value === '☕'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-16 h-24 rounded-lg shadow-xl transition-all duration-300
        ${isSelected 
          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 ring-4 ring-indigo-300 shadow-2xl z-10' 
          : isSpecial
          ? 'bg-gradient-to-br from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 border-slate-500'
          : 'bg-gradient-to-br from-slate-100 to-white text-slate-800 hover:from-slate-50 hover:to-slate-100 hover:shadow-2xl border-slate-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        flex items-center justify-center font-bold text-2xl
        border-2 ${isSelected ? 'border-indigo-400' : isSpecial ? 'border-slate-500' : 'border-slate-300'}
        transform hover:rotate-1 hover:rotate-0
      `}
      style={{
        transform: isSelected ? 'scale(1.1) rotate(-2deg)' : undefined,
      }}
    >
      <span className={isSelected ? 'drop-shadow-lg' : ''}>
        {displayValue}
      </span>
    </button>
  )
}
