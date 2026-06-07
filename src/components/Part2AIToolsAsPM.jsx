const TOOLS = [
  {
    tool: 'Claude',
    description: 'Spec drafting, edge case generation, stakeholder messaging. Turns complex integration logic into clear written decisions fast.',
  },
  {
    tool: 'Claude Code',
    description: 'Prototyping integration UX before engineering gets involved. Build a clickable flow, get feedback, then write the spec.',
  },
  {
    tool: 'Perplexity',
    description: 'Quick regulatory lookups across jurisdictions. Statutory pay rules, misclassification laws, compliance context — without digging through legal databases.',
  },
  {
    tool: 'NotebookLM',
    description: 'Loading Workday, BambooHR, and Rippling API docs into one queryable knowledge base. Ask questions across all three instead of reading 300 pages of documentation.',
  },
]

export default function Part2AIToolsAsPM() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">AI tools in my day-to-day</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOLS.map((t) => (
          <div key={t.tool} className="border border-gray-200 rounded-xl p-5 bg-white">
            <p className="text-sm font-semibold text-dark mb-2">{t.tool}</p>
            <p className="text-sm text-muted leading-relaxed">{t.description}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-6">
        <p className="text-sm font-semibold text-dark mb-1">What AI doesn't replace</p>
        <p className="text-xs text-muted leading-relaxed max-w-2xl">
          The judgment calls — which failure modes actually matter, where to draw the trust tier line, which deal is worth pursuing. AI compresses the research-to-artifact gap. The decisions stay with the PM.
        </p>
      </div>
    </div>
  )
}
