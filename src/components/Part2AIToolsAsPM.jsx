const TOOLS = [
  {
    tool: 'Claude',
    task: 'Spec drafting, edge case generation, structured reasoning',
    example: 'When scoping a new onboarding flow: gave Claude the constraints (two user types, three entry points, one shared form), asked it to list every edge case an engineer would flag in review. Caught four I hadn\'t thought of before the doc went out.',
    why: 'Best at structured reasoning over a defined problem space. Useful when the problem is well-scoped and the output needs to be decision-ready, not just a list.',
    color: 'bg-purple-50 border-purple-100',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    tool: 'Cursor / Claude Code',
    task: 'Building functional prototypes for stakeholder reviews',
    example: 'For a dashboard redesign review: built a clickable mock in an afternoon so stakeholders could interact with the layout instead of reading a Figma description. Feedback was specific and actionable — about the actual experience, not assumptions about it.',
    why: 'PMs who can prototype get better feedback earlier. Stakeholders react to what they can use, not what they imagine.',
    color: 'bg-blue-50 border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    tool: 'Perplexity',
    task: 'Fast regulatory and market research',
    example: 'Before a discovery call with a customer in France: looked up French GDPR enforcement patterns, data residency requirements, and recent regulator guidance on employee data. Went into the call informed rather than asking questions I should have already known.',
    why: 'Faster than searching legal databases or industry sites. Good enough for PM-level situational awareness — legal team validates before anything ships.',
    color: 'bg-amber-50 border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    tool: 'NotebookLM',
    task: 'Turning dense documentation into a queryable knowledge base',
    example: 'Loaded three vendor API docs and two compliance frameworks before a partner evaluation. Instead of reading linearly, asked cross-cutting questions — "where do these systems diverge on webhook reliability?" — and got grounded answers with citations.',
    why: 'Product work is doc-heavy. NotebookLM makes it possible to reason across sources rather than remembering them.',
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
          AI tools are part of my daily workflow — not for generating ideas, but for compressing the time between a problem and a decision-ready artifact. Each tool earns its place by doing one thing faster than the alternative.
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            The pattern across all four tools: AI compresses the research-to-artifact gap. It does not replace the judgment calls — which failure modes matter, which workflows need human gates, which trade-offs are worth making. That stays with the PM.
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
            'Which failure modes are worth including — that requires knowing what an enterprise HR admin actually fears',
            'Whether a trust tier is set correctly — that requires understanding statutory payroll law across jurisdictions',
            'How to frame a trade-off for an engineering team — that requires knowing what they\'ll push back on',
            'When to ship vs. when to spec more — that\'s judgment, not synthesis',
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
