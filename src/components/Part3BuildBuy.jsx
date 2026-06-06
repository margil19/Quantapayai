import { useState } from 'react'

const DECISIONS = {
  BUILD: { label: 'Build', bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-500', light: 'bg-emerald-50 border-emerald-200' },
  PARTNER: { label: 'Partner', bg: 'bg-teal-500', text: 'text-white', border: 'border-teal-500', light: 'bg-teal-50 border-teal-200' },
  PARTNER_CAUTION: { label: 'Partner — with caution', bg: 'bg-amber-500 text-white', text: 'text-white', border: 'border-amber-500', light: 'bg-amber-50 border-amber-200' },
  BUY: { label: 'Buy', bg: 'bg-amber-400 text-dark', text: 'text-dark', border: 'border-amber-400', light: 'bg-amber-50 border-amber-200' },
}

const ROWS = [
  {
    hris: 'Workday',
    signal: '$1.4M ACV · 3 deals blocked · 41% of enterprise segment',
    decision: 'BUILD',
    apiQuality: 'RAAS polling API — versioned, no native webhooks',
    competitiveRisk: 'None — pure HRIS, no payroll overlap',
    rationale: 'The highest revenue at risk in the backlog, with zero viable off-the-shelf alternatives. Workday\'s versioned API, complex field mapping surface, and compliance requirements mean no third-party connector handles this reliably. QuantapayAI needs full ownership of the mapping layer, trust tier routing, and failure handling. This is not a connector — it is the core integration.',
  },
  {
    hris: 'BambooHR',
    signal: '14 CS tickets · 28% of mid-market segment',
    decision: 'PARTNER',
    apiQuality: 'Clean REST API · webhooks supported · good documentation',
    competitiveRisk: 'Low — HRIS only, no payroll overlap',
    rationale: '14 CS tickets is the loudest demand signal after Workday. But BambooHR\'s clean API means a middleware partner (Merge.dev or Finch) can cover 80% of the use case in weeks, not quarters. Ship a working connector via partner immediately to silence the CS noise, then evaluate native build after 6 months of usage data.',
  },
  {
    hris: 'HiBob',
    signal: '2 strategic accounts · 11% of current base',
    decision: 'PARTNER',
    apiQuality: 'Modern REST API · webhooks · strong developer experience',
    competitiveRisk: 'Low — HRIS only',
    rationale: 'Two customers doesn\'t justify native build investment at this stage. But "strategic" matters — these are likely reference accounts or expansion bets. A partner connector via Merge/Finch ships in 3 weeks and protects these accounts without burning eng cycles. Revisit if HiBob penetration grows to 10+ customers.',
  },
  {
    hris: 'Rippling',
    signal: '3 prospects · unproven segment',
    decision: 'PARTNER_CAUTION',
    apiQuality: 'Excellent API · real-time webhooks · modern stack',
    competitiveRisk: 'HIGH — Rippling competes directly in payroll',
    rationale: "Rippling's API quality makes this technically easy. The strategic complexity comes from Rippling competing directly in payroll — they have a financial incentive to make it harder for customers to route payroll elsewhere. As a vertically integrated platform, they control the data source. A partner connector via Merge limits QuantapayAI's exposure — if Rippling restricts API access for any reason, Merge absorbs that problem, not QuantapayAI's engineering team. Do not invest in a native Rippling build until the segment is proven and the risk profile is clearer.",
  },
  {
    hris: 'Custom Proprietary HRIS',
    signal: '$900K · single deal',
    decision: 'BUY',
    apiQuality: 'Unknown — proprietary, no standard API',
    competitiveRisk: 'None',
    rationale: "Before writing a single line of code, check whether an off-the-shelf connector already exists for this system. If one does, buy it — a $900K deal doesn't justify building and maintaining a custom integration from scratch for one customer. If no connector exists, treat this as a scoped commercial engagement with a clear price and end date, not an open-ended product feature.",
  },
]

export default function Part3BuildBuy() {
  const [open, setOpen] = useState(null)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">Build / Buy / Partner</h2>
        <p className="text-sm text-muted mb-3">
          Five HRIS integrations evaluated across revenue risk, API quality, and competitive exposure. Click any row to see the full reasoning behind the decision.
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            Standard prioritization asks "what is most impactful?" Integration prioritization asks "what is most costly to delay?" Those are different questions with different answers. ACV alone doesn't decide sequence — revenue already at risk does.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {ROWS.map((row) => {
          const d = DECISIONS[row.decision]
          const isOpen = open === row.hris
          return (
            <div
              key={row.hris}
              className={`border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${isOpen ? `${d.light} border` : 'border-gray-200 bg-white hover:border-gray-300'}`}
              onClick={() => setOpen(isOpen ? null : row.hris)}
            >
              <div className="px-5 py-4 flex items-center gap-4">
                {/* Decision badge — first thing the eye lands on */}
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${d.bg} ${d.text} shrink-0 min-w-[140px] text-center`}>
                  {d.label}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-dark">{row.hris}</span>
                  <p className="text-xs text-muted mt-0.5">{row.signal}</p>
                </div>
                <span className={`text-xs text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 space-y-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                      <p className="text-xs font-semibold text-gray-500 mb-1">API Quality</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{row.apiQuality}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Competitive Risk</p>
                      <p className={`text-xs leading-relaxed font-medium ${row.competitiveRisk.startsWith('HIGH') ? 'text-red-600' : 'text-gray-700'}`}>{row.competitiveRisk}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Rationale</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{row.rationale}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
