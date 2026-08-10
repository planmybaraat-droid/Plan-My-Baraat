import type { LetterTemplate } from '../../lib/types';

function buildStaffAgreementBody(source: string) {
  return source
    .replace(
      /\n# 4\. WEBSITE-DEVELOPMENT RESPONSIBILITIES[\s\S]*?(?=\n# 6\. WORK REPORTING AND PERFORMANCE STANDARDS)/,
      '',
    )
    .replace(/^# (\d+)\./gm, (heading, value: string) => {
      const number = Number(value);
      return number >= 6 ? `# ${number - 2}.` : heading;
    })
    .replaceAll('Internship', 'Employment')
    .replaceAll('internship', 'employment')
    .replaceAll('Interns', 'Staff Members')
    .replaceAll('Intern', 'Staff Member');
}

export const INTERN_AGREEMENT_TEMPLATE: LetterTemplate = {
  id: 'tpl-intern-agreement',
  letter_type: 'intern_agreement',
  label: 'Staff Agreement',
  icon: 'ShieldCheck',
  description: 'Responsibilities, confidentiality, data security and intellectual-property agreement for staff.',
  category: 'Onboarding',
  requires_status: null,
  is_active: true,
  extra_fields: [
    { key: 'agreement_date', label: 'Agreement Date', type: 'date' },
    { key: 'employment_type', label: 'Employment Type', type: 'text', default: 'Full Time' },
    { key: 'employment_start_date', label: 'Employment Start Date', type: 'date' },
    { key: 'employment_term', label: 'Employment Term', type: 'text', default: 'Ongoing until ended under this Agreement' },
    { key: 'monthly_compensation', label: 'Monthly Salary / Stipend (₹)', type: 'number', default: '8000' },
    { key: 'office_hours', label: 'Office Operating Hours', type: 'text', default: 'Monday to Sunday, 10:00 AM to 7:00 PM' },
    { key: 'working_schedule', label: 'Working Days & Weekly Off', type: 'text', default: 'As per the schedule assigned by management' },
    { key: 'reporting_authority', label: 'Reporting Authority', type: 'text', default: 'Founder or an Authorised Reporting Manager' },
    { key: 'notice_period_days', label: 'Notice Period (Days)', type: 'number', default: '14' },
    { key: 'authorized_representative', label: 'Authorised Representative', type: 'text', default: 'Ronak Dave' },
    { key: 'representative_designation', label: 'Representative Designation', type: 'text', default: 'Founder / Authorised Representative' },
  ],
  body_template: buildStaffAgreementBody(String.raw`# AGREEMENT

This Agreement is executed on **{{agreement_date}}** between:

## First Party — The Company

**PlanMyBaraat**, having its office at Studio 501–502, Broadway Signature, 5th Floor, Near Red Petal Party Plot, Opp. Sevasi-Bhayli Canal Ring Road, Vadodara, Gujarat – 391110, hereinafter referred to as the **“Company”**;

**AND**

## Second Party — The Staff Member

**Name of Staff Member:** {{employee_name}}

**Address:** {{employee_address}}

Hereinafter referred to as the **“Staff Member.”**

The Company and the Staff Member shall collectively be referred to as the **“Parties.”**

# 1. PURPOSE OF THE AGREEMENT

This Agreement defines the Staff Member’s duties, responsibilities, performance expectations, confidentiality obligations, intellectual-property obligations, data-security requirements and other applicable conditions during their employment or professional engagement with PlanMyBaraat.

The Staff Member agrees to carry out all assigned duties professionally, honestly and in the best interests of the Company.

# 2. EMPLOYMENT DETAILS

**Name of Staff Member:** {{employee_name}}

**Designation:** {{designation}}

**Department:** {{department}}

**Joining Date:** {{joining_date}}

**Employment Type:** {{employment_type}}

**Employment Start Date:** {{employment_start_date}}

**Employment Term:** {{employment_term}}

**Monthly Salary / Stipend:** ₹{{monthly_compensation}}/- per month

**Work Location:** {{work_location}}

**Office Operating Hours:** {{office_hours}}

**Working Days and Weekly Off:** {{working_schedule}}

**Reporting Authority:** {{reporting_authority}}

The Company may reasonably modify the Staff Member’s work schedule, reporting structure, project allocation or responsibilities according to operational and business requirements.

# 3. NATURE OF THE ENGAGEMENT

The engagement is intended to establish clear professional responsibilities in website development, technical SEO, local SEO, digital marketing systems, online marketplace development, organic lead generation and any other work reasonably assigned by the Company.

The Staff Member may work on live business projects and may receive access to Company websites, dashboards, business information, customer enquiries, vendor information and digital accounts. Such access shall be used strictly for authorised Company work.

[[PAGE_BREAK]]

# 4. WEBSITE-DEVELOPMENT RESPONSIBILITIES

## 4.1 Website Development and Maintenance

The Intern may be responsible for:

* Developing, maintaining and regularly updating the official PlanMyBaraat website.
* Creating responsive and user-friendly website pages.
* Developing service pages, package pages, vendor pages, city pages and promotional landing pages.
* Maintaining website menus, layouts, buttons, banners, forms and navigation.
* Ensuring compatibility across mobile phones, tablets, laptops and desktop devices.
* Improving website loading speed, functionality, accessibility and user experience.
* Identifying and fixing frontend errors, layout problems and technical issues.
* Maintaining clean, structured, reusable and secure website code.
* Following the Company’s approved brand identity, fonts, colours and design standards.
* Ensuring that all published content, pricing, service details and claims are approved and accurate.

## 4.2 PlanMyBaraat Service Pages

The Intern may be assigned to develop and manage pages for:

* Complete baraat-management packages
* DJ trucks and professional DJ artists
* Concert sound and intelligent lighting
* Vintage wedding cars
* Dhol artists and live performers
* Groom and barati safa services
* Dancers and entertainment artists
* Gorilla, mascot and theme performers
* Confetti, pyro and special-effects services
* Bouncers and crowd-management teams
* Wedding-entry concepts
* Groom-name letters and LED panels
* Chariots and wedding-entry vehicles
* Vendor listings and marketplace services
* Destination and city-specific baraat services

## 4.3 Enquiry and Lead-Generation Systems

The Intern shall:

* Create and maintain customer enquiry and booking forms.
* Capture customer names, contact numbers, event dates, cities, venues and service requirements.
* Develop sections such as “Book Now,” “Get a Quote,” “WhatsApp Now” and “Check Availability.”
* Test all forms before publishing them.
* Ensure enquiries are correctly received by the authorised Company system or representative.
* Maintain the privacy and security of all customer enquiries.
* Improve the website’s enquiry and conversion journey.
* Immediately report any lead-delivery, form or database issue.

[[PAGE_BREAK]]

## 4.4 Website Testing and Quality Control

The Intern shall:

* Test website pages, buttons, menus, forms, links, images and videos.
* Check website compatibility across commonly used browsers.
* Identify broken links, incorrect redirects and missing media.
* Check mobile responsiveness before publishing changes.
* Maintain records of completed work, pending tasks and technical issues.
* Take management approval before publishing major changes.
* Avoid making unauthorised changes to the live website.
* Maintain suitable backups or version-control records wherever instructed.

# 5. SEO RESPONSIBILITIES

## 5.1 Keyword Research

The Intern shall:

* Conduct keyword research for wedding, baraat and event-management services.
* Identify city-based and area-based search terms.
* Research keywords for individual PlanMyBaraat services.
* Categorise keywords according to customer search intent.
* Maintain organised keyword-research reports.
* Recommend new service pages and location pages based on genuine business requirements.
* Avoid irrelevant, misleading or unauthorised keywords.

## 5.2 On-Page SEO

The Intern shall:

* Optimise page titles and meta descriptions.
* Maintain proper H1, H2 and H3 heading structures.
* Optimise page URLs, content structure and image alt text.
* Create relevant internal links between website pages.
* Improve content readability and keyword placement.
* Identify and correct duplicate titles, descriptions and content.
* Ensure SEO content accurately represents the Company’s actual services.
* Coordinate with the content and marketing team for website updates.

## 5.3 Technical SEO

The Intern shall:

* Monitor website crawling and indexing.
* Create and maintain XML sitemaps.
* Review robots.txt settings.
* Identify and resolve crawl errors.
* Monitor broken links, redirects and canonical issues.
* Improve website speed and mobile performance.
* Assist with approved structured-data and schema implementation.
* Ensure important pages are accessible to search engines.
* Maintain a logical website hierarchy and internal-linking structure.
* Report any sudden indexing or technical problem immediately.

[[PAGE_BREAK]]

## 5.4 Local and City-Based SEO

The Intern shall:

* Create SEO-friendly city and area pages.
* Optimise location pages for PlanMyBaraat services.
* Support the optimisation of the Company’s Google Business Profile.
* Maintain consistent Company information across approved platforms.
* Create location pages only for cities and areas approved by management.
* Avoid false or misleading location claims.
* Monitor city-based keyword rankings and enquiries.

## 5.5 SEO Monitoring and Reporting

The Intern shall:

* Monitor Google Search Console, analytics platforms and other approved tools.
* Track website impressions, clicks, rankings, traffic and organic enquiries.
* Prepare weekly and monthly SEO performance reports.
* Maintain records of completed SEO work and observed results.
* Inform management about traffic drops, indexing errors or security concerns.
* Provide accurate and transparent performance reports.
* Avoid falsifying, manipulating or hiding website-performance information.

## 5.6 Ethical SEO Practices

The Intern shall not use:

* Spam backlinks
* Hidden text
* Keyword stuffing
* Fake website traffic
* Automated spam comments
* Misleading redirects
* Copied or duplicate content
* Unauthorised paid links
* Hacked websites
* Black-hat SEO methods
* Any technique that could damage the Company’s website, reputation or search visibility

Only ethical and management-approved SEO practices shall be used.

# 6. WORK REPORTING AND PERFORMANCE STANDARDS

The Intern shall:

* Report to the Founder or authorised reporting manager.
* Maintain daily or weekly work reports.
* Provide regular updates on completed and pending assignments.
* Attend scheduled meetings and review sessions.
* Follow assigned deadlines and project priorities.
* Inform management in advance about expected delays.
* Maintain documentation of important website changes.
* Accept reasonable corrections and performance feedback.
* Complete assigned duties accurately and professionally.
* Coordinate respectfully with Company staff, vendors and authorised service providers.

The Intern’s performance may be evaluated based on website-development quality, SEO implementation and technical accuracy, timely completion, website performance, organic visibility and lead generation, attendance, punctuality, communication, teamwork, problem-solving, documentation, professional discipline and protection of Company information and accounts.

[[PAGE_BREAK]]

# 7. STIPEND AND PAYMENT CONDITIONS

The Staff Member will receive monthly compensation of **₹{{monthly_compensation}}/-**, subject to:

* Regular attendance
* Satisfactory performance
* Timely completion of assigned tasks
* Submission of required work reports
* Compliance with Company policies
* Proper maintenance of Company information and credentials

The salary or stipend shall be processed according to the Company’s payment schedule and subject to any legally applicable deductions.

The Intern shall not be entitled to any additional salary, allowance, incentive, reimbursement or benefit unless separately approved in writing by the Company.

Final settlement and clearance shall be processed after the Intern has completed the required handover of assigned work, files, reports, credentials and Company property.

# 8. ATTENDANCE, PUNCTUALITY AND LEAVE

The Intern shall:

* Maintain regular attendance and punctuality.
* Request and obtain reporting-manager approval for planned leave in advance.
* Inform the reporting manager as soon as reasonably possible in case of illness or emergency.

The following may affect the Staff Member’s performance review, compensation and employment record:

* Repeated late arrival
* Unauthorised absence
* Leaving the workplace without permission
* Failure to communicate an absence or delay

Since PlanMyBaraat operates in the wedding and event-management industry, work priorities may occasionally change according to project deadlines, website launches, marketing campaigns and live-event requirements.

[[PAGE_BREAK]]

# 9. CONFIDENTIALITY OBLIGATIONS

During the internship, the Intern may receive access to confidential information belonging to PlanMyBaraat, its associated projects, customers, vendors, employees and business partners.

Confidential information includes:

* Customer names, contact details and enquiry information
* Event dates, venues and booking details
* Vendor information and commercial terms
* Package prices and internal costing
* Business plans and expansion strategies
* Marketing and SEO strategies
* Website source code and database information
* Website, hosting and domain credentials
* CRM information and lead data
* Analytics and performance reports
* Keyword-research documents
* Internal Company documents and quotations
* Design files, logos and brand assets
* Employee, freelancer and vendor records
* Business processes and operational information
* Any other information reasonably understood to be private or confidential

The Intern shall not:

* Share, copy, forward, publish, sell, transfer or misuse confidential information.
* Save Company files in unauthorised accounts or devices.
* Share passwords, OTPs or credentials.
* Use Company information for external assignments.
* Retain unauthorised copies after the internship.

These confidentiality obligations continue after completion or discontinuation of the internship.

[[PAGE_BREAK]]

# 10. DATA SECURITY AND ACCESS CONTROL

The Intern shall maintain strict security of website administrator accounts, domain and hosting credentials, Company email, Google Search Console, analytics accounts, CRM access, social-media and marketing tools, databases, cloud storage, backups and all other Company software access.

The Intern must:

* Use secure passwords and keep passwords and OTPs confidential.
* Avoid storing credentials in unsecured documents.
* Log out from shared or public devices.
* Avoid providing Company access to another person.
* Report any suspected data breach immediately.
* Use Company accounts only for authorised work.
* Follow security instructions provided by management.

The Intern shall not change account ownership, recovery email, recovery number, administrator access, domain settings or passwords without prior approval from management.

# 11. INTELLECTUAL PROPERTY AND OWNERSHIP OF WORK

All work created, developed, edited, modified or contributed by the Intern during the internship for PlanMyBaraat shall remain the exclusive property of the Company, including:

* Website source code, designs, layouts, landing pages and forms
* User-interface components, graphics and visual elements
* Databases and technical structures
* SEO strategies, reports and keyword-research documents
* Metadata and content structures
* Internal dashboards and tools
* Documentation, process notes, research and analysis
* Concepts, workflows, technical solutions and any other material produced for the Company

The Intern must submit all source files, editable files, reports, credentials, backups and documentation whenever requested by management.

The Intern shall not sell, reuse, publish, transfer, reproduce or claim ownership of Company work without prior written approval. Selected non-confidential work may be displayed in a personal portfolio only after receiving written permission from PlanMyBaraat.

# 12. PERSONAL LAPTOP AND COMPANY RESOURCES

The Intern may be required to use a personal laptop and mobile phone for assigned work. The Intern shall ensure the laptop has suitable specifications, required software, reliable internet, secure login protection, reasonable antivirus protection, adequate storage and backups.

Any Company account, device, subscription, software or resource must be used only for authorised Company work. The Intern shall not:

* Install unauthorised or pirated software.
* Use Company accounts for personal projects.
* Download confidential data without permission.
* Provide access to another person.
* Perform any action that may damage Company systems or data.

[[PAGE_BREAK]]

# 13. CONFLICT OF INTEREST AND EXTERNAL ASSIGNMENTS

During the internship, the Intern shall not undertake any external employment, freelance work or business assignment that:

* Conflicts with Company responsibilities.
* Uses confidential information.
* Involves Company customers or vendors without approval.
* Competes with assigned projects.
* Affects attendance or deadlines.
* Uses Company resources without permission.

The Intern must obtain prior management approval before accepting any external assignment that may create a conflict of interest.

# 14. PROFESSIONAL CONDUCT AND DISCIPLINE

The Intern shall maintain honesty, professionalism, discipline and respect towards the Company, team members, customers, vendors and business partners.

The following may result in disciplinary action or immediate discontinuation:

* Theft, fraud, misappropriation or misuse of Company funds, data or assets
* Sharing confidential information or misusing customer or vendor data
* Serious or repeated unauthorised absence
* Insubordination, harassment, inappropriate behaviour or serious misconduct
* Deliberate damage to Company websites or systems
* Falsification of attendance or work reports
* Submission of copied, stolen or unauthorised work
* Unauthorised transfer or misuse of credentials
* False claims on behalf of the Company
* Actions that damage the Company’s reputation
* Violation of Company policies and instructions

# 15. PERFORMANCE REVIEW AND CAREER GROWTH

The Staff Member’s performance will be reviewed periodically. Staff Members who consistently demonstrate outstanding performance, discipline, technical growth, professionalism and measurable contribution may be considered for expanded responsibilities, promotion, compensation review or another suitable growth opportunity.

Any employment role will depend on:

* Consistent performance and completion of assigned responsibilities.
* Performance results.
* Technical and professional capabilities.
* Management approval.
* Business requirements.
* Availability of a suitable position.

Any offer will be communicated separately in writing.

# 16. NOTICE PERIOD AND EARLY DISCONTINUATION

If the Staff Member wishes to resign or end the engagement, the Staff Member must provide at least **{{notice_period_days}} days’ written notice** to management.

During the notice period, the Intern must:

* Complete pending assignments.
* Submit source code, backups, SEO reports, keyword documents, Company files and documentation.
* Transfer website and software access.
* Document pending technical issues.
* Assist with the complete handover.
* Obtain reporting-manager clearance.

The Company may end the employment or engagement based on performance, attendance, misconduct, breach of confidentiality or operational requirements, subject to applicable law. Serious misconduct, data theft, credential misuse, fraud or deliberate system damage may result in immediate termination.

[[PAGE_BREAK]]

# 17. MANDATORY HANDOVER

Upon completion or discontinuation, the Intern must hand over:

* Website source code and backup files
* Domain, hosting and database information
* Login credentials and administrator access
* SEO reports and keyword-research documents
* Google Search Console and analytics access
* Pending-work and error lists
* Technical documentation, content and design files
* Access to Company tools and software
* Company-provided devices or property
* Any other Company information in the Intern’s possession

The Intern must remove Company data from personal devices and accounts after confirmation of the complete handover.

# 18. SERVICE AND EXPERIENCE DOCUMENTS

The Staff Member may be eligible for an experience letter, relieving letter or other applicable service document after:

* Completion of the applicable employment or engagement period.
* Satisfactory submission of assigned work.
* Completion of the required handover.
* Reporting-manager clearance.

Any experience, relieving or recommendation document will be issued according to performance, clearance status, Company policy and management approval.

# 19. VERIFICATION AND REQUIRED DOCUMENTS

The employment or engagement is offered on the basis that information provided in the Staff Member’s resume, application, portfolio, educational documents and discussions is true and accurate. The Staff Member may be required to submit:

* Updated resume
* Educational certificates and mark sheets
* Aadhaar Card or another valid identity proof
* PAN Card, where available
* Two passport-size photographs
* Current residential-address proof
* Bank-account details for salary or stipend payment
* Signed copies of the applicable Joining Letter and this Agreement

If any important information is found materially false or misleading, the Company may review or end the employment or engagement.

# 20. ENTIRE AGREEMENT

The Parties agree that:

* This Agreement, together with the applicable Joining Letter and any subsequent written Company communication, represents the agreed terms applicable to the employment or engagement.
* Any change must be communicated or approved in writing.
* If any provision is invalid or unenforceable, the remaining provisions shall continue to apply to the extent legally permitted.

# 21. GOVERNING JURISDICTION

The Parties acknowledge that:

* This Agreement shall be governed by the applicable laws of India.
* Any dispute shall be subject to the jurisdiction of the appropriate courts in Vadodara, Gujarat.

[[PAGE_BREAK]]

# DECLARATION BY THE INTERN

I, **{{employee_name}}**, confirm that:

* I have carefully read and understood this Agreement.
* I accept the responsibilities and performance standards assigned to me.
* I will maintain the confidentiality of Company information.
* I will protect all Company accounts, data and credentials.
* I understand that all Company-related work remains the property of PlanMyBaraat.
* I will maintain professional behaviour, attendance and discipline.
* I will complete the required handover before leaving.
* I accept the employment terms, salary or stipend, work schedule and notice-period conditions.
* I am signing this Agreement voluntarily.

I confirm that I have understood and accepted the terms and conditions stated in this Agreement.

## FOR PLANMYBARAAT

**Signature:** {{authorized_representative}}

## STAFF MEMBER

**Name:** {{employee_name}}

**Signature:** ______________________________

**Date:** {{agreement_date}}

**Address:** {{employee_address}}

**Contact Number:** {{employee_mobile}}`),
};
