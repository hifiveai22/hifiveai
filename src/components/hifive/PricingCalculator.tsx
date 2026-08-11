'use client';
import './PricingCalculator.css';
import { useState, useEffect, useCallback } from 'react';

const PER_EMPLOYEE_COST = 800;
const COUNTRY_MULT_FACTOR = 0.15;
const TOOL_COST = 15000;
const HI_BASE_COST = 24000;
const HI_PER_EMPLOYEE = 240;

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const end = value;
    const duration = 500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatted = display.toLocaleString('en-US');
  return <>{prefix}{formatted}{suffix}</>;
}

export default function PricingCalculator() {
  const [employees, setEmployees] = useState(100);
  const [countries, setCountries] = useState(3);
  const [tools, setTools] = useState(5);
  const [industry, setIndustry] = useState('tech');

  const calculateCosts = useCallback(() => {
    const countryMultiplier = 1 + (countries - 1) * COUNTRY_MULT_FACTOR;
    const currentCost = Math.round(
      employees * PER_EMPLOYEE_COST * countryMultiplier + TOOL_COST * tools
    );
    const hiSurcharge = countries > 5 ? 1.1 : 1.0;
    const hiFiveCost = Math.round(
      (HI_BASE_COST + employees * HI_PER_EMPLOYEE) * hiSurcharge
    );
    const savings = currentCost - hiFiveCost;
    const savingsPct = Math.round((savings / currentCost) * 100);

    return { currentCost, hiFiveCost, savings, savingsPct };
  }, [employees, countries, tools]);

  const { currentCost, hiFiveCost, savings, savingsPct } = calculateCosts();

  const maxCost = Math.max(currentCost, 1);

  return (
    <section className="pricing-calc-section">
      <div className="pricing-calc-inner">
        <div className="pricing-calc-header">
          <div className="eyebrow reveal">TCO Estimator</div>
          <h2 className="reveal d1">Estimate your savings.<br /><em>See the difference.</em></h2>
          <p className="reveal d2">Adjust the sliders to reflect your organization. See how much you could save by consolidating your people stack into one AI-native system.</p>
        </div>

        <div className="pricing-calc-grid">
          {/* Sliders Panel */}
          <div className="pricing-calc-sliders">
            <div className="calc-slider-group">
              <div className="calc-slider-label">
                <span>Number of Employees</span>
                <span className="calc-slider-value">{employees}</span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="calc-slider"
                aria-label="Number of Employees"
              />
              <div className="calc-slider-range">
                <span>10</span>
                <span>500</span>
              </div>
            </div>

            <div className="calc-slider-group">
              <div className="calc-slider-label">
                <span>Number of Countries</span>
                <span className="calc-slider-value">{countries}</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={1}
                value={countries}
                onChange={(e) => setCountries(Number(e.target.value))}
                className="calc-slider"
                aria-label="Number of Countries"
              />
              <div className="calc-slider-range">
                <span>1</span>
                <span>15</span>
              </div>
            </div>

            <div className="calc-slider-group">
              <div className="calc-slider-label">
                <span>Current Tool Count</span>
                <span className="calc-slider-value">{tools}</span>
              </div>
              <input
                type="range"
                min={3}
                max={12}
                step={1}
                value={tools}
                onChange={(e) => setTools(Number(e.target.value))}
                className="calc-slider"
                aria-label="Current Tool Count"
              />
              <div className="calc-slider-range">
                <span>3</span>
                <span>12</span>
              </div>
            </div>

            <div className="calc-slider-group">
              <div className="calc-slider-label">
                <span>Industry</span>
              </div>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="calc-select"
                aria-label="Industry"
              >
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Results Panel */}
          <div className="pricing-calc-results">
            <div className="calc-results-card">
              <div className="calc-savings-badge">
                <span className="calc-savings-pct">
                  <AnimatedNumber value={savingsPct} suffix="%" />
                </span>
                <span className="calc-savings-label">Estimated Savings</span>
              </div>

              <div className="calc-comparison">
                <div className="calc-cost-row">
                  <div className="calc-cost-label">
                    <span className="calc-cost-dot current" />
                    Current Stack
                  </div>
                  <div className="calc-cost-amount">
                    $<AnimatedNumber value={currentCost} />
                  </div>
                  <div className="calc-bar-track">
                    <div
                      className="calc-bar-fill current"
                      style={{ width: `${(currentCost / maxCost) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="calc-cost-row">
                  <div className="calc-cost-label">
                    <span className="calc-cost-dot hifive" />
                    HiFive AI
                  </div>
                  <div className="calc-cost-amount hifive">
                    $<AnimatedNumber value={hiFiveCost} />
                  </div>
                  <div className="calc-bar-track">
                    <div
                      className="calc-bar-fill hifive"
                      style={{ width: `${(hiFiveCost / maxCost) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="calc-savings-row">
                <span className="calc-savings-title">Annual Savings</span>
                <span className="calc-savings-amount">
                  $<AnimatedNumber value={savings} />
                </span>
              </div>

              <a
                href="https://cal.com/hifiveai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold btn-lg calc-cta"
              >
                Get Exact Quote →
              </a>

              <p className="calc-disclaimer">
                Estimates based on typical mid-market pricing. Actual costs vary by region, entity complexity, and feature scope.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
