import { useState } from 'react'
import DataFlow from './components/DataFlow'
import TrustGradient from './components/TrustGradient'
import FailureModes from './components/FailureModes'

const PARTS = [
  { id: 'part1', label: 'Part 1: Designing the Integration', available: true },
  { id: 'part2', label: 'Part 2', available: false },
  { id: 'part3', label: 'Part 3', available: false },
  { id: 'part4', label: 'Part 4', available: false },
]

const SUBSECTIONS = [
  { id: 'dataflow', label: 'Data Flow' },
  { id: 'trust', label: 'Trust Gradient' },
  { id: 'failures', label: 'Failure Modes' },
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
  const [activeSection, setActiveSection] = useState('dataflow')

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
                  onClick={() => part.available && setActivePart(part.id)}
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

      {/* Content */}
      {activePart === 'part1' ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Part header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-primary bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                Case Study · Part 1 of 4
              </span>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Designing the Integration</h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              How QuantapayAI connects to Workday HCM — covering trigger architecture, data normalization, trust-tier routing, and failure handling across a live payroll integration.
            </p>
          </div>

          {/* Sub-section tabs */}
          <div className="flex items-center gap-1 border-b border-gray-100 mb-8">
            {SUBSECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`relative text-sm px-4 py-3 font-medium transition-colors ${
                  activeSection === s.id ? 'text-dark' : 'text-muted hover:text-dark'
                }`}
              >
                {s.label}
                {activeSection === s.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Section content */}
          <div className="transition-all duration-200">
            {activeSection === 'dataflow' && <DataFlow />}
            {activeSection === 'trust' && <TrustGradient />}
            {activeSection === 'failures' && <FailureModes />}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ComingSoon label={PARTS.find(p => p.id === activePart)?.label} />
        </div>
      )}
    </div>
  )
}
