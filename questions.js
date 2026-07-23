// =====================================================================
//  SF APEX DEVELOPER ASSESSMENT — Question Bank
//  Fixed 45 questions: 20 Scenario + 20 MCQ + 5 Live Coding
//  Topics: Apex Core + Apex Triggers
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
    category: "Data Types & Variables",
    scenario: "A developer stores a product price in an Integer variable. When the price is 99.99, the stored value becomes 99 and causes wrong invoice totals.",
    question: "What went wrong with the data type choice? Which Apex data type should be used for decimal values like prices? List at least four Apex primitive data types with a simple example of when to use each.",
    placeholder: "Enter your answer..."
  },
  {
    id: 2,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Data Types & Type Casting",
    scenario: "A developer writes: Integer x = 10; Integer y = 3; Decimal result = x / y; and expects the result to be 3.33. Instead, result holds 3.0.",
    question: "Why does this division produce 3.0 instead of 3.33? How does integer division work in Apex? How would you fix the code to get the correct decimal result?",
    placeholder: "Enter your answer..."
  },
  {
    id: 3,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Conditional Statements",
    scenario: "A method receives a student's score and must return a grade: 90+ = 'A', 70-89 = 'B', 50-69 = 'C', below 50 = 'F'. The developer uses separate if statements instead of if-else if.",
    question: "What is the problem with using separate if statements for this grade logic? Rewrite the logic using if, else if, and else. Why does the order of conditions matter in a chain like this?",
    placeholder: "Enter your answer..."
  },
  {
    id: 4,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Conditional Statements",
    scenario: "A method checks a picklist field called Status__c and must run different logic for values: 'New', 'Active', 'Closed', and a default action for anything else. The developer has written a long if-else chain.",
    question: "Rewrite this logic using an Apex switch statement. How is switch different from if-else? What is the 'else' equivalent in a switch statement, and what happens if no case matches and there is no else block?",
    placeholder: "Enter your answer..."
  },
  {
    id: 5,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Iterations",
    scenario: "A developer writes a for loop over a List<Opportunity> and inside the loop executes a SOQL query to fetch related Contacts for each Opportunity. With 150 Opportunities, the code fails in production.",
    question: "What is the problem with placing a SOQL query inside a loop? What Apex governor limit does this violate? How would you fix this using a single SOQL query outside the loop and a Map to correlate the data?",
    placeholder: "Enter your answer..."
  },
  {
    id: 6,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Iterations",
    scenario: "A developer needs to remove items from a List<String> while iterating over it using a for-each loop. The code compiles but produces unexpected results — some entries are not removed.",
    question: "Why is it unsafe to remove items from a collection while iterating it with a for-each loop in Apex? Describe two safe alternatives to handle this correctly.",
    placeholder: "Enter your answer..."
  },
  {
    id: 7,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Introduction to sObjects",
    scenario: "A developer creates an Account sObject in Apex, sets the Name and Phone fields, and then tries to read the Id field before inserting the record. The Id field is null and causes a NullPointerException.",
    question: "Why is the Id field null before a DML insert? What are the default values of common sObject fields (String, Integer, Boolean) before insert? Show a code example of creating, inserting, and reading the Id of an Account.",
    placeholder: "Enter your answer..."
  },
  {
    id: 8,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "SOQL",
    scenario: "A developer writes this code: Account acc = [SELECT Id, Name FROM Account WHERE Name = 'Acme']; The code throws a QueryException in production because sometimes there is no matching record.",
    question: "What are the two situations that can cause this QueryException? How do you safely query for a single record using LIMIT 1? What is the difference between assigning SOQL results to a single object versus a List?",
    placeholder: "Enter your answer..."
  },
  {
    id: 9,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "SOQL Loops",
    scenario: "A developer needs to process all Opportunity records in the org where Amount > 10,000. The total record count could be 60,000 — too large to load into a List at once due to heap size limits.",
    question: "How does a SOQL for loop solve the heap size problem? Explain how it processes records in chunks. Compare the heap usage of assigning SOQL to a List versus using a SOQL for loop.",
    placeholder: "Enter your answer..."
  },
  {
    id: 10,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "SOSL",
    scenario: "A developer needs to search for a customer name across Account, Contact, and Lead objects simultaneously. They consider writing three separate SOQL queries with LIKE '%name%'.",
    question: "Why is SOSL a better choice here than three separate SOQL queries? Write a basic SOSL statement that searches across all three objects. What does the result look like in Apex, and when would SOSL be the wrong choice?",
    placeholder: "Enter your answer..."
  },
  {
    id: 11,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "DML With Apex & Bulkification",
    scenario: "A trigger on Account creates a related Task inside a for loop — one insert per Account. A bulk load of 200 Accounts causes a 'Too many DML statements: 151' error.",
    question: "Explain the DML statement governor limit. How would you fix this by collecting all Task records in a List and inserting them after the loop? Why is this pattern called bulkification and why is it mandatory in Apex?",
    placeholder: "Enter your answer..."
  },
  {
    id: 12,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "DML With Apex",
    scenario: "A developer inserts a List of 10 Lead records using insert leadList. Some records fail due to validation rules and the entire operation rolls back. The requirement is to insert valid records and log failures separately.",
    question: "What is the difference between insert leadList (all-or-nothing) and Database.insert(leadList, false) with partial success? How do you use Database.SaveResult to check which records failed? Write a simple code example.",
    placeholder: "Enter your answer..."
  },
  {
    id: 13,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Debugging & Logging",
    scenario: "A developer uses System.debug() throughout a complex Apex class. They are not sure how to view the logs or which log level to use. The debug logs are very long and hard to read.",
    question: "How do you view debug logs in Salesforce? What log levels are available (ERROR, WARN, INFO, DEBUG, FINE, FINER, FINEST) and when would you use each? What best practices help keep debug logs readable?",
    placeholder: "Enter your answer..."
  },
  {
    id: 14,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Exception Handling",
    scenario: "A developer writes an Apex method that queries a record by Id and updates its fields. Sometimes the record does not exist and a NullPointerException crashes the transaction with no useful error message.",
    question: "Explain what a NullPointerException is and the most common causes in Apex. Show how to use a try-catch block to handle it gracefully. What information should always be logged inside the catch block?",
    placeholder: "Enter your answer..."
  },
  {
    id: 15,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Exception Handling",
    scenario: "A developer creates a service class that validates Opportunity data. The architect wants the service to throw a custom exception called InvalidOpportunityException instead of returning a Boolean when validation fails.",
    question: "How do you create a custom Apex exception class? Write the InvalidOpportunityException class, show how to throw it with a message from the service, and catch it in the calling code. What class must a custom exception extend?",
    placeholder: "Enter your answer..."
  },
  {
    id: 16,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Custom Labels, Settings & Metadata",
    scenario: "A developer has error messages and discount percentages hardcoded directly in Apex classes. When the business wants to update these values, a full code deployment is required each time.",
    question: "Compare Custom Labels, Custom Settings, and Custom Metadata Types as solutions to this problem. Which would you use for each type of value (UI message vs configuration number) and why? How do you access each one in Apex?",
    placeholder: "Enter your answer..."
  },
  {
    id: 17,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Email Services",
    scenario: "When a new high-priority Case is created, an automatic notification email must be sent to the Support Manager. The developer is unsure whether to use Messaging.SingleEmailMessage or an Email Alert via Flow.",
    question: "Explain how to send an email from Apex using Messaging.SingleEmailMessage. What are the key fields you must set? What is the governor limit for email sends per transaction, and how do you avoid hitting it when sending to multiple recipients?",
    placeholder: "Enter your answer..."
  },
  {
    id: 18,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Apex Triggers — Before vs After",
    scenario: "A developer needs to set a default value on a field before a Contact record is saved. A colleague suggests using an after insert trigger and performing a second DML update to set the value.",
    question: "Why is a before insert trigger the better choice for setting a default field value? What is the key difference between before and after triggers in terms of how they modify records and DML usage?",
    placeholder: "Enter your answer..."
  },
  {
    id: 19,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Apex Triggers — Context Variables",
    scenario: "A developer writes a trigger on Contact that fires on both insert and update. On update, they need to compare the old value of the Email field to the new value. The developer uses Trigger.old[0] to get the old record, which fails when multiple records are updated at once.",
    question: "Explain Trigger.old, Trigger.new, Trigger.oldMap, and Trigger.newMap. Why is Trigger.old[0] dangerous in a bulk context? Write the correct pattern to detect field changes by comparing Trigger.newMap and Trigger.oldMap.",
    placeholder: "Enter your answer..."
  },
  {
    id: 20,
    part: "Part 1 — Scenario Questions",
    type: "scenario",
    category: "Apex Triggers — Bulkification & Governor Limits",
    scenario: "An org has three separate triggers on the Account object written by different developers. When an Account is updated, all three fire in an unpredictable order and one trigger's changes overwrite another's. A Process Builder also runs on Account.",
    question: "Explain the risks of multiple triggers on the same object. What is the Single Trigger / Trigger Handler pattern and how does it solve this? Where do triggers fit in the Salesforce Order of Execution for a record save?",
    placeholder: "Enter your answer..."
  },

  // ══════════════════════════════════════════════════════════════
  //  PART 2 — MCQ  (Q21 – Q40)
  // ══════════════════════════════════════════════════════════════

  {
    id: 21,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Data Types",
    scenario: "A developer needs to store a product price of 29.99 in an Apex variable.",
    question: "Which data type is most appropriate for storing a decimal monetary value in Apex?",
    options: [
      "Integer",
      "Long",
      "Decimal",
      "Boolean"
    ],
    answer: 2
  },
  {
    id: 22,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Data Types & Type Casting",
    scenario: "A developer writes: Integer i = (Integer) 9.9;",
    question: "What is the value of i after this statement executes?",
    options: [
      "10 — it rounds up to the nearest integer",
      "9 — it truncates the decimal portion",
      "A TypeException is thrown at runtime",
      "A compile error is thrown"
    ],
    answer: 1
  },
  {
    id: 23,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Conditional Statements",
    scenario: "An Apex switch statement is written to evaluate a String variable. At runtime the variable's value is null.",
    question: "How does an Apex switch statement handle a null input value?",
    options: [
      "It throws a NullPointerException automatically",
      "It matches the first when clause regardless of value",
      "It falls through to the else block if present, otherwise does nothing",
      "Null causes a compile-time error in switch statements"
    ],
    answer: 2
  },
  {
    id: 24,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Iterations",
    scenario: "A developer uses a for-each loop to iterate a List<Account> and tries to remove records from the list inside the loop body.",
    question: "What happens when you try to remove an item from a List while iterating it with a for-each loop in Apex?",
    options: [
      "The item is removed successfully",
      "A compile error is thrown",
      "A System.ListException is thrown at runtime",
      "The loop silently skips the removed item"
    ],
    answer: 2
  },
  {
    id: 25,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Introduction to sObjects",
    scenario: "A developer creates a new Account sObject in memory and reads its Id field before inserting it.",
    question: "What is the value of the Id field on a newly created sObject before a DML insert is performed?",
    options: [
      "A temporary Id assigned by Apex",
      "An empty String ''",
      "null",
      "000000000000000"
    ],
    answer: 2
  },
  {
    id: 26,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "SOQL",
    scenario: "A developer writes: Account acc = [SELECT Id, Name FROM Account WHERE Name = 'Acme']; and there are zero matching records in the org.",
    question: "What happens when a SOQL query assigned to a single sObject variable returns zero records?",
    options: [
      "The variable is set to null",
      "A QueryException is thrown: 'List has no rows for assignment to SObject'",
      "An empty Account with null fields is returned",
      "The code compiles but the Id will be null"
    ],
    answer: 1
  },
  {
    id: 27,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "SOQL",
    scenario: "A developer writes a SOQL query that returns 60,000 Account records assigned directly to a List<Account> in a single transaction.",
    question: "What happens when a SOQL result assigned to a List exceeds 50,000 rows?",
    options: [
      "Only the first 50,000 records are returned silently",
      "A QueryException is thrown: 'Too many query rows: 50001'",
      "The query automatically paginates into the list in chunks",
      "A heap size error is thrown before the query limit is reached"
    ],
    answer: 1
  },
  {
    id: 28,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "SOQL Loops",
    scenario: "A developer uses a SOQL for loop: for (List<Account> chunk : [SELECT Id FROM Account WHERE ...]) { ... }",
    question: "How many records does each chunk List contain per iteration by default?",
    options: [
      "1 record per iteration",
      "100 records per iteration",
      "200 records per iteration",
      "500 records per iteration"
    ],
    answer: 2
  },
  {
    id: 29,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "SOSL",
    scenario: "A developer runs a SOSL query in a test class to search for a Contact they just inserted in the same test. The SOSL returns zero results even though the insert succeeded.",
    question: "Why does SOSL return no results for newly inserted records in test context?",
    options: [
      "SOSL is not supported inside test methods",
      "Search indexes are not updated during test execution — use Test.setFixedSearchResults()",
      "The Contact was not committed before the SOSL ran",
      "SOSL requires a minimum of 10 records to return results"
    ],
    answer: 1
  },
  {
    id: 30,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "DML With Apex",
    scenario: "A developer wants to insert a list of Leads where some might fail validation rules, but valid records should still be saved without rolling back everything.",
    question: "Which method allows partial success when inserting a list of records?",
    options: [
      "insert leadList inside a try-catch",
      "Database.insert(leadList, false) and check SaveResult[]",
      "Database.insert(leadList, true) and check UpsertResult[]",
      "Partial inserts are not supported in Apex"
    ],
    answer: 1
  },
  {
    id: 31,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "DML With Apex",
    scenario: "A developer needs to either insert a Contact if it does not exist, or update it if it does, using Email as the unique match key. Email is set as an External Id field.",
    question: "Which DML operation handles both insert and update in a single statement?",
    options: [
      "merge",
      "update",
      "upsert",
      "insert or update (not a real operation)"
    ],
    answer: 2
  },
  {
    id: 32,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Debugging & Logging",
    scenario: "A developer wants to print the value of a variable called totalAmount to the debug log.",
    question: "Which statement correctly logs the value of totalAmount in Apex?",
    options: [
      "console.log('Total: ' + totalAmount);",
      "Debug.print('Total: ' + totalAmount);",
      "System.debug('Total: ' + totalAmount);",
      "Apex.log('Total: ' + totalAmount);"
    ],
    answer: 2
  },
  {
    id: 33,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Exception Handling",
    scenario: "A developer writes a SOQL query inside a try block that might return no results. They want to catch only query-related exceptions.",
    question: "Which exception type should be caught for a failed SOQL assignment that returns zero or multiple rows?",
    options: [
      "NullPointerException",
      "DmlException",
      "QueryException",
      "TypeException"
    ],
    answer: 2
  },
  {
    id: 34,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Custom Labels",
    scenario: "A developer needs to access a Custom Label called Welcome_Message in an Apex class.",
    question: "Which syntax correctly retrieves a Custom Label value in Apex?",
    options: [
      "CustomLabel.Welcome_Message",
      "Label.get('Welcome_Message')",
      "System.Label.Welcome_Message",
      "$Label.Welcome_Message"
    ],
    answer: 2
  },
  {
    id: 35,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Custom Metadata vs Custom Settings",
    scenario: "A developer stores configuration values that must survive sandbox refreshes, be deployable via Change Sets, and be queryable in Apex. Per-user values are not required.",
    question: "Which Salesforce feature best meets all these requirements?",
    options: [
      "Custom Settings — Hierarchy type",
      "Custom Settings — List type",
      "Custom Metadata Types",
      "Custom Labels"
    ],
    answer: 2
  },
  {
    id: 36,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Email Services",
    scenario: "A developer calls Messaging.sendEmail() inside a for loop that iterates 15 times, sending one email per iteration.",
    question: "What is the maximum number of Messaging.sendEmail() calls allowed per Apex transaction?",
    options: [
      "10",
      "50",
      "100",
      "Unlimited — only the number of recipients is limited"
    ],
    answer: 0
  },
  {
    id: 37,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Apex Triggers — Context Variables",
    scenario: "A trigger on Contact is written for the delete event. The developer uses Trigger.new inside the trigger body.",
    question: "What is the value of Trigger.new in a delete trigger?",
    options: [
      "It contains the records being deleted with their current field values",
      "It contains the records as they will appear after deletion",
      "It is null — only Trigger.old is populated on a delete trigger",
      "It contains an empty list"
    ],
    answer: 2
  },
  {
    id: 38,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Apex Triggers — Before vs After",
    scenario: "A developer needs to automatically set a default field value before a Contact record is saved, without issuing an additional DML update.",
    question: "Which trigger event handles this most efficiently?",
    options: [
      "after insert — to read the Id after save and then update",
      "before insert — fields on Trigger.new can be modified directly before save",
      "after update — to check the value after the initial save",
      "before delete — to preserve values before removal"
    ],
    answer: 1
  },
  {
    id: 39,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Apex Triggers — Bulkification",
    scenario: "A trigger on Opportunity is invoked by Data Loader uploading 1,000 records at once.",
    question: "In how many batches does Salesforce invoke the trigger for 1,000 records?",
    options: [
      "1 invocation for all 1,000 records at once",
      "1,000 separate invocations — one per record",
      "5 invocations of 200 records each",
      "10 invocations of 100 records each"
    ],
    answer: 2
  },
  {
    id: 40,
    part: "Part 2 — Multiple Choice Questions",
    type: "mcq",
    category: "Governor Limits",
    scenario: "A developer writes a SOQL query inside a for loop. The loop iterates 150 times.",
    question: "Which governor limit does this pattern violate?",
    options: [
      "Maximum heap size of 6 MB",
      "Maximum CPU time of 10,000 ms",
      "Maximum 100 SOQL queries per transaction",
      "Maximum 150 DML statements per transaction"
    ],
    answer: 2
  },

  // ══════════════════════════════════════════════════════════════
  //  PART 3 — LIVE CODING — TRIGGERS  (Q41 – Q45)
  // ══════════════════════════════════════════════════════════════

  {
    id: 41,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Trigger — Before Insert",
    language: "Apex",
    file: "ContactTrigger.cls",
    scenario: "When a new Contact record is created, if the Description field is blank or null, it should automatically be set to 'New Contact - Needs Review' before the record is saved. This must work even if 200 Contacts are inserted at the same time.",
    question: "Write a before insert Apex trigger on the Contact object named ContactDefaultsTrigger that sets the default Description.",
    placeholder: "",
    hint: ""
  },
  {
    id: 42,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Trigger — After Insert (Bulkified)",
    language: "Apex",
    file: "AccountTrigger.cls",
    scenario: "Whenever a new Account is created, a follow-up Task must be automatically created for that Account. The Task should have Subject = 'Follow up with new Account', Status = 'Not Started', and Due Date = today + 7 days. The trigger must handle bulk inserts without hitting governor limits.",
    question: "Write a bulkified after insert trigger on the Account object named AccountTaskTrigger. Collect all Task records in a List and insert them with a single DML statement outside the loop.",
    placeholder: "",
    hint: ""
  },
  {
    id: 43,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Trigger — After Update (Field Change Detection)",
    language: "Apex",
    file: "OpportunityTrigger.cls",
    scenario: "When an Opportunity's Stage is changed to 'Closed Won', a custom field Won_Date__c (Date) should automatically be set to today's date. If the Stage changes to anything else, Won_Date__c should be cleared. The trigger must compare old and new Stage values to detect the change.",
    question: "Write an after update trigger on Opportunity named OpportunityWonDateTrigger. Use Trigger.oldMap to detect the stage change and update the Won_Date__c field.",
    placeholder: "",
    hint: ""
  },
  {
    id: 44,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Trigger — Before Delete (Validation)",
    language: "Apex",
    file: "AccountTrigger.cls",
    scenario: "The business has a rule that Customer accounts should never be deleted. If a user attempts to delete an Account where Type = 'Customer', the deletion must be blocked with the error message: 'Customer accounts cannot be deleted.'",
    question: "Write a before delete trigger on the Account object named AccountDeleteProtectionTrigger that blocks deletion of Customer type accounts using the addError() method.",
    placeholder: "",
    hint: ""
  },
  {
    id: 45,
    part: "Part 3 — Live Coding",
    type: "coding",
    category: "Trigger — Before Insert",
    language: "Apex",
    file: "ContactTrigger.cls",
    scenario: "Whenever a Contact is inserted with existing email trigger doe not allow to create a record in salesforce.",
    question: "Prevent users from creating a Contact if another Contact already exists with the same Email.",
    placeholder: "",
    hint: ""
  }

];
