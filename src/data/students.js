import { pick, chance, randInt } from '../utils/random'

const firstNames = [
  'Rahul', 'Prem', 'Aarav', 'Diya', 'Priya', 'Harsh', 'Kavya', 'Meet',
  'Ananya', 'Yash', 'Sneha', 'Jay', 'Isha', 'Ravi', 'Neha', 'Parth',
  'Krisha', 'Om', 'Twinkle', 'Vivek',
]

const lastNames = [
  'Patel', 'Shah', 'Mehta', 'Desai', 'Joshi', 'Trivedi', 'Raval',
  'Chauhan', 'Parmar', 'Solanki', 'Pandya', 'Dave', 'Agravat',
]

const courses = [
  { name: 'Computer Engineering', prefix: 'CE' },
  { name: 'BCA', prefix: 'BCA' },
  { name: 'Mechanical Engineering', prefix: 'ME' },
  { name: 'Civil Engineering', prefix: 'CV' },
  { name: 'MBA', prefix: 'MBA' },
  { name: 'BBA', prefix: 'BBA' },
  { name: 'IT Engineering', prefix: 'IT' },
]

const colleges = [
  'RK University',
  'Gujarat Tech University',
  'Saurashtra College',
  'Marwadi University',
  'Atmiya University',
]

const issueTypes = [
  null,
  null,
  null,
  null,
  null,
  'photo_mismatch',
  'expired',
  'wrong_college',
  'wrong_id',
  'missing_id',
  'duplicate_id',
]

const photoColors = [
  '#c4a574', '#8d6e4c', '#d4b896', '#a67c52', '#b8956c', '#7a5c3e',
]

export function getRandomStudent(collegeName = 'RK University') {
  const course = pick(courses)
  const semester = randInt(1, 8)
  const year = 2026
  const id = `${course.prefix}${year}${String(randInt(100, 999))}`
  const name = `${pick(firstNames)} ${pick(lastNames)}`
  const issue = pick(issueTypes)

  const student = {
    id: `npc-${Date.now()}-${randInt(1, 9999)}`,
    name,
    college: collegeName,
    course: course.name,
    semester,
    studentId: id,
    validYear: '2026-27',
    photoColor: pick(photoColors),
    issue: null,
    shouldAllow: true,
    greeting: pick(['Good morning sir.', 'Sir, namaste.', 'Morning sir.']),
  }

  if (issue === 'photo_mismatch') {
    student.issue = 'photo_mismatch'
    student.shouldAllow = false
    student.photoNote = 'Photo looks different'
    student.issueLabel = 'Photo does not match'
  } else if (issue === 'expired') {
    student.issue = 'expired'
    student.shouldAllow = false
    student.validYear = '2023-24'
    student.issueLabel = 'ID expired'
  } else if (issue === 'wrong_college') {
    student.issue = 'wrong_college'
    student.shouldAllow = false
    student.college = pick(colleges.filter((c) => c !== collegeName))
    student.issueLabel = 'Wrong college'
  } else if (issue === 'wrong_id') {
    student.issue = 'wrong_id'
    student.shouldAllow = false
    student.holderName = `${pick(firstNames)} ${pick(lastNames)}`
    student.issueLabel = 'Wrong student ID / name mismatch'
  } else if (issue === 'missing_id') {
    student.issue = 'missing_id'
    student.shouldAllow = false
    student.hasId = false
    student.issueLabel = 'Missing ID'
  } else if (issue === 'duplicate_id') {
    student.issue = 'duplicate_id'
    student.shouldAllow = false
    student.issueLabel = 'Duplicate / suspicious ID'
  } else {
    student.hasId = true
    student.issueLabel = 'Valid ID'
  }

  if (student.hasId === undefined) student.hasId = true

  return student
}

export function getRandomVisitor() {
  const types = [
    { type: 'parent', purpose: 'Meet student / parent visit' },
    { type: 'delivery', purpose: 'Parcel delivery' },
    { type: 'guest', purpose: 'Guest lecture' },
    { type: 'alumni', purpose: 'Alumni visit' },
    { type: 'friend', purpose: 'Meet friend' },
    { type: 'vendor', purpose: 'Vendor / supply' },
    { type: 'interview', purpose: 'Campus interview' },
    { type: 'unknown', purpose: 'Personal work' },
  ]
  const t = pick(types)
  return {
    ...t,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    person: pick(['Prof. Patel', 'Prof. Shah', 'Admin Office', 'Library', 'Canteen', 'HR Desk']),
    department: pick(['Computer Engineering', 'Admin', 'MBA', 'Mechanical', 'Library']),
    phone: `9${randInt(100000000, 999999999)}`,
  }
}

export function getRandomProfessor() {
  const personalities = ['strict', 'funny', 'friendly']
  return {
    name: pick(['Prof. Patel', 'Prof. Mehta', 'Prof. Joshi', 'Prof. Shah', 'Dr. Trivedi']),
    personality: pick(personalities),
    department: pick(['Computer Engineering', 'Mechanical', 'MBA', 'Civil']),
  }
}

export const defaultStudentProfile = {
  name: 'Prem Agravat',
  college: 'RK University',
  course: 'Computer Engineering',
  semester: '5',
  studentId: 'CE2026XXX',
  photo: null,
  validYear: '2026-27',
}

/** Student-mode encounter outcomes weighted toward fun variety */
export function rollStudentEncounter() {
  const roll = Math.random()
  if (roll < 0.42) return { type: 'valid', label: 'Normal valid ID' }
  if (roll < 0.52) return { type: 'forgot', label: 'Forgot ID' }
  if (roll < 0.6) return { type: 'expired', label: 'Expired ID' }
  if (roll < 0.68) return { type: 'wrong_id', label: 'Wrong ID' }
  if (roll < 0.75) return { type: 'photo_mismatch', label: 'Photo mismatch' }
  if (roll < 0.8) return { type: 'upside_down', label: 'ID upside down' }
  if (roll < 0.85) return { type: 'late', label: 'Student is late' }
  if (roll < 0.9) return { type: 'sneak', label: 'Tries to sneak' }
  if (roll < 0.94) return { type: 'group', label: 'Group arrives' }
  if (roll < 0.97) return { type: 'professor_behind', label: 'Professor behind' }
  return { type: 'argue', label: 'Student argues' }
}

export function maybeSuspicious(baseRate = 0.35) {
  return chance(baseRate)
}
