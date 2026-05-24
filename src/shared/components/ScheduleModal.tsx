import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

interface ScheduleModalProps {
  onClose: () => void
  onSchedule: (isoDateTime: string) => void
  isPending?: boolean
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// 30-min slots 7:00 AM – 10:30 PM
const TIME_SLOTS = (() => {
  const slots: { label: string; hour: number; minute: number }[] = []
  for (let h = 7; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      const ampm = h < 12 ? 'AM' : 'PM'
      slots.push({ label: `${h12}:${m === 0 ? '00' : '30'} ${ampm}`, hour: h, minute: m })
    }
  }
  return slots
})()

function defaultDateTime() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() < 30 ? 0 : 30)
  if (d.getHours() < 7) { d.setHours(9); d.setMinutes(0) }
  if (d.getHours() > 22) { d.setDate(d.getDate() + 1); d.setHours(9); d.setMinutes(0) }
  return d
}

export function ScheduleModal({ onClose, onSchedule, isPending }: ScheduleModalProps) {
  const def = defaultDateTime()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const maxDate = new Date(Date.now() + SIX_MONTHS_MS)

  const [viewYear, setViewYear] = useState(def.getFullYear())
  const [viewMonth, setViewMonth] = useState(def.getMonth())
  const [selDate, setSelDate] = useState(new Date(def.getFullYear(), def.getMonth(), def.getDate()))
  const [selHour, setSelHour] = useState(def.getHours())
  const [selMin, setSelMin] = useState(def.getMinutes())
  const [showPicker, setShowPicker] = useState(false)
  const [pickerYear, setPickerYear] = useState(def.getFullYear())

  const timeRef = useRef<HTMLDivElement>(null)

  // Scroll active time slot into center on mount / selection
  useEffect(() => {
    if (!timeRef.current) return
    const idx = TIME_SLOTS.findIndex((s) => s.hour === selHour && s.minute === selMin)
    if (idx < 0) return
    const item = timeRef.current.children[idx] as HTMLElement
    item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selHour, selMin])

  // Calendar helpers
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const firstDayMon = (firstDayOfMonth + 6) % 7 // Monday-first
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDayMon).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function isDayDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0, 0, 0, 0)
    return d < todayStart || d > maxDate
  }

  function isSelected(day: number) {
    return (
      selDate.getDate() === day &&
      selDate.getMonth() === viewMonth &&
      selDate.getFullYear() === viewYear
    )
  }

  function isToday(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === todayStart.getTime()
  }

  function selectDay(day: number) {
    if (isDayDisabled(day)) return
    setSelDate(new Date(viewYear, viewMonth, day))
  }

  const thisMonthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1)
  const maxMonthStart = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)

  function prevMonth() {
    const prev = new Date(viewYear, viewMonth - 1, 1)
    if (prev < thisMonthStart) return
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1)
    if (next > maxMonthStart) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  function goToToday() {
    const t = new Date()
    setViewYear(t.getFullYear())
    setViewMonth(t.getMonth())
    setSelDate(new Date(t.getFullYear(), t.getMonth(), t.getDate()))
    const next = TIME_SLOTS.find(
      (s) => s.hour > t.getHours() || (s.hour === t.getHours() && s.minute > t.getMinutes()),
    )
    if (next) { setSelHour(next.hour); setSelMin(next.minute) }
  }

  function isSlotDisabled(slot: { hour: number; minute: number }) {
    const dt = new Date(selDate.getFullYear(), selDate.getMonth(), selDate.getDate(), slot.hour, slot.minute)
    return dt.getTime() <= Date.now() || dt.getTime() > maxDate.getTime()
  }

  const selectedDT = new Date(selDate.getFullYear(), selDate.getMonth(), selDate.getDate(), selHour, selMin)
  const isValid = selectedDT.getTime() > Date.now() && selectedDT.getTime() <= maxDate.getTime()

  const formattedDate = selDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const formattedTime = (() => {
    const h12 = selHour === 0 ? 12 : selHour > 12 ? selHour - 12 : selHour
    const ampm = selHour < 12 ? 'AM' : 'PM'
    return `${h12}:${selMin === 0 ? '00' : '30'} ${ampm}`
  })()

  const relativeTime = (() => {
    const diff = selectedDT.getTime() - Date.now()
    if (diff <= 0) return null
    const totalMin = Math.floor(diff / 60000)
    const days = Math.floor(totalMin / 1440)
    const hours = Math.floor((totalMin % 1440) / 60)
    const mins = totalMin % 60
    if (days > 0 && hours > 0) return `in ${days}d ${hours}h`
    if (days > 0) return `in ${days}d`
    if (hours > 0 && mins > 0) return `in ${hours}h ${mins}m`
    if (hours > 0) return `in ${hours}h`
    if (mins > 0) return `in ${mins}m`
    return 'any moment now'
  })()

  const canPrev = new Date(viewYear, viewMonth - 1, 1) >= thisMonthStart
  const canNext = new Date(viewYear, viewMonth + 1, 1) <= maxMonthStart

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-bg border border-line rounded-[14px] flex flex-col overflow-hidden"
        style={{ width: 540, boxShadow: '0 24px 64px rgba(0,0,0,.22)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main body: calendar + time list */}
        <div className="flex" style={{ height: 340 }}>

          {/* ── Calendar ── */}
          <div style={{ flex: 1, padding: '20px 18px' }}>

            {/* Month / Year header */}
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <button
                onClick={prevMonth}
                disabled={!canPrev}
                className="rounded-[6px] text-ink-3 hover:text-ink hover:bg-bg-tint transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                style={{ padding: '4px 6px' }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => { setShowPicker((v) => !v); setPickerYear(viewYear) }}
                className="font-semibold text-ink hover:text-ls-accent transition-colors"
                style={{ fontSize: 14 }}
              >
                {MONTHS[viewMonth]} {viewYear}
              </button>

              <button
                onClick={nextMonth}
                disabled={!canNext}
                className="rounded-[6px] text-ink-3 hover:text-ink hover:bg-bg-tint transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                style={{ padding: '4px 6px' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Month / Year quick picker */}
            {showPicker ? (
              <div className="border border-line rounded-[8px] bg-bg-soft" style={{ padding: 12 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <button
                    onClick={() => setPickerYear((y) => y - 1)}
                    className="text-ink-2 hover:text-ink rounded-[4px] hover:bg-bg-tint transition-colors"
                    style={{ padding: '2px 6px' }}
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span className="font-semibold text-ink" style={{ fontSize: 13 }}>{pickerYear}</span>
                  <button
                    onClick={() => setPickerYear((y) => y + 1)}
                    className="text-ink-2 hover:text-ink rounded-[4px] hover:bg-bg-tint transition-colors"
                    style={{ padding: '2px 6px' }}
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                  {MONTHS.map((m, i) => {
                    const monthStart = new Date(pickerYear, i, 1)
                    const disabled = monthStart < thisMonthStart || monthStart > maxMonthStart
                    const active = i === viewMonth && pickerYear === viewYear
                    return (
                      <button
                        key={m}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return
                          setViewMonth(i)
                          setViewYear(pickerYear)
                          setShowPicker(false)
                        }}
                        className={cn(
                          'rounded-[6px] font-sans transition-colors text-center',
                          active
                            ? 'bg-ls-accent text-white font-semibold'
                            : disabled
                              ? 'text-ink-3 opacity-30 cursor-not-allowed'
                              : 'text-ink-2 hover:bg-bg-tint hover:text-ink',
                        )}
                        style={{ fontSize: 11, padding: '6px 4px' }}
                      >
                        {m.slice(0, 3)}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <>
                {/* Weekday headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center font-mono text-ink-3" style={{ fontSize: 11, padding: '2px 0' }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                  {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />
                    const disabled = isDayDisabled(day)
                    const selected = isSelected(day)
                    const todayMark = isToday(day)
                    return (
                      <button
                        key={day}
                        onClick={() => selectDay(day)}
                        disabled={disabled}
                        className={cn(
                          'relative rounded-full flex items-center justify-center font-sans transition-colors',
                          selected
                            ? 'bg-ls-accent text-white font-semibold'
                            : todayMark && !disabled
                              ? 'text-ls-accent font-semibold'
                              : disabled
                                ? 'text-ink-3 opacity-30 cursor-not-allowed'
                                : 'text-ink-2 hover:bg-bg-tint hover:text-ink cursor-pointer',
                        )}
                        style={{ fontSize: 13, height: 32 }}
                      >
                        {day}
                        {todayMark && !selected && (
                          <span
                            className="absolute bg-ls-accent rounded-full"
                            style={{ width: 3, height: 3, bottom: 4, left: '50%', transform: 'translateX(-50%)' }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* ── Time list ── */}
          <div className="border-l border-line flex flex-col" style={{ width: 148, flexShrink: 0 }}>
            <div
              className="font-mono uppercase text-ink-3 border-b border-line flex-shrink-0"
              style={{ fontSize: 10, letterSpacing: '1px', padding: '14px 14px 10px' }}
            >
              Available times
            </div>
            <div ref={timeRef} className="overflow-y-auto flex-1" style={{ padding: '6px 8px' }}>
              {TIME_SLOTS.map((slot) => {
                const disabled = isSlotDisabled(slot)
                const active = slot.hour === selHour && slot.minute === selMin
                return (
                  <button
                    key={slot.label}
                    onClick={() => { if (!disabled) { setSelHour(slot.hour); setSelMin(slot.minute) } }}
                    disabled={disabled}
                    className={cn(
                      'w-full text-left rounded-[6px] border transition-colors',
                      active
                        ? 'bg-ls-accent text-white font-semibold border-ls-accent'
                        : disabled
                          ? 'text-ink-3 opacity-30 cursor-not-allowed border-transparent'
                          : 'text-ink-2 border-transparent hover:bg-bg-tint hover:text-ink',
                    )}
                    style={{ fontSize: 13, padding: '7px 10px', marginBottom: 2 }}
                  >
                    {slot.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-line flex flex-col" style={{ padding: '12px 16px', gap: 10 }}>
          {/* Publish message */}
          <div
            className="rounded-[6px] bg-bg-soft border border-line text-ink-2"
            style={{ padding: '7px 12px', fontSize: 12 }}
          >
            {isValid
              ? <>Will publish on <span className="font-semibold text-ink">{formattedDate} at {formattedTime}</span> · <span className="text-ls-accent font-semibold">{relativeTime}</span></>
              : <span className="text-ink-3">Select a future date and time to schedule</span>
            }
          </div>

          {/* Controls row */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <div
              className="border border-line rounded-[6px] text-ink-2 font-mono bg-bg-soft"
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              {formattedDate}
            </div>

            <button
              onClick={goToToday}
              className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors"
              style={{ padding: '6px 12px', fontSize: 13 }}
            >
              Today
            </button>

            <div className="flex" style={{ marginLeft: 'auto', gap: 8 }}>
              <button
                onClick={onClose}
                className="border border-line text-ink-2 rounded-[6px] hover:bg-bg-tint transition-colors"
                style={{ padding: '7px 16px', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={() => isValid && onSchedule(selectedDT.toISOString())}
                disabled={isPending || !isValid}
                className="bg-ls-accent text-white font-semibold rounded-[6px] hover:bg-accent-ink transition-colors disabled:opacity-40"
                style={{ padding: '7px 22px', fontSize: 13 }}
              >
                {isPending ? 'Scheduling…' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
