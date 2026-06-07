import { useState } from 'react'


const TIERS = [
  {
    id: 'direct',
    label: 'Direct Write',
    sublabel: 'Auto-applied, no gate',
    color: 'emerald',
    headerBg: 'bg-emerald-50',
    headerBorder: 'border-emerald-200',
    headerText: 'text-emerald-800',
    dot: 'bg-emerald-500',
    cardBorder: 'border-emerald-100 hover:border-emerald-300',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    actions: [
      {
        name: 'Department Change',
        reversibility: 'High - fully editable at any time',
        payrollConsequence: 'None - cost allocation only, no payroll impact',
        regulatoryExposure: 'None',
        justification: 'Org structure changes carry zero payroll risk. Adding approval creates friction with no compliance benefit.',
      },
      {
        name: 'Manager Change',
        reversibility: 'High - editable at any time',
        payrollConsequence: 'None - hierarchy only',
        regulatoryExposure: 'None',
        justification: 'Reporting line changes are informational. Zero downstream payroll or compliance consequence.',
      },
      {
        name: 'Work Location (Same Country)',
        reversibility: 'High',
        payrollConsequence: 'Low - may affect state tax bracket; auto-flagged if cross-state',
        regulatoryExposure: 'Low - intra-country only',
        justification: 'Intra-country relocation is low statutory risk. Cross-state tax implications are auto-flagged without blocking.',
      },
      {
        name: 'New Hire - Identity Fields',
        reversibility: 'High - all fields editable',
        payrollConsequence: 'None - name and ID only, no current-cycle payroll',
        regulatoryExposure: 'Low',
        justification: 'Identity fields must sync fast to unblock onboarding. Blocking with approval slows access with zero risk reduction.',
      },
    ],
  },
  {
    id: 'queue',
    label: 'Queue for Approval',
    sublabel: 'Staged - HR must approve',
    color: 'amber',
    headerBg: 'bg-amber-50',
    headerBorder: 'border-amber-200',
    headerText: 'text-amber-800',
    dot: 'bg-amber-500',
    cardBorder: 'border-amber-100 hover:border-amber-300',
    badgeBg: 'bg-amber-100 text-amber-700',
    actions: [
      {
        name: 'Salary Update',
        reversibility: 'Low - affects past payroll if retroactive',
        payrollConsequence: 'CRITICAL - direct payroll output, next and possibly past cycles',
        regulatoryExposure: 'High - statutory salary guarantee laws in many jurisdictions',
        justification: 'Salary is the highest-risk write in payroll. Overpay/underpay creates legal exposure that cannot be recalled. Always gates behind HR approval.',
      },
      {
        name: 'Termination',
        reversibility: 'Irreversible - affects final pay, benefits, severance entitlements',
        payrollConsequence: 'CRITICAL - final payslip, statutory payouts, benefit cutoffs',
        regulatoryExposure: 'Critical - delayed final pay carries statutory fines in UK, Germany, California, and others',
        justification: 'Most consequential action in HR. Final pay rules vary by jurisdiction and termination reason. Never auto-applies regardless of API confidence.',
      },
      {
        name: 'New Hire - Start Date',
        reversibility: 'Medium - requires payroll correction if wrong',
        payrollConsequence: 'HIGH - triggers first payroll cycle',
        regulatoryExposure: 'Medium - wrong start date affects statutory benefits eligibility',
        justification: 'Incorrect start date = wrong first payslip. HR must verify before the payroll cycle locks.',
      },
      {
        name: 'Worker Type Change',
        reversibility: 'Very Low - legal entity change, complex to reverse',
        payrollConsequence: 'CRITICAL - determines EOR vs payroll routing and legal entity',
        regulatoryExposure: 'Critical - misclassification is statutory liability in 60+ countries',
        justification: 'Employee ↔ EOR ↔ Contractor misclassification is a compliance catastrophe. This change must never auto-apply.',
      },
    ],
  },
  {
    id: 'suggest',
    label: 'Suggested Action',
    sublabel: 'Surfaced - no action taken',
    color: 'purple',
    headerBg: 'bg-purple-50',
    headerBorder: 'border-purple-200',
    headerText: 'text-purple-800',
    dot: 'bg-purple-500',
    cardBorder: 'border-purple-100 hover:border-purple-300',
    badgeBg: 'bg-purple-100 text-purple-700',
    actions: [
      {
        name: 'Benefits Election Sync',
        reversibility: 'Medium - plan changes have enrollment windows',
        payrollConsequence: 'HIGH - affects premium deductions',
        regulatoryExposure: 'Medium - benefit plan mismatches affect employee entitlements',
        justification: "Benefits plans in QuantapayAI may not map 1:1 to Workday. Surfaced as a suggestion until the customer confirms the mapping - QuantapayAI can't validate correctness without HR context.",
      },
      {
        name: 'Bank Account / Pay Elections',
        reversibility: 'N/A - not synced from Workday',
        payrollConsequence: 'CRITICAL - payment destination',
        regulatoryExposure: 'Critical - PII and financial data transfer liability',
        justification: "Bank details are entered directly in QuantapayAI by the employee. Syncing from Workday introduces PII transfer liability with zero trust benefit - the employee is the authoritative source.",
      },
    ],
  },
]


function ActionCard({ action, tier, onFirstCardClick, showBubble, onBubbleDismiss }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`border rounded-xl p-3 cursor-pointer transition-all duration-200 relative ${tier.cardBorder} ${open ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/60'}`}
      onClick={() => { setOpen(!open); if (!open && onFirstCardClick) onFirstCardClick(); if (showBubble) onBubbleDismiss() }}
    >
      {showBubble && (
        <span className="absolute -top-2 -right-2 flex items-center gap-1 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm z-10 animate-pulse pointer-events-none">
          tap to expand
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${tier.badgeBg} px-2 py-0.5 rounded-full`}>
          {action.name}
        </span>
        <span className={`text-xs text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </div>
      {open && (
        <div className="mt-3 space-y-2 text-xs">
          <div className="grid grid-cols-[110px_1fr] gap-1 items-start">
            <span className="text-gray-400 font-medium">Reversibility</span>
            <span className="text-gray-700">{action.reversibility}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-1 items-start">
            <span className="text-gray-400 font-medium">Payroll Impact</span>
            <span className="text-gray-700">{action.payrollConsequence}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-1 items-start">
            <span className="text-gray-400 font-medium">Reg. Exposure</span>
            <span className="text-gray-700">{action.regulatoryExposure}</span>
          </div>
          <div className="border-t border-gray-100 pt-2">
            <span className="text-gray-400 font-medium block mb-1">Justification</span>
            <span className="text-gray-700 leading-relaxed">{action.justification}</span>
          </div>
        </div>
      )}
    </div>
  )
}


export default function TrustGradient({ onFirstCardClick }) {
  const [bubbleDismissed, setBubbleDismissed] = useState(false)
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">Trust Gradient</h2>
        <p className="text-sm text-muted mb-3">
          Every write action is classified by reversibility, payroll consequence, and regulatory exposure - then routed to one of three tiers. <span className="text-gray-400 font-medium">Click any action card to see the full reasoning.</span>
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            Trust tier is assigned based on reversibility, payroll consequence, and regulatory exposure. Human oversight is required for all irreversible or compliance-sensitive actions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div key={tier.id} className="space-y-3">
            <div className={`rounded-xl border p-4 ${tier.headerBg} ${tier.headerBorder}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${tier.dot}`} />
                <span className={`text-sm font-semibold ${tier.headerText}`}>{tier.label}</span>
              </div>
              <p className={`text-xs ${tier.headerText} opacity-70`}>{tier.sublabel}</p>
            </div>
            <div className="space-y-2">
              {tier.actions.map((action, ai) => (
                <ActionCard
                  key={action.name}
                  action={action}
                  tier={tier}
                  onFirstCardClick={onFirstCardClick}
                  showBubble={!bubbleDismissed && tier.id === TIERS[0].id && ai === 0}
                  onBubbleDismiss={() => setBubbleDismissed(true)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-muted leading-relaxed">
        <span className="font-medium text-dark">Design principle:</span> Every action where a wrong value could generate a payroll disbursement that cannot be recalled - salary, termination, worker type, cross-border relocation - is gated behind HR admin approval regardless of API confidence. Speed is not worth statutory exposure.
      </div>
    </div>
  )
}
