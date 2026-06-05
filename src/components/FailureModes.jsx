import { useState } from 'react'

const CATEGORY_COLORS = {
  'Data Mapping': 'bg-blue-100 text-blue-700',
  'Timing': 'bg-orange-100 text-orange-700',
  'API Regression': 'bg-red-100 text-red-700',
  'Config Error': 'bg-yellow-100 text-yellow-700',
  'Idempotency': 'bg-violet-100 text-violet-700',
}

const FAILURE_MODES = [
  {
    id: 'FM-1',
    category: 'Data Mapping',
    title: 'Salary Field Type Mismatch',
    description: 'Workday returns salary as a formatted string. QuantapayAI expects a clean decimal.',
    what: 'Workday returns Annual_Base_Salary as "$85,000.00 USD" — a formatted string with currency symbol. QuantapayAI\'s normalization layer expects a clean decimal (85000.00) and separate ISO 4217 currency code. A regex parsing failure extracts "8500000" — missing the decimal — and routes a 100x salary to the write queue.',
    detected: 'Schema validation layer rejects the parsed value if it falls outside a sanity range (>500% of current value or <$0.01/hr equivalent). Alert fires before any write attempt. Employee: Marcus Lee, WD-31042.',
    notified: 'Integration health dashboard: amber alert. QuantapayAI CS rep assigned: email + in-app within 5 min. HR admin: in-app notification with affected record and raw Workday value for manual review.',
    matters: 'Silent rejection means the salary change is lost — the employee gets paid at the old rate until someone manually catches it, which may not happen before the next payroll lock. A bad write means a 100x overpay.',
  },
  {
    id: 'FM-2',
    category: 'Timing',
    title: 'Termination Before Payroll Lock',
    description: 'Termination detected on Day 1, effective Day 15 — payroll locks Day 10.',
    what: 'HR marks termination in Workday for Jordan Park (WD-22918) on Jun 1 with effective date Jun 15. QuantapayAI receives the event on Jun 1. Payroll for the current cycle locks Jun 10. The queued termination approval is not actioned — the final payroll run either misses or processes incorrectly.',
    detected: 'Termination events with effective dates within the current payroll cycle window are auto-flagged as time-sensitive. Countdown SLA shown to HR admin: "Action required by Jun 10 to avoid compliance issue."',
    notified: 'HR admin: push notification + email with explicit payroll lock deadline. If unapproved 48hrs before lock: escalation to HR Manager role. After lock passes without action: CS team alerted to initiate off-cycle run protocol.',
    matters: 'In UK, Germany, and California, delayed final pay carries statutory fines. This is not an edge case — it is a compliance risk QuantapayAI must surface proactively, not reactively.',
  },
  {
    id: 'FM-3',
    category: 'API Regression',
    title: 'Workday API Version Upgrade Breaks Schema',
    description: 'Workday v42 renames a field. Customer tenant auto-upgrades. Normalization layer expects old structure.',
    what: 'Workday releases API v42 and restructures Worker_Type into a sub-object. Customer\'s Acme Corp tenant (WD tenant: T-8821) auto-upgrades. QuantapayAI\'s normalization layer still expects the v41 flat field. Worker_Type returns null. All subsequent worker type reads silently drop the field.',
    detected: 'Two layers: (1) Null/empty on a required field triggers schema validation error immediately. (2) Synthetic canary record — a test worker in each tenant is polled every 30 min and all fields validated. Any mismatch fires before real employees are affected.',
    notified: 'QuantapayAI Integration Platform team: P1 alert — Slack + PagerDuty immediately. Affected customer CS reps: email within 15 min. HR admins: banner — "Workday sync paused — our team is investigating. No data has been lost."',
    matters: 'Sync is paused (not silently failing) until normalization layer is patched. All changes during the pause are backfilled using the stored last-successful-sync cursor — no manual re-entry required.',
  },
  {
    id: 'FM-4',
    category: 'Config Error',
    title: 'Incorrect Field Mapping During Onboarding',
    description: 'HR admin maps a Workday sub-type field to employment_classification. All contingent workers import with wrong classification.',
    what: 'During onboarding, an HR admin at GlobalHR Inc. maps Workday\'s "Contingent_Worker_Type" to QuantapayAI\'s employment_classification field. The Workday field is a sub-type of contingent workers, not the top-level worker classification. All 47 contingent workers import with employment_classification: "CONTINGENT_SUBTYPE_A" — an unknown enum value.',
    detected: 'Post-mapping dry-run: QuantapayAI runs a validation sync against 10 sample records from the customer\'s Workday tenant before go-live. Sample records are shown to the HR admin for review. Enum value mismatches (unknown worker type strings) are flagged inline with suggested corrections.',
    notified: 'HR admin during onboarding dry-run: inline warning with field-level detail and correction suggestion. If caught post-go-live: CS rep + HR admin with bulk re-classification workflow and audit trail.',
    matters: 'Customer configuration errors cannot be caught by schema validation alone — the fields technically map, the values are semantically wrong. Only showing the customer their own real data in a pre-production review catches this class of error.',
  },
  {
    id: 'FM-5',
    category: 'Idempotency',
    title: 'Duplicate New Hire on Rapid Retry',
    description: 'Sync engine times out writing a new hire. Retry fires. QuantapayAI creates a second employee record.',
    what: 'Sync engine detects new hire Sarah Chen (WD-48291). Write to QuantapayAI times out after 30 seconds due to a network issue. Retry fires automatically. Without idempotency enforcement, QuantapayAI creates employee #48291-A and #48291-B — duplicate payroll enrollment follows.',
    detected: 'Every write includes an idempotency key derived from Worker_ID + event_type + effective_date (e.g. "WD-48291:new_hire:2025-07-01"). QuantapayAI\'s API rejects duplicate keys with a 409 Conflict. Sync engine treats 409 as success and logs accordingly — no duplicate created.',
    notified: 'No notification to HR admin for clean 409 handling (expected behavior, no action needed). If a duplicate slips past the idempotency check: automated deduplication job runs nightly and flags records with identical Worker_ID for CS review.',
    matters: 'Name-based deduplication fails on common names and legal name changes. Worker_ID is the only stable, unique identifier across Workday tenants. Idempotency must be ID-based, not fuzzy-match.',
  },
]

function DesignChip() {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1 border border-gray-200 rounded-full px-2 py-0.5"
    >
      <span>ⓘ</span> Why design for failure first?
      {open && (
        <span
          onClick={(e) => e.stopPropagation()}
          className="absolute z-10 mt-6 ml-0 w-80 bg-gray-50 border border-gray-200 text-left rounded-lg px-3 py-2 text-xs text-muted leading-relaxed shadow-lg font-normal"
        >
          Happy-path integrations are table stakes. Enterprise payroll integrations fail in specific, predictable ways — field type drift, timing mismatches, config errors at onboarding, API regressions. Designing failure modes first forces the integration architecture to be resilient by default: every stage has a defined failure state, a detection mechanism, and a notification path. Silent data loss is never acceptable in payroll.
        </span>
      )}
    </button>
  )
}

function FMCard({ fm }) {
  const [open, setOpen] = useState(false)
  const catColor = CATEGORY_COLORS[fm.category] || 'bg-gray-100 text-gray-600'

  return (
    <div
      className={`border rounded-xl transition-all duration-200 cursor-pointer ${open ? 'border-primary/30 bg-purple-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
      onClick={() => setOpen(!open)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-primary">{fm.id}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColor}`}>
              {fm.category}
            </span>
          </div>
          <span className={`text-xs text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
        </div>
        <p className="text-sm font-semibold text-dark mb-1">{fm.title}</p>
        <p className="text-xs text-muted leading-relaxed">{fm.description}</p>
      </div>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          <div>
            <p className="text-xs font-semibold text-dark mb-1">What happened</p>
            <p className="text-xs text-gray-600 leading-relaxed">{fm.what}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-dark mb-1">How it was detected</p>
            <p className="text-xs text-gray-600 leading-relaxed">{fm.detected}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-dark mb-1">Who was notified</p>
            <p className="text-xs text-gray-600 leading-relaxed">{fm.notified}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-amber-800 mb-1">Why it matters</p>
            <p className="text-xs text-amber-700 leading-relaxed">{fm.matters}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FailureModes() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">Failure Modes</h2>
        <p className="text-sm text-muted mb-3">
          Five failure scenarios across all four failure categories. The integration is designed to fail loudly — never silently. Click any card to expand the full incident detail.
        </p>
        <DesignChip />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAILURE_MODES.map((fm) => (
          <FMCard key={fm.id} fm={fm} />
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-muted leading-relaxed">
        <span className="font-medium text-dark">Summary principle:</span> Every failure mode results in either a blocked action with a clear notification, or a paused sync with backfill capability — never a silent data loss or incorrect write.
      </div>
    </div>
  )
}
