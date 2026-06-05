const ITEMS = [
  {
    pos: 1,
    name: 'Workday',
    decision: 'Build',
    decisionColor: 'bg-emerald-500 text-white',
    timeline: 'Now — Q1 priority',
    why: '$1.4M in deals are actively blocked right now. Every week of delay has a direct, measurable cost.',
    revenueAtRisk: '$1.4M',
    revenueLabel: 'revenue blocked',
    revenueColor: 'bg-red-100 text-red-700 border-red-200',
    urgency: 'critical',
  },
  {
    pos: 2,
    name: 'BambooHR',
    decision: 'Partner',
    decisionColor: 'bg-teal-500 text-white',
    timeline: 'Q1 — run parallel to Workday',
    why: '14 CS tickets is the loudest existing-customer signal. A partner connector ships in weeks, not quarters — run this alongside Workday at low eng cost.',
    revenueAtRisk: null,
    revenueLabel: 'CS noise + churn risk',
    revenueColor: 'bg-amber-100 text-amber-700 border-amber-200',
    urgency: 'high',
  },
  {
    pos: 3,
    name: 'HiBob',
    decision: 'Partner',
    decisionColor: 'bg-teal-500 text-white',
    timeline: 'Q2',
    why: 'Two strategic accounts. A partner connector takes 3 weeks to stand up. Don\'t lose reference accounts for something this fast to ship.',
    revenueAtRisk: null,
    revenueLabel: 'strategic account retention',
    revenueColor: 'bg-blue-100 text-blue-700 border-blue-200',
    urgency: 'medium',
  },
  {
    pos: 4,
    name: 'Rippling',
    decision: 'Partner — cautious',
    decisionColor: 'bg-amber-500 text-white',
    timeline: 'Q2–Q3 · after segment validation',
    why: '3 prospects, unproven segment. Don\'t build until at least 2 convert. Ship via partner only — Rippling competes in payroll and can restrict the integration.',
    revenueAtRisk: null,
    revenueLabel: '3 prospects, unproven',
    revenueColor: 'bg-gray-100 text-gray-500 border-gray-200',
    urgency: 'low',
  },
  {
    pos: 5,
    name: 'Custom Proprietary HRIS',
    decision: 'Buy',
    decisionColor: 'bg-amber-400 text-dark',
    timeline: 'Q2 · commercial conversation first',
    why: "Check if a connector already exists before anything else. If yes, buy it. If not, scope and price it as a one-time engagement — not a product feature.",
    revenueAtRisk: '$900K',
    revenueLabel: 'deal structure matters',
    revenueColor: 'bg-gray-100 text-gray-500 border-gray-200',
    urgency: 'low',
  },
]

function urgencyStyles(urgency) {
  if (urgency === 'critical') return { card: 'border-primary/30 bg-white shadow-md shadow-primary/5', pos: 'bg-primary text-white w-10 h-10 text-base', name: 'text-xl font-bold', opacity: '' }
  if (urgency === 'high') return { card: 'border-gray-200 bg-white', pos: 'bg-gray-800 text-white w-8 h-8 text-sm', name: 'text-base font-semibold', opacity: '' }
  if (urgency === 'medium') return { card: 'border-gray-200 bg-white', pos: 'bg-gray-600 text-white w-8 h-8 text-sm', name: 'text-base font-semibold', opacity: '' }
  return { card: 'border-gray-100 bg-gray-50/60', pos: 'bg-gray-300 text-gray-600 w-7 h-7 text-xs', name: 'text-sm font-medium text-gray-500', opacity: 'opacity-70' }
}

export default function Part3Sequencing() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">Sequencing</h2>
        <p className="text-sm text-muted mb-3">
          Priority order based on revenue already at risk, not predicted impact. Position 1 is the only integration where delay has an immediate, measurable cost today.
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            The sequence is a starting position, not a commitment. It holds until new data arrives — deal close timelines, churn signals, partner coverage gaps. See the "What Would Change This" section for the exact data points that could shift it.
          </p>
        </div>
      </div>

      <div className="space-y-3 max-w-3xl">
        {ITEMS.map((item, i) => {
          const s = urgencyStyles(item.urgency)
          return (
            <div key={item.pos} className={`border rounded-2xl px-5 py-4 transition-all ${s.card}`}>
              <div className={s.opacity}>
                <div className="flex items-start gap-4">
                  {/* Position number */}
                  <div className={`rounded-full flex items-center justify-center font-bold shrink-0 ${s.pos}`}>
                    {item.pos}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span className={s.name}>{item.name}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${item.decisionColor}`}>
                        {item.decision}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${item.revenueColor}`}>
                        {item.revenueAtRisk ? `${item.revenueAtRisk} — ` : ''}{item.revenueLabel}
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-2">{item.timeline}</p>
                    <p className={`text-xs leading-relaxed ${item.urgency === 'critical' ? 'text-gray-700' : 'text-gray-500'}`}>{item.why}</p>
                  </div>
                </div>
              </div>

              {/* Connector line between items */}
              {i < ITEMS.length - 1 && (
                <div className="flex justify-start pl-4 mt-3">
                  <div className={`w-px h-3 ${item.urgency === 'critical' || item.urgency === 'high' ? 'bg-gray-300' : 'bg-gray-200'}`} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
