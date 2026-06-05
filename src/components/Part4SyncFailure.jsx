import { useState } from 'react'

const WORKDAY_RAW = '$920,000.00 USD'
const QUANTAPAY_RECEIVED = '920000.00'
const CORRECT_VALUE = '92000.00'
const CURRENCY = 'USD'

export default function Part4SyncFailure() {
  const [expanded, setExpanded] = useState(false)
  const [fixed, setFixed] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [logOpen, setLogOpen] = useState(false)

  if (fixed) {
    return (
      <div className="bg-[#f5f6fa] min-h-[600px] rounded-2xl overflow-hidden flex flex-col">
        {/* Mock nav */}
        <div className="bg-[#0f172a] px-6 py-3 flex items-center gap-2">
          <span className="text-white text-sm font-semibold">QuantapayAI</span>
          <span className="text-slate-500 text-sm">|</span>
          <span className="text-slate-400 text-sm">Integrations</span>
          <span className="text-slate-500 text-sm">|</span>
          <span className="text-slate-300 text-sm">Sync Monitor</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">✓</div>
          <p className="text-lg font-semibold text-dark">Sarah Chen's record has been corrected</p>
          <p className="text-sm text-muted">Annual salary updated to $92,000. Will be applied in the next sync — before the June 30 payroll run.</p>
          <button onClick={() => { setFixed(false); setExpanded(false) }} className="text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition-colors">
            Reset demo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
        <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
        <p className="text-xs text-muted leading-relaxed">
          The failure screen is designed around one principle: the HR admin should never have to read a log to understand what's wrong or what to do next. Plain English, one clear action, deadline visible at a glance.
        </p>
      </div>

      {/* Wireframe shell */}
      <div className="bg-[#f5f6fa] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

        {/* Mock product nav */}
        <div className="bg-[#0f172a] px-6 py-3 flex items-center gap-2">
          <span className="text-white text-sm font-semibold">QuantapayAI</span>
          <span className="text-slate-500 text-sm">|</span>
          <span className="text-slate-400 text-sm">Integrations</span>
          <span className="text-slate-500 text-sm">|</span>
          <span className="text-slate-300 text-sm">Sync Monitor</span>
        </div>

        {/* Urgency banner */}
        {!dismissed && (
          <div className="bg-red-600 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">⚠</span>
              <span className="text-white text-sm font-semibold">ACTION REQUIRED</span>
              <span className="text-red-200 text-sm">— Payroll locks in 2 days. 1 employee record needs your attention.</span>
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">

          {/* Main failure card */}
          <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-red-500 overflow-hidden shadow-sm">
            <div className="px-6 py-5">
              {/* Employee identity */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-dark">Sarah Chen · Senior Engineer, Platform Team</h2>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted">Employee ID: EMP-4821</span>
                  <span className="text-xs text-muted">Hired: Mar 15 2022</span>
                  <span className="text-xs text-muted">Location: San Francisco, CA</span>
                </div>
              </div>

              {/* What happened */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-dark mb-1">What happened</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Workday sent Sarah's updated salary as <span className="font-semibold text-dark">$920,000</span> — but her current salary on file is <span className="font-semibold text-dark">$92,000</span>. This looks like a data entry error in Workday (an extra zero). QuantapayAI flagged it automatically because the new value is 10× her current salary.
                </p>
              </div>

              {/* If you don't act */}
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-sm font-semibold text-red-700 mb-1">If you don't act</p>
                <p className="text-sm text-red-600 leading-relaxed">
                  Sarah will be paid at her <span className="font-semibold">current salary ($92,000 pro-rated)</span> on June 30 — the flagged update will remain blocked until you review it.
                </p>
              </div>

              {/* Expanded: raw field comparison */}
              {expanded && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Workday value vs. what QuantapayAI received</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                      <p className="text-xs font-semibold text-red-700 mb-1">Workday sent</p>
                      <p className="text-lg font-bold text-red-800 font-mono">$920,000.00 USD</p>
                      <p className="text-xs text-red-500 mt-1">Field: Annual_Base_Salary</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                      <p className="text-xs font-semibold text-emerald-700 mb-1">Correct value</p>
                      <p className="text-lg font-bold text-emerald-800 font-mono">$92,000.00 USD</p>
                      <p className="text-xs text-emerald-500 mt-1">Current salary on file</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFixed(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors"
                  >
                    Apply correct value — $92,000
                  </button>
                  <p className="text-xs text-muted text-center mt-2">This will update Sarah's record and clear the flag. The change will be confirmed in the next sync.</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {!expanded && (
              <div className="px-6 pb-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setExpanded(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors"
                >
                  Review and Fix →
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-sm text-muted border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  Dismiss — I'll handle this manually
                </button>
                <button
                  onClick={() => setLogOpen(v => !v)}
                  className="text-sm text-muted hover:text-dark transition-colors underline-offset-2 hover:underline"
                >
                  View full sync log
                </button>
              </div>
            )}

            {/* Sync log drawer */}
            {logOpen && !expanded && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sync log — June 5 2025, 09:15 AM</p>
                <div className="space-y-1 font-mono text-xs text-gray-500">
                  <p><span className="text-emerald-600">✓</span> Poll complete — 48 records returned</p>
                  <p><span className="text-emerald-600">✓</span> 47 records passed schema validation</p>
                  <p><span className="text-emerald-600">✓</span> 47 records routed to trust tier</p>
                  <p><span className="text-red-500">✕</span> 1 record flagged by anomaly detection — EMP-4821 (Sarah Chen)</p>
                  <p><span className="text-amber-500">⚠</span> Annual_Base_Salary: received 920000.00, expected ~92000.00 (10× anomaly)</p>
                  <p><span className="text-amber-500">⚠</span> Record held — pending HR review</p>
                </div>
                <button onClick={() => setLogOpen(false)} className="mt-2 text-xs text-muted hover:text-dark transition-colors">Close log</button>
              </div>
            )}
          </div>

          {/* Bottom stats bar */}
          <div className="bg-white rounded-xl border border-gray-200 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-6 text-xs text-muted">
              <span>Last sync: <span className="text-dark font-medium">Jun 5, 09:15 AM</span></span>
              <span>Records processed: <span className="text-dark font-medium">47 of 48</span></span>
              <span>Failures: <span className="text-red-600 font-semibold">1</span></span>
              <span>Next sync: <span className="text-dark font-medium">Jun 5, 09:30 AM</span></span>
            </div>
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
              Sync paused — pending review
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
