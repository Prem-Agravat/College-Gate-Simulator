import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAudio } from './useAudio'
import { useGameTime } from './useGameTime'
import { createEventEngine } from '../utils/eventEngine'
import { chance, pick, randInt } from '../utils/random'
import {
  getRandomSecurityAsk,
  getRandomSecurityResponse,
  securityValid,
  securityInvalid,
  studentLines,
  chaiwala,
  professorLines,
  visitorLines,
  announcements,
  notices,
  securityFree,
} from '../data/dialogues'
import {
  defaultStudentProfile,
  getRandomStudent,
  getRandomVisitor,
  getRandomProfessor,
  rollStudentEncounter,
} from '../data/students'

const SimulationContext = createContext(null)

const ROLE_START_TIME = {
  student: 8 * 60 + 47,
  checker: 8 * 60 + 52,
  free: 10 * 60 + 43,
  professor: 9 * 60 + 10,
  visitor: 10 * 60 + 42,
}

const SESSION_END_MS = 4 * 60 * 1000 // ~4 minutes then offer results

export function SimulationProvider({ children }) {
  const audio = useAudio()
  const [screen, setScreen] = useState('landing') // landing | roles | setup | sim | results
  const [role, setRole] = useState(null)
  const [studentData, setStudentData] = useState(defaultStudentProfile)
  const [visitorData, setVisitorData] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [dialogue, setDialogue] = useState(null)
  const [actions, setActions] = useState([])
  const [phase, setPhase] = useState('idle')
  const [guardPose, setGuardPose] = useState('idle') // idle | check | sit | drink | sleep | music | phone | newspaper | walk
  const [playerPose, setPlayerPose] = useState('idle') // walk | stop | enter | sneak
  const [showIdFly, setShowIdFly] = useState(false)
  const [inspecting, setInspecting] = useState(false)
  const [currentNpc, setCurrentNpc] = useState(null)
  const [encounter, setEncounter] = useState(null)
  const [toast, setToast] = useState(null)
  const [announcement, setAnnouncement] = useState(null)
  const [notice] = useState(() => pick(notices))
  const [overlay, setOverlay] = useState(null) // phone | music | chai | newspaper | minigame | visitorPass
  const [interruptBanner, setInterruptBanner] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [result, setResult] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showTalkMenu, setShowTalkMenu] = useState(false)
  const [chaiSellerVisible, setChaiSellerVisible] = useState(false)
  const [entryStatus, setEntryStatus] = useState(null) // approved | denied
  const [camera, setCamera] = useState('student') // student | security | professor | visitor

  const [stats, setStats] = useState({
    studentsChecked: 0,
    approved: 0,
    rejected: 0,
    mistakes: 0,
    securityScore: 80,
    chaiCount: 0,
    napMinutes: 0,
    musicMinutes: 0,
    arguments: 0,
    idChecked: 0,
    lateMinutes: 0,
    securityInteractions: 0,
    collegeScore: 70,
  })

  const sessionStartRef = useRef(null)
  const engineRef = useRef(null)
  const busyRef = useRef(false)
  const [sessionId, setSessionId] = useState(0)

  const FREE_ACTIONS = useMemo(() => [
    { id: 'chai', label: '☕ DRINK CHAI' },
    { id: 'music', label: '🎵 PLAY MUSIC' },
    { id: 'phone', label: '📱 USE PHONE' },
    { id: 'newspaper', label: '📰 READ NEWSPAPER' },
    { id: 'nap', label: '😴 TAKE NAP' },
    { id: 'minigame', label: '🎮 MINI GAME' },
    { id: 'walk', label: '🚶 WALK AROUND' },
  ], [])

  const onPeriodChange = useCallback((period) => {
    if (period.id === 'closing' || period.id === 'gate_closing') {
      setAnnouncement('College closing soon. Please wrap up.')
      audio.sfx('bell')
    }
  }, [audio])

  const gameTime = useGameTime({
    startMinutes: ROLE_START_TIME[role] || 8 * 60 + 47,
    paused: isPaused || screen !== 'sim',
    onPeriodChange,
  })

  const say = useCallback((speaker, text, opts = {}) => {
    setDialogue({ speaker, text, ...opts })
    audio.sfx('dialogue')
  }, [audio])

  const flashToast = useCallback((text, ms = 2200) => {
    setToast(text)
    setTimeout(() => setToast(null), ms)
  }, [])

  const bumpStat = useCallback((patch) => {
    setStats((s) => ({ ...s, ...patch }))
  }, [])

  const endSession = useCallback(() => {
    const r = buildResult(role, stats, studentData, entryStatus)
    setResult(r)
    setScreen('results')
    setIsPaused(true)
  }, [role, stats, studentData, entryStatus])

  // Session timer
  useEffect(() => {
    if (screen !== 'sim' || isPaused) return undefined
    if (!sessionStartRef.current) sessionStartRef.current = Date.now()
    const id = setInterval(() => {
      if (Date.now() - sessionStartRef.current > SESSION_END_MS) {
        endSession()
      }
    }, 2000)
    return () => clearInterval(id)
  }, [screen, isPaused, endSession])

  // Pause when tab hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setIsPaused(true)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const resetSimVisuals = useCallback(() => {
    setGateOpen(false)
    setDialogue(null)
    setActions([])
    setPhase('idle')
    setGuardPose('idle')
    setPlayerPose('idle')
    setShowIdFly(false)
    setInspecting(false)
    setCurrentNpc(null)
    setEncounter(null)
    setOverlay(null)
    setInterruptBanner(null)
    setFeedback(null)
    setEntryStatus(null)
    setShowTalkMenu(false)
    setChaiSellerVisible(false)
    busyRef.current = false
  }, [])

  const enterCollege = useCallback(() => {
    audio.unlock()
    setScreen('roles')
  }, [audio])

  const selectRole = useCallback((r) => {
    setRole(r)
    if (r === 'student') {
      setScreen('setup')
      setCamera('student')
    } else if (r === 'visitor') {
      setScreen('setup')
      setCamera('visitor')
    } else {
      setCamera(r === 'professor' ? 'professor' : 'security')
      setScreen('sim')
sessionStartRef.current = Date.now()
      setSessionId((n) => n + 1)
      setIsPaused(false)
      setStats({
        studentsChecked: 0,
        approved: 0,
        rejected: 0,
        mistakes: 0,
        securityScore: 80,
        chaiCount: 0,
        napMinutes: 0,
        musicMinutes: 0,
        arguments: 0,
        idChecked: 0,
        lateMinutes: randInt(0, 12),
        securityInteractions: 0,
        collegeScore: 70,
      })
      resetSimVisuals()
      gameTime.setTime(ROLE_START_TIME[r])
    }
  }, [gameTime, resetSimVisuals])

  const startWithProfile = useCallback((profile) => {
    if (role === 'student') {
      setStudentData(profile)
      setCamera('student')
    } else if (role === 'visitor') {
      setVisitorData(profile)
      setCamera('visitor')
    }
    setScreen('sim')
    sessionStartRef.current = Date.now()
    setSessionId((n) => n + 1)
    setIsPaused(false)
    setStats((s) => ({
      ...s,
      lateMinutes: role === 'student' ? randInt(0, 15) : s.lateMinutes,
    }))
    resetSimVisuals()
    gameTime.setTime(ROLE_START_TIME[role] || 8 * 60 + 47)
  }, [role, gameTime, resetSimVisuals])

  const changeRole = useCallback(() => {
    setScreen('roles')
    setIsPaused(true)
    resetSimVisuals()
    sessionStartRef.current = null
  }, [resetSimVisuals])

  const playAgain = useCallback(() => {
    sessionStartRef.current = Date.now()
    setSessionId((n) => n + 1)
    setResult(null)
    setStats({
      studentsChecked: 0,
      approved: 0,
      rejected: 0,
      mistakes: 0,
      securityScore: 80,
      chaiCount: 0,
      napMinutes: 0,
      musicMinutes: 0,
      arguments: 0,
      idChecked: 0,
      lateMinutes: randInt(0, 12),
      securityInteractions: 0,
      collegeScore: 70,
    })
    resetSimVisuals()
    setIsPaused(false)
    setScreen('sim')
    gameTime.setTime(ROLE_START_TIME[role] || 8 * 60 + 47)
  }, [role, gameTime, resetSimVisuals])

  // --- STUDENT FLOW ---
  const startStudentApproach = useCallback(() => {
    busyRef.current = true
    setPhase('approaching')
    setPlayerPose('walk')
    setActions([])
    setEntryStatus(null)
    setGateOpen(false)
    const enc = rollStudentEncounter()
    setEncounter(enc)
    say('narrator', 'You walk toward the college gate...')
    audio.sfx('footsteps')

    const delay = enc.type === 'sneak' ? 2200 : 3200
    setTimeout(() => {
      if (enc.type === 'sneak') {
        setPlayerPose('sneak')
        say('security', getRandomSecurityResponse('sneak'))
        setGuardPose('check')
        setPhase('stopped')
        setActions([
          { id: 'show', label: 'SHOW ID' },
          { id: 'talk', label: 'TALK' },
          { id: 'ignore', label: 'IGNORE' },
        ])
        setStats((s) => ({ ...s, securityInteractions: s.securityInteractions + 1 }))
        return
      }
      setPlayerPose('stop')
      setPhase('stopped')
      setGuardPose('check')
      if (enc.type === 'late') {
        say('security', `${getRandomSecurityAsk()} ${getRandomSecurityResponse('late')}`)
      } else if (enc.type === 'group') {
        say('security', 'એક-એક કરીને! ID બતાવો.')
      } else if (enc.type === 'professor_behind') {
        say('security', getRandomSecurityAsk())
        flashToast('Professor approaching behind you...')
      } else {
        say('security', getRandomSecurityAsk())
      }
      setActions([
        { id: 'show', label: 'SHOW ID' },
        { id: 'talk', label: 'TALK' },
        { id: 'ignore', label: 'IGNORE' },
      ])
      setStats((s) => ({ ...s, securityInteractions: s.securityInteractions + 1 }))
    }, delay)
  }, [say, audio, flashToast])

  const resolveStudentId = useCallback(() => {
    const type = encounter?.type || 'valid'
    setShowIdFly(true)
    setInspecting(true)
    setActions([])
    say('narrator', 'Security checks your ID...')
    bumpStat({ idChecked: (stats.idChecked || 0) + 1 })

    setTimeout(() => {
      setShowIdFly(false)
      setInspecting(false)

      if (type === 'valid' || type === 'late' || type === 'group' || type === 'upside_down') {
        if (type === 'upside_down') {
          say('security', 'ભાઈ, ID સીધું પકડો... OK, ચાલો.')
        } else {
          say('security', pick(securityValid))
        }
        setGateOpen(true)
        audio.sfx('gateOpen')
        setPlayerPose('enter')
        setEntryStatus('approved')
        flashToast('ENTRY APPROVED ✓')
        bumpStat({ collegeScore: Math.min(100, (stats.collegeScore || 70) + 12) })
        setPhase('entered')
        setTimeout(() => {
          setActions([{ id: 'again', label: 'WALK TO GATE AGAIN' }, { id: 'finish', label: 'END DAY' }])
          busyRef.current = false
        }, 2800)
      } else if (type === 'forgot') {
        say('security', pick(securityInvalid.filter((l) => l.includes('વગર') || l.includes('ID'))))
        say('security', 'આજે ID વગર?')
        setEntryStatus('denied')
        flashToast('ENTRY DENIED')
        setPhase('denied')
        setActions([
          { id: 'goback', label: 'GO BACK' },
          { id: 'explain', label: 'TRY TO EXPLAIN' },
          { id: 'friend', label: 'CALL FRIEND' },
        ])
      } else if (type === 'expired') {
        say('security', 'આ તો expire થઈ ગઈ.')
        setEntryStatus('denied')
        flashToast('ENTRY DENIED — EXPIRED')
        setPhase('denied')
        setActions([{ id: 'goback', label: 'GO BACK' }, { id: 'explain', label: 'TRY TO EXPLAIN' }, { id: 'talk', label: 'TALK' }])
      } else if (type === 'wrong_id') {
        say('security', 'ભાઈ, આ કોનું ID છે?')
        setEntryStatus('denied')
        flashToast('ENTRY DENIED — WRONG ID')
        setPhase('denied')
        setActions([{ id: 'goback', label: 'GO BACK' }, { id: 'explain', label: 'TRY TO EXPLAIN' }])
      } else if (type === 'photo_mismatch') {
        say('security', 'ફોટો તો બીજાનો છે.')
        setEntryStatus('denied')
        flashToast('ENTRY DENIED — PHOTO MISMATCH')
        setPhase('denied')
        setActions([{ id: 'goback', label: 'GO BACK' }, { id: 'explain', label: 'TRY TO EXPLAIN' }])
      } else if (type === 'argue') {
        say('security', getRandomSecurityResponse('argue'))
        bumpStat({ arguments: (stats.arguments || 0) + 1 })
        setPhase('denied')
        setActions([{ id: 'show', label: 'SHOW ID' }, { id: 'goback', label: 'GO BACK' }])
      } else if (type === 'sneak' || type === 'professor_behind') {
        say('security', 'ID વગર entry નહીં. બતાવો.')
        setPhase('stopped')
        setActions([{ id: 'show', label: 'SHOW ID NOW' }, { id: 'talk', label: 'TALK' }, { id: 'goback', label: 'GO BACK' }])
      } else {
        say('security', pick(securityValid))
        setGateOpen(true)
        audio.sfx('gateOpen')
        setPlayerPose('enter')
        setEntryStatus('approved')
        flashToast('ENTRY APPROVED ✓')
        setPhase('entered')
        setActions([{ id: 'again', label: 'WALK TO GATE AGAIN' }, { id: 'finish', label: 'END DAY' }])
        busyRef.current = false
      }
    }, 1800)
  }, [encounter, say, audio, bumpStat, flashToast, stats])

  const handleStudentTalk = useCallback((key) => {
    setShowTalkMenu(false)
    const lineMap = {
      forgot: studentLines.forgot,
      phonePhoto: studentLines.phone,
      regular: studentLines.regular,
      wait: studentLines.wait,
      friend: studentLines.friend,
      please: studentLines.please,
    }
    say('student', pick(lineMap[key] || studentLines.forgot))
    setTimeout(() => {
      const reply = getRandomSecurityResponse(key)
      say('security', reply)
      // Soft allow sometimes
      if (key === 'please' || key === 'regular') {
        if (chance(0.45)) {
          setTimeout(() => {
            say('security', 'ચાલો, આજે જવા દઉં. Next time ID લાવજો.')
            setGateOpen(true)
            audio.sfx('gateOpen')
            setPlayerPose('enter')
            setEntryStatus('approved')
            flashToast('ENTRY APPROVED ✓ (barely)')
            setPhase('entered')
            setActions([{ id: 'again', label: 'WALK TO GATE AGAIN' }, { id: 'finish', label: 'END DAY' }])
            busyRef.current = false
          }, 1200)
          return
        }
      }
      setActions([
        { id: 'show', label: 'SHOW ID' },
        { id: 'talk', label: 'TALK AGAIN' },
        { id: 'goback', label: 'GO BACK' },
      ])
    }, 900)
  }, [say, audio, flashToast])

  // --- SECURITY CHECKER ---
  const spawnCheckerStudent = useCallback(() => {
    if (busyRef.current && phase === 'checking') return
    busyRef.current = true
    const npc = getRandomStudent(studentData.college || 'RK University')
    setCurrentNpc(npc)
    setPhase('npc_approach')
    setPlayerPose('walk')
    setGuardPose('check')
    say('student', npc.greeting)
    setTimeout(() => {
      say('security', getRandomSecurityAsk())
      setPhase('checking')
      if (npc.issue === 'missing_id') {
        setActions([
          { id: 'allow', label: 'ALLOW ENTRY' },
          { id: 'stop', label: 'STOP' },
          { id: 'ask', label: 'ASK AGAIN' },
        ])
        say('student', pick(studentLines.forgot))
      } else {
        setActions([
          { id: 'allow', label: 'ALLOW ENTRY' },
          { id: 'stop', label: 'STOP' },
          { id: 'ask', label: 'ASK AGAIN' },
        ])
      }
    }, 1400)
  }, [phase, say, studentData.college])

  const judgeStudent = useCallback((decision) => {
    if (!currentNpc) return
    const shouldAllow = currentNpc.shouldAllow
    const correct =
      (decision === 'allow' && shouldAllow) ||
      (decision === 'stop' && !shouldAllow)

    setStats((s) => ({
      ...s,
      studentsChecked: s.studentsChecked + 1,
      approved: s.approved + (decision === 'allow' ? 1 : 0),
      rejected: s.rejected + (decision === 'stop' ? 1 : 0),
      mistakes: s.mistakes + (correct ? 0 : 1),
      securityScore: Math.max(0, Math.min(100, s.securityScore + (correct ? 10 : -5))),
    }))

    if (correct) {
      setFeedback({ ok: true, text: shouldAllow ? 'Correct — ID was valid.' : `Good catch. ${currentNpc.issueLabel}.` })
      audio.sfx('notification')
    } else {
      setFeedback({ ok: false, text: shouldAllow ? 'Wrong — this ID was actually valid.' : `Missed it — ${currentNpc.issueLabel}.` })
      audio.sfx('horn')
    }

    if (decision === 'allow') {
      say('security', pick(securityValid))
      setGateOpen(true)
      audio.sfx('gateOpen')
      setPlayerPose('enter')
    } else if (decision === 'stop') {
      say('security', pick(securityInvalid))
      setGateOpen(false)
      setPlayerPose('stop')
    } else {
      say('security', getRandomSecurityAsk())
      setFeedback(null)
      return
    }

    setActions([])
    setTimeout(() => {
      setFeedback(null)
      setGateOpen(false)
      setCurrentNpc(null)
      setPhase('idle')
      busyRef.current = false
      setGuardPose(role === 'free' ? 'sit' : 'idle')
      setActions(role === 'free' ? FREE_ACTIONS : [{ id: 'nextStudent', label: 'NEXT STUDENT' }])
    }, 2200)
  }, [currentNpc, say, audio, role, FREE_ACTIONS])

  // --- FREE TIME ---
  const interruptRelaxation = useCallback((reason = 'STUDENT APPROACHING') => {
    setInterruptBanner(`🚨 ${reason}`)
    audio.pauseMusic()
    audio.sfx('notification')
    setOverlay(null)
    setGuardPose('check')
    setChaiSellerVisible(false)
    audio.setQuiet(false)
    say('security', getRandomSecurityAsk())
    setTimeout(() => setInterruptBanner(null), 2500)

    // Mini check loop during free time
    const npc = getRandomStudent(studentData.college || 'RK University')
    setCurrentNpc(npc)
    setPhase('checking')
    setCamera('security')
    setActions([
      { id: 'allow', label: 'ALLOW ENTRY' },
      { id: 'stop', label: 'STOP' },
      { id: 'ask', label: 'ASK AGAIN' },
    ])
    busyRef.current = true
  }, [audio, say, studentData.college])

  const freeAction = useCallback((id) => {
    if (busyRef.current && phase === 'checking') return
    switch (id) {
      case 'chai':
        setChaiSellerVisible(true)
        setGuardPose('idle')
        say('chaiwala', pick(chaiwala))
        setOverlay('chai')
        setActions([])
        break
      case 'music':
        setOverlay('music')
        setGuardPose('music')
        audio.playMusic()
        bumpStat({ musicMinutes: stats.musicMinutes + 1 })
        break
      case 'phone':
        setOverlay('phone')
        setGuardPose('phone')
        audio.sfx('phone')
        break
      case 'newspaper':
        setOverlay('newspaper')
        setGuardPose('newspaper')
        say('security', 'આજે તો શાંતિ છે.')
        setTimeout(() => {
          if (chance(0.7)) interruptRelaxation('STUDENT APPROACHING')
        }, 3500)
        break
      case 'nap':
        setGuardPose('sleep')
        audio.setQuiet(true)
        gameTime.setTime(13 * 60 + 17)
        say('narrator', 'Eyes getting heavy...')
        setTimeout(() => {
          say('student', pick(studentLines.wake))
          setGuardPose('check')
          audio.setQuiet(false)
          say('security', pick(securityFree.filter((l) => l.includes('ID') || l.includes('ફરી') || l.includes('હા'))))
          bumpStat({ napMinutes: stats.napMinutes + 12 })
          interruptRelaxation('STUDENT AT GATE')
        }, 4000)
        break
      case 'minigame':
        setOverlay('minigame')
        break
      case 'walk':
        setGuardPose('walk')
        say('security', 'થોડું walk કરું...')
        setTimeout(() => {
          if (chance(0.6)) interruptRelaxation('SOMEONE AT THE GATE')
          else {
            setGuardPose('idle')
            say('security', pick(securityFree))
          }
        }, 3000)
        break
      default:
        break
    }
  }, [phase, say, audio, bumpStat, stats, interruptRelaxation, gameTime])

  const orderChai = useCallback((size) => {
    if (size === 'no') {
      say('chaiwala', 'બરાબર sir!')
      setOverlay(null)
      setChaiSellerVisible(false)
      return
    }
    say('security', size === 'cutting' ? 'એક cutting.' : 'Full મૂકો.')
    audio.sfx('chai')
    setGuardPose('drink')
    bumpStat({ chaiCount: stats.chaiCount + 1 })
    setTimeout(() => {
      say('security', 'આજે તો શાંતિ છે.')
      setOverlay(null)
      setTimeout(() => interruptRelaxation('STUDENT APPROACHING'), 1500)
    }, 2000)
  }, [say, audio, bumpStat, stats.chaiCount, interruptRelaxation])

  // --- PROFESSOR ---
  const startProfessorScene = useCallback(() => {
    busyRef.current = true
    const prof = getRandomProfessor()
    setCurrentNpc({ ...prof, kind: 'professor' })
    setPhase('prof_walk')
    setPlayerPose('walk')
    setGuardPose('idle')
    say('security', 'Good morning sir.')
    say('professor', pick(professorLines[prof.personality] || professorLines.friendly))
    setTimeout(() => {
      setGateOpen(true)
      audio.sfx('gateOpen')
      setPlayerPose('enter')
      setPhase('prof_entered')
      flashToast('Professor walks through')
      setTimeout(() => {
        // Student tries to follow
        setGateOpen(false)
        setPlayerPose('sneak')
        setGuardPose('check')
        say('security', 'એ... ઊભો! તારો ID.')
        setTimeout(() => {
          say('student', pick(studentLines.followProf))
          setTimeout(() => {
            say('security', 'Sir તો ગયા. તું અલગ છે.')
            setPhase('follow_caught')
            setActions([
              { id: 'checkFollower', label: 'CHECK STUDENT ID' },
              { id: 'letFollow', label: 'LET THEM GO (risky)' },
              { id: 'profAgain', label: 'ENTER AS PROFESSOR AGAIN' },
            ])
          }, 1000)
        }, 900)
      }, 2200)
    }, 2000)
  }, [say, audio, flashToast])

  // --- VISITOR ---
  const startVisitorScene = useCallback(() => {
    busyRef.current = true
    setPhase('visitor_approach')
    setPlayerPose('walk')
    setTimeout(() => {
      setPlayerPose('stop')
      setGuardPose('check')
      const v = visitorData || getRandomVisitor()
      say('visitor', pick(visitorLines[v.type] || visitorLines.unknown))
      setTimeout(() => {
        say('security', v.type === 'delivery' ? 'કયા department માટે?' : 'ક્યાં જાવ છો? Purpose?')
        setOverlay('visitorPass')
        setPhase('visitor_check')
        setActions([
          { id: 'vallow', label: 'ALLOW' },
          { id: 'vreject', label: 'REJECT' },
          { id: 'vask', label: 'ASK DETAILS' },
        ])
      }, 1000)
    }, 2500)
  }, [visitorData, say])

  // Boot role scenes when sim starts
  useEffect(() => {
    if (screen !== 'sim' || !sessionId) return undefined
    let cancelled = false
    const t = setTimeout(() => {
      if (cancelled) return
      if (role === 'student') startStudentApproach()
      if (role === 'checker') {
        setActions([{ id: 'nextStudent', label: 'CALL NEXT STUDENT' }])
        setTimeout(() => {
          if (!cancelled) spawnCheckerStudent()
        }, 800)
      }
      if (role === 'free') {
        setGuardPose('sit')
        setActions(FREE_ACTIONS)
      }
      if (role === 'professor') startProfessorScene()
      if (role === 'visitor') startVisitorScene()
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, role, sessionId])

  // Free-time / ambient event engine
  useEffect(() => {
    if (screen !== 'sim' || isPaused) return undefined
    engineRef.current = createEventEngine({
      context: role === 'free' ? 'freeTime' : role === 'checker' ? 'busy' : 'idle',
      minMs: 12000,
      maxMs: 28000,
    })
    const id = setInterval(() => {
      if (busyRef.current && role !== 'free') return
      if (role === 'free' && (overlay || phase === 'checking')) return
      const ev = engineRef.current?.tick()
      if (!ev) return
      handleWorldEvent(ev)
    }, 1500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, isPaused, role, overlay, phase])

  const handleWorldEvent = useCallback((ev) => {
    switch (ev) {
      case 'announcement':
        setAnnouncement(pick(announcements))
        audio.sfx('bell')
        setTimeout(() => setAnnouncement(null), 5000)
        break
      case 'student_arrival':
      case 'late_student':
        if (role === 'free') interruptRelaxation(ev === 'late_student' ? 'LATE STUDENT' : 'STUDENT APPROACHING')
        else if (role === 'checker' && phase === 'idle') spawnCheckerStudent()
        else flashToast(ev === 'late_student' ? 'A late student rushes past...' : 'More students at the gate')
        break
      case 'professor_arrival':
        flashToast(`${getRandomProfessor().name} walking in`)
        if (role === 'free') interruptRelaxation('PROFESSOR ARRIVING')
        break
      case 'visitor_arrival':
      case 'delivery_arrival':
        flashToast(ev === 'delivery_arrival' ? 'Delivery person at gate' : 'Visitor at gate')
        if (role === 'free') interruptRelaxation(ev === 'delivery_arrival' ? 'DELIVERY' : 'VISITOR')
        break
      case 'phone_call':
        audio.sfx('phone')
        flashToast('📞 Incoming call...')
        break
      case 'principal_arrival':
        flashToast('🚨 Principal near the gate!')
        if (role === 'free') {
          audio.pauseMusic()
          setGuardPose('check')
          say('security', 'Good morning sir!')
        }
        break
      case 'chai_break':
        if (role === 'free' && !overlay) {
          setChaiSellerVisible(true)
          say('chaiwala', pick(chaiwala))
        }
        break
      case 'group_students':
        flashToast('Group of students at the gate')
        break
      case 'random_dialogue':
        if (!dialogue) say('npc', pick(['Lecture ક્યાં છે?', 'Canteen ખુલ્લું છે?', 'ID ભૂલી ગયો!']))
        break
      default:
        break
    }
  }, [role, phase, overlay, interruptRelaxation, spawnCheckerStudent, flashToast, audio, say, dialogue])

  const dispatchAction = useCallback((id) => {
    // Student
    if (id === 'show') resolveStudentId()
    else if (id === 'talk') setShowTalkMenu(true)
    else if (id === 'ignore') {
      say('security', 'ભાઈ! સાંભળો! ID બતાવો.')
      bumpStat({ arguments: (stats.arguments || 0) + 1 })
      setActions([{ id: 'show', label: 'SHOW ID' }, { id: 'talk', label: 'TALK' }, { id: 'goback', label: 'GO BACK' }])
    } else if (id === 'goback') {
      setPlayerPose('idle')
      setPhase('idle')
      setEntryStatus(null)
      setGateOpen(false)
      busyRef.current = false
      setActions([{ id: 'again', label: 'TRY AGAIN' }, { id: 'finish', label: 'END DAY' }])
      say('narrator', 'You step back from the gate.')
    } else if (id === 'explain') {
      handleStudentTalk('please')
    } else if (id === 'friend') {
      handleStudentTalk('friend')
    } else if (id === 'again') {
      resetSimVisuals()
      setTimeout(() => startStudentApproach(), 300)
    } else if (id === 'finish') {
      endSession()
    }
    // Checker
    else if (id === 'allow') judgeStudent('allow')
    else if (id === 'stop') judgeStudent('stop')
    else if (id === 'ask') judgeStudent('ask')
    else if (id === 'nextStudent') {
      setActions([])
      spawnCheckerStudent()
    }
    // Free
    else if (['chai', 'music', 'phone', 'newspaper', 'nap', 'minigame', 'walk'].includes(id)) {
      freeAction(id)
    }
    // Professor
    else if (id === 'checkFollower') {
      say('security', getRandomSecurityAsk())
      setTimeout(() => {
        say('security', pick(securityValid))
        setGateOpen(true)
        audio.sfx('gateOpen')
        setPlayerPose('enter')
        setActions([{ id: 'profAgain', label: 'ENTER AGAIN' }, { id: 'finish', label: 'END DAY' }])
        busyRef.current = false
      }, 1200)
    } else if (id === 'letFollow') {
      say('security', '...ચાલો, જાવ. Next time ID.')
      setGateOpen(true)
      setPlayerPose('enter')
      bumpStat({ mistakes: stats.mistakes + 1, securityScore: Math.max(0, stats.securityScore - 5) })
      setActions([{ id: 'profAgain', label: 'ENTER AGAIN' }, { id: 'finish', label: 'END DAY' }])
      busyRef.current = false
    } else if (id === 'profAgain') {
      resetSimVisuals()
      setTimeout(() => startProfessorScene(), 300)
    }
    // Visitor
    else if (id === 'vallow') {
      say('security', 'Pass લો. અંદર જાઓ.')
      setGateOpen(true)
      audio.sfx('gateOpen')
      setPlayerPose('enter')
      setEntryStatus('approved')
      flashToast('VISITOR ENTRY ALLOWED')
      setActions([{ id: 'finish', label: 'END DAY' }, { id: 'vagain', label: 'NEW VISITOR' }])
      busyRef.current = false
    } else if (id === 'vreject') {
      say('security', 'આજે entry નહીં. Office contact કરો.')
      setEntryStatus('denied')
      flashToast('VISITOR REJECTED')
      setActions([{ id: 'vask', label: 'ASK DETAILS' }, { id: 'finish', label: 'END DAY' }])
    } else if (id === 'vask') {
      say('security', 'Phone number? Person નું full name?')
      say('visitor', `${visitorData?.person || 'Prof. Patel'} — ${visitorData?.department || 'CE'}`)
    } else if (id === 'vagain') {
      resetSimVisuals()
      setTimeout(() => startVisitorScene(), 300)
    }
  }, [
    resolveStudentId, say, bumpStat, stats, handleStudentTalk, resetSimVisuals,
    startStudentApproach, endSession, judgeStudent, spawnCheckerStudent, freeAction,
    audio, startProfessorScene, flashToast, visitorData, startVisitorScene,
  ])

  const value = useMemo(() => ({
    screen,
    setScreen,
    role,
    studentData,
    setStudentData,
    visitorData,
    setVisitorData,
    isPaused,
    setIsPaused,
    gateOpen,
    dialogue,
    actions,
    phase,
    guardPose,
    playerPose,
    showIdFly,
    inspecting,
    currentNpc,
    encounter,
    toast,
    announcement,
    notice,
    overlay,
    setOverlay,
    interruptBanner,
    feedback,
    result,
    settingsOpen,
    setSettingsOpen,
    showTalkMenu,
    setShowTalkMenu,
    chaiSellerVisible,
    entryStatus,
    camera,
    stats,
    audio,
    gameTime,
    enterCollege,
    selectRole,
    startWithProfile,
    changeRole,
    playAgain,
    dispatchAction,
    handleStudentTalk,
    orderChai,
    interruptRelaxation,
    endSession,
    flashToast,
  }), [
    screen, role, studentData, visitorData, isPaused, gateOpen, dialogue, actions, phase,
    guardPose, playerPose, showIdFly, inspecting, currentNpc, encounter, toast, announcement,
    notice, overlay, interruptBanner, feedback, result, settingsOpen, showTalkMenu, chaiSellerVisible,
    entryStatus, camera, stats, audio, gameTime, enterCollege, selectRole, startWithProfile,
    changeRole, playAgain, dispatchAction, handleStudentTalk, orderChai, interruptRelaxation,
    endSession, flashToast,
  ])

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider')
  return ctx
}

function buildResult(role, stats, studentData, entryStatus) {
  if (role === 'checker' || role === 'free') {
    return {
      title: 'SECURITY SHIFT COMPLETE',
      name: 'SECURITY BHAI',
      lines: [
        { label: 'Students Checked', value: stats.studentsChecked },
        { label: 'Approved', value: stats.approved },
        { label: 'Rejected', value: stats.rejected },
        { label: 'Wrong Decisions', value: stats.mistakes },
        { label: 'Chai', value: stats.chaiCount },
        { label: 'Nap', value: `${stats.napMinutes} minutes` },
        { label: 'Music', value: `${stats.musicMinutes} minutes` },
      ],
      score: stats.securityScore,
      scoreLabel: 'Security Score',
      blurb: `Checked ${stats.studentsChecked} IDs. Survived ${stats.chaiCount} chai breaks. Caught ${stats.rejected} suspicious entries.`,
    }
  }
  if (role === 'visitor') {
    return {
      title: 'VISITOR DAY COMPLETE',
      name: (studentData?.name || 'VISITOR').split(' ')[0].toUpperCase() + "'S VISIT",
      lines: [
        { label: 'Entry', value: entryStatus === 'approved' ? 'ALLOWED ✓' : entryStatus === 'denied' ? 'DENIED' : 'PENDING' },
        { label: 'Security Interaction', value: stats.securityInteractions || 1 },
      ],
      score: entryStatus === 'approved' ? 88 : 55,
      scoreLabel: 'Visit Score',
      blurb: 'Tried to get past the gate. Security had questions.',
    }
  }
  if (role === 'professor') {
    return {
      title: 'PROFESSOR DAY COMPLETE',
      name: 'FACULTY ENTRY',
      lines: [
        { label: 'Walked through', value: 'Yes' },
        { label: 'Students stopped behind you', value: 1 },
        { label: 'Security greetings', value: 'Good morning sir.' },
      ],
      score: 95,
      scoreLabel: 'Authority Score',
      blurb: 'Walked straight through. Someone tried to follow.',
    }
  }
  return {
    title: 'COLLEGE DAY COMPLETE',
    name: `${(studentData?.name || 'STUDENT').split(' ')[0].toUpperCase()}'S COLLEGE DAY`,
    lines: [
      { label: 'Entry', value: entryStatus === 'approved' ? 'APPROVED ✓' : entryStatus === 'denied' ? 'DENIED' : 'IN PROGRESS' },
      { label: 'ID Checked', value: stats.idChecked },
      { label: 'Arguments', value: stats.arguments },
      { label: 'Chai', value: stats.chaiCount },
      { label: 'Late', value: `${stats.lateMinutes} minutes` },
      { label: 'Security Interaction', value: stats.securityInteractions },
    ],
    score: stats.collegeScore,
    scoreLabel: "Today's College Score",
    blurb: entryStatus === 'approved'
      ? 'Made it inside. ID drama survived.'
      : 'Gate kept you honest today.',
  }
}
