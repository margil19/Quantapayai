import { useState } from 'react'
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

const PARTS = [
  { id: 'part1', label: 'Part 1: Designing the Integration', available: true, sectionCount: 3 },
  { id: 'part2', label: 'Part 2: AI in the Integration Layer', available: true, sectionCount: 4 },
  { id: 'part3', label: 'Part 3: Prioritization', available: true, sectionCount: 3 },
  { id: 'part4', label: 'Part 4: Error UX', available: true, sectionCount: 2 },
  { id: 'bonus', label: 'Bonus: Health Dashboard', available: true, bonus: true, sectionCount: null },
]

const PART1_SECTIONS = [
  { id: 'dataflow', label: 'Data Flow' },
  { id: 'trust', label: 'Trust Gradient' },
  { id: 'failures', label: 'Failure Modes' },
]

const PART2_SECTIONS = [
  { id: 'fieldmapping', label: 'Field Mapping' },
  { id: 'anomaly', label: 'Anomaly Detection' },
  { id: 'notai', label: 'Where AI Should Not Be Used' },
  { id: 'aitoolspm', label: 'AI Tools as PM' },
]

const PART3_SECTIONS = [
  { id: 'buildbuy', label: 'Build / Buy / Partner' },
  { id: 'sequencing', label: 'Sequencing' },
  { id: 'datagaps', label: 'What Would Change This' },
]

const PART4_SECTIONS = [
  { id: 'syncfailure', label: 'Sync Failure State' },
  { id: 'fieldmapping', label: 'Field Mapping Configuration' },
]

// Flat ordered list of every screen in the app
const NAV_SEQUENCE = [
  { partId: 'part1', sectionId: 'dataflow',    label: 'Data Flow' },
  { partId: 'part1', sectionId: 'trust',        label: 'Trust Gradient' },
  { partId: 'part1', sectionId: 'failures',     label: 'Failure Modes' },
  { partId: 'part2', sectionId: 'fieldmapping', label: 'Field Mapping' },
  { partId: 'part2', sectionId: 'anomaly',      label: 'Anomaly Detection' },
  { partId: 'part2', sectionId: 'notai',        label: 'Where AI Should Not Be Used' },
  { partId: 'part2', sectionId: 'aitoolspm',    label: 'AI Tools as PM' },
  { partId: 'part3', sectionId: 'buildbuy',     label: 'Build / Buy / Partner' },
  { partId: 'part3', sectionId: 'sequencing',   label: 'Sequencing' },
  { partId: 'part3', sectionId: 'datagaps',     label: 'What Would Change This' },
  { partId: 'part4', sectionId: 'syncfailure',  label: 'Sync Failure State' },
  { partId: 'part4', sectionId: 'fieldmapping', label: 'Field Mapping Configuration' },
  { partId: 'bonus', sectionId: null,           label: 'Health Dashboard' },
]

const OVERVIEW_ROWS = [
  {
    partId: 'part1',
    label: 'Part 1: Designing the Integration',
    desc: 'Trigger architecture, data normalization, trust-tier routing, failure handling',
    sections: ['Data Flow', 'Trust Gradient', 'Failure Modes'],
    firstSection: 'dataflow',
  },
  {
    partId: 'part2',
    label: 'Part 2: AI in the Integration Layer',
    desc: 'Where AI earns its place — and where deterministic rules must stay in charge',
    sections: ['Field Mapping', 'Anomaly Detection', 'Where AI Should Not Be Used', 'AI Tools as PM'],
    firstSection: 'fieldmapping',
  },
  {
    partId: 'part3',
    label: 'Part 3: Prioritization',
    desc: 'Build vs buy vs partner across 5 HRIS systems, sequenced by revenue at risk',
    sections: ['Build / Buy / Partner', 'Sequencing', 'What Would Change This'],
    firstSection: 'buildbuy',
  },
  {
    partId: 'part4',
    label: 'Part 4: Error UX & Onboarding Wireframes',
    desc: 'Two interactive product screens — sync failure state and field mapping config',
    sections: ['Sync Failure State', 'Field Mapping Configuration'],
    firstSection: 'syncfailure',
  },
  {
    partId: 'bonus',
    label: 'Bonus: Integration Health Dashboard',
    desc: 'Internal ops view — tenant risk, approval velocity, failure breakdown',
    sections: ['Live Dashboard'],
    firstSection: null,
    bonus: true,
  },
]

function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-xl">◈</span>
      </div>
      <p className="text-sm font-semibold text-dark mb-1">{label}</p>
      <p className="text-xs text-muted">Coming soon — in progress.</p>
    </div>
  )
}

function NavFooter({ activePart, activeSection, onNavigate }) {
  const currentIdx = NAV_SEQUENCE.findIndex(
    (s) => s.partId === activePart && s.sectionId === activeSection
  )
  const prev = currentIdx > 0 ? NAV_SEQUENCE[currentIdx - 1] : null
  const next = currentIdx < NAV_SEQUENCE.length - 1 ? NAV_SEQUENCE[currentIdx + 1] : null
  const isLast = currentIdx === NAV_SEQUENCE.length - 1

  return (
    <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
      {prev ? (
        <button
          onClick={() => onNavigate(prev.partId, prev.sectionId)}
          className="flex items-center gap-2 text-xs text-muted hover:text-dark transition-colors group"
        >
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors">←</span>
          <span>{prev.label}</span>
        </button>
      ) : (
        <div />
      )}

      {isLast ? (
        <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
          <span>✓</span>
          <span>You've seen everything — all 4 parts + bonus</span>
        </div>
      ) : next ? (
        <button
          onClick={() => onNavigate(next.partId, next.sectionId)}
          className="flex items-center gap-2 text-xs font-medium text-primary hover:text-accent transition-colors group bg-purple-50 hover:bg-purple-100 border border-purple-100 hover:border-purple-200 px-3 py-2 rounded-lg"
        >
          <span>Next: {next.label}</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      ) : null}
    </div>
  )
}

function SectionProgress({ sections, activeId }) {
  const idx = sections.findIndex((s) => s.id === activeId)
  if (idx === -1) return null
  return (
    <p className="text-xs text-muted mb-6 -mt-5">
      Section {idx + 1} of {sections.length}
    </p>
  )
}

function OverviewCard({ onNavigate, onDismiss }) {
  return (
    <div className="mb-10 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-dark">QuantapayAI Integration Explorer</p>
          <p className="text-xs text-muted mt-0.5">4 parts · 13 interactive sections · 1 bonus dashboard — start anywhere or follow the sequence</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-gray-100"
        >
          Dismiss
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {OVERVIEW_ROWS.map((row) => (
          <div key={row.partId} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50/60 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <p className={`text-sm font-semibold ${row.bonus ? 'text-accent' : 'text-dark'}`}>{row.label}</p>
                {row.bonus && (
                  <span className="text-[10px] font-medium text-accent bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-full">bonus</span>
                )}
              </div>
              <p className="text-xs text-muted mb-2">{row.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {row.sections.map((s) => (
                  <span key={s} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => { onNavigate(row.partId, row.firstSection); onDismiss() }}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                row.bonus
                  ? 'text-accent bg-purple-50 hover:bg-purple-100 border border-purple-100'
                  : 'text-primary bg-purple-50 hover:bg-purple-100 border border-purple-100'
              }`}
            >
              Explore →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [activePart, setActivePart] = useState('part1')
  const [p1Section, setP1Section] = useState('dataflow')
  const [p2Section, setP2Section] = useState('fieldmapping')
  const [p3Section, setP3Section] = useState('buildbuy')
  const [p4Section, setP4Section] = useState('syncfailure')
  const [showOverview, setShowOverview] = useState(true)

  // Active section per part (for NavFooter)
  const activeSection =
    activePart === 'part1' ? p1Section
    : activePart === 'part2' ? p2Section
    : activePart === 'part3' ? p3Section
    : activePart === 'part4' ? p4Section
    : null

  const handlePartSwitch = (partId) => {
    setActivePart(partId)
  }

  // Unified navigate: sets both part and section
  const navigate = (partId, sectionId) => {
    setActivePart(partId)
    if (partId === 'part1' && sectionId) setP1Section(sectionId)
    if (partId === 'part2' && sectionId) setP2Section(sectionId)
    if (partId === 'part3' && sectionId) setP3Section(sectionId)
    if (partId === 'part4' && sectionId) setP4Section(sectionId)
  }

  return (
    <div className="min-h-screen bg-white">
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
                  {part.sectionCount && (
                    <span className="text-[10px] text-gray-300 font-normal">· {part.sectionCount}</span>
                  )}
                  {activePart === part.id && part.available && (
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full ${part.bonus ? 'bg-accent' : 'bg-primary'}`} />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Part 1 */}
      {activePart === 'part1' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {showOverview && (
            <OverviewCard onNavigate={navigate} onDismiss={() => setShowOverview(false)} />
          )}
          <div className="mb-8">
            <span className="text-xs font-medium text-primary bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Case Study · Part 1 of 4
            </span>
            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">Designing the Integration</h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              How QuantapayAI connects to Workday HCM — covering trigger architecture, data normalization, trust-tier routing, and failure handling across a live payroll integration.
            </p>
          </div>
          <div className="flex items-center gap-1 border-b border-gray-100 mb-3">
            {PART1_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setP1Section(s.id)}
                className={`relative text-sm px-4 py-3 font-medium transition-colors ${
                  p1Section === s.id ? 'text-dark' : 'text-muted hover:text-dark'
                }`}
              >
                {s.label}
                {p1Section === s.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <SectionProgress sections={PART1_SECTIONS} activeId={p1Section} />
          <div>
            {p1Section === 'dataflow' && <DataFlow />}
            {p1Section === 'trust' && <TrustGradient />}
            {p1Section === 'failures' && <FailureModes />}
          </div>
          <NavFooter activePart={activePart} activeSection={p1Section} onNavigate={navigate} />
        </div>
      )}

      {/* Part 2 */}
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
          <div className="flex items-center gap-1 border-b border-gray-100 mb-3">
            {PART2_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setP2Section(s.id)}
                className={`relative text-sm px-4 py-3 font-medium transition-colors ${
                  p2Section === s.id ? 'text-dark' : 'text-muted hover:text-dark'
                }`}
              >
                {s.label}
                {p2Section === s.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <SectionProgress sections={PART2_SECTIONS} activeId={p2Section} />
          <div>
            {p2Section === 'fieldmapping' && <Part2FieldMapping />}
            {p2Section === 'anomaly' && <Part2AnomalyDetection />}
            {p2Section === 'notai' && <Part2TrustWarning />}
            {p2Section === 'aitoolspm' && <Part2AIToolsAsPM />}
          </div>
          <NavFooter activePart={activePart} activeSection={p2Section} onNavigate={navigate} />
        </div>
      )}

      {/* Part 3 */}
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
          <div className="flex items-center gap-1 border-b border-gray-100 mb-3">
            {PART3_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setP3Section(s.id)}
                className={`relative text-sm px-4 py-3 font-medium transition-colors ${
                  p3Section === s.id ? 'text-dark' : 'text-muted hover:text-dark'
                }`}
              >
                {s.label}
                {p3Section === s.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <SectionProgress sections={PART3_SECTIONS} activeId={p3Section} />
          <div>
            {p3Section === 'buildbuy' && <Part3BuildBuy />}
            {p3Section === 'sequencing' && <Part3Sequencing />}
            {p3Section === 'datagaps' && <Part3DataGaps />}
          </div>
          <NavFooter activePart={activePart} activeSection={p3Section} onNavigate={navigate} />
        </div>
      )}

      {/* Part 4 */}
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
          <div className="flex items-center gap-1 border-b border-gray-100 mb-3">
            {PART4_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setP4Section(s.id)}
                className={`relative text-sm px-4 py-3 font-medium transition-colors ${
                  p4Section === s.id ? 'text-dark' : 'text-muted hover:text-dark'
                }`}
              >
                {s.label}
                {p4Section === s.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <SectionProgress sections={PART4_SECTIONS} activeId={p4Section} />
          <div>
            {p4Section === 'syncfailure' && <Part4SyncFailure />}
            {p4Section === 'fieldmapping' && <Part4FieldMapping />}
          </div>
          <NavFooter activePart={activePart} activeSection={p4Section} onNavigate={navigate} />
        </div>
      )}

      {/* Bonus */}
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
          <NavFooter activePart={activePart} activeSection={null} onNavigate={navigate} />
        </div>
      )}
    </div>
  )
}
