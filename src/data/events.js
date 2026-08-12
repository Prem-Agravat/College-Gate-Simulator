export const EVENT_TYPES = {
  STUDENT_ARRIVAL: 'student_arrival',
  STUDENT_MISSING_ID: 'student_missing_id',
  WRONG_ID: 'wrong_id',
  PROFESSOR_ARRIVAL: 'professor_arrival',
  VISITOR_ARRIVAL: 'visitor_arrival',
  DELIVERY_ARRIVAL: 'delivery_arrival',
  CHAI_BREAK: 'chai_break',
  PHONE_CALL: 'phone_call',
  PRINCIPAL_ARRIVAL: 'principal_arrival',
  GROUP_STUDENTS: 'group_students',
  LATE_STUDENT: 'late_student',
  RANDOM_DIALOGUE: 'random_dialogue',
  ANNOUNCEMENT: 'announcement',
  GATE_OPEN: 'gate_open',
  GATE_CLOSE: 'gate_close',
}

/** Weights by role / activity context */
export const eventWeights = {
  idle: {
    student_arrival: 28,
    professor_arrival: 8,
    visitor_arrival: 10,
    delivery_arrival: 6,
    phone_call: 8,
    principal_arrival: 3,
    group_students: 6,
    late_student: 8,
    announcement: 7,
    random_dialogue: 10,
    chai_break: 6,
  },
  freeTime: {
    student_arrival: 22,
    professor_arrival: 8,
    visitor_arrival: 8,
    delivery_arrival: 8,
    phone_call: 12,
    principal_arrival: 5,
    announcement: 10,
    chai_break: 10,
    random_dialogue: 12,
    group_students: 5,
  },
  busy: {
    student_arrival: 40,
    late_student: 15,
    group_students: 15,
    professor_arrival: 8,
    announcement: 5,
    visitor_arrival: 7,
    gate_open: 5,
    gate_close: 5,
  },
}

export const TIME_PERIODS = [
  { start: 8 * 60, end: 9 * 60, id: 'morning_rush', label: 'Morning Rush', npcDensity: 0.9, light: 'dawn' },
  { start: 9 * 60, end: 10 * 60 + 30, id: 'peak', label: 'Maximum students', npcDensity: 1, light: 'day' },
  { start: 10 * 60 + 30, end: 12 * 60 + 30, id: 'normal', label: 'Normal', npcDensity: 0.55, light: 'day' },
  { start: 12 * 60 + 30, end: 13 * 60 + 30, id: 'lunch', label: 'Lunch', npcDensity: 0.7, light: 'bright' },
  { start: 13 * 60 + 30, end: 15 * 60 + 30, id: 'quiet', label: 'Quiet period', npcDensity: 0.25, light: 'afternoon' },
  { start: 15 * 60 + 30, end: 16 * 60 + 30, id: 'leaving', label: 'Students leaving', npcDensity: 0.85, light: 'golden' },
  { start: 16 * 60 + 30, end: 17 * 60, id: 'closing', label: 'College closing', npcDensity: 0.4, light: 'dusk' },
  { start: 17 * 60, end: 18 * 60, id: 'gate_closing', label: 'Gate closing', npcDensity: 0.15, light: 'dusk' },
]

export function getPeriodForMinutes(mins) {
  const m = ((mins % (12 * 60)) + 8 * 60) // keep in college day-ish
  const clamped = Math.max(8 * 60, Math.min(mins, 17 * 60 + 59))
  return (
    TIME_PERIODS.find((p) => clamped >= p.start && clamped < p.end) ||
    TIME_PERIODS[TIME_PERIODS.length - 1]
  )
}

export function formatGameTime(totalMinutes) {
  const h24 = Math.floor(totalMinutes / 60) % 24
  const m = Math.floor(totalMinutes % 60)
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}
