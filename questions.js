// =====================================================================
//  SF ADMIN SCENARIO QUIZ — Question Bank
//  Fixed 40 questions per session: 20 Scenario + 20 MCQ
//  Questions appear in fixed order — no randomisation
// =====================================================================

const QUESTIONS = [

  // ══════════════════════════════════════════════════════════════
  //  PART 1 — SCENARIO / DESCRIPTIVE  (Q1 – Q20)
  // ══════════════════════════════════════════════════════════════

  {
    id: 1,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Security & Access",
    scenario: "A retail company has 300 sales reps, 20 regional managers, and 5 VPs. Sales reps should only see their own Opportunity records. Regional managers should see all records owned by reps in their region. VPs need visibility across all regions. A sensitive 'Negotiated Price' field must be hidden from reps but visible to managers and above.",
    question: "Design the complete security model for this organisation. Explain your OWD settings, role hierarchy structure, any sharing rules required, and how you would configure field-level security for the Negotiated Price field.",
    placeholder: "Describe your OWD settings, role hierarchy levels, sharing rules, and FLS configuration in detail..."
  },
  {
    id: 2,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Profiles & Permission Sets",
    scenario: "Your company has grown from 50 users to 400 users across 6 departments. Currently the org has 20 profiles with inconsistent and overlapping permissions. Users frequently raise access requests that don't match any existing profile. IT spends 3 days per week managing manual permission changes.",
    question: "How would you redesign the permission model? Explain the difference between Profiles and Permission Sets, how you would reduce the number of profiles, and how Permission Set Groups could streamline the process. Describe your governance approach going forward.",
    placeholder: "Explain your profile rationalisation plan, permission set design, and governance process..."
  },
  {
    id: 3,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Data Management",
    scenario: "Your company is migrating 500,000 legacy CRM records into Salesforce. The legacy data has duplicate accounts, missing required fields, inconsistent phone number formats, and parent-child relationships (Accounts → Contacts → Cases) that must be preserved.",
    question: "Outline your complete data migration strategy. Include the tools you would use, data cleansing steps before migration, the loading order for related objects, and how you would validate the data after migration.",
    placeholder: "Describe your migration plan including tools, cleansing, load order, and post-migration validation..."
  },
  {
    id: 4,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Process Automation",
    scenario: "When a new Lead with Lead Source = 'Website' is created: the system must auto-assign it to the 'Website Leads' queue, send a welcome email to the lead, create a follow-up Task for the assigned user due in 2 business days, and post a notification to the Sales Manager's Chatter feed.",
    question: "Which automation tools would you use for each of these four actions and why? Walk through the complete configuration for each step. Would you use Flow, Workflow Rules, or a combination?",
    placeholder: "Explain which tool handles each of the 4 actions, and describe the full configuration for each..."
  },
  {
    id: 5,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Reports & Dashboards",
    scenario: "The VP of Sales wants an executive dashboard showing: total pipeline value by stage, top 10 reps by closed revenue this quarter, win rate compared to the same quarter last year, and average deal size by product family. The dashboard must refresh every hour and be viewable on mobile.",
    question: "Describe how you would build this dashboard end to end. Include the report types needed, grouping and summary configurations, chart selections, and how you handle the hourly refresh and mobile access requirements.",
    placeholder: "Describe report types, configurations, chart choices, refresh settings, and mobile access..."
  },
  {
    id: 6,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Service Cloud",
    scenario: "A support team handles 800 cases per day via email, web form, and phone. Cases must be auto-routed to specialised queues based on product type. Customers with a Premium SLA must get a response within 2 hours. If a Premium SLA case is not responded to within 1 hour, the case owner's manager must be automatically notified.",
    question: "Design the complete Service Cloud setup. Cover case assignment rules, queue configuration, Entitlements, Milestones, and Escalation Rules. How would you configure the 1-hour warning for Premium SLA cases?",
    placeholder: "Describe assignment rules, queues, entitlements, milestones, and escalation configuration..."
  },
  {
    id: 7,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Sales Cloud",
    scenario: "Your sales team sells two different product lines — Enterprise Software and Professional Services — each with different sales stages, required fields at each stage, and different approval requirements. A manager wants a visual indicator showing reps which stage they are on and what is needed to advance.",
    question: "How would you implement this using Sales Processes, Opportunity Stages, Record Types, Validation Rules, and Path? Explain how each piece fits together and what configuration decisions you would make.",
    placeholder: "Explain Sales Process, Record Types, Stage configuration, Validation Rules, and Path setup..."
  },
  {
    id: 8,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Flows",
    scenario: "Every Monday at 9 AM, the system must find all open Opportunities where the Close Date is more than 60 days old and there has been no activity logged in the last 30 days. For each such Opportunity, update a custom field Status__c to 'Stale' and send an alert email to the Opportunity owner's manager.",
    question: "Build this logic using a Scheduled Flow. Describe every element you would use — how you filter records, check activity, update the field, and send the email. Why is a Scheduled Flow the right tool rather than a Workflow Rule?",
    placeholder: "Describe the Scheduled Flow design step by step, including each element and why Scheduled Flow over Workflow..."
  },
  {
    id: 9,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Approval Processes",
    scenario: "Opportunities over $75,000 require a 3-level approval: the rep's direct manager, then the regional VP, then Finance. If any approver rejects the deal, the Opportunity must revert to the previous stage and the rep must be notified. Approvers are frequently out of office and have delegates.",
    question: "Design the Approval Process for this scenario. Cover entry criteria, approval steps, delegated approvers, actions on approval and rejection, and how you handle the stage reversion on rejection.",
    placeholder: "Describe entry criteria, approval steps, delegation, and actions on approval/rejection..."
  },
  {
    id: 10,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Duplicate Management",
    scenario: "After a trade show, the marketing team imported 8,000 new Lead records. Now the system has thousands of duplicates across Leads and Contacts. Going forward, reps must be warned (but not blocked) when creating a potential duplicate Lead, and must be hard-blocked from creating an exact duplicate based on email address.",
    question: "Describe how you would use Matching Rules and Duplicate Rules to handle both scenarios — the soft warning for potential duplicates and the hard block for exact email duplicates. How would you also clean up the existing duplicates?",
    placeholder: "Explain Matching Rules, two separate Duplicate Rules (alert vs block), and the cleanup approach..."
  },
  {
    id: 11,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Validation Rules",
    scenario: "The sales team is entering poor quality data — Opportunities are being created with Close Dates in the past, Contact phone numbers in inconsistent formats, and Accounts missing the Industry field when they are of Type 'Enterprise'. These issues are causing reporting inaccuracies.",
    question: "Write validation rules to address all three data quality issues. For each rule, explain the formula logic, the error message you would show, and where the error would appear (field-level or page-level). Explain any edge cases to handle.",
    placeholder: "Write three validation rules with formula logic, error messages, and edge case explanations..."
  },
  {
    id: 12,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Custom Objects & Relationships",
    scenario: "A training company needs to track Courses, Batches (multiple batches per course), Student Enrolments (students enrolled in a batch), and Certificates (issued to a student after completing a batch). Each relationship has different requirements for record deletion and rollup reporting.",
    question: "Design the custom object data model. For each relationship, justify whether you would use a Master-Detail or Lookup relationship, and explain the impact of your choice on record deletion, sharing, and rollup summary fields.",
    placeholder: "Design the data model with all objects, justify Master-Detail vs Lookup for each relationship..."
  },
  {
    id: 13,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "AppExchange",
    scenario: "Your admin team wants to install a contract management app from AppExchange. The package requires custom permissions, adds fields to the existing Account and Opportunity objects, and includes its own Flows. You are worried it may conflict with existing Flows and automation already in the org.",
    question: "Walk through the evaluation and installation process for this managed package. What steps would you take before installation? What would you check for conflicts? How would you configure it post-installation and how would you test it safely?",
    placeholder: "Describe pre-install evaluation, conflict checks, sandbox testing, and post-install configuration..."
  },
  {
    id: 14,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Sandbox & Deployment",
    scenario: "Your team made 60 configuration changes in a Developer sandbox: new custom fields, updated page layouts, modified validation rules, new Flows, and a new custom object with related objects. You need to deploy these to production during business hours with zero downtime.",
    question: "Plan the deployment step by step. How do you organise change sets, handle metadata dependencies, determine the correct deployment order, validate before going live, and roll back if something goes wrong?",
    placeholder: "Describe change set organisation, dependency management, deployment order, validation, and rollback plan..."
  },
  {
    id: 15,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Experience Cloud",
    scenario: "A B2B company wants to build a partner portal where channel partners can: register new deals (create Opportunities), view their own pipeline, submit support cases, and download marketing materials. Partners must only see their own records and the records of their company.",
    question: "Design the Experience Cloud portal implementation. Cover which template to use, how sharing works for external users, how you would configure deal registration, and any licence considerations for partner users.",
    placeholder: "Describe template choice, sharing model for external users, deal registration setup, and licence type..."
  },
  {
    id: 16,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Record Types",
    scenario: "A healthcare company uses the Account object for two very different types of records: Hospitals and Individual Clinics. Hospitals have different required fields, different picklist values, and a completely different page layout from Clinics. The sales process also differs between the two.",
    question: "How would you use Record Types to support this? Walk through the configuration steps including how you assign Record Types to profiles, assign different page layouts, and handle the different picklist values for each type.",
    placeholder: "Explain Record Type creation, page layout assignment per type, picklist value configuration, and profile assignment..."
  },
  {
    id: 17,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Territory Management",
    scenario: "A company is reorganising its sales territories from geographic regions to industry-based territories. 15,000 Account records need to be reassigned. Sales reps must only see Accounts in their assigned territory. Territory realignments happen every quarter.",
    question: "Explain how you would configure Enterprise Territory Management for this scenario. Cover territory model setup, rule-based assignment, access model, and how you manage the quarterly realignment process.",
    placeholder: "Describe territory model, rule-based account assignment, access model, and quarterly realignment process..."
  },
  {
    id: 18,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Data Privacy & GDPR",
    scenario: "Your Salesforce org contains personal data of EU citizens (Contacts and Leads). You must comply with GDPR: individuals have the right to access, correct, and delete their data. Marketing consent must be tracked per channel (email, phone, SMS). Data must be automatically deleted after 3 years of inactivity.",
    question: "Implement a GDPR compliance approach in Salesforce. Cover Individual records, consent tracking fields, how you would handle Right to Access and Right to Erasure requests, and how you would automate the 3-year data deletion.",
    placeholder: "Describe Individual records, consent tracking, Right to Access/Erasure handling, and automated deletion..."
  },
  {
    id: 19,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Forecasting",
    scenario: "The CFO wants a rolling 90-day revenue forecast broken down by product family, sales rep, and region. The sales team uses both 'Commit' and 'Best Case' forecast categories. Historical forecast accuracy must also be tracked. The CFO wants to see the forecast update in real time as deals change.",
    question: "Configure Collaborative Forecasting to meet these requirements. How do you set up forecast types, map pipeline stages to forecast categories, enable product family forecasting, and allow the CFO to view forecasts at different hierarchy levels?",
    placeholder: "Describe forecast type setup, stage-to-category mapping, product family config, and hierarchy view..."
  },
  {
    id: 20,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Einstein & Analytics",
    scenario: "A sales manager wants to know which of their open Leads are most likely to convert this month. They have heard about Salesforce Einstein and want to use it. They also want a simple dashboard showing the top 10 at-risk Leads that need follow-up.",
    question: "Explain what Einstein Lead Scoring is and how it works. What data does it use to score Leads? How would you enable and configure it? How would you build the 'Top 10 At-Risk Leads' dashboard component using the Einstein score field?",
    placeholder: "Explain Einstein Lead Scoring, how to enable and configure it, and how to build the dashboard component..."
  },

  // ══════════════════════════════════════════════════════════════
  //  PART 2 — MCQ  (Q21 – Q40)
  // ══════════════════════════════════════════════════════════════

  {
    id: 21,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Security — OWD",
    scenario: "An org has OWD set to Private for the Opportunity object. A Sales Rep owns an Opportunity. The Rep's Manager is directly above them in the Role Hierarchy.",
    question: "Can the Manager see the Rep's Opportunity without any Sharing Rule?",
    options: [
      "No — OWD Private means no one else can see the record",
      "Yes — Role Hierarchy grants read/write access upward automatically",
      "Only if a Manual Share is created by the Rep",
      "Only if the Manager is also added as an Opportunity Team member"
    ],
    answer: 1
  },
  {
    id: 22,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Security — Profiles vs Permission Sets",
    scenario: "An admin needs to give a single user access to a new custom object. All other users on the same Profile should NOT get access.",
    question: "What is the most appropriate way to grant this access?",
    options: [
      "Edit the user's Profile to add object access",
      "Create a new Profile for just this user",
      "Assign a Permission Set to the specific user",
      "Use a Sharing Rule to open access to this user"
    ],
    answer: 2
  },
  {
    id: 23,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Automation — Order of Execution",
    scenario: "A record is being saved in Salesforce. An admin has both a Validation Rule and an Apex Before Trigger configured on the same object.",
    question: "In the Salesforce Order of Execution, which fires first?",
    options: [
      "Validation Rules fire before Apex Before Triggers",
      "Apex Before Triggers fire before Validation Rules",
      "They fire simultaneously",
      "Workflow Rules fire first, then Triggers, then Validation Rules"
    ],
    answer: 1
  },
  {
    id: 24,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Reports — Report Types",
    scenario: "A manager wants a report showing all Accounts, and for each Account, all related Contacts — even if some Accounts have no Contacts at all.",
    question: "Which Report Type should be used?",
    options: [
      "Tabular Report on Contacts",
      "Summary Report on Accounts",
      "Accounts with Contacts (Accounts and Contacts with or without Contacts)",
      "Matrix Report on Accounts and Contacts"
    ],
    answer: 2
  },
  {
    id: 25,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Data Management — Data Loader",
    scenario: "An admin needs to import 200,000 Account records from a CSV file into Salesforce. Some records may fail due to missing required fields and should be logged separately without stopping the entire import.",
    question: "Which tool is best suited for this operation?",
    options: [
      "Data Import Wizard",
      "Data Loader with Insert and separate error log",
      "Workbench",
      "SOQL query from Developer Console"
    ],
    answer: 1
  },
  {
    id: 26,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Flows — Types",
    scenario: "An admin needs to automatically update a field on an Account record every time a related Contact's email address is changed, without any user interaction.",
    question: "Which Flow type is most appropriate for this requirement?",
    options: [
      "Screen Flow",
      "Schedule-Triggered Flow",
      "Record-Triggered Flow",
      "Platform Event-Triggered Flow"
    ],
    answer: 2
  },
  {
    id: 27,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Relationships — Master-Detail vs Lookup",
    scenario: "An admin is creating a custom object called 'Invoice Line Item' that should always belong to an 'Invoice' record. If the Invoice is deleted, all its Line Items should also be deleted automatically.",
    question: "Which relationship type should be used between Invoice and Invoice Line Item?",
    options: [
      "Lookup Relationship",
      "Master-Detail Relationship",
      "Many-to-Many Relationship",
      "Hierarchical Relationship"
    ],
    answer: 1
  },
  {
    id: 28,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Validation Rules",
    scenario: "An admin wants to prevent an Opportunity from being saved if the Close Date is in the past AND the Stage is NOT 'Closed Won' or 'Closed Lost'.",
    question: "Which formula correctly implements this validation rule (should return TRUE to show an error)?",
    options: [
      "CloseDate < TODAY() && ISPICKVAL(StageName, 'Closed Won')",
      "CloseDate < TODAY() && NOT(ISPICKVAL(StageName,'Closed Won') || ISPICKVAL(StageName,'Closed Lost'))",
      "CloseDate < TODAY() || ISPICKVAL(StageName, 'Closed Lost')",
      "NOT(CloseDate > TODAY()) && StageName = 'Closed Won'"
    ],
    answer: 1
  },
  {
    id: 29,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Duplicate Management",
    scenario: "An admin sets up a Duplicate Rule on the Lead object with the Action set to 'Alert'. A rep tries to create a Lead with the same email as an existing Lead.",
    question: "What happens when the rep clicks Save?",
    options: [
      "The record is blocked and cannot be saved",
      "The record is saved silently without any warning",
      "The rep sees a warning about the potential duplicate but can still save",
      "The record is automatically merged with the existing Lead"
    ],
    answer: 2
  },
  {
    id: 30,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Sandboxes",
    scenario: "A developer needs a sandbox environment to build and test a new feature. They need a small subset of production data (up to 10GB) copied in, and the sandbox must be refreshable every 29 days.",
    question: "Which sandbox type is the best fit?",
    options: [
      "Developer Sandbox",
      "Developer Pro Sandbox",
      "Partial Copy Sandbox",
      "Full Sandbox"
    ],
    answer: 2
  },
  {
    id: 31,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Approval Processes",
    scenario: "An Opportunity is submitted for approval. The approver is on holiday and has set up a delegated approver. The original approver's manager also needs to be able to approve.",
    question: "Which Approval Process setting allows both the delegated approver AND the manager to approve?",
    options: [
      "Approve based on Queue membership",
      "Allow approvals from related users only",
      "Enable 'Allow Approvers to Reassign'",
      "Configure the step to allow the approver's delegate and manager to approve"
    ],
    answer: 3
  },
  {
    id: 32,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Service Cloud — Entitlements",
    scenario: "A support team has Premium customers who must get a first response within 2 hours and resolution within 8 hours. Standard customers have 24-hour response and 72-hour resolution. These SLAs must be enforced automatically on Cases.",
    question: "Which Salesforce features enforce time-based SLAs on Cases?",
    options: [
      "Case Assignment Rules and Escalation Rules",
      "Entitlements and Milestones",
      "Workflow Rules with Time-Based Actions",
      "Case Teams and Queues"
    ],
    answer: 1
  },
  {
    id: 33,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Dashboards — Running User",
    scenario: "A dashboard must always show data from the perspective of a specific executive user, regardless of which user is actually viewing the dashboard.",
    question: "Which dashboard running user setting achieves this?",
    options: [
      "Run as Logged-in User",
      "Run as Specified User (a fixed named user)",
      "Dynamic Dashboard (run as viewer)",
      "Run as Dashboard Owner"
    ],
    answer: 1
  },
  {
    id: 34,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Data Import — External IDs",
    scenario: "An admin is loading Account records from an external system. They want to prevent duplicates during the load and be able to easily update the same records in future loads, using a unique ID from the external system.",
    question: "What is the correct approach?",
    options: [
      "Use the Salesforce Record Id as the match key",
      "Create a custom field marked as External ID and use it as the upsert key in Data Loader",
      "Use the Account Name as the unique match field",
      "Load all records as new inserts and clean up duplicates afterward"
    ],
    answer: 1
  },
  {
    id: 35,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Experience Cloud — Licences",
    scenario: "A company wants to give 500 external partner users access to a Salesforce Experience Cloud portal to manage their deals and view reports.",
    question: "Which licence type is designed for external partner users accessing Experience Cloud?",
    options: [
      "Salesforce Platform Licence",
      "Customer Community Licence",
      "Partner Community Licence",
      "Chatter External Licence"
    ],
    answer: 2
  },
  {
    id: 36,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Forecasting",
    scenario: "A sales rep updates an Opportunity's Amount from $50,000 to $80,000. The Opportunity has a Stage of 'Proposal' which is mapped to the 'Pipeline' forecast category.",
    question: "How does this change affect the rep's forecast immediately?",
    options: [
      "It has no effect until the manager approves the forecast",
      "The Pipeline forecast for the rep increases by $30,000 automatically",
      "The forecast only updates when the rep manually refreshes it",
      "The change only reflects in the next quarter's forecast"
    ],
    answer: 1
  },
  {
    id: 37,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Record Types",
    scenario: "An admin has two Record Types on the Case object: 'Technical Support' and 'Billing Support'. The 'Priority' picklist has different values available for each Record Type.",
    question: "Where does the admin configure which picklist values are available for each Record Type?",
    options: [
      "In the Picklist field definition in Object Manager",
      "In the Page Layout assigned to the Record Type",
      "In the Record Type configuration under Available Picklist Values",
      "In the Profile settings for each user"
    ],
    answer: 2
  },
  {
    id: 38,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Custom Metadata vs Custom Settings",
    scenario: "An admin needs to store a set of configuration values (tax rates by country) that must be deployable between sandboxes via Change Sets, should survive sandbox refreshes, and must be queryable in Flows and Apex.",
    question: "Which Salesforce feature is the best fit?",
    options: [
      "Custom Settings — Hierarchy type",
      "Custom Settings — List type",
      "Custom Metadata Types",
      "Custom Labels"
    ],
    answer: 2
  },
  {
    id: 39,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Flows — Get Records",
    scenario: "A Flow needs to look up whether an Account with a specific Name already exists in the system. If it exists, update it; if not, create a new one.",
    question: "Which combination of Flow elements handles this logic correctly?",
    options: [
      "Create Records → Assignment → Update Records",
      "Get Records → Decision → Create Records or Update Records",
      "Loop → Assignment → Create Records",
      "Subflow → Get Records → Update Records"
    ],
    answer: 1
  },
  {
    id: 40,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Automation — Scheduled Flow",
    scenario: "An admin wants to send a reminder email to the owner of every open Opportunity where no activity has been logged in the last 14 days. This should happen every morning at 8 AM automatically.",
    question: "Which is the correct Salesforce tool for this time-based automation that requires querying and processing multiple records?",
    options: [
      "Workflow Rule with Time-Based Action",
      "Process Builder with Scheduled Action",
      "Scheduled-Triggered Flow",
      "Approval Process with Reminder"
    ],
    answer: 2
  },

  // ══════════════════════════════════════════════════════════════
  //  PART 3 — LIVE CODING  (Q41 – Q45)
  // ══════════════════════════════════════════════════════════════

  {
    id: 41,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "SOQL — Basic Query",
    language: "SOQL / Apex",
    file: "solution.cls",
    scenario: "Your manager needs a list of all Accounts in the 'Technology' industry where AnnualRevenue is greater than $500,000. The results should show Account Name, Industry, Annual Revenue, and Phone. Order the results by AnnualRevenue from highest to lowest and limit to 10 records.",
    question: "Write the Apex method getTopTechAccounts() that queries and returns these Account records.",
    placeholder: "public static List<Account> getTopTechAccounts() {\n    // Write your SOQL query here\n    return [\n        SELECT ...\n        FROM Account\n        WHERE ...\n    ];\n}",
    hint: "Use: SELECT Id, Name, Industry, AnnualRevenue, Phone FROM Account WHERE Industry = \'Technology\' AND AnnualRevenue > 500000 ORDER BY AnnualRevenue DESC LIMIT 10"
  },
  {
    id: 42,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Apex — DML & sObjects",
    language: "Apex",
    file: "solution.cls",
    scenario: "A new business requirement asks that when a lead is marked as 'Converted', a follow-up Task is automatically created and assigned to the Lead Owner. The Task Subject should be 'Post-conversion follow-up', due date should be 7 days from today, and Status should be 'Not Started'.",
    question: "Write an Apex method createFollowUpTask(Lead convertedLead) that creates and inserts this Task record.",
    placeholder: "public static void createFollowUpTask(Lead convertedLead) {\n    // Build the Task sObject\n    Task t = new Task();\n    // Set the required fields here\n    \n    // Insert the Task\n}",
    hint: "Set: t.Subject = 'Post-conversion follow-up'; t.OwnerId = convertedLead.OwnerId; t.WhoId = convertedLead.Id; t.ActivityDate = Date.today() + 7; t.Status = 'Not Started'; Then call insert t;"
  },
  {
    id: 43,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Apex Trigger — Before Insert",
    language: "Apex",
    file: "AccountTrigger.cls",
    scenario: "Your company has a rule: every new Account created must have the Rating field set to 'Warm' by default if the user leaves it blank. This must happen automatically before the record is saved, without requiring an extra DML update.",
    question: "Write a before insert Apex trigger on Account called AccountDefaultsTrigger that sets Rating to 'Warm' for any Account where Rating is null or blank.",
    placeholder: "trigger AccountDefaultsTrigger on Account (before insert) {\n    for (Account acc : Trigger.new) {\n        // Check and set the default Rating here\n        \n    }\n}",
    hint: "Check if String.isBlank(acc.Rating) or acc.Rating == null. If true, set acc.Rating = \'Warm\'. No DML needed — before triggers modify Trigger.new records directly before they are saved."
  },
  {
    id: 44,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Apex — Collections & Logic",
    language: "Apex",
    file: "solution.cls",
    scenario: "A reporting utility needs a method that takes a List of Opportunity records and returns a Map where the key is the StageName and the value is the total Amount for all Opportunities in that stage. For example: {'Prospecting' => 50000, 'Proposal' => 120000}.",
    question: "Write an Apex method groupAmountByStage(List<Opportunity> opps) that builds and returns this Map<String, Decimal>.",
    placeholder: "public static Map<String, Decimal> groupAmountByStage(List<Opportunity> opps) {\n    Map<String, Decimal> stageMap = new Map<String, Decimal>();\n    \n    for (Opportunity opp : opps) {\n        // Build the map here\n        \n    }\n    \n    return stageMap;\n}",
    hint: "Inside the loop: check if stageMap.containsKey(opp.StageName). If yes, add to existing value: stageMap.put(opp.StageName, stageMap.get(opp.StageName) + (opp.Amount ?? 0)). If no, put a new entry."
  },
  {
    id: 45,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Apex — Exception Handling",
    language: "Apex",
    file: "solution.cls",
    scenario: "A service method queries a Case record by Id and updates its Status to 'Closed'. If the Id is invalid or the record does not exist, the method should not throw an unhandled exception — instead it should return false. If the update is successful, return true.",
    question: "Write an Apex method closeCase(Id caseId) that safely queries and updates the Case, returning true on success and false on any failure.",
    placeholder: "public static Boolean closeCase(Id caseId) {\n    try {\n        // Query the Case by caseId\n        \n        // Update its Status to 'Closed'\n        \n        return true;\n    } catch (Exception e) {\n        System.debug('Error closing case: ' + e.getMessage());\n        return false;\n    }\n}",
    hint: "Inside try: Case c = [SELECT Id, Status FROM Case WHERE Id = :caseId LIMIT 1]; c.Status = \'Closed\'; update c; return true; The catch block catches QueryException (no record) and DmlException (update fails)."
  }


];
