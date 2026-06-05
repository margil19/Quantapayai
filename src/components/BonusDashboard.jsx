import { useState } from 'react'

// ─── KPI DATA ─────────────────────────────────────────────────────────────────
const KPIS = [
  { label: 'Tenants Healthy',   value: 84,  color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', note: null },
  { label: 'Tenants At Risk',   value: 11,  color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',     dot: 'bg-amber-500',   note: null },
  { label: 'Tenants Critical',  value: 3,   color: 'text-red-600',     bg: 'bg-red-50 border-red-200',         dot: 'bg-red-500',     note: null },
  { label: 'Approvals Pending', value: 37,  color: 'text-slate-700',   bg: 'bg-slate-50 border-slate-200',     dot: 'bg-primary',     note: '9 near lock' },
]

// ─── CRITICAL TENANTS ─────────────────────────────────────────────────────────
const CRITICAL = [
  {
    id: 'meridian',
    tenant: 'Meridian Global',
    status: 'CRITICAL',
    issue: 'Termination stuck — awaiting HR approval for 18 hrs',
    employee: 'D. Okafor · VP Engineering',
    lock: 'Tomorrow, 6 PM',
    lockUrgency: 'amber',
    panel: {
      title: 'Termination approval stalled — Meridian Global',
      what: "David Okafor's voluntary termination was detected by QuantapayAI 18 hours ago. It was routed to the HR approval queue immediately. No action has been taken. Payroll for Meridian's current cycle locks tomorrow at 6 PM.",
      risk: 'If not approved before lock, the final payroll run will exclude David. Meridian is a UK-registered entity — delayed final pay carries a statutory penalty under the Employment Rights Act 1996.',
      action: 'Send escalation to Meridian HR Manager and re-notify the approver with the deadline.',
    },
  },
  {
    id: 'vantage',
    tenant: 'Vantage Health',
    status: 'CRITICAL',
    issue: 'Sync failed 3 consecutive times — Workday connection error',
    employee: '7 employees affected',
    lock: 'Tonight, 11 PM',
    lockUrgency: 'red',
    panel: {
      title: 'Workday sync failure — Vantage Health',
      what: "Vantage Health's Workday sync has failed on 3 consecutive attempts over the last 90 minutes. The error is a 403 Forbidden on the RAAS endpoint — Vantage's Workday admin likely rotated the API credentials without notifying QuantapayAI.",
      risk: '7 employees have pending changes (2 new hires, 3 salary updates, 2 role changes) that are unprocessed. Payroll locks tonight at 11 PM. If credentials are not refreshed in time, all 7 changes miss this cycle.',
      action: 'Notify Vantage IT admin to re-share API credentials. Auto-retry will resume as soon as credentials are refreshed.',
    },
  },
  {
    id: 'crestline',
    tenant: 'Crestline Ops',
    status: 'CRITICAL',
    issue: 'Salary change received as $0 — likely data entry error in Workday',
    employee: 'P. Alvarez · Senior Analyst',
    lock: 'Tomorrow, 3 PM',
    lockUrgency: 'amber',
    panel: {
      title: 'Zero-value salary anomaly — Crestline Ops',
      what: "Workday sent a salary update for Priya Alvarez with an Annual_Base_Salary of $0.00. Her current salary on file is $74,000. This almost certainly reflects a data entry error in Workday — the field was likely cleared instead of updated.",
      risk: "If this change were approved and processed, Priya would be paid $0 on the next payroll run. QuantapayAI blocked the write automatically — it's sitting in the anomaly review queue waiting for HR action.",
      action: 'Flag to Crestline HR admin to correct the Workday entry. Once corrected, re-sync will detect the fix and re-route for approval.',
    },
  },
]

const AT_RISK = [
  { tenant: 'Brightfield Inc.',   issue: 'Approval queue: 2 changes pending > 24 hrs', employee: '2 employees', lock: 'In 4 days' },
  { tenant: 'Northgate Systems',  issue: 'HiBob connector returning null on work_location', employee: '3 employees', lock: 'In 3 days' },
  { tenant: 'Summit Payroll Co.', issue: 'New hire onboarding blocked — missing field mapping', employee: '1 employee', lock: 'In 5 days' },
  { tenant: 'Axiom Partners',     issue: 'Salary change approval near 48hr SLA limit', employee: '1 employee', lock: 'In 2 days' },
  { tenant: 'Coastline HR',       issue: 'BambooHR connector authentication expiring in 6 hrs', employee: 'All employees', lock: 'In 3 days' },
  { tenant: 'Redwood Global',     issue: 'Worker type change pending — Rippling API delay', employee: '2 employees', lock: 'In 4 days' },
  { tenant: 'Pinnacle Corp.',     issue: '3 field mapping warnings from last Workday update', employee: '4 employees', lock: 'In 6 days' },
  { tenant: 'Delta Solutions',    issue: 'Cross-border relocation change in approval queue', employee: '1 employee', lock: 'In 5 days' },
  { tenant: 'Ember Consulting',   issue: 'Pay group reference unmapped after tenant migration', employee: '6 employees', lock: 'In 7 days' },
  { tenant: 'Torrent Tech',       issue: 'Termination effective date 30 days retroactive', employee: '1 employee', lock: 'In 3 days' },
  { tenant: 'Lumen Health',       issue: 'Custom field mapping broken after Workday v42 upgrade', employee: '9 employees', lock: 'In 4 days' },
]

// ─── CHART DATA ───────────────────────────────────────────────────────────────
const FAILURE_TYPES = [
  { label: 'Data mapping errors',       pct: 44, count: 127, color: 'bg-red-500',    trend: '↑ trending up', trendColor: 'text-red-500' },
  { label: 'Approval queue timeout',    pct: 28, count: 81,  color: 'bg-amber-400',  trend: null },
  { label: 'Partner API regressions',   pct: 18, count: 52,  color: 'bg-blue-500',   trend: null },
  { label: 'Config errors',             pct: 10, count: 29,  color: 'bg-gray-400',   trend: null },
]

const APPROVAL_TIMES = [
  { label: 'Under 2 hours',  pct: 58, count: 214, color: 'bg-emerald-500' },
  { label: '2 – 12 hours',   pct: 27, count: 100, color: 'bg-teal-500' },
  { label: '12 – 48 hours',  pct: 12, count: 44,  color: 'bg-amber-400' },
  { label: 'Over 48 hours',  pct: 3,  count: 11,  color: 'bg-red-500' },
]

// ─── SLIDE-IN PANEL ───────────────────────────────────────────────────────────
function SlidePanel({ tenant, onClose, onResolve, resolved }) {
  if (!tenant) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="bg-[#0f172a] px-5 py-4 flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Critical Issue</span>
            <h3 className="text-sm font-semibold text-white mt-0.5">{tenant.panel.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none mt-0.5 ml-4 shrink-0">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-dark mb-1">What happened</p>
            <p className="text-sm text-gray-600 leading-relaxed">{tenant.panel.what}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-red-700 mb-1">Risk if unresolved</p>
            <p className="text-sm text-red-600 leading-relaxed">{tenant.panel.risk}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">Recommended action</p>
            <p className="text-sm text-blue-600 leading-relaxed">{tenant.panel.action}</p>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100">
          {resolved ? (
            <div className="text-center py-2">
              <p className="text-sm font-semibold text-emerald-600">✓ Action taken — team notified</p>
              <button onClick={onClose} className="text-xs text-muted mt-1 hover:underline">Close</button>
            </div>
          ) : (
            <button
              onClick={onResolve}
              className="w-full bg-primary text-white text-sm font-semibold rounded-xl py-3 hover:bg-primary/90 transition-colors"
            >
              Take action →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── HORIZONTAL BAR ───────────────────────────────────────────────────────────
function HBar({ item }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span className="flex items-center gap-1.5">
          {item.label}
          {item.trend && <span className={`text-xs font-medium ${item.trendColor}`}>{item.trend}</span>}
        </span>
        <span className="font-semibold text-dark">{item.pct}%</span>
      </div>
      <div className="relative h-7 bg-gray-100 rounded-lg overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`h-full rounded-lg transition-all duration-500 ${item.color}`}
          style={{ width: `${item.pct}%` }}
        />
        {hovered && (
          <div className="absolute inset-0 flex items-center px-3">
            <span className="text-xs font-semibold text-white drop-shadow">
              {item.count} tenants · {item.pct}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function BonusDashboard() {
  const [panel, setPanel] = useState(null)
  const [resolved, setResolved] = useState({})
  const [atRiskOpen, setAtRiskOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Slide-in panel */}
      <SlidePanel
        tenant={panel}
        onClose={() => setPanel(null)}
        onResolve={() => setResolved(r => ({ ...r, [panel.id]: true }))}
        resolved={panel ? resolved[panel.id] : false}
      />

      {/* Rationale chip */}
      <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
        <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
        <p className="text-xs text-muted leading-relaxed">
          This dashboard is for QuantapayAI's internal team — Customer Success, Integration Engineering, and on-call PMs. It answers one question: which tenants need action before payroll locks? It is not a customer-facing screen. The design prioritises urgency surfacing over completeness.
        </p>
      </div>

      {/* ── SECTION 1: KPI BAR ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPIS.map(k => (
          <div key={k.label} className={`border rounded-2xl px-5 py-4 ${k.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${k.dot}`} />
              <span className="text-xs font-medium text-muted">{k.label}</span>
            </div>
            <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
            {k.note && (
              <p className="text-xs text-amber-600 font-medium mt-1">{k.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── SECTION 2: CRITICAL TENANTS ── */}
      <div>
        <div className="bg-red-50 border border-red-200 rounded-t-2xl px-5 py-3 flex items-center gap-2">
          <span className="text-red-600 font-bold text-sm">⛔ CRITICAL</span>
          <span className="text-red-600 text-sm">— 3 tenants need action before payroll lock closes.</span>
        </div>
        <div className="border border-red-200 border-t-0 rounded-b-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-red-50 border-b border-red-100">
                {['Tenant', 'Issue', 'Affected', 'Payroll Lock', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 font-semibold text-red-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITICAL.map((row, i) => (
                <tr key={row.id} className={`border-b border-red-50 ${i % 2 === 0 ? 'bg-white' : 'bg-red-50/30'}`}>
                  <td className="px-4 py-3 font-semibold text-dark">{row.tenant}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[240px]">{row.issue}</td>
                  <td className="px-4 py-3 text-gray-500">{row.employee}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${row.lockUrgency === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
                      {row.lock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setPanel(row)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        resolved[row.id]
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {resolved[row.id] ? '✓ Actioned' : 'View & resolve →'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 2b: AT RISK TENANTS ── */}
      <div>
        <button
          onClick={() => setAtRiskOpen(v => !v)}
          className="w-full bg-amber-50 border border-amber-200 rounded-t-2xl px-5 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-700 font-bold text-sm">⚠ AT RISK</span>
            <span className="text-amber-700 text-sm">— 11 tenants with issues that could escalate.</span>
          </div>
          <span className={`text-amber-500 text-sm transition-transform duration-200 ${atRiskOpen ? 'rotate-180' : ''}`}>▾</span>
        </button>
        <div className={`border border-amber-200 border-t-0 rounded-b-2xl overflow-hidden transition-all duration-300 ${atRiskOpen ? '' : ''}`}>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-amber-50 border-b border-amber-100">
                {['Tenant', 'Issue', 'Affected', 'Payroll Lock'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 font-semibold text-amber-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(atRiskOpen ? AT_RISK : AT_RISK.slice(0, 2)).map((row, i) => (
                <tr key={row.tenant} className={`border-b border-amber-50 ${i % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}`}>
                  <td className="px-4 py-3 font-semibold text-dark">{row.tenant}</td>
                  <td className="px-4 py-3 text-gray-600">{row.issue}</td>
                  <td className="px-4 py-3 text-gray-500">{row.employee}</td>
                  <td className="px-4 py-3 text-amber-600 font-medium">{row.lock}</td>
                </tr>
              ))}
              {!atRiskOpen && (
                <tr className="bg-amber-50/30">
                  <td colSpan={4} className="px-4 py-2.5">
                    <button onClick={() => setAtRiskOpen(true)} className="text-xs text-amber-600 font-semibold hover:underline">
                      +9 more at-risk tenants — click to expand
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 3: CHARTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Failure type breakdown */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <h3 className="text-sm font-semibold text-dark mb-1">Failure type breakdown</h3>
          <p className="text-xs text-muted mb-4">Last 30 days · 289 total failures</p>
          <div className="space-y-3">
            {FAILURE_TYPES.map(item => <HBar key={item.label} item={item} />)}
          </div>
          <p className="text-xs text-muted italic mt-5 border-t border-gray-100 pt-3">
            Data mapping errors trending up — Workday v42 rollout likely cause.
          </p>
        </div>

        {/* Approval queue response time */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <h3 className="text-sm font-semibold text-dark mb-1">Approval queue response time</h3>
          <p className="text-xs text-muted mb-4">Last 30 days · 369 approvals</p>
          <div className="space-y-3">
            {APPROVAL_TIMES.map(item => <HBar key={item.label} item={item} />)}
          </div>
          <p className="text-xs text-muted italic mt-5 border-t border-gray-100 pt-3">
            3% unactioned over 48 hrs — review notification delivery to HR contacts.
          </p>
        </div>
      </div>
    </div>
  )
}
