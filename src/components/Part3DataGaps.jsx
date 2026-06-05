const GAPS = [
  {
    dataPoint: 'Workday deal close timelines',
    why: 'Are these 3 blocked deals closing in Q1, or in 12 months? The urgency of the Workday build changes dramatically depending on the answer.',
    shift: 'If deals are 6+ months out, BambooHR (14 CS tickets = existing revenue at risk) could move to #1 ahead of Workday.',
    affects: 'Position 1 vs 2',
  },
  {
    dataPoint: 'BambooHR churn intent signals',
    why: '14 CS tickets tells us customers are frustrated. It doesn\'t tell us if any have expressed intent to leave.',
    shift: 'Active churn risk on BambooHR could move it to #1 if Workday deals aren\'t imminent. A customer leaving is worse than a deal delayed.',
    affects: 'Position 2 vs 1',
  },
  {
    dataPoint: 'Merge.dev / Finch field coverage',
    why: 'Partner connectors don\'t support every field. If employment type changes or compensation syncs are missing, the partner path breaks.',
    shift: 'Gaps in partner coverage could force a native BambooHR or HiBob build sooner and more urgently than currently planned.',
    affects: 'BambooHR & HiBob decisions',
  },
  {
    dataPoint: 'Rippling commercial relationship',
    why: 'Is there any existing partnership discussion with Rippling, or is this purely competitive? A formal technology agreement changes the risk profile entirely.',
    shift: 'A signed API stability guarantee with Rippling would unlock a native build much earlier. Without it, partner-only is the right call.',
    affects: 'Rippling decision',
  },
  {
    dataPoint: 'Custom HRIS deal contingency',
    why: 'Is the $900K deal already signed and waiting on the integration, or is the integration a condition of signing?',
    shift: 'If integration is a deal condition, the commercial conversation must happen in Q1 — not Q2. The answer also determines whether buying an off-the-shelf connector is even an option.',
    affects: 'Position 5 urgency',
  },
  {
    dataPoint: 'Engineering capacity & Workday build estimate',
    why: 'A production-grade Workday integration is complex. The actual eng estimate affects how much parallel work is realistic.',
    shift: 'If the Workday estimate is 20+ weeks, the case for shipping BambooHR and HiBob via partner in parallel — not sequentially — gets much stronger.',
    affects: 'Overall sequence pacing',
  },
]

export default function Part3DataGaps() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">What Data Would Change This</h2>
        <p className="text-sm text-muted mb-3">
          The sequence above is defensible with current information. These are the six gaps that could shift it — and how. The first two weeks before any eng work starts should be spent pulling these answers.
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            A prioritization framework is only as good as the data it runs on. Naming the gaps upfront is a PM discipline — it separates a defensible starting position from false certainty.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GAPS.map((gap, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 bg-white hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-start gap-2">
                <span className="text-2xl font-light text-gray-200 leading-none mt-[-2px] shrink-0">?</span>
                <span className="text-sm font-semibold text-dark leading-tight">{gap.dataPoint}</span>
              </div>
              <span className="text-xs border border-primary/20 text-primary bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                {gap.affects}
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Why it matters</p>
                <p className="text-xs text-gray-600 leading-relaxed">{gap.why}</p>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs font-medium text-gray-500 mb-1">How it could shift the sequence</p>
                <p className="text-xs text-gray-600 leading-relaxed">{gap.shift}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
