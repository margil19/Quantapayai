import { useState } from 'react'

const CATEGORY_COLORS = {
  'Data Mapping': 'bg-blue-100 text-blue-700',
  'Timing': 'bg-orange-100 text-orange-700',
'Config Error': 'bg-yellow-100 text-yellow-700',
  'Idempotency': 'bg-violet-100 text-violet-700',
}

const FAILURE_MODES = [
  {
    id: 'FM-1',
    category: 'Data Mapping',
    title: 'Salary Field Type Mismatch',
    description: 'Workday returns salary as a formatted string. QuantapayAI expects a clean decimal.',
    what: 'Imagine Marcus Lee\'s salary in Workday is stored as "$85,000.00 USD" - a piece of text, not just a number. QuantapayAI needs a clean number to work with. During translation, a small parsing mistake drops the decimal point and reads the value as $8,500,000. Without a safety check, that 100x salary would land in the approval queue.',
    detected: 'Before anything is written, QuantapayAI runs a sanity check - if a salary looks more than 5x the current value, it stops and raises an alert immediately. Nothing is changed until a human reviews it.',
    notified: 'The HR admin sees an in-app alert with Marcus\'s name and the raw value from Workday so they can spot the issue. The assigned QuantapayAI support rep is also notified within 5 minutes.',
    matters: 'Without this check, two bad outcomes are possible: the salary change is quietly skipped (Marcus keeps getting paid the old amount), or it goes through as written (a 100x overpay). Either way, payroll is wrong before anyone notices.',
  },
  {
    id: 'FM-2',
    category: 'Timing',
    title: 'Termination Before Payroll Lock',
    description: 'Termination detected on Day 1, effective Day 15 - payroll locks Day 10.',
    what: 'Jordan Park resigns on June 1st, with June 15th as their last day. HR logs it in Workday straight away and QuantapayAI picks it up. But payroll for the current cycle closes on June 10th - meaning the termination approval needs to happen before then, or the final paycheck either gets missed or goes out wrong.',
    detected: 'QuantapayAI spots that the last day falls within the current pay cycle and immediately shows a countdown to the HR admin: "Approve by June 10th to avoid a compliance issue." It\'s surfaced as urgent, not buried in a queue.',
    notified: 'HR admin gets a push notification and email with the exact deadline. If they haven\'t acted 48 hours before the cutoff, it automatically escalates to the HR Manager. If payroll locks without action, the support team is alerted to run a manual off-cycle payment.',
    matters: 'In countries like the UK, Germany, and in California, paying someone late after they leave is a legal violation - not just an inconvenience. QuantapayAI has to surface this proactively, not wait for someone to notice.',
  },
  {
    id: 'FM-4',
    category: 'Config Error',
    title: 'Incorrect Field Mapping During Onboarding',
    description: 'HR admin maps a Workday sub-type field to employment_classification. All contingent workers import with wrong classification.',
    what: 'When GlobalHR Inc. first set up their integration, their HR admin connected the wrong Workday field to the "worker type" field in QuantapayAI. They picked a sub-category field instead of the main one - like tagging everyone with "Contractor - Sub-type A" instead of just "Contractor." All 47 contract workers imported with an unrecognised label that QuantapayAI didn\'t know what to do with.',
    detected: 'Before going live, QuantapayAI runs a test sync using 10 real employees from the customer\'s Workday account and shows the results to the HR admin. In this case, the worker type column looked obviously wrong - the admin could see it immediately and fix the mapping before anything went live.',
    notified: 'The HR admin sees a clear warning during the test review with a suggested fix. If it\'s only caught after going live, the support team steps in with a tool to bulk-correct all the affected records.',
    matters: 'The technical check can\'t catch this - the connection looked valid on paper, just pointing at the wrong thing. Only showing HR their own real data in a test run surfaces this kind of mistake before it becomes a payroll problem.',
  },
  {
    id: 'FM-5',
    category: 'Idempotency',
    title: 'Duplicate New Hire on Rapid Retry',
    description: 'Sync engine times out writing a new hire. Retry fires. QuantapayAI creates a second employee record.',
    what: 'Sarah Chen\'s new hire record is picked up and sent to QuantapayAI. Halfway through, the connection drops. QuantapayAI never confirmed it received the record, so the sync engine tries again - and this time it goes through. Without a safeguard, Sarah now exists twice in QuantapayAI, and payroll would enroll her twice.',
    detected: 'Every record sent comes with a unique stamp based on Sarah\'s ID, the type of change, and the date. When the retry arrives, QuantapayAI sees it already processed that exact stamp and quietly ignores the second one - no duplicate is created.',
    notified: 'Nothing happens - this is the system working exactly as intended. If a duplicate somehow slipped through, an overnight check scans for employees sharing the same Workday ID and flags them for the support team to review.',
    matters: 'You can\'t catch duplicates by name - two different Sarahs could join the same day, and someone named Sarah Chen could also change their name. The only reliable way to know it\'s the same person is their unique Workday ID.',
  },
]


function FMCard({ fm, onFirstCardClick }) {
  const [open, setOpen] = useState(false)
  const catColor = CATEGORY_COLORS[fm.category] || 'bg-gray-100 text-gray-600'

  return (
    <div
      className={`border rounded-xl transition-all duration-200 cursor-pointer ${open ? 'border-primary/30 bg-purple-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
      onClick={() => { setOpen(!open); if (!open && onFirstCardClick) onFirstCardClick() }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-2">
          <span className={`text-xs text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-primary">{fm.id}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColor}`}>
              {fm.category}
            </span>
          </div>
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

export default function FailureModes({ onFirstCardClick }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">Failure Modes</h2>
        <p className="text-sm text-muted">
          Five failure scenarios across all four failure categories. The integration is designed to fail loudly - never silently. Click any card to expand the full incident detail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {FAILURE_MODES.map((fm) => (
          <FMCard key={fm.id} fm={fm} onFirstCardClick={onFirstCardClick} />
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-muted leading-relaxed">
        <span className="font-medium text-dark">Summary principle:</span> Every failure mode results in either a blocked action with a clear notification, or a paused sync with backfill capability - never a silent data loss or incorrect write.
      </div>
    </div>
  )
}
