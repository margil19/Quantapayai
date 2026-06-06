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
  { id: 'part1', label: 'Part 1: Designing the Integration', available: true },
  { id: 'part2', label: 'Part 2: AI in the Integration Layer', available: true },
  { id: 'part3', label: 'Part 3: Prioritization', available: true },
  { id: 'part4', label: 'Part 4: Error UX', available: true },
  { id: 'bonus', label: 'Bonus: Health Dashboard', available: true, bonus: true },
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

function SectionProgress({ sections, activeId }) {
  const idx = sections.findIndex((s) => s.id === activeId)
  if (idx === -1) return null
  return (
    <p className="text-xs text-muted mt-2 mb-8">
      Section {idx + 1} of {sections.length}
    </p>
  )
}

export default function App() {
  const [activePart, setActivePart] = useState('part1')
  const [p1Section, setP1Section] = useState('dataflow')
  const [p2Section, setP2Section] = useState('fieldmapping')
  const [p3Section, setP3Section] = useState('buildbuy')
  const [p4Section, setP4Section] = useState('syncfailure')

  const handlePartSwitch = (partId) => {
    setActivePart(partId)
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
          <div className="mb-8">
            <span className="text-xs font-medium text-primary bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Case Study · Part 1 of 4
            </span>
            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">Designing the Integration</h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              How QuantapayAI connects to Workday HCM — covering trigger architecture, data normalization, trust-tier routing, and failure handling across a live payroll integration.
            </p>
          </div>
          <div className="flex items-center gap-1 border-b border-gray-100">
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
          <div className="flex items-center gap-1 border-b border-gray-100">
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
          <div className="flex items-center gap-1 border-b border-gray-100">
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
          <div className="flex items-center gap-1 border-b border-gray-100">
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
        </div>
      )}
    </div>
  )
}
