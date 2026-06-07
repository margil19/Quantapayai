const SCENARIOS = [
  {
    scenario: 'Termination - employee in Germany',
    aiDecision: 'AI assigns Direct Write (90% confidence it\'s routine)',
    consequence: 'Termination applied immediately without HR review. Final pay calculated without checking German statutory rules. Statutory fine issued. The company owes back wages and faces regulatory scrutiny.',
    jurisdiction: 'Germany',
  },
  {
    scenario: 'Salary update - $85,000 → $95,000 promotion',
    aiDecision: 'AI assigns Suggested Action (uncertain - only 60% confident)',
    consequence: 'The change sits unactioned in a suggestions panel. No one approves it. The employee is paid at the old rate for two cycles. A payroll correction is required. The employee loses trust.',
    jurisdiction: 'United States',
  },
]

export default function Part2TrustWarning() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          <span className="text-red-500 text-sm">⚠</span>
          <span className="text-xs font-semibold text-red-700">This is what breaks when AI is used in the wrong place</span>
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">Trust tier assignment is deterministic rules, not AI.</h2>
        <p className="text-sm text-muted max-w-2xl leading-relaxed mb-3">
          Deciding whether a change writes directly, queues for approval, or gets surfaced as a suggestion is a policy decision - not a prediction. The rules are known, stable, and don't improve with more data. Adding AI here introduces errors on questions that already have right answers.
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            Does this change affect current-cycle payroll? Is it irreversible without legal consequence? These are yes/no questions. A rule answers them perfectly, every time. An AI model answers them probabilistically - which means sometimes wrong on the most critical decisions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {SCENARIOS.map((s, i) => (
          <div key={i} className="border border-red-200 rounded-xl overflow-hidden">
            <div className="bg-red-50 px-4 py-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-1">Scenario {i + 1}</p>
                <p className="text-sm font-semibold text-dark">{s.scenario}</p>
              </div>
              <span className="text-xs border border-red-200 text-red-600 px-2 py-0.5 rounded-full shrink-0">{s.jurisdiction}</span>
            </div>
            <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-3">
                <p className="text-xs font-semibold text-amber-800 mb-1">Wrong AI decision</p>
                <p className="text-xs text-amber-700 leading-relaxed">{s.aiDecision}</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-3">
                <p className="text-xs font-semibold text-red-800 mb-1">Consequence</p>
                <p className="text-xs text-red-700 leading-relaxed">{s.consequence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50">
        <p className="text-sm font-semibold text-dark mb-1">The rule QuantapayAI actually uses</p>
        <div className="space-y-2 mt-3">
          {[
            ['Does this change affect current-cycle payroll?', 'Yes → Queue for Approval'],
            ['Is this change irreversible without a statutory consequence?', 'Yes → Queue for Approval'],
            ['Does QuantapayAI have enough context to act confidently?', 'No → Surface as Suggestion'],
            ['None of the above', '→ Direct Write'],
          ].map(([q, a]) => (
            <div key={q} className="flex items-start gap-3 text-xs">
              <span className="text-muted shrink-0 w-5 pt-0.5">→</span>
              <span className="text-gray-600 flex-1">{q}</span>
              <span className="font-semibold text-dark shrink-0 text-right w-44">{a}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted italic mt-4 pt-3 border-t border-gray-200">
          These are illustrative examples of the rule logic - not an exhaustive list. The full rule set expands as new action types, jurisdictions, and edge cases are added to the integration.
        </p>
      </div>
    </div>
  )
}
