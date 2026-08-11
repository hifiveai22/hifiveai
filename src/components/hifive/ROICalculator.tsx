'use client';

import { useState, useMemo, useCallback } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useCounters } from '@/hooks/useCounters';
import {
  Users,
  Globe,
  DollarSign,
  Clock,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
} from 'lucide-react';

type Step = 0 | 1 | 2;

interface OrgProfile {
  employees: number;
  countries: number;
  annualGrowth: number; // %
}

interface CurrentCosts {
  annualToolSpend: number;
  hrsPerWeekAdmin: number;
  avgFullyLoadedRate: number; // $/hr
  complianceIncidents: number; // per year
}

// Industry benchmark assumptions (sourced from Gartner / Deloitte mid-market studies, 2024)
const SAVINGS_FACTORS = {
  toolConsolidation: 0.62, // 62% reduction in tool spend
  adminTimeReduction: 0.55, // 55% reduction in admin hours
  complianceReduction: 0.75, // 75% fewer compliance incidents
  incidentCost: 18000, // $18K avg per compliance incident
  hifivePerEmployee: 240, // $/employee/year
  hifiveBasePlatform: 24000, // base annual platform fee
  hifiveCountryMult: 0.12, // 12% per additional country
};

export default function ROICalculator() {
  useReveal();
  useCounters();

  const [step, setStep] = useState<Step>(0);

  const [org, setOrg] = useState<OrgProfile>({
    employees: 150,
    countries: 4,
    annualGrowth: 25,
  });

  const [costs, setCosts] = useState<CurrentCosts>({
    annualToolSpend: 145000,
    hrsPerWeekAdmin: 38,
    avgFullyLoadedRate: 65,
    complianceIncidents: 6,
  });

  const results = useMemo(() => {
    const countryMult = 1 + (org.countries - 1) * SAVINGS_FACTORS.hifiveCountryMult;
    const hifiveAnnualCost = Math.round(
      (SAVINGS_FACTORS.hifiveBasePlatform + org.employees * SAVINGS_FACTORS.hifivePerEmployee) *
        countryMult
    );

    const currentToolCost = costs.annualToolSpend;
    const projectedToolCost = Math.round(currentToolCost * (1 - SAVINGS_FACTORS.toolConsolidation));
    const toolSavings = currentToolCost - projectedToolCost;

    const annualAdminHrs = costs.hrsPerWeekAdmin * 52;
    const currentAdminCost = annualAdminHrs * costs.avgFullyLoadedRate;
    const projectedAdminHrs = annualAdminHrs * (1 - SAVINGS_FACTORS.adminTimeReduction);
    const projectedAdminCost = projectedAdminHrs * costs.avgFullyLoadedRate;
    const adminSavings = Math.round(currentAdminCost - projectedAdminCost);

    const currentComplianceCost = costs.complianceIncidents * SAVINGS_FACTORS.incidentCost;
    const projectedComplianceCost = Math.round(
      currentComplianceCost * (1 - SAVINGS_FACTORS.complianceReduction)
    );
    const complianceSavings = currentComplianceCost - projectedComplianceCost;

    const totalCurrentCost = currentToolCost + currentAdminCost + currentComplianceCost;
    const totalProjectedCost = projectedToolCost + projectedAdminCost + projectedComplianceCost + hifiveAnnualCost;
    const netAnnualSavings = totalCurrentCost - totalProjectedCost;
    const savingsPct = Math.round((netAnnualSavings / totalCurrentCost) * 100);

    // Payback period (months): hifive annual / monthly savings
    const monthlyNetSavings = netAnnualSavings / 12;
    const paybackMonths = monthlyNetSavings > 0
      ? Math.max(1, Math.round((hifiveAnnualCost / 12) / monthlyNetSavings))
      : 0;

    // 3-year projection
    const threeYearSavings = netAnnualSavings * 3;

    return {
      hifiveAnnualCost,
      currentToolCost,
      projectedToolCost,
      toolSavings,
      currentAdminCost,
      projectedAdminCost,
      adminSavings,
      currentComplianceCost,
      projectedComplianceCost,
      complianceSavings,
      totalCurrentCost,
      totalProjectedCost,
      netAnnualSavings,
      savingsPct,
      paybackMonths,
      threeYearSavings,
    };
  }, [org, costs]);

  const reset = useCallback(() => {
    setStep(0);
    setOrg({ employees: 150, countries: 4, annualGrowth: 25 });
    setCosts({
      annualToolSpend: 145000,
      hrsPerWeekAdmin: 38,
      avgFullyLoadedRate: 65,
      complianceIncidents: 6,
    });
  }, []);

  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;

  return (
    <section className="roi-calc-section" id="roi">
      <div className="roi-calc-inner">
        <div className="roi-calc-header">
          <div className="eyebrow reveal">ROI Calculator</div>
          <h2 className="reveal d1">Quantify your return.<br /><em>Before you switch.</em></h2>
          <p className="reveal d2">
            Three steps. Two minutes. A defensible business case your CFO will sign off on.
            Benchmarked against 2024 Gartner and Deloitte mid-market studies.
          </p>
        </div>

        <div className="roi-calc-card reveal-scale">
          {/* Stepper */}
          <div className="roi-stepper">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={`roi-step ${step === s ? 'active' : ''} ${step > s ? 'done' : ''}`}
              >
                <div className="roi-step-circle">
                  {step > s ? <Check size={14} /> : s + 1}
                </div>
                <div className="roi-step-label">
                  {s === 0 ? 'Organization' : s === 1 ? 'Current Costs' : 'Your ROI'}
                </div>
                {s < 2 && <div className="roi-step-line" />}
              </div>
            ))}
          </div>

          {/* Step 0: Org Profile */}
          {step === 0 && (
            <div className="roi-step-content">
              <div className="roi-step-title">Tell us about your organization</div>
              <div className="roi-fields-grid">
                <div className="roi-field">
                  <label>
                    <Users size={14} />
                    Number of employees
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={10000}
                    value={org.employees}
                    onChange={(e) =>
                      setOrg({ ...org, employees: Math.max(10, Number(e.target.value) || 0) })
                    }
                    className="roi-input"
                  />
                </div>
                <div className="roi-field">
                  <label>
                    <Globe size={14} />
                    Operating countries
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={150}
                    value={org.countries}
                    onChange={(e) =>
                      setOrg({ ...org, countries: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="roi-input"
                  />
                </div>
                <div className="roi-field">
                  <label>
                    <TrendingDown size={14} />
                    Annual headcount growth (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={org.annualGrowth}
                    onChange={(e) =>
                      setOrg({ ...org, annualGrowth: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="roi-input"
                  />
                </div>
              </div>
              <div className="roi-step-actions">
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => setStep(1)}
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Current Costs */}
          {step === 1 && (
            <div className="roi-step-content">
              <div className="roi-step-title">What are you spending today?</div>
              <div className="roi-fields-grid">
                <div className="roi-field">
                  <label>
                    <DollarSign size={14} />
                    Annual people-tool spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={costs.annualToolSpend}
                    onChange={(e) =>
                      setCosts({ ...costs, annualToolSpend: Number(e.target.value) || 0 })
                    }
                    className="roi-input"
                  />
                </div>
                <div className="roi-field">
                  <label>
                    <Clock size={14} />
                    Admin hours / week (HR + Ops + IT)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={costs.hrsPerWeekAdmin}
                    onChange={(e) =>
                      setCosts({ ...costs, hrsPerWeekAdmin: Number(e.target.value) || 0 })
                    }
                    className="roi-input"
                  />
                </div>
                <div className="roi-field">
                  <label>
                    <DollarSign size={14} />
                    Avg fully-loaded rate ($/hr)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={500}
                    value={costs.avgFullyLoadedRate}
                    onChange={(e) =>
                      setCosts({ ...costs, avgFullyLoadedRate: Number(e.target.value) || 0 })
                    }
                    className="roi-input"
                  />
                </div>
                <div className="roi-field">
                  <label>
                    <Clock size={14} />
                    Compliance incidents / year
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={costs.complianceIncidents}
                    onChange={(e) =>
                      setCosts({ ...costs, complianceIncidents: Number(e.target.value) || 0 })
                    }
                    className="roi-input"
                  />
                  <div className="roi-field-hint">
                    Avg cost per incident: {fmt(SAVINGS_FACTORS.incidentCost)}
                  </div>
                </div>
              </div>
              <div className="roi-step-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(0)}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => setStep(2)}
                >
                  Calculate ROI
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Results */}
          {step === 2 && (
            <div className="roi-step-content roi-results">
              <div className="roi-step-title">Your projected return on investment</div>

              <div className="roi-headline-stats">
                <div className="roi-headline-stat primary">
                  <div className="roi-headline-stat-label">Net Annual Savings</div>
                  <div className="roi-headline-stat-value" data-count={results.netAnnualSavings} data-prefix="$">
                    {fmt(results.netAnnualSavings)}
                  </div>
                  <div className="roi-headline-stat-sub">
                    {results.savingsPct}% reduction in total cost of ownership
                  </div>
                </div>
                <div className="roi-headline-stat">
                  <div className="roi-headline-stat-label">Payback Period</div>
                  <div className="roi-headline-stat-value">
                    {results.paybackMonths} <span className="roi-headline-stat-unit">months</span>
                  </div>
                  <div className="roi-headline-stat-sub">Until HiFive AI pays for itself</div>
                </div>
                <div className="roi-headline-stat">
                  <div className="roi-headline-stat-label">3-Year Net Savings</div>
                  <div className="roi-headline-stat-value" data-count={results.threeYearSavings} data-prefix="$">
                    {fmt(results.threeYearSavings)}
                  </div>
                  <div className="roi-headline-stat-sub">Compounding impact over 36 months</div>
                </div>
              </div>

              <div className="roi-breakdown">
                <div className="roi-breakdown-title">Where the savings come from</div>
                <div className="roi-breakdown-rows">
                  <div className="roi-breakdown-row">
                    <div className="roi-breakdown-row-label">
                      <span className="roi-breakdown-dot gold" />
                      Tool consolidation
                    </div>
                    <div className="roi-breakdown-bar-track">
                      <div
                        className="roi-breakdown-bar-fill gold"
                        style={{ width: `${(results.toolSavings / results.totalCurrentCost) * 100}%` }}
                      />
                    </div>
                    <div className="roi-breakdown-row-value">{fmt(results.toolSavings)}</div>
                  </div>
                  <div className="roi-breakdown-row">
                    <div className="roi-breakdown-row-label">
                      <span className="roi-breakdown-dot green" />
                      Admin time recovered
                    </div>
                    <div className="roi-breakdown-bar-track">
                      <div
                        className="roi-breakdown-bar-fill green"
                        style={{ width: `${(results.adminSavings / results.totalCurrentCost) * 100}%` }}
                      />
                    </div>
                    <div className="roi-breakdown-row-value">{fmt(results.adminSavings)}</div>
                  </div>
                  <div className="roi-breakdown-row">
                    <div className="roi-breakdown-row-label">
                      <span className="roi-breakdown-dot amber" />
                      Compliance risk avoided
                    </div>
                    <div className="roi-breakdown-bar-track">
                      <div
                        className="roi-breakdown-bar-fill amber"
                        style={{ width: `${(results.complianceSavings / results.totalCurrentCost) * 100}%` }}
                      />
                    </div>
                    <div className="roi-breakdown-row-value">{fmt(results.complianceSavings)}</div>
                  </div>
                  <div className="roi-breakdown-row total">
                    <div className="roi-breakdown-row-label">
                      <span className="roi-breakdown-dot ink" />
                      HiFive AI annual cost
                    </div>
                    <div className="roi-breakdown-bar-track">
                      <div
                        className="roi-breakdown-bar-fill ink"
                        style={{ width: `${(results.hifiveAnnualCost / results.totalCurrentCost) * 100}%` }}
                      />
                    </div>
                    <div className="roi-breakdown-row-value negative">−{fmt(results.hifiveAnnualCost)}</div>
                  </div>
                </div>
              </div>

              <div className="roi-step-actions">
                <button type="button" className="btn btn-outline" onClick={reset}>
                  <RefreshCw size={14} />
                  Recalculate
                </button>
                <a
                  href="https://cal.com/hifiveai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                >
                  Get a Custom TCO Analysis
                  <ArrowRight size={16} />
                </a>
              </div>

              <p className="roi-disclaimer">
                Estimates use 2024 Gartner / Deloitte mid-market benchmarks. Actual savings vary by
                entity complexity, region, and existing contract terms. Schedule a demo for a
                precise TCO analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
