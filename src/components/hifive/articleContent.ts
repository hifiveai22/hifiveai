import { ArticleContent } from './ArticleReaderModal';
import { articlesBatch1 } from './articleBatch1';
import { articlesBatch2 } from './articleContentBatch2';

// Re-export GlossaryTerm for convenience
export type { GlossaryTerm } from './ArticleReaderModal';

const baseArticles: Record<string, ArticleContent> = {
  'hr-stack-cost': {
    id: 'hr-stack-cost',
    category: 'Blog',
    title: 'Why Your HR Stack Is Costing You 40% More Than You Think',
    description:
      "Most mid-market companies spend $120K–$180K on fragmented people tools. Here's how to calculate your true TCO - and what to do about it.",
    readTime: '8 min read',
    author: 'Maya Chen',
    authorRole: 'Head of Product, HiFive AI',
    publishDate: 'June 12, 2025',
    heroGradient:
      'linear-gradient(135deg, #18140F 0%, #28231A 50%, #B07D2E 120%)',
      image: '/articles/hr-stack-cost.png',
    sections: [
      {
        heading: 'The hidden tax of fragmentation',
        body: [
          'When finance teams audit their people-stack spend, they typically sum line items: $12K for the ATS, $8K for HRIS, $15K for payroll, $6K for engagement, $4K for e-signature. The total - $45K - feels manageable. It is not the real number.',
          'The real number includes the cost of reconciliation: the operations analyst who spends 6 hours every Monday syncing headcount between systems; the HRIS admin who manually re-keys compensation changes from the ATS into payroll; the finance team that cannot close monthly books until three different systems agree on headcount.',
          'Across our customer base of 240+ mid-market companies, we measured this reconciliation tax at an additional 38–46% on top of license spend. The median 150-employee company spends $145K in licenses and $61K in hidden reconciliation cost - a true TCO of $206K per year.',
        ],
      },
      {
        heading: 'How to calculate your true TCO',
        body: [
          'Audit your stack in three categories. First, direct license cost: sum every recurring invoice tagged to HR, payroll, IT provisioning, and people analytics. Second, integration cost: count the engineer-hours spent maintaining sync pipelines, API connectors, and custom middleware. Third, opportunity cost: estimate the decisions delayed because data was fragmented.',
          'Most companies undercount the third category. When a CFO cannot answer "what is our fully loaded cost per employee by entity?" inside 30 seconds, that is not a missing report - it is a structural failure of the stack. Decisions delayed by 30 days compound into hiring delays, budget overruns, and missed quarterly targets.',
          'A simple heuristic: take your license spend, multiply by 1.4. That is your true TCO within ±8%. If your CFO disputes the number, ask them to estimate the cost of one delayed quarterly hiring plan. They will quickly agree.',
        ],
      },
      {
        heading: 'The consolidation math',
        body: [
          'When you consolidate to a single AI-native platform, three things happen simultaneously. License spend drops 60–70% because you are no longer paying for overlapping features. Integration cost drops to near-zero because there is nothing to integrate. Opportunity cost drops because cross-functional answers take seconds, not days.',
          'The typical HiFive AI customer reduces their TCO from $206K to $62K - a 70% reduction. Of that $144K in annual savings, approximately $96K comes from license consolidation and $48K comes from recovered admin time.',
          'Critically, the savings compound. Year 2 adds another 8% because the platform continues to absorb workflows that were previously handled by humans. Year 3 adds another 5% as the AI layer becomes more accurate on your specific data.',
        ],
      },
      {
        heading: 'What to do this quarter',
        body: [
          'Run the audit above. Present the true TCO number to your CFO. Then book a 30-minute TCO analysis with our team - we will pressure-test your math against 240+ comparable companies and tell you whether consolidation makes sense for your specific entity complexity.',
          'If the answer is yes, the typical implementation takes 6 weeks from contract to go-live. We migrate data, configure SSO, and train managers. Your team stops reconciling and starts deciding.',
        ],
      },
    ],
    keyTakeaways: [
      'True TCO = license spend × 1.4 (includes reconciliation and opportunity cost)',
      'Mid-market median: $145K licenses + $61K hidden = $206K true TCO',
      'Consolidation to one platform reduces TCO by 60–70% in year 1',
      'Savings compound 8% in year 2 and 5% in year 3 as AI improves',
      'Typical implementation: 6 weeks from contract to go-live',
    ],
    glossaryTerms: [
      { term: 'TCO', definition: 'Total Cost of Ownership. The full cost of a system including licenses, integration, reconciliation labor, and opportunity cost.', extended: 'In HR tech, TCO typically runs 1.4× license spend due to hidden reconciliation and integration costs.' },
      { term: 'HRIS', definition: 'Human Resource Information System. Software that manages employee data, benefits, and compliance records.' },
      { term: 'ATS', definition: 'Applicant Tracking System. Software used to manage recruiting pipelines, from job posting to offer acceptance.' },
      { term: 'SSO', definition: 'Single Sign-On. An authentication method that lets users access multiple applications with one set of credentials.' },
      { term: 'EOR', definition: 'Employer of Record. A legal entity that employs staff on behalf of another company in countries where the company has no subsidiary.' },
    ],
    nextArticle: { id: 'novapay-case', title: 'How NovaPay Replaced 5 Tools and Saved $120K/Year' },
  },

  'eor-guide': {
    id: 'eor-guide',
    category: 'Guide',
    title: 'The Complete Guide to Global EOR in 2025',
    description:
      'Employer of Record is the fastest-growing compliance model for distributed teams. This guide covers every jurisdiction, risk, and cost factor.',
    readTime: '15 min read',
    author: 'David Okonkwo',
    authorRole: 'Head of Compliance, HiFive AI',
    publishDate: 'May 28, 2025',
    heroGradient:
      'linear-gradient(135deg, #0F1A14 0%, #1A2820 50%, #22C55E 120%)',
      image: '/articles/eor-guide.png',
    sections: [
      {
        heading: 'What is an Employer of Record?',
        body: [
          'An Employer of Record (EOR) is a legal entity that employs staff on behalf of another company. The EOR handles local payroll, taxes, benefits, and compliance; the client company directs the work and retains operational control.',
          'EOR became mainstream in 2020–2022 as distributed hiring accelerated. By 2025, the global EOR market exceeds $6.2B and is projected to grow 18% annually through 2030, driven by remote-first hiring and cross-border M&A.',
          'The core value proposition: hire anywhere in 4–6 weeks without setting up a local entity. The core risk: misclassification, permanent establishment exposure, and benefits parity disputes.',
        ],
      },
      {
        heading: 'EOR vs. PEO vs. subsidiary: choosing the right model',
        body: [
          'Professional Employer Organization (PEO) is a co-employment model primarily used in the United States. The PEO shares employment liability with the client. EOR is a single-employer model used internationally. Subsidiary is full local incorporation.',
          'Choose EOR when you have 1–15 employees in a country and uncertain long-term commitment. Choose subsidiary when headcount exceeds 25 and you plan to stay 5+ years. Between 15 and 25, the decision depends on tax exposure, IP ownership, and data residency requirements.',
          'A common mistake: companies use EOR in a country for 3+ years, accumulate 30+ employees, and then face a painful migration to subsidiary status because the EOR contract lacks portability. HiFive AI includes both EOR and subsidiary management in one platform, with a one-click migration path.',
        ],
      },
      {
        heading: 'Jurisdiction deep-dive: the 12 highest-risk countries',
        body: [
          'Germany: works council co-determination requires 4–6 weeks of consultation before hiring. France: strict 35-hour work week and profit-sharing (participation) mandates add 8–12% to fully loaded cost. Brazil: 13th-month salary, vacation premium, and FGTS contributions add 41% to base salary.',
          'India: PF, gratuity, and professional tax vary by state; misclassification risk is high for contractors. China: social insurance is mandatory and varies by city; foreign employee quotas apply. Japan: employment insurance and workers\' compensation require local enrollment within 10 days.',
          'UAE: new labor law (2022) introduced end-of-service gratuity funds. Saudi Arabia: Saudization quotas require minimum local hiring ratios. Singapore: EP pass salary thresholds increased to SGD 5,600 in 2025. Australia: Fair Work Act changes require written casual conversion offers.',
          'The UK, Ireland, and Canada remain relatively straightforward. The EU requires careful attention to GDPR data residency - employee data must be processed within EU boundaries unless adequate safeguards (SCCs) are in place.',
        ],
      },
      {
        heading: 'Cost structure: what you actually pay',
        body: [
          'EOR pricing typically follows one of three models: flat per-employee-per-month fee ($400–$650), percentage of payroll (8–15%), or a hybrid. The flat-fee model is most predictable; the percentage model scales poorly at high compensation.',
          'Hidden costs include: benefits markups (EORs typically charge a 12–18% markup on health insurance and pension contributions), currency conversion fees (1.5–3% on every payroll run), and termination/severance administration (often billed separately at $500–$1,500 per event).',
          'A $150K/year engineer hired via EOR in Germany costs the company approximately $11,400 in EOR fees plus $18,200 in benefits markups - a true annual cost of $179,600, not $150,000. Always calculate fully loaded, never base salary.',
        ],
      },
      {
        heading: 'Compliance checklist before you sign',
        body: [
          'Verify the EOR holds valid licenses in every country where you will use them. Confirm IP assignment language in the employment contract (this is the #1 source of post-termination disputes). Require monthly compliance reports including tax filings, social contributions, and benefit enrollments.',
          'Audit data residency: employee PII must be processed and stored within the country or region required by local law. For EU employees, this means EU-only data centers with SCCs in place. For China, data must be stored on Chinese-located servers.',
          'Finally, negotiate a portability clause: if you migrate to a subsidiary or switch EORs, employee contracts must transfer seamlessly without termination and rehire. Without this clause, a migration can take 6–12 months and trigger severance obligations.',
        ],
      },
    ],
    keyTakeaways: [
      'EOR is optimal for 1–15 employees per country; subsidiary for 25+',
      'Always calculate fully loaded cost (benefits + fees + FX) - typically 18–25% over base',
      'Top 12 highest-risk countries require country-specific compliance expertise',
      'Negotiate portability, IP assignment, and data residency clauses upfront',
      'HiFive AI includes EOR + subsidiary + migration in one platform',
    ],
    glossaryTerms: [
      { term: 'EOR', definition: 'Employer of Record. A legal entity that employs staff on behalf of another company in countries where the company has no subsidiary.', extended: 'EOR is optimal for 1–15 employees per country. Beyond 25 employees, a subsidiary is usually more cost-effective.' },
      { term: 'PEO', definition: 'Professional Employer Organization. A co-employment model primarily used in the United States where the PEO shares employment liability with the client.' },
      { term: 'GDPR', definition: 'General Data Protection Regulation. EU law requiring data protection by design and by default, including restrictions on cross-border data transfers.', extended: 'Employee PII must be processed within EU boundaries unless adequate safeguards (SCCs) are in place.' },
      { term: 'SCIM', definition: 'System for Cross-domain Identity Management. Automated user provisioning and de-provisioning protocol.' },
      { term: 'SCCs', definition: 'Standard Contractual Clauses. Legal mechanisms allowing transfer of personal data from the EU to countries without adequate data protection laws.' },
    ],
    prevArticle: { id: 'hr-stack-cost', title: 'Why Your HR Stack Is Costing You 40% More Than You Think' },
    nextArticle: { id: 'novapay-case', title: 'How NovaPay Replaced 5 Tools and Saved $120K/Year' },
  },

  'novapay-case': {
    id: 'novapay-case',
    category: 'Case Study',
    title: 'How NovaPay Replaced 5 Tools and Saved $120K/Year',
    description:
      "A fintech startup's journey from Greenhouse + BambooHR + Deel + Lattice + Okta to a single AI-native platform.",
    readTime: '6 min read',
    author: 'Priya Ramaswamy',
    authorRole: 'Customer Success Lead, HiFive AI',
    publishDate: 'May 14, 2025',
    heroGradient:
      'linear-gradient(135deg, #1A1410 0%, #2A2018 50%, #C99140 120%)',
      image: '/articles/novapay-case.png',
    sections: [
      {
        heading: 'The starting point: a 142-person fintech with 5 disconnected tools',
        body: [
          'NovaPay is a Series B fintech based in San Francisco with 142 employees across 4 countries (US, UK, India, Singapore). In early 2024, their people stack consisted of: Greenhouse ($12K/yr) for recruiting, BambooHR ($8K/yr) for HRIS, Deel ($15K/yr) for international payroll, Lattice ($6K/yr) for performance, and Okta ($6K/yr) for identity.',
          'Total license spend: $47K/year. Reasonable, on the surface. But CFO Ravi Menon noticed that headcount in Greenhouse never matched headcount in BambooHR, which never matched headcount in Deel. Every Monday, an operations analyst spent 6 hours reconciling the three systems. Every quarterly board meeting required 3 extra days of prep to produce a single accurate headcount number.',
          'The breaking point came in March 2024 when an audit revealed that 3 employees in the UK had been paid through the wrong entity for 4 months - a £42K compliance exposure that took 11 weeks to unwind. NovaPay\'s board demanded consolidation within 2 quarters.',
        ],
      },
      {
        heading: 'The evaluation: 4 platforms, 8 weeks',
        body: [
          'NovaPay\'s procurement team evaluated 4 platforms against 38 criteria: Rippling, Deel HR, Workday Peakon, and HiFive AI. The criteria were grouped into 4 categories: consolidation breadth (does it replace all 5 tools?), cross-module intelligence (does data flow between recruiting, payroll, and performance?), global compliance (does it handle UK, India, and Singapore natively?), and total cost of ownership over 3 years.',
          'Rippling scored well on consolidation but required 3 separate modules (HR, Payroll, IT) and did not include recruiting. Deel HR was strong internationally but weak on performance management. Workday was enterprise-grade but would have required a 14-month implementation and a full-time admin.',
          'HiFive AI scored highest on consolidation breadth (all 5 use cases in one platform) and cross-module intelligence (the Ask AI feature could answer questions like "show me all UK employees hired in the last 6 months and their onboarding completion rate"). TCO over 3 years was 64% lower than the next-best option.',
        ],
      },
      {
        heading: 'The migration: 5 weeks, zero downtime',
        body: [
          'Implementation began on April 15, 2024. Week 1: data migration from BambooHR (employee records, compensation history, performance reviews). Week 2: payroll configuration for US, UK, India, Singapore. Week 3: SSO setup via Okta, deprovisioning of legacy tools. Week 4: manager training on the new dashboard and Ask AI. Week 5: parallel payroll run for validation, then full cutover.',
          'Critically, NovaPay ran both systems in parallel for one full payroll cycle. This caught a currency conversion rounding error in the Singapore payroll that would have underpaid 7 employees by $12 each. The error was fixed before go-live; no employees were affected.',
          'Total implementation cost: $24,000 (one-time). Total internal time investment: 142 hours across HR, finance, and IT - significantly less than the 600+ hours Workday would have required.',
        ],
      },
      {
        heading: 'The results: $120K saved, 32 hours recovered weekly',
        body: [
          'Twelve months after go-live, NovaPay\'s numbers tell the story. License spend dropped from $47K to $36K (HiFive AI Growth tier). Reconciliation time dropped from 6 hours/week to 0 - the system maintains a single source of truth. Board prep time dropped from 3 days to 4 hours.',
          'The compliance exposure that triggered the project? Zero incidents in the past 9 months. UK payroll runs through the correct entity every cycle, automatically. The Ask AI feature has answered 1,247 cross-functional questions for managers - questions that previously would have required email threads, spreadsheet exports, and 2–3 day waits.',
          'Total annual savings: $120,400 ($11K license + $61K reconciliation labor + $48K opportunity cost). Payback period: 2.4 months. Three-year projected savings: $385,000.',
        ],
      },
      {
        heading: 'What Ravi would do differently',
        body: [
          '"If I could redo the evaluation, I would have asked harder questions about cross-module intelligence from day one," says Ravi. "We spent 3 weeks evaluating recruiting features in isolation. We should have started by asking: can the system tell me, in one query, the fully loaded cost of every employee hired in the last 18 months? That question would have eliminated 3 of the 4 vendors immediately."',
          '"The second thing: negotiate the migration cost upfront. HiFive AI included migration in the contract, but other vendors were quoting $40–$80K for the same scope. That should have been a day-one filter, not a week-6 surprise."',
          'NovaPay is now expanding to 220 employees and adding Japan and Australia. The HiFive AI platform scales with them - no new modules, no new contracts, no new integrations.',
        ],
      },
    ],
    keyTakeaways: [
      'Replaced 5 tools (Greenhouse, BambooHR, Deel, Lattice, Okta) with one platform',
      'Saved $120K/year (24% license + 51% reconciliation labor + 25% opportunity cost)',
      'Implementation: 5 weeks, $24K one-time, 142 internal hours',
      'Payback period: 2.4 months; 3-year projected savings: $385K',
      'Zero compliance incidents in 9 months vs. £42K exposure pre-migration',
    ],
    glossaryTerms: [
      { term: 'HRIS', definition: 'Human Resource Information System. Software that manages employee data, benefits, and compliance records.' },
      { term: 'SSO', definition: 'Single Sign-On. An authentication method that lets users access multiple applications with one set of credentials.' },
      { term: 'EOR', definition: 'Employer of Record. A legal entity that employs staff on behalf of another company in countries where the company has no subsidiary.' },
      { term: 'TCO', definition: 'Total Cost of Ownership. The full cost of a system including licenses, integration, reconciliation labor, and opportunity cost.' },
      { term: 'ATS', definition: 'Applicant Tracking System. Software used to manage recruiting pipelines, from job posting to offer acceptance.' },
    ],
    prevArticle: { id: 'eor-guide', title: 'The Complete Guide to Global EOR in 2025' },
    nextArticle: { id: 'ask-ai-vs-chatgpt', title: 'Ask AI vs. ChatGPT: Why Context Matters More Than Conversational Ability' },
  },

  'ask-ai-vs-chatgpt': {
    id: 'ask-ai-vs-chatgpt',
    category: 'Blog',
    title: 'Ask AI vs. ChatGPT: Why Context Matters More Than Conversational Ability',
    description:
      "General-purpose AI chatbots can't reason across your payroll, talent, and operations data. Here's why architecture matters more than model size.",
    readTime: '10 min read',
    author: 'Dr. Aisha Bello',
    authorRole: 'Head of AI Research, HiFive AI',
    publishDate: 'April 30, 2025',
    heroGradient:
      'linear-gradient(135deg, #14101A 0%, #201828 50%, #8B5CF6 120%)',
      image: '/articles/ask-ai-vs-chatgpt.png',
    sections: [
      {
        heading: 'The fundamental difference: reasoning vs. conversation',
        body: [
          'ChatGPT is a conversational interface to a large language model. It excels at generating text, answering general questions, and brainstorming. It cannot, however, reason across your specific business data - because it does not have access to your specific business data.',
          'Ask AI is a reasoning engine built on top of your data fabric. When a CHRO asks "which of my Senior Engineers are paid below the 40th percentile for their band, controlling for tenure?", Ask AI does not generate a plausible-sounding answer. It queries your compensation table, joins it with your tenure data, applies the percentile calculation, and returns the exact list - with the underlying records linked.',
          'This distinction - reasoning vs. conversation - is the difference between a tool that produces content and a tool that produces decisions. Most enterprise AI projects fail because they conflate the two.',
        ],
      },
      {
        heading: 'Why fine-tuning is not the answer',
        body: [
          'A common misconception: "We will fine-tune ChatGPT on our HR data and get the same result." This does not work, for three reasons.',
          'First, fine-tuning teaches a model style and vocabulary, not facts. A fine-tuned model will sound more like your company, but it will still hallucinate specific employee records, compensation numbers, and compliance dates. Fine-tuning cannot teach a model that Employee #4321 was hired on March 14, 2023 at $145,000 base + 12% bonus - those facts must be retrieved at query time.',
          'Second, fine-tuning is static. Your headcount changes daily. A model fine-tuned on last month\'s data is already stale. Reasoning engines query live data; fine-tuned models cannot.',
          'Third, fine-tuning cannot enforce row-level permissions. A CFO and a people manager asking the same question should get different answers based on their access level. Fine-tuned models have no concept of permissions; reasoning engines enforce them at every query.',
        ],
      },
      {
        heading: 'The architecture of a reasoning engine',
        body: [
          'A production reasoning engine has four layers. The semantic layer translates natural language into structured queries (SQL, API calls, or graph traversals). The data fabric holds the actual records - employees, compensation, performance, compliance - in a single, cryptographic source of truth.',
          'The reasoning layer orchestrates multi-step logic: "find senior engineers below 40th percentile" requires joining compensation, tenure, role-level, and benchmark data. The reasoning layer breaks this into 4–6 sub-queries, executes them in order, and synthesizes the result. The presentation layer returns the answer with citations - every number links to the underlying record.',
          'ChatGPT has none of these layers. It is a single model that predicts the next token. Architecture, not model size, determines whether AI can support business decisions.',
        ],
      },
      {
        heading: 'Measuring the difference: a controlled experiment',
        body: [
          'In Q1 2025, we ran a controlled experiment with 12 mid-market companies. Each company\'s CHRO submitted the same 25 questions to both ChatGPT Enterprise (with their HR data uploaded as documents) and Ask AI (connected to their live data fabric).',
          'Results: ChatGPT produced plausible-sounding answers to 23 of 25 questions. Of those 23, 19 contained at least one factual error (wrong headcount, wrong compensation number, wrong date). Ask AI produced correct answers to 24 of 25 questions; the 1 miss was a question requiring external benchmark data we did not have.',
          'More importantly: ChatGPT could not provide citations. When the CHRO asked "where does that number come from?", ChatGPT could only rephrase. Ask AI linked every number to the underlying employee record, payroll entry, or compliance filing - auditable in one click.',
          'The CHROs\' feedback was unanimous: "ChatGPT is a writing assistant. Ask AI is a decision support system. They are not the same product."',
        ],
      },
      {
        heading: 'When to use which',
        body: [
          'Use ChatGPT (or any general-purpose LLM) for: drafting job descriptions, generating interview questions, summarizing meeting notes, brainstorming performance review language, writing HR policy drafts. These are content tasks where plausibility matters more than precision.',
          'Use Ask AI for: compensation audits, headcount planning, compliance gap analysis, flight-risk scoring, pay equity reviews, budget forecasting, cross-functional KPI queries. These are decision tasks where precision, citations, and permissions matter.',
          'A useful heuristic: if the answer will be used to make a decision worth more than $10,000, use a reasoning engine. If the answer will be used to communicate or draft, a conversational model is fine.',
        ],
      },
    ],
    keyTakeaways: [
      'ChatGPT generates text; Ask AI reasons across live business data',
      'Fine-tuning cannot teach facts, handle live changes, or enforce permissions',
      'Reasoning engines have 4 layers: semantic, data fabric, reasoning, presentation',
      'Controlled experiment: ChatGPT 19/23 errors, Ask AI 1/25 errors on identical questions',
      'Use LLMs for content; use reasoning engines for decisions > $10K',
    ],
    glossaryTerms: [
      { term: 'Reasoning Engine', definition: 'Translates natural language into multi-table queries, executes them, and synthesizes an auditable answer with citations.', extended: 'Unlike conversational AI, a reasoning engine queries live business data and enforces row-level permissions at every query.' },
      { term: 'Data Fabric', definition: 'A unified data architecture that holds employee, compensation, performance, and compliance records in a single source of truth.' },
      { term: 'LLM', definition: 'Large Language Model. An AI model trained on vast text data to generate human-like responses. Lacks access to live business data.' },
      { term: 'Fine-Tuning', definition: 'The process of further training a pre-trained model on domain-specific data. Teaches style and vocabulary, not facts.' },
      { term: 'HRIS', definition: 'Human Resource Information System. Software that manages employee data, benefits, and compliance records.' },
    ],
    prevArticle: { id: 'novapay-case', title: 'How NovaPay Replaced 5 Tools and Saved $120K/Year' },
    nextArticle: { id: 'crypto-truth', title: 'The Cryptographic Source of Truth: Building Trust in People Data' },
  },

  'crypto-truth': {
    id: 'crypto-truth',
    category: 'Whitepaper',
    title: 'The Cryptographic Source of Truth: Building Trust in People Data',
    description:
      'How HiFive AI ensures that headcount in Talent always matches headcount in Finance - through a single, immutable data architecture.',
    readTime: '12 min read',
    author: 'Marcus Holst',
    authorRole: 'Chief Architect, HiFive AI',
    publishDate: 'April 8, 2025',
    heroGradient:
      'linear-gradient(135deg, #10141A 0%, #18202A 50%, #2563EB 120%)',
      image: '/articles/crypto-truth.png',
    sections: [
      {
        heading: 'The problem with distributed people data',
        body: [
          'In every mid-market company, headcount exists in at least 3 places: the ATS (recruiting pipeline), the HRIS (active employees), and payroll (compensation records). Each system was designed independently, each maintains its own copy of "headcount", and each is wrong in a different way.',
          'The ATS counts candidates who have signed offers but not yet started. The HRIS counts active employees but lags terminations by 1–7 days. Payroll counts employees who received a paycheck last cycle, which includes some who have already given notice and excludes new hires not yet in payroll.',
          'When the CFO asks "what is our headcount?", the answer depends on which system they query. This is not a minor inconvenience. It is a structural failure that causes budget errors, compliance gaps, and strategic decisions made on wrong numbers.',
        ],
      },
      {
        heading: 'The cryptographic principle',
        body: [
          'HiFive AI enforces a single rule: there can be only one source of truth for any piece of data. Headcount, compensation, and employment status each have exactly one authoritative record. Every other system is a downstream consumer - never an independent authority.',
          'We enforce this cryptographically. Every authoritative record is signed with a content hash. When a downstream system (a dashboard, a report, an API response) displays a number, it must include the hash of the underlying record. If the hash does not match, the system refuses to display the number.',
          'This means: a dashboard cannot show "headcount: 142" unless there are exactly 142 signed employee records backing that number. If someone manually edits the dashboard, the hash fails and the number disappears. The system makes wrong numbers impossible to display.',
        ],
      },
      {
        heading: 'Append-only event log',
        body: [
          'Underneath the authoritative records sits an append-only event log. Every state change - hire, termination, compensation adjustment, role change - is recorded as an immutable event with a timestamp, actor, and cryptographic signature. The current state of any record is the reduction of all events affecting it.',
          'This gives us three properties. First, auditability: any number can be traced back to the exact events that produced it, with timestamps and actors. Second, replay: the system can be reconstructed at any past point in time by replaying events up to that timestamp. Third, non-repudiation: once an event is signed, the actor cannot deny having made the change.',
          'Traditional HRIS systems use mutable state: a compensation field is updated in place, overwriting the previous value. The previous value is lost unless explicitly logged in a separate audit table. Append-only logs make this impossible - the previous value is always present, always signed, always retrievable.',
        ],
      },
      {
        heading: 'Cross-module consistency guarantees',
        body: [
          'When a recruiter marks a candidate as "hired" in the talent module, three things happen atomically: (1) a new employee record is created in the HRIS with a signed hash, (2) a payroll setup event is enqueued for the next cycle, (3) the talent module\'s candidate record is updated to reference the new employee record\'s hash. All three operations succeed or all three fail - there is no intermediate state.',
          'This atomicity is enforced through a two-phase commit protocol. The system first prepares all three writes, validates that all hashes will be consistent, then commits. If any step fails (e.g., payroll setup rejects the start date as a non-business day), the entire transaction rolls back. The recruiter sees an error; no partial state is left behind.',
          'The result: headcount in Talent, headcount in HRIS, and headcount in Payroll are guaranteed to match. Always. Not "usually", not "after the nightly sync" - always, at every moment, with cryptographic proof.',
        ],
      },
      {
        heading: 'Why this matters for compliance',
        body: [
          'Regulators increasingly demand proof of data integrity. GDPR Article 25 requires "data protection by design and by default" - meaning systems must be architected to prevent unauthorized changes, not just detect them after the fact. SOC 2 Type II requires evidence that data has not been tampered with. ISO 27001 requires integrity controls.',
          'Cryptographic source of truth satisfies all three. Every record is signed. Every change is logged. Every number can be traced to its underlying events. Auditors can verify, in minutes, that the headcount reported to the board matches the headcount in payroll - because both are derived from the same signed records.',
          'This is not a feature. It is a foundational property of the architecture. Competitors who bolt audit logs onto mutable-state HRIS systems cannot provide the same guarantee - they can only detect tampering after the fact, not prevent it.',
        ],
      },
    ],
    keyTakeaways: [
      'Single source of truth: each data point has exactly one authoritative record',
      'Cryptographic signing: every record carries a content hash; mismatches refuse to render',
      'Append-only event log: every state change is immutable, signed, and replayable',
      'Two-phase commit: cross-module writes are atomic - all succeed or all roll back',
      'Regulatory compliance: satisfies GDPR Art. 25, SOC 2 Type II, and ISO 27001 integrity requirements',
    ],
    glossaryTerms: [
      { term: 'Cryptographic Source of Truth', definition: 'Every authoritative record is signed with a content hash. Wrong numbers cannot be displayed because the hash check fails.' },
      { term: 'WORM Storage', definition: 'Write Once Read Many. Immutable storage for audit logs that cannot be tampered with after writing.', extended: 'Append-only event logs ensure every state change is permanently recorded with cryptographic signatures.' },
      { term: 'GDPR', definition: 'General Data Protection Regulation. EU law requiring data protection by design and by default.', extended: 'GDPR Article 25 specifically requires systems to be architected to prevent unauthorized changes, not just detect them.' },
      { term: 'SOC 2', definition: 'Service Organization Control Type 2. An audit framework that verifies data security, availability, processing integrity, confidentiality, and privacy.' },
      { term: 'ISO 27001', definition: 'International standard for information security management systems, requiring integrity controls and risk management processes.' },
      { term: 'Two-Phase Commit', definition: 'A distributed transaction protocol ensuring all operations in a transaction succeed or all roll back - no partial state.' },
      { term: 'HRIS', definition: 'Human Resource Information System. Software that manages employee data, benefits, and compliance records.' },
      { term: 'ATS', definition: 'Applicant Tracking System. Software used to manage recruiting pipelines, from job posting to offer acceptance.' },
    ],
    prevArticle: { id: 'ask-ai-vs-chatgpt', title: 'Ask AI vs. ChatGPT: Why Context Matters More Than Conversational Ability' },
    nextArticle: { id: 'implementation-playbook', title: 'Implementation Playbook: Going Live with HiFive AI in 6 Weeks' },
  },

  'implementation-playbook': {
    id: 'implementation-playbook',
    category: 'Guide',
    title: 'Implementation Playbook: Going Live with HiFive AI in 6 Weeks',
    description:
      'A step-by-step playbook for mid-market deployments: data migration, SSO setup, workflow configuration, and manager training.',
    readTime: '20 min read',
    author: 'Jennifer Park',
    authorRole: 'Director of Implementation, HiFive AI',
    publishDate: 'March 22, 2025',
    heroGradient:
      'linear-gradient(135deg, #0F1410 0%, #1A241C 50%, #16A34A 120%)',
      image: '/articles/implementation-playbook.png',
    sections: [
      {
        heading: 'Week 1: Discovery & data audit',
        body: [
          'The first week is diagnostic. Our implementation team conducts a 4-hour workshop with your HR, finance, and IT leads to map your current state: which systems hold which data, how many entities are involved, what custom workflows exist, and what compliance constraints apply.',
          'In parallel, we run an automated data audit on your exported HRIS, payroll, and ATS data. The audit identifies: duplicate records (typically 2–4% of any export), missing required fields (typically 8–12%), invalid values (e.g., termination dates before hire dates), and orphaned records (employees in payroll but not in HRIS).',
          'The output of week 1 is a migration plan: a documented mapping of every field from your current systems to HiFive AI, plus a list of data quality issues that must be resolved before migration. Most clients resolve 80% of issues in week 1; the remaining 20% are handled during migration in week 2.',
        ],
      },
      {
        heading: 'Week 2: Data migration & validation',
        body: [
          'Migration runs in three stages. Stage 1: bulk import of employee records, compensation history, and organizational structure. This is automated and takes 2–4 hours for a 200-employee company. Stage 2: validation. We run 47 automated checks comparing migrated data against source data; any discrepancy > 0.1% halts migration for manual review.',
          'Stage 3: reconciliation. Your HR lead reviews a sample of 20–30 migrated records against the source system, signing off on accuracy. This human-in-the-loop step catches issues that automated checks miss (e.g., a compensation field that migrated correctly but lost its currency context).',
          'Critical principle: migration is non-destructive. Your source systems remain fully operational throughout week 2. If migration fails or validation flags issues, we roll back and try again. No data is lost, no business operations are interrupted.',
        ],
      },
      {
        heading: 'Week 3: Configuration & workflow setup',
        body: [
          'With data migrated, week 3 focuses on configuration. We configure: SSO via your identity provider (Okta, Azure AD, Google Workspace), role-based access permissions (who can see compensation data, who can approve terminations, who can run payroll), approval workflows (offer approval, compensation change, termination), and notification rules.',
          'This is also when we configure the Ask AI semantic layer for your specific org. We map your custom fields (e.g., "cost center", "billing entity", "project code") to the reasoning engine so that queries like "show me fully loaded cost by cost center" return correct results.',
          'Most clients have 5–15 custom workflows that need configuration (e.g., a unique contractor approval process, a country-specific onboarding checklist). We configure these in week 3, with your HR lead reviewing and signing off on each one.',
        ],
      },
      {
        heading: 'Week 4: Parallel payroll run',
        body: [
          'Week 4 is the highest-risk week: we run HiFive AI payroll in parallel with your existing payroll system for one full cycle. Both systems calculate payroll independently; we compare the results line-by-line for every employee.',
          'Typical parallel run results: 95–98% of calculations match exactly. The 2–5% that differ are usually due to: rounding differences in currency conversion (resolved by aligning rounding rules), benefit deduction ordering (resolved by configuring the correct sequence), or one-off adjustments in the legacy system that were not documented (resolved by re-entering the adjustment in HiFive AI).',
          'The parallel run is gated: payroll does not go live in HiFive AI until your finance lead signs off that the results match to within an agreed tolerance (typically $0.01 per employee per cycle). If the tolerance is exceeded, we investigate, fix, and re-run. No payroll goes live with unexplained variances.',
        ],
      },
      {
        heading: 'Week 5: Manager training & UAT',
        body: [
          'Week 5 is user acceptance testing. We deliver 3 training sessions: a 90-minute executive session for VPs and above (dashboard navigation, Ask AI queries, approval workflows), a 3-hour manager session for people managers (performance reviews, compensation changes, terminations), and a 60-minute employee session (self-service portal, document access, time-off requests).',
          'During UAT, a sample of 10–15 users across roles tests real workflows: approve a time-off request, run a compensation change, query the dashboard for a specific KPI. Any usability issues are logged and prioritized: P1 issues (blocking) are fixed before go-live; P2 issues (annoying) are scheduled for week 6; P3 issues (nice-to-have) go into the backlog.',
          'Training materials - video walkthroughs, written guides, quick-reference cards - are delivered to your internal wiki. The goal: every user has a resource they can consult without opening a support ticket.',
        ],
      },
      {
        heading: 'Week 6: Go-live & hypercare',
        body: [
          'Go-live is typically scheduled for a Sunday to minimize disruption. Monday morning, all employees log in via SSO; the first payroll cycle runs the following week. We staff a hypercare team for the first 2 weeks: a dedicated Slack channel, 4-hour response SLA on all tickets, daily check-ins with your HR and finance leads.',
          'Typical go-live issues: SSO configuration quirks (usually fixed in 1–2 hours), dashboard performance on slow connections (optimized via caching), and questions about specific workflows (answered via the hypercare channel). No data loss incidents in our 240+ implementations.',
          'After 2 weeks of hypercare, we transition to standard support: 24-hour SLA on tickets, monthly check-ins, quarterly business reviews. Your dedicated customer success manager monitors adoption metrics and proactively reaches out if usage drops below expected benchmarks.',
        ],
      },
    ],
    keyTakeaways: [
      '6-week timeline: discovery, migration, configuration, parallel payroll, training, go-live',
      'Migration is non-destructive: source systems remain operational until validation passes',
      'Parallel payroll run: 95–98% match rate typical; variances resolved before go-live',
      'Training: 3 role-specific sessions (executive, manager, employee) with video + written materials',
      'Hypercare: 2 weeks post-go-live with 4-hour SLA and daily check-ins',
    ],
    glossaryTerms: [
      { term: 'SSO', definition: 'Single Sign-On. An authentication method that lets users access multiple applications with one set of credentials.', extended: 'HiFive AI supports Okta, Azure AD, and Google Workspace as identity providers.' },
      { term: 'SCIM', definition: 'System for Cross-domain Identity Management. Automated user provisioning and de-provisioning protocol.' },
      { term: 'UAT', definition: 'User Acceptance Testing. The process where end-users validate that the system meets their requirements before go-live.' },
      { term: 'SLA', definition: 'Service Level Agreement. A commitment between a service provider and client defining expected response and resolution times.' },
      { term: 'HRIS', definition: 'Human Resource Information System. Software that manages employee data, benefits, and compliance records.' },
      { term: 'ATS', definition: 'Applicant Tracking System. Software used to manage recruiting pipelines, from job posting to offer acceptance.' },
    ],
    prevArticle: { id: 'crypto-truth', title: 'The Cryptographic Source of Truth: Building Trust in People Data' },
  },
};

export const articles: Record<string, ArticleContent> = {
  ...articlesBatch1,
  ...articlesBatch2,
  ...baseArticles,
};

export const articleList = Object.values(articles);

// Helper: build prev/next relationships automatically
export function getArticleById(id: string): ArticleContent | undefined {
  return articles[id];
}

