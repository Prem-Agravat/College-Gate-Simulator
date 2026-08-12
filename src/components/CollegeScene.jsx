import Gate from './Gate'
import Student from './Student'
import SecurityGuard from './SecurityGuard'
import Professor from './Professor'
import Visitor from './Visitor'
import NoticeBoard from './NoticeBoard'
import IDCard from './IDCard'
import GateBackground from './GateBackground'

export default function CollegeScene({
  collegeName = 'RK University',
  gateOpen,
  guardPose,
  playerPose,
  role,
  camera,
  studentData,
  currentNpc,
  showIdFly,
  inspecting,
  encounter,
  notice,
  chaiSellerVisible,
  period,
}) {
  const light = period?.light || 'day'
  const density = period?.npcDensity ?? 0.6
  const npcCount = Math.max(2, Math.round(density * 6))

  const showPlayerStudent = role === 'student' || (role === 'checker' && currentNpc)
  const showProfessor = role === 'professor' || currentNpc?.kind === 'professor'
  const showVisitor = role === 'visitor'

  return (
    <div className={`college-scene camera-${camera} light-${light}`} aria-label="College gate scene">
      <GateBackground />
      <div className="sky" />
      <div className="sun" />

      <div className="far-building">
        <div className="building-block" />
        <div className="building-block mid" />
        <div className="building-block tall" />
        <div className="college-nameplate">{collegeName}</div>
      </div>
      <div className="trees" aria-hidden="true">
        <span className="tree t1" />
        <span className="tree t2" />
        <span className="tree t3" />
      </div>
      <div className="parking" aria-hidden="true">
        <span className="bike b1" />
        <span className="bike b2" />
        <span className="scooter" />
      </div>
      <div className="road">
        <div className="road-line" />
      </div>

      <NoticeBoard notice={notice} />

      <div className="security-cabin" aria-hidden="true">
        <div className="cabin-roof" />
        <div className="cabin-wall" />
        <div className="cabin-window" />
      </div>

      <Gate open={gateOpen} />

      <div className="npc-layer" aria-hidden="true">
        {Array.from({ length: npcCount }).map((_, i) => (
          <div key={i} className={`npc-walker n${i % 5}`} style={{ animationDelay: `${i * 1.4}s` }}>
            <div className="npc-dot" />
          </div>
        ))}
        <div className="bike-mover" />
      </div>

      {chaiSellerVisible && (
        <div className="chai-seller" aria-hidden="true">
          <div className="chai-cart" />
          <span>Chaiwala</span>
        </div>
      )}

      <SecurityGuard pose={guardPose} />

      {showProfessor && (
        <Professor
          pose={playerPose === 'enter' ? 'enter' : playerPose}
          name={currentNpc?.name || 'Professor'}
        />
      )}

      {showVisitor && (
        <Visitor pose={playerPose} label={studentData?.name?.split(' ')[0] || 'Visitor'} />
      )}

      {showPlayerStudent && !showProfessor && (
        <Student
          pose={role === 'checker' ? (playerPose || 'walk') : playerPose}
          label={role === 'checker' ? (currentNpc?.name?.split(' ')[0] || 'Student') : 'You'}
          highlight={role === 'student'}
        />
      )}

      {(showIdFly || inspecting) && role === 'student' && (
        <div className="id-fly-layer">
          <IDCard
            {...studentData}
            flying={showIdFly}
            inspecting={inspecting}
            upsideDown={encounter?.type === 'upside_down'}
          />
        </div>
      )}

      {(role === 'checker' || role === 'free') && currentNpc && currentNpc.kind !== 'professor' && (
        currentNpc.issue === 'missing_id' || currentNpc.hasId === false ? (
          <div className="checker-id-panel missing">
            <p>No ID presented</p>
          </div>
        ) : (
          <div className="checker-id-panel">
            <IDCard
              name={currentNpc.name}
              college={currentNpc.college}
              course={currentNpc.course}
              semester={currentNpc.semester}
              studentId={currentNpc.studentId}
              photoColor={currentNpc.photoColor}
              validYear={currentNpc.validYear}
              holderName={currentNpc.holderName}
              issue={currentNpc.issue}
              compact
            />
            <p className="inspect-tip">Inspect photo, college, validity & ID</p>
          </div>
        )
      )}
    </div>
  )
}
