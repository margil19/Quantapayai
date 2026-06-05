import { useState } from 'react'
import DataFlow from './components/DataFlow'
import TrustGradient from './components/TrustGradient'
import FailureModes from './components/FailureModes'
import Part2FieldMapping from './components/Part2FieldMapping'
import Part2AnomalyDetection from './components/Part2AnomalyDetection'
import Part2TrustWarning from './components/Part2TrustWarning'
import Part2AIToolsAsPM from './components/Part2AIToolsAsPM'

const PARTS = [
  { id: 'part1', label: 'Part 1: Designing the Integration', available: true },
  { id: 'part2', label: 'Part 2: AI in the Integration Layer', available: true },
  { id: 'part3', label: 'Part 3', available: false },
  { id: 'part4', label: 'Part 4', available: false },
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

export default function App() {
  const [activePart, setActivePart] = useState('part1')
  const [p1Section, setP1Section] = useState('dataflow')
  const [p2Section, setP2Section] = useState('fieldmapping')

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
                  className={`relative text-xs px-3 py-4 transition-colors font-medium ${
                    !part.available
                      ? 'text-gray-300 cursor-default'
                      : activePart === part.id
                      ? 'text-primary'
                      : 'text-muted hover:text-dark'
                  }`}
                >
                  {part.available ? part.label : part.label + ' — Coming Soon'}
                  {activePart === part.id && part.available && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
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
          <div className="flex items-center gap-1 border-b border-gray-100 mb-8">
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
          <div className="flex items-center gap-1 border-b border-gray-100 mb-8">
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
          <div>
            {p2Section === 'fieldmapping' && <Part2FieldMapping />}
            {p2Section === 'anomaly' && <Part2AnomalyDetection />}
            {p2Section === 'notai' && <Part2TrustWarning />}
            {p2Section === 'aitoolspm' && <Part2AIToolsAsPM />}
          </div>
        </div>
      )}

      {/* Parts 3 & 4 */}
      {(activePart === 'part3' || activePart === 'part4') && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ComingSoon label={PARTS.find(p => p.id === activePart)?.label} />
        </div>
      )}
    </div>
  )
}
