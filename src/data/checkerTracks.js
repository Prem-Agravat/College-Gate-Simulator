export const checkerTracks = [
  {
    id: 1,
    title: "Valid ID",
    speaker: "Security Guard",
    dialogue: "“ID batavo... Barabar che. Jao.”",
    gujarati: "“આઈડી બતાવો... બરાબર છે. જાઓ.”",
    audio: "/audio/checker/checker-01.mp3",
    image: "/images/rk_gate_new.png",
    zoomClass: "zoom-checker-desk",
    voiceText: "ID batavo. Barabar che. Jao.",
    duration: 5,
    flag: "none",
    description: "A student approaches the desk, presents a clear ID card, and you verify it instantly.",
    idCard: {
      name: "Rahul Patel",
      course: "Computer Engineering",
      semester: "5",
      idNumber: "CE2026102",
      validYears: "2026-27",
      avatar: "👨‍🎓",
      avatarColor: "#2b5c8a",
      suspiciousField: null
    }
  },
  {
    id: 2,
    title: "ID Tamaru Nathi",
    speaker: "Security Guard",
    dialogue: "“Bhai, aa ID card tamaru nathi lagto. Naam check karo.”",
    gujarati: "“ભાઈ, આ આઈડી કાર્ડ તમારું નથી લાગતું. નામ ચેક કરો.”",
    audio: "/audio/checker/checker-02.mp3",
    image: "/images/rk_gate_new.png",
    zoomClass: "zoom-checker-examine",
    voiceText: "Bhai, aa ID card tamaru nathi lagto. Naam check karo.",
    duration: 6,
    flag: "name",
    description: "A male student hands you an ID card. You look down and notice the card belongs to a female student.",
    idCard: {
      name: "Anjali Sharma",
      course: "Information Technology",
      semester: "3",
      idNumber: "IT2026045",
      validYears: "2026-27",
      avatar: "👩‍🎓",
      avatarColor: "#6b4f7a",
      suspiciousField: "name"
    }
  },
  {
    id: 3,
    title: "ID Card Kya Che?",
    speaker: "Security Guard",
    dialogue: "“Ubho re bhai, ID card kya che? ID card batav pehla pachi andar ja.”",
    gujarati: "“ઊભો રે ભાઈ, આઈડી કાર્ડ ક્યાં છે? આઈડી કાર્ડ બતાવ પહેલાં પછી અંદર જા.”",
    audio: "/audio/checker/checker-03.mp3",
    image: "/images/rk_gate_new.png",
    zoomClass: "zoom-checker-backpack",
    voiceText: "Ubho re bhai, ID card kya che? ID card batav pehla pachi andar ja.",
    duration: 7,
    flag: "missing",
    description: "The student approaches empty-handed and searches their pockets sheepishly. No card is presented.",
    idCard: null
  },
  {
    id: 4,
    title: "Photo Match Nathi",
    speaker: "Security Guard",
    dialogue: "“Photo to match j nathi thato. Aa photo ma koi biju che.”",
    gujarati: "“ફોટો તો મેચ જ નથી થતો. આ ફોટો માં કોઈ બીજું છે.”",
    audio: "/audio/checker/checker-04.mp3",
    image: "/images/rk_gate_new.png",
    zoomClass: "zoom-checker-compare",
    voiceText: "Photo to match j nathi thato. Aa photo ma koi biju che.",
    duration: 6,
    flag: "photo",
    description: "You look at the student, then down at the card. The photo is clearly of someone else.",
    idCard: {
      name: "Hardik Gohel",
      course: "Mechanical Engineering",
      semester: "7",
      idNumber: "ME2026089",
      validYears: "2026-27",
      avatar: "🧔", // Mismatched avatar look
      avatarColor: "#e65c00",
      suspiciousField: "photo"
    }
  },
  {
    id: 5,
    title: "Phone Ma Photo",
    speaker: "Student",
    dialogue: "“Sir, phone ma photo che, chalai lo ne...”",
    gujarati: "“સર, ફોનમાં ફોટો છે, ચલાવી લો ને...”",
    audio: "/audio/checker/checker-05.mp3",
    image: "/images/rk_gate_new.png",
    zoomClass: "zoom-checker-phone",
    voiceText: "Sir, phone ma photo che, chalai lo ne.",
    duration: 5,
    flag: "phone",
    description: "The student holds up a smartphone displaying a screenshot of their ID card.",
    idCard: {
      name: "Karan Dave",
      course: "Civil Engineering",
      semester: "1",
      idNumber: "CL2026211",
      validYears: "2026-27",
      avatar: "📱",
      avatarColor: "#333",
      suspiciousField: "phone"
    }
  },
  {
    id: 6,
    title: "Late Student",
    speaker: "Security Guard",
    dialogue: "“Ketlu late thaya? Traffic hato to pan ID batavo pehla.”",
    gujarati: "“કેટલું લેટ થયા? ટ્રાફિક હતો તો પણ આઈડી બતાવો પહેલાં.”",
    audio: "/audio/checker/checker-06.mp3",
    image: "/images/rk_gate_new.png",
    zoomClass: "zoom-checker-late",
    voiceText: "Ketlu late thaya? Traffic hato to pan ID batavo pehla.",
    duration: 6,
    flag: "validity",
    description: "A student runs up late for class, claiming traffic. You stop them to check, and realize their card is expired.",
    idCard: {
      name: "Pooja Mehta",
      course: "MBA",
      semester: "3",
      idNumber: "MB2026012",
      validYears: "2025-26", // Expired!
      avatar: "👩‍🎓",
      avatarColor: "#9c27b0",
      suspiciousField: "validYears"
    }
  }
];
