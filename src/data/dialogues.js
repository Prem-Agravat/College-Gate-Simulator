import { pick } from '../utils/random'

export const securityAskId = [
  'ID બતાવો ભાઈ.',
  'ID ક્યાં છે?',
  'આઈડી બતાવો.',
  'રોકો... ID બતાવો.',
  'ID card છે?',
  'ભાઈ, ID કાઢો.',
]

export const securityValid = [
  'બરાબર છે, જાવ.',
  'ઠીક છે, અંદર જાઓ.',
  'OK, next.',
  'ચાલો, જાવ.',
]

export const securityInvalid = [
  'આ ID તો valid નથી.',
  'આ તો expire થઈ ગઈ.',
  'ભાઈ, આ કોનું ID છે?',
  'ફોટો તો બીજાનો છે.',
  'આજે ID વગર?',
  'ID વગર entry નહીં.',
]

export const securityResponses = {
  forgot: [
    'દરરોજનું છે તમારું.',
    'આજે ભૂલી ગયા?',
    'Office માં જાઓ.',
    'Next time ID લાવજો.',
  ],
  phonePhoto: [
    'Photo બતાવવાથી entry નહીં મળે.',
    'Physical ID જોઈએ.',
    'Phone નહીં ચાલે.',
  ],
  regular: [
    'રોજ આવો છો એટલે ID નથી લાવવાનું?',
    'Rules છે ભાઈ.',
    'ચાલો, આજે જવા દઉં. Next time લાવજો.',
  ],
  wait: ['ઝડપથી!', 'હા, ઉતાવળ કરો.', 'લાઇન લાંબી છે.'],
  friend: ['મિત્રનું ID નહીં ચાલે.', 'તારું જોઈએ.', 'Friend પાસેથી મંગાવો.'],
  please: [
    'Please થી entry નહીં.',
    'ચાલો, આજે માફી.',
    'એક વાર. Next time ID.',
  ],
  argue: ['આર્ગ્યુમેન્ટ ન કરો.', 'Rules છે.', 'Office જાઓ જો issue હોય.'],
  sneak: ['એ... ઊભો!', 'ક્યાં જાવ છો?', 'રોકો ભાઈ!'],
  late: ['મોડું થયું ને?', 'Lecture miss થશે.', 'ઝડપથી જાઓ.'],
}

export const studentLines = {
  greeting: ['Good morning sir.', 'Sir, namaste.', 'Morning sir.'],
  forgot: [
    'Sir, ID ઘરે રહી ગયું.',
    'Sir, આજે જ ભૂલી ગયો.',
    'Sir, bag માં નથી.',
  ],
  phone: ['Sir, phone માં photo છે.', 'Digital ID છે sir.'],
  regular: ['Sir, હું રોજ આવું છું.', 'Sir, તમે મને ઓળખો છો.'],
  wait: ['Sir, એક મિનિટ.', 'એક સેકન્ડ sir.'],
  friend: ['મારા મિત્ર પાસે છે.', 'Friend પાસેથી મંગાવું?'],
  please: ['Sir, please જવા દો.', 'Sir, lecture છે.'],
  professorWaiting: ['Sir, professor wait કરે છે.', 'Sir પાસે જવાનું છે.'],
  followProf: ['Sir સાથે જ છું.', 'Professor સાથે આવ્યો.'],
  wake: ['Sirrrrr!', 'Gate ખોલો.', 'Sir, wake up!'],
}

export const studentTalkOptions = [
  { id: 'forgot', label: 'Sir, ID ઘરે રહી ગયું.', key: 'forgot' },
  { id: 'phone', label: 'Sir, phone માં photo છે.', key: 'phonePhoto' },
  { id: 'regular', label: 'Sir, હું રોજ આવું છું.', key: 'regular' },
  { id: 'wait', label: 'Sir, એક મિનિટ.', key: 'wait' },
  { id: 'friend', label: 'મારા મિત્ર પાસે છે.', key: 'friend' },
  { id: 'please', label: 'Sir, please જવા દો.', key: 'please' },
]

export const chaiwala = [
  'ચા મૂકી દઉં?',
  'કટિંગ કે ફુલ?',
  'બે કટિંગ?',
  'ગરમ ગરમ ચા!',
]

export const professorLines = {
  strict: ['Late કેમ?', 'Time પર આવો.', 'Assignment ક્યાં છે?'],
  funny: ['ID તો મારી પાસે પણ નથી.', 'Security, મને ઓળખો છો ને?', 'Gate duty tough છે.'],
  friendly: ['ચાલો, અંદર જાઓ.', 'Good morning.', 'આજે મોડું થઈ ગયું.'],
  greeting: ['Good morning.', 'Namaste.', 'ચાલો.'],
}

export const visitorLines = {
  parent: ['મારા બાળકને મળવું છે.', 'Parent છું sir.'],
  delivery: ['Sir, parcel dena hai.', 'Delivery છે sir.'],
  guest: ['Guest lecture માટે આવ્યો છું.', 'Invitation છે.'],
  alumni: ['હું alumni છું.', 'જૂના વર્ષનો student.'],
  friend: ['મિત્રને મળવું છે.', 'Friend અંદર છે.'],
  vendor: ['Canteen માટે supply.', 'Vendor છું.'],
  interview: ['Interview માટે આવ્યો.', 'HR પાસે જવાનું છે.'],
  unknown: ['Sir, અંદર જવું છે.', 'કામ છે sir.'],
}

export const securityFree = [
  'આજે તો શાંતિ છે.',
  'Quiet day છે.',
  'ફરી શરૂ.',
  'હા હા... ID બતાવો.',
]

export const announcements = [
  "Attention students, today's lecture schedule has changed.",
  'Students are requested to carry their ID cards.',
  'Canteen will close at 3 PM today.',
  'Internal exam seating is on the notice board.',
  'Please park bikes in designated area only.',
]

export const notices = [
  'Tomorrow: Internal Exam',
  'ID CARD COMPULSORY',
  'Parking Only in Designated Area',
  'Canteen Closed Today',
  'Assignment Submission: Today',
  'Please do not ask security for attendance.',
  'ID વગર argument ન કરશો.',
  'Library timing: 9 AM – 5 PM',
  'No helmet, no entry (bike)',
]

export function getRandomSecurityAsk() {
  return pick(securityAskId)
}

export function getRandomSecurityResponse(key = 'forgot') {
  return pick(securityResponses[key] || securityResponses.forgot)
}

export function getRandomDialogue(list) {
  return pick(list)
}
