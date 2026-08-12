import { studentTalkOptions } from '../data/dialogues'
import CollegeScene from './CollegeScene'
import DialogueBox from './DialogueBox'
import ControlPanel from './ControlPanel'
import ScorePanel from './ScorePanel'
import Phone from './Phone'
import MusicPlayer from './MusicPlayer'
import ChaiInteraction from './ChaiInteraction'
import MiniGame from './MiniGame'
import IDCard from './IDCard'
import { useSimulation } from '../hooks/useSimulation'

export default function SimulationView() {
  const sim = useSimulation()
  const {
    role, studentData, visitorData, gateOpen, guardPose, playerPose, camera,
    showIdFly, inspecting, currentNpc, encounter, notice, chaiSellerVisible,
    dialogue, actions, toast, announcement, interruptBanner, feedback, overlay,
    showTalkMenu, setShowTalkMenu, entryStatus, stats, audio, gameTime,
    isPaused, setIsPaused, settingsOpen, setSettingsOpen, dispatchAction,
    handleStudentTalk, orderChai, setOverlay, changeRole,
  } = sim

  return (
    <div className={`sim-view role-${role} ${isPaused ? 'is-paused' : ''}`}>
      <ScorePanel
        role={role}
        stats={stats}
        timeLabel={gameTime.timeLabel}
        periodLabel={gameTime.period.label}
      />

      <ControlPanel
        soundOn={audio.enabled}
        onToggleSound={audio.toggle}
        onSettings={() => setSettingsOpen((v) => !v)}
        onChangeRole={changeRole}
        paused={isPaused}
        onTogglePause={() => setIsPaused((v) => !v)}
        volume={audio.volume}
        onVolume={audio.setVolume}
        settingsOpen={settingsOpen}
      />

      <CollegeScene
        collegeName={studentData.college || visitorData?.college || 'RK University'}
        gateOpen={gateOpen}
        guardPose={guardPose}
        playerPose={playerPose}
        role={role}
        camera={camera}
        studentData={role === 'visitor' ? visitorData : studentData}
        currentNpc={currentNpc}
        showIdFly={showIdFly}
        inspecting={inspecting}
        encounter={encounter}
        notice={notice}
        chaiSellerVisible={chaiSellerVisible}
        period={gameTime.period}
      />

      {entryStatus && (
        <div className={`entry-banner entry-${entryStatus}`} role="status">
          {entryStatus === 'approved' ? 'ENTRY APPROVED ✓' : 'ENTRY DENIED'}
        </div>
      )}

      {interruptBanner && <div className="interrupt-banner" role="alert">{interruptBanner}</div>}
      {toast && <div className="toast" role="status">{toast}</div>}
      {announcement && (
        <div className="announcement" role="status">
          🔔 {announcement}
        </div>
      )}
      {feedback && (
        <div className={`feedback ${feedback.ok ? 'ok' : 'bad'}`} role="status">
          {feedback.ok ? '✓ Correct' : '✗ Wrong'} — {feedback.text}
        </div>
      )}

      <div className="sim-hud">
        <DialogueBox dialogue={dialogue} />

        {showTalkMenu && (
          <div className="talk-menu" role="menu">
            {studentTalkOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="menuitem"
                onClick={() => handleStudentTalk(opt.key)}
              >
                {opt.label}
              </button>
            ))}
            <button type="button" className="ghost" onClick={() => setShowTalkMenu(false)}>Cancel</button>
          </div>
        )}

        {actions?.length > 0 && !showTalkMenu && (
          <div className="action-bar" role="group" aria-label="Actions">
            {actions.map((a) => (
              <button key={a.id} type="button" className="action-btn" onClick={() => dispatchAction(a.id)}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {overlay === 'phone' && (
        <div className="overlay-backdrop">
          <Phone
            onClose={() => setOverlay(null)}
            onOpenMusic={() => {
              setOverlay('music')
              audio.playMusic()
            }}
          />
        </div>
      )}
      {overlay === 'music' && (
        <div className="overlay-backdrop">
          <MusicPlayer
            track={audio.track}
            playlist={audio.playlist}
            playing={audio.musicPlaying}
            onPlay={() => audio.playMusic()}
            onPause={audio.pauseMusic}
            onNext={audio.nextTrack}
            onClose={() => setOverlay(null)}
          />
        </div>
      )}
      {overlay === 'chai' && (
        <div className="overlay-backdrop">
          <ChaiInteraction onOrder={orderChai} onClose={() => setOverlay(null)} />
        </div>
      )}
      {overlay === 'minigame' && (
        <div className="overlay-backdrop">
          <MiniGame onClose={() => setOverlay(null)} />
        </div>
      )}
      {overlay === 'newspaper' && (
        <div className="overlay-backdrop">
          <div className="newspaper-panel" role="dialog" aria-label="Newspaper">
            <h3>સવારનું અખબાર</h3>
            <p>Local college makes ID compulsory. Security celebrates quietly.</p>
            <p>Chai prices up by ₹2. Gate duty morale down.</p>
            <button type="button" className="overlay-close" onClick={() => setOverlay(null)}>Fold newspaper</button>
          </div>
        </div>
      )}
      {overlay === 'visitorPass' && visitorData && (
        <div className="visitor-pass-float">
          <IDCard
            name={visitorData.name}
            college={visitorData.college || studentData.college}
            course={`Meeting: ${visitorData.person}`}
            semester={visitorData.department}
            studentId={`Entry ${gameTime.timeLabel}`}
            validYear="VALID TODAY"
            variant="visitor"
            compact
          />
        </div>
      )}

      {isPaused && (
        <div className="pause-veil">
          <p>PAUSED</p>
          <button type="button" className="primary-btn" onClick={() => setIsPaused(false)}>RESUME</button>
        </div>
      )}
    </div>
  )
}
