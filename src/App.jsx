import { useState, useEffect, useRef } from 'react'
import DataFlow from './components/DataFlow'
import TrustGradient from './components/TrustGradient'
import FailureModes from './components/FailureModes'
import Part2FieldMapping from './components/Part2FieldMapping'
import Part2AnomalyDetection from './components/Part2AnomalyDetection'
import Part2TrustWarning from './components/Part2TrustWarning'
import Part2AIToolsAsPM from './components/Part2AIToolsAsPM'
import Part3BuildBuy from './components/Part3BuildBuy'
import Part3Sequencing from './components/Part3Sequencing'
import Part3DataGaps from './components/Part3DataGaps'
import Part4SyncFailure from './components/Part4SyncFailure'
import Part4FieldMapping from './components/Part4FieldMapping'
import BonusDashboard from './components/BonusDashboard'

// ─── localStorage keys ────────────────────────────────────────────────────────
const LS_WELCOMED       = 'qpai_welcomed'
const LS_TOUR_DISMISSED = 'qpai_tour_dismissed'
const LS_TOUR_VISITED   = 'qpai_tour_visited'

// ─── Nav ─────────────────────────────────────────────────────────────────────
const PARTS = [
  { id: 'part1', label: 'Part 1: Designing the Integration', available: true },
  { id: 'part2', label: 'Part 2: AI in the Integration Layer', available: true },
  { id: 'part3', label: 'Part 3: Prioritization', available: true },
  { id: 'part4', label: 'Part 4: Error UX', available: true },
  { id: 'bonus', label: 'Bonus: Health Dashboard', available: true, bonus: true },
]

const TOUR_STEPS = [
  { partId: 'part1', label: 'Part 1' },
  { partId: 'part2', label: 'Part 2' },
  { partId: 'part3', label: 'Part 3' },
  { partId: 'part4', label: 'Part 4' },
  { partId: 'bonus', label: 'Bonus'  },
]

const CIRCLE = ['①','②','③','④','⑤']

// ─── Section arrays ───────────────────────────────────────────────────────────
const PART1_SECTIONS = [
  { id: 'dataflow', label: 'Data Flow' },
  { id: 'trust',    label: 'Trust Gradient' },
  { id: 'failures', label: 'Failure Modes' },
]
const PART2_SECTIONS = [
  { id: 'fieldmapping', label: 'Field Mapping' },
  { id: 'anomaly',      label: 'Anomaly Detection' },
  { id: 'notai',        label: 'Where AI Should Not Be Used' },
  { id: 'aitoolspm',    label: 'AI Tools as PM' },
]
const PART3_SECTIONS = [
  { id: 'buildbuy',   label: 'Build / Buy / Partner' },
  { id: 'sequencing', label: 'Sequencing' },
  { id: 'datagaps',   label: 'What Would Change This' },
]
const PART4_SECTIONS = [
  { id: 'syncfailure',  label: 'Sync Failure State' },
  { id: 'fieldmapping', label: 'Field Mapping Configuration' },
]

// ─── Guide message logic ──────────────────────────────────────────────────────
function getGuideMessage({ showWelcome, activePart, p1Section, p2Section, p3Section, p4Section, tourVisited, triggerClicked }) {
  const allVisited = PARTS.every((p) => tourVisited.includes(p.id))

  if (showWelcome) {
    return "Start by clicking 'Let's go →' to begin the tour"
  }
  if (allVisited) {
    return "You've seen everything. Questions? The ⓘ icons throughout explain every PM decision."
  }
  if (activePart === 'part1') {
    if (p1Section === 'dataflow') {
      if (triggerClicked) return "See how each stage lights up? Now head to Trust Gradient to see how each change gets routed →"
      return "Click New Hire, Salary Change, or Termination to watch the integration run"
    }
    if (p1Section === 'trust') {
      return "Click any card to see why it was assigned that trust level"
    }
    if (p1Section === 'failures') {
      return "You've seen how the integration works. Head to Part 2 to see where AI fits in →"
    }
  }
  if (activePart === 'part2') {
    if (p2Section === 'fieldmapping') return "Click the AI workflow cards to see the before and after"
    if (p2Section === 'anomaly')      return "See how AI flags outliers — and why it can't make the final call"
    if (p2Section === 'notai')        return "This is the key distinction — where rules beat AI every time"
    if (p2Section === 'aitoolspm')    return "Part 3 is where prioritization gets interesting → which HRIS do we build first?"
  }
  if (activePart === 'part3') {
    if (p3Section === 'buildbuy')   return "Click each HRIS card to see the build vs buy vs partner decision"
    if (p3Section === 'sequencing') return "See them ordered by revenue at risk — not predicted impact"
    if (p3Section === 'datagaps')   return "Now see what the admin actually sees when something breaks → Part 4"
  }
  if (activePart === 'part4') {
    if (p4Section === 'syncfailure')  return "Try the sync failure card first — click 'Review and Fix' to see the full flow"
    if (p4Section === 'fieldmapping') return "You've covered all 4 parts. We built one more thing nobody asked for → check the Bonus tab"
  }
  if (activePart === 'bonus') {
    return "This is the health dashboard — the screen that tells you what's breaking before your customer does"
  }
  return "Explore the sections above to walk through the full integration story"
}

// ─── Guide bubble ─────────────────────────────────────────────────────────────
function GuideBubble({ message, minimized, onMinimize, onExpand }) {
  const [displayed, setDisplayed]   = useState(message)
  const [visible,   setVisible]     = useState(true)   // for fade transition
  const prevMessageRef              = useRef(message)

  useEffect(() => {
    if (message === prevMessageRef.current) return
    // Fade out → swap text → fade in
    setVisible(false)
    const t = setTimeout(() => {
      setDisplayed(message)
      prevMessageRef.current = message
      setVisible(true)
    }, 180)
    return () => clearTimeout(t)
  }, [message])

  // Minimized — small purple dot, expands on hover
  if (minimized) {
    return (
      <button
        onClick={onExpand}
        title="Show guide"
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div
          className="w-4 h-4 rounded-full shadow-lg transition-transform duration-200 group-hover:scale-[2.5]"
          style={{ background: '#714dff' }}
        />
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 w-[280px] rounded-2xl shadow-2xl overflow-hidden"
      style={{ background: '#714dff' }}
    >
      <div className="px-4 py-3 flex items-start gap-3">
        {/* message */}
        <p
          className="text-xs text-white leading-relaxed flex-1 transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {displayed}
        </p>
        {/* minimise */}
        <button
          onClick={onMinimize}
          className="shrink-0 text-white/50 hover:text-white transition-colors text-[10px] mt-0.5 leading-none"
          aria-label="Minimise guide"
        >
          ✕
        </button>
      </div>
      {/* subtle bottom accent stripe */}
      <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
    </div>
  )
}

// ─── SectionProgress ─────────────────────────────────────────────────────────
function SectionProgress({ sections, activeId }) {
  const idx = sections.findIndex((s) => s.id === activeId)
  if (idx === -1) return null
  return (
    <p className="text-xs text-muted mt-2 mb-8">
      Section {idx + 1} of {sections.length}
    </p>
  )
}

// ─── SideNav ─────────────────────────────────────────────────────────────────
function SideNav({ sections, activeId, onSelect }) {
  const activeIdx = sections.findIndex((s) => s.id === activeId)
  return (
    <>
      {/* md+ — labelled sidebar */}
      <div className="hidden md:block w-36 shrink-0 self-start sticky top-[57px]">
        <div className="space-y-0.5">
          {sections.map((s) => {
            const isActive = s.id === activeId
            return (
              <button
                key={s.id}
                onClick={() => { onSelect(s.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors border-l-2 ${
                  isActive
                    ? 'text-primary font-semibold bg-purple-50 border-primary'
                    : 'text-muted hover:text-dark hover:bg-gray-50 border-transparent'
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>
      {/* sm — thin progress rail */}
      <div className="md:hidden w-1.5 shrink-0 self-stretch mt-1">
        <div className="relative h-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="absolute w-full rounded-full bg-primary transition-all duration-300"
            style={{
              top: `${(activeIdx / sections.length) * 100}%`,
              height: `${(1 / sections.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </>
  )
}

// ─── NextNudge ────────────────────────────────────────────────────────────────
function NextNudge({ text, dest, onClick }) {
  return (
    <div className="mt-14 pt-6 border-t border-gray-100 flex justify-end">
      <button
        onClick={onClick}
        className="group flex items-center gap-1.5 text-xs text-muted hover:text-dark transition-colors"
      >
        <span>{text}</span>
        <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform inline-block">
          → {dest}
        </span>
      </button>
    </div>
  )
}

// ─── Welcome modal ────────────────────────────────────────────────────────────
function WelcomeModal({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] p-8">
        <p className="text-2xl mb-4">👋</p>
        <h2 className="text-xl font-bold text-dark mb-2">
          Welcome to the QuantapayAI Integration Explorer
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-5">
          This is a PM take-home case study built as an interactive product — not a PDF.
        </p>
        <p className="text-xs font-semibold text-dark uppercase tracking-wide mb-3">
          Here's how to navigate it:
        </p>
        <ol className="space-y-2.5 mb-6">
          {[
            ['Part 1 — Data Flow', 'Click the trigger buttons to watch the integration run live'],
            ['Part 2 — AI in the Integration Layer', "See where AI helps and where it shouldn't"],
            ['Part 3 — Prioritization', 'Click each HRIS card to see the build / buy / partner decision'],
            ['Part 4 — Error UX', 'Interact with the wireframes like a real product'],
            ['Bonus — Health Dashboard', 'The dashboard no one asked for but every ops team needs'],
          ].map(([title, desc], i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-primary font-semibold shrink-0 w-5 text-center">{CIRCLE[i]}</span>
              <span>
                <span className="font-medium text-dark">{title}</span>
                <br />
                <span className="text-xs text-muted">{desc}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted mb-6 flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
          <span className="shrink-0">ⓘ</span>
          <span>Look for the ⓘ icon throughout — it shows the PM thinking behind every design decision.</span>
        </p>
        <button
          onClick={onDismiss}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: '#714dff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#5f3ddd'}
          onMouseLeave={e => e.currentTarget.style.background = '#714dff'}
        >
          Let's go →
        </button>
      </div>
    </div>
  )
}

// ─── Tour bar ─────────────────────────────────────────────────────────────────
function TourBar({ visited, onNavigate, onDismiss }) {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center gap-1 flex-wrap">
        <span className="text-xs text-muted mr-2 shrink-0">Your tour:</span>
        {TOUR_STEPS.map((step, i) => {
          const done = visited.includes(step.partId)
          return (
            <button
              key={step.partId}
              onClick={() => onNavigate(step.partId)}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                done ? 'text-primary font-semibold bg-purple-50' : 'text-muted hover:text-dark'
              }`}
            >
              <span className={done ? 'text-primary' : 'text-gray-300'}>{CIRCLE[i]}</span>
              {step.label}
              {done && <span className="text-emerald-500 text-[10px]">✓</span>}
            </button>
          )
        })}
        <button
          onClick={onDismiss}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-gray-50"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

// ─── SubTabs (shared renderer) ────────────────────────────────────────────────
function SubTabs({ sections, activeId, onSelect }) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-100">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`relative text-sm px-4 py-3 font-medium transition-colors ${
            activeId === s.id ? 'text-dark' : 'text-muted hover:text-dark'
          }`}
        >
          {s.label}
          {activeId === s.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activePart,  setActivePart]  = useState('part1')
  const [p1Section,   setP1Section]   = useState('dataflow')
  const [p2Section,   setP2Section]   = useState('fieldmapping')
  const [p3Section,   setP3Section]   = useState('buildbuy')
  const [p4Section,   setP4Section]   = useState('syncfailure')

  // Onboarding
  const [showWelcome,   setShowWelcome]   = useState(() => !localStorage.getItem(LS_WELCOMED))
  const [infoPulse,     setInfoPulse]     = useState(false)
  const pulseTimerRef = useRef(null)

  // Tour bar
  const [tourDismissed, setTourDismissed] = useState(() => !!localStorage.getItem(LS_TOUR_DISMISSED))
  const [tourVisited,   setTourVisited]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_TOUR_VISITED) || '[]') }
    catch { return [] }
  })

  // Guide bubble
  const [guideMinimized,  setGuideMinimized]  = useState(false)  // session only
  const [triggerClicked,  setTriggerClicked]  = useState(false)  // first pipeline trigger

  // Mark current part visited
  useEffect(() => {
    if (!tourVisited.includes(activePart)) {
      const next = [...tourVisited, activePart]
      setTourVisited(next)
      localStorage.setItem(LS_TOUR_VISITED, JSON.stringify(next))
    }
  }, [activePart]) // eslint-disable-line

  // Auto-dismiss tour bar when all parts visited
  useEffect(() => {
    if (!tourDismissed && tourVisited.length >= PARTS.length) {
      const t = setTimeout(() => handleTourDismiss(), 1500)
      return () => clearTimeout(t)
    }
  }, [tourVisited, tourDismissed]) // eslint-disable-line

  const handleWelcomeDismiss = () => {
    localStorage.setItem(LS_WELCOMED, '1')
    setShowWelcome(false)
    setInfoPulse(true)
    pulseTimerRef.current = setTimeout(() => setInfoPulse(false), 30000)
  }

  const handleTourDismiss = () => {
    localStorage.setItem(LS_TOUR_DISMISSED, '1')
    setTourDismissed(true)
  }

  const handlePartSwitch = (partId) => setActivePart(partId)

  const showTourBar = !tourDismissed && !showWelcome

  // Derive guide message from current state
  const guideMessage = getGuideMessage({
    showWelcome,
    activePart,
    p1Section,
    p2Section,
    p3Section,
    p4Section,
    tourVisited,
    triggerClicked,
  })

  return (
    <div className={`min-h-screen bg-white${infoPulse ? ' info-pulse-active' : ''}`}>

      {showWelcome && <WelcomeModal onDismiss={handleWelcomeDismiss} />}

      {showTourBar && (
        <TourBar visited={tourVisited} onNavigate={handlePartSwitch} onDismiss={handleTourDismiss} />
      )}

      {/* Top nav */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">Q</span>
              </div>
              <span className="text-sm font-semibold text-dark">QuantapayAI</span>
              <span className="text-gray-300 text-xs mx-1">|</span>
              <span className="text-xs text-muted hidden sm:block">Integration Explorer</span>
            </div>
            <nav className="flex items-center gap-1">
              {PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => part.available && handlePartSwitch(part.id)}
                  className={`relative text-xs px-3 py-4 transition-colors font-medium flex items-center gap-1.5 ${
                    !part.available
                      ? 'text-gray-300 cursor-default'
                      : activePart === part.id
                      ? part.bonus ? 'text-accent' : 'text-primary'
                      : 'text-muted hover:text-dark'
                  }`}
                >
                  {part.bonus && (
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activePart === part.id ? 'bg-accent' : 'bg-accent/60'}`} />
                  )}
                  {part.available ? part.label : part.label + ' — Coming Soon'}
                  {activePart === part.id && part.available && (
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full ${part.bonus ? 'bg-accent' : 'bg-primary'}`} />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Part 1 ── */}
      {activePart === 'part1' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <span className="text-xs font-medium text-primary bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Case Study · Part 1 of 4
            </span>
            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">Designing the Integration</h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              How QuantapayAI connects to Workday HCM — covering trigger architecture, data normalization, trust-tier routing, and failure handling across a live payroll integration.
            </p>
          </div>
          <SubTabs sections={PART1_SECTIONS} activeId={p1Section} onSelect={setP1Section} />
          <SectionProgress sections={PART1_SECTIONS} activeId={p1Section} />
          <div className="flex gap-8">
            <SideNav sections={PART1_SECTIONS} activeId={p1Section} onSelect={setP1Section} />
            <div className="flex-1 min-w-0">
              {p1Section === 'dataflow' && (
                <>
                  <DataFlow onFirstTrigger={() => setTriggerClicked(true)} />
                  <NextNudge
                    text="Next: see how each change gets routed"
                    dest="Trust Gradient"
                    onClick={() => { setP1Section('trust'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
              {p1Section === 'trust' && (
                <>
                  <TrustGradient />
                  <NextNudge
                    text="Next: what happens when things go wrong"
                    dest="Failure Modes"
                    onClick={() => { setP1Section('failures'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
              {p1Section === 'failures' && (
                <>
                  <FailureModes />
                  <NextNudge
                    text="You've seen how the integration works. Next: where AI fits in"
                    dest="Part 2"
                    onClick={() => { handlePartSwitch('part2'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Part 2 ── */}
      {activePart === 'part2' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <span className="text-xs font-medium text-primary bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Case Study · Part 2 of 4
            </span>
            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">AI in the Integration Layer</h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              Where AI earns its place in this integration — and where it doesn't. AI reduces manual effort on low-stakes, high-volume tasks. It never touches the logic that determines compliance.
            </p>
          </div>
          <SubTabs sections={PART2_SECTIONS} activeId={p2Section} onSelect={setP2Section} />
          <SectionProgress sections={PART2_SECTIONS} activeId={p2Section} />
          <div className="flex gap-8">
            <SideNav sections={PART2_SECTIONS} activeId={p2Section} onSelect={setP2Section} />
            <div className="flex-1 min-w-0">
              {p2Section === 'fieldmapping' && (
                <>
                  <Part2FieldMapping />
                  <NextNudge
                    text="Next: see what happens when the data looks wrong"
                    dest="Anomaly Detection"
                    onClick={() => { setP2Section('anomaly'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
              {p2Section === 'anomaly' && (
                <>
                  <Part2AnomalyDetection />
                  <NextNudge
                    text="Next: where AI should stay out of it entirely"
                    dest="Where AI Should Not Be Used"
                    onClick={() => { setP2Section('notai'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
              {p2Section === 'notai' && (
                <>
                  <Part2TrustWarning />
                  <NextNudge
                    text="Next: how this PM used AI while building it"
                    dest="AI Tools as PM"
                    onClick={() => { setP2Section('aitoolspm'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
              {p2Section === 'aitoolspm' && (
                <>
                  <Part2AIToolsAsPM />
                  <NextNudge
                    text="Next: which integrations to build first"
                    dest="Part 3"
                    onClick={() => { handlePartSwitch('part3'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Part 3 ── */}
      {activePart === 'part3' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <span className="text-xs font-medium text-primary bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Case Study · Part 3 of 4
            </span>
            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">Prioritization</h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              Which integrations to build, which to partner, and in what order — based on revenue already at risk, not predicted impact.
            </p>
          </div>
          <SubTabs sections={PART3_SECTIONS} activeId={p3Section} onSelect={setP3Section} />
          <SectionProgress sections={PART3_SECTIONS} activeId={p3Section} />
          <div className="flex gap-8">
            <SideNav sections={PART3_SECTIONS} activeId={p3Section} onSelect={setP3Section} />
            <div className="flex-1 min-w-0">
              {p3Section === 'buildbuy' && (
                <>
                  <Part3BuildBuy />
                  <NextNudge
                    text="Next: see them ordered by priority"
                    dest="Sequencing"
                    onClick={() => { setP3Section('sequencing'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
              {p3Section === 'sequencing' && (
                <>
                  <Part3Sequencing />
                  <NextNudge
                    text="Next: what data could change this order"
                    dest="What Would Change This"
                    onClick={() => { setP3Section('datagaps'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
              {p3Section === 'datagaps' && (
                <>
                  <Part3DataGaps />
                  <NextNudge
                    text="Next: what the admin actually sees"
                    dest="Part 4"
                    onClick={() => { handlePartSwitch('part4'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Part 4 ── */}
      {activePart === 'part4' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <span className="text-xs font-medium text-primary bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Case Study · Part 4 of 4
            </span>
            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">Error UX & Onboarding Wireframes</h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              Two interactive product screens — how QuantapayAI surfaces a sync failure to an HR admin, and how field mapping is configured during onboarding. Both are clickable, not static.
            </p>
          </div>
          <SubTabs sections={PART4_SECTIONS} activeId={p4Section} onSelect={setP4Section} />
          <SectionProgress sections={PART4_SECTIONS} activeId={p4Section} />
          <div className="flex gap-8">
            <SideNav sections={PART4_SECTIONS} activeId={p4Section} onSelect={setP4Section} />
            <div className="flex-1 min-w-0">
              {p4Section === 'syncfailure' && (
                <>
                  <Part4SyncFailure />
                  <NextNudge
                    text="Next: how the admin sets up field mapping"
                    dest="Field Mapping Configuration"
                    onClick={() => { setP4Section('fieldmapping'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
              {p4Section === 'fieldmapping' && (
                <>
                  <Part4FieldMapping />
                  <NextNudge
                    text="You've covered all 4 parts. One more thing we built"
                    dest="Bonus"
                    onClick={() => { handlePartSwitch('bonus'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Bonus ── */}
      {activePart === 'bonus' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-accent bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Bonus — beyond required scope
              </span>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Integration Health Dashboard</h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              Internal operations view — which tenants need action before payroll locks, what's failing, and how fast HR teams are responding to approval requests.
            </p>
          </div>
          <BonusDashboard />
        </div>
      )}

      {/* ── Floating guide bubble ── */}
      <GuideBubble
        message={guideMessage}
        minimized={guideMinimized}
        onMinimize={() => setGuideMinimized(true)}
        onExpand={() => setGuideMinimized(false)}
      />
    </div>
  )
}
