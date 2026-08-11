'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import {
  Shield,
  Lock,
  FileCheck,
  Globe,
  Key,
  Eye,
  Award,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface Certification {
  name: string;
  fullName: string;
  status: 'certified' | 'in-progress' | 'planned';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  issuedBy: string;
  lastAudit: string;
}

const certifications: Certification[] = [
  {
    name: 'SOC 2 Type II',
    fullName: 'Service Organization Control 2',
    status: 'certified',
    icon: Shield,
    description: 'All five Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy. Annually re-audited by Big Four firm.',
    issuedBy: 'Deloitte',
    lastAudit: 'March 2025',
  },
  {
    name: 'ISO 27001',
    fullName: 'Information Security Management',
    status: 'certified',
    icon: Lock,
    description: 'International standard for establishing, implementing, maintaining, and continually improving an information security management system (ISMS).',
    issuedBy: 'BSI Group',
    lastAudit: 'January 2025',
  },
  {
    name: 'GDPR',
    fullName: 'General Data Protection Regulation',
    status: 'certified',
    icon: Globe,
    description: 'Full compliance with EU GDPR including data subject rights, breach notification within 72 hours, and Data Processing Agreements with every sub-processor.',
    issuedBy: 'Self-certified + external DPO',
    lastAudit: 'Continuous',
  },
  {
    name: 'CCPA',
    fullName: 'California Consumer Privacy Act',
    status: 'certified',
    icon: FileCheck,
    description: 'Compliance with California Consumer Privacy Act, including right to know, right to delete, and right to opt-out of sale of personal information.',
    issuedBy: 'Self-certified',
    lastAudit: 'Continuous',
  },
  {
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    status: 'in-progress',
    icon: Key,
    description: 'Available for healthcare customers. Business Associate Agreements (BAAs) signed per customer. PHI isolated in dedicated infrastructure.',
    issuedBy: 'Compliancy Group',
    lastAudit: 'Q3 2025',
  },
  {
    name: 'FedRAMP',
    fullName: 'Federal Risk and Authorization Management Program',
    status: 'planned',
    icon: Award,
    description: 'Pursuing FedRAMP Moderate authorization for U.S. federal agency customers. Targeted authorization date: Q2 2026.',
    issuedBy: 'Planned - 3PAO TBD',
    lastAudit: 'Q2 2026 (target)',
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: 'Encryption everywhere',
    desc: 'AES-256 at rest, TLS 1.3 in transit. Customer-managed encryption keys (CMEK) available on Enterprise tier. Key rotation every 90 days.',
  },
  {
    icon: Key,
    title: 'SSO & SCIM provisioning',
    desc: 'SAML 2.0, OIDC, Google Workspace, Microsoft Entra ID, Okta. Automated user provisioning and de-provisioning via SCIM 2.0. SSO required for all admins.',
  },
  {
    icon: Eye,
    title: 'Row-level security',
    desc: 'Permissions enforced at the database layer using row-level security policies - not application-level filtering. Impossible to bypass via API or direct query.',
  },
  {
    icon: FileCheck,
    title: 'Immutable audit logs',
    desc: 'Every read, write, and approval logged with timestamp, actor, and cryptographic signature. WORM (Write Once Read Many) storage on Enterprise. 7-year retention standard.',
  },
  {
    icon: Shield,
    title: 'Penetration testing',
    desc: 'Annual third-party penetration tests by Bishop Fox. Bug bounty program with HackerOne (critical: $25K, high: $10K, medium: $2.5K).',
  },
  {
    icon: Globe,
    title: 'Data residency',
    desc: 'EU-only data centers for EU customers. US-only data centers for US customers. No cross-border data transfer without explicit customer consent and SCCs.',
  },
];

export default function SecurityCompliance() {
  useReveal();
  const [expandedCert, setExpandedCert] = useState<string | null>(null);

  return (
    <section className="security-section" id="security">
      <div className="security-inner">
        <div className="security-header">
          <div className="eyebrow reveal">Security &amp; Compliance</div>
          <h2 className="reveal d1">
            Enterprise-grade trust.<br /><em>Built into the architecture.</em>
          </h2>
          <p className="reveal d2">
            Security is not a feature added at the end. It is a constraint that
            governs every architectural decision - from row-level database permissions
            to immutable audit logs to cryptographic source of truth.
          </p>
        </div>

        {/* Certifications grid */}
        <div className="security-certs-grid stagger">
          {certifications.map((cert) => {
            const Icon = cert.icon;
            const isExpanded = expandedCert === cert.name;
            return (
              <div
                key={cert.name}
                className={`security-cert-card ${cert.status} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setExpandedCert(isExpanded ? null : cert.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedCert(isExpanded ? null : cert.name);
                  }
                }}
                aria-expanded={isExpanded}
              >
                <div className="security-cert-header">
                  <div className="security-cert-icon">
                    <Icon size={20} />
                  </div>
                  <div className="security-cert-info">
                    <div className="security-cert-name">{cert.name}</div>
                    <div className="security-cert-full">{cert.fullName}</div>
                  </div>
                  <div className={`security-cert-status ${cert.status}`}>
                    {cert.status === 'certified' && <CheckCircle2 size={12} />}
                    {cert.status === 'certified' ? 'Certified' : cert.status === 'in-progress' ? 'In Progress' : 'Planned'}
                  </div>
                </div>
                <div className="security-cert-expand">
                  <ChevronDown size={14} />
                </div>
                <div className="security-cert-detail">
                  <p>{cert.description}</p>
                  <div className="security-cert-meta">
                    <span><strong>Issued by:</strong> {cert.issuedBy}</span>
                    <span><strong>Last audit:</strong> {cert.lastAudit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security features */}
        <div className="security-features-header reveal">
          <h3>Built-in security controls</h3>
          <p>Six layers of defense, every one enabled by default on every plan.</p>
        </div>

        <div className="security-features-grid stagger">
          {securityFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="security-feature-card">
                <div className="security-feature-icon">
                  <Icon size={18} />
                </div>
                <div className="security-feature-title">{feat.title}</div>
                <div className="security-feature-desc">{feat.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Trust footer */}
        <div className="security-trust-footer reveal d2">
          <div className="security-trust-stat">
            <div className="security-trust-stat-value">0</div>
            <div className="security-trust-stat-label">Security incidents</div>
            <div className="security-trust-stat-sub">Since founding, 2023</div>
          </div>
          <div className="security-trust-stat">
            <div className="security-trust-stat-value">99.99%</div>
            <div className="security-trust-stat-label">Uptime SLA</div>
            <div className="security-trust-stat-sub">Last 12 months</div>
          </div>
          <div className="security-trust-stat">
            <div className="security-trust-stat-value">&lt; 4h</div>
            <div className="security-trust-stat-label">Incident response</div>
            <div className="security-trust-stat-sub">P1 severity, 24/7</div>
          </div>
          <div className="security-trust-stat">
            <div className="security-trust-stat-value">256-bit</div>
            <div className="security-trust-stat-label">Encryption strength</div>
            <div className="security-trust-stat-sub">AES at rest, TLS in transit</div>
          </div>
        </div>
      </div>
    </section>
  );
}
