const TOOLS = [
  {
    tool: 'Claude',
    task: 'Failure mode analysis, trust policy design, spec pressure-testing',
    example: 'When defining which sync writes should require HR approval vs. auto-apply: described the data types, payroll consequences, and reversibility constraints, then asked Claude to flag every scenario where the wrong tier assignment could create a compliance issue. It surfaced the retroactive termination edge case — someone terminated two months prior appearing in a new sync batch — which I hadn\'t fully thought through. That became a first-class failure mode in the spec.',
    why: 'Integration specs are full of conditional logic that\'s easy to underspecify. Claude is good at holding the whole constraint set and finding where the logic breaks.',
    color: 'bg-purple-50 border-purple-100',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    tool: 'Cursor / Claude Code',
    task: 'Building interactive prototypes for eng and HR stakeholder reviews',
    example: 'Before the field mapping spec was finalised, I built a clickable version of the mapping configuration screen. HR admins on the customer side could try selecting fields and see the inline confidence scores — rather than reading a Figma mock and imagining the experience. The feedback shifted from "this looks fine" to specific questions about what happens when no match is found, which changed the design.',
    why: 'Integration UX is hard to evaluate in static mocks. Stakeholders need to interact with the flow to catch what\'s missing.',
    color: 'bg-blue-50 border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    tool: 'Perplexity',
    task: 'Fast regulatory lookup across payroll jurisdictions',
    example: 'Before writing the termination handling requirements: looked up final pay statutory deadlines across the US (California 72-hour rule), UK (same-day for dismissal), Germany (end-of-month norm), and Australia (7-day requirement). This took minutes rather than hours of legal research — enough to write the spec correctly and flag which jurisdictions needed legal sign-off before launch.',
    why: 'Payroll compliance varies significantly by country. I need PM-level accuracy fast — legal validates before anything ships, but I can\'t write requirements blind.',
    color: 'bg-amber-50 border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    tool: 'NotebookLM',
    task: 'Making sense of HRIS API documentation across multiple vendors',
    example: 'Loaded the Workday RAAS API reference, BambooHR REST docs, and Rippling webhook documentation before writing the integration architecture requirements. Instead of reading each linearly, asked questions across all three at once — "which of these support real-time employee status change events, and what does the payload look like?" The answer shaped the decision to use polling for Workday and webhooks for the others.',
    why: 'Integration PM work involves large volumes of vendor documentation. NotebookLM lets me reason across sources rather than hold them in my head.',
    color: 'bg-emerald-50 border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
  },
]

export default function Part2AIToolsAsPM() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">How I Use AI Tools as PM</h2>
        <p className="text-sm text-muted mb-3">
          Integration PM work has a specific shape: it's heavy on vendor documentation, conditional logic, compliance constraints, and stakeholder alignment across engineering, HR, and legal. AI tools are part of my daily workflow — not for generating ideas, but for compressing the time between a question and a decision-ready answer.
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            The pattern across all four tools: AI handles the research and synthesis layer so I can spend time on the judgment layer — which edge cases actually matter, where the trust boundary should sit, what the HR admin will get wrong on first use.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOLS.map((t) => (
          <div key={t.tool} className={`border rounded-xl p-5 ${t.color}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-sm font-semibold text-dark">{t.tool}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-right max-w-[55%] leading-snug ${t.badge}`}>
                {t.task.split(',')[0]}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              <span className="font-medium text-gray-700">Task: </span>{t.task}
            </p>
            <div className="bg-white/70 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs font-medium text-gray-600 mb-1">Concrete example</p>
              <p className="text-xs text-gray-600 leading-relaxed">{t.example}</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-medium text-gray-700">Why this tool: </span>{t.why}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50">
        <p className="text-sm font-semibold text-dark mb-2">What AI doesn't replace</p>
        <div className="space-y-2">
          {[
            'Which failure modes matter most — that requires knowing what an enterprise HR admin fears, not just what can technically go wrong',
            'Where to draw the trust tier boundary — AI can list scenarios, but the call on what\'s reversible vs. catastrophic is a product decision',
            'How to sequence integration builds — revenue risk, engineering cost, and competitive exposure don\'t resolve themselves',
            'When a sync should pause vs. proceed with a warning — that\'s a product judgment call, not a pattern to be inferred',
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted">
              <span className="text-gray-300 shrink-0 mt-0.5">—</span>
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
