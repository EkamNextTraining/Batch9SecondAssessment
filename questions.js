// =====================================================================
//  SF LIVE CODING ASSESSMENT — Question Bank (30 questions)
//  Topics: Apex, SOQL, Triggers, LWC
//  Difficulty: Easy to Medium
//  Random pick: 5 questions per session
// =====================================================================

const ALL_QUESTIONS = [

  // ── Apex — Data Types & Methods ──────────────────────────────────
  {
    category: "Apex — Variables & Methods",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "A utility class is needed that calculates a discounted price. Given an original price (Decimal) and a discount percentage (Integer), return the final price after applying the discount. If the discount is more than 100 or less than 0, return the original price unchanged.",
    question: "Write an Apex method calculateDiscountedPrice(Decimal originalPrice, Integer discountPct) that returns the final price after discount.",
    placeholder: "public static Decimal calculateDiscountedPrice(Decimal originalPrice, Integer discountPct) {\n    // your code here\n}",
    hint: "Check discountPct >= 0 && discountPct <= 100. Compute: originalPrice - (originalPrice * discountPct / 100). Return originalPrice if invalid."
  },
  {
    category: "Apex — Collections",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "You have a List<String> of city names that may contain duplicates. You need to return a new List<String> with only unique city names, preserving the original order of first occurrence.",
    question: "Write an Apex method getUniqueCities(List<String> cities) that returns a deduplicated list in order.",
    placeholder: "public static List<String> getUniqueCities(List<String> cities) {\n    // your code here\n}",
    hint: "Use a Set<String> to track seen cities. Iterate with for-each. Add to result list only if not in the Set yet. Handle null input."
  },
  {
    category: "Apex — Conditionals & Loops",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "You need a method that takes a list of integers and returns a Map with two keys: 'even' mapped to a list of even numbers from the input, and 'odd' mapped to a list of odd numbers. Preserve the original order within each group.",
    question: "Write an Apex method separateEvenOdd(List<Integer> numbers) that returns a Map<String, List<Integer>> with 'even' and 'odd' keys.",
    placeholder: "public static Map<String, List<Integer>> separateEvenOdd(List<Integer> numbers) {\n    // your code here\n}",
    hint: "Initialise both lists first. Use Math.mod(n, 2) == 0 to identify evens. Iterate and add to the correct list. Return the map."
  },
  {
    category: "Apex — Exception Handling",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "A method receives a String that should be a valid Salesforce record Id. If it is null, blank, or not a valid Id format, the method should throw a custom exception called InvalidIdException with a descriptive message instead of letting Apex throw a generic error.",
    question: "Write the InvalidIdException class and a method validateId(String rawId) that throws it if the input is invalid.",
    placeholder: "public class InvalidIdException extends Exception {}\n\npublic class IdValidator {\n    public static Id validateId(String rawId) {\n        // your code here\n    }\n}",
    hint: "Check String.isBlank(rawId) first. Then try Id parsed = (Id) rawId inside try-catch(TypeException). Throw InvalidIdException with a message if blank or catch fires."
  },
  {
    category: "Apex — sObjects & DML",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "A method should create a Contact for a given Account Id. The Contact's First Name and Last Name are passed as parameters. After creating the Contact, the method should return the new Contact's Id. If AccountId is null, do not insert and return null.",
    question: "Write an Apex method createContact(Id accountId, String firstName, String lastName) that creates and inserts a Contact, returning its Id.",
    placeholder: "public static Id createContact(Id accountId, String firstName, String lastName) {\n    // your code here\n}",
    hint: "Check accountId != null first. Create: Contact c = new Contact(AccountId=accountId, FirstName=firstName, LastName=lastName); insert c; return c.Id;"
  },

  // ── SOQL ─────────────────────────────────────────────────────────
  {
    category: "SOQL — Basic Query",
    language: "SOQL / Apex",
    badge: "badge-soql",
    file: "solution.cls",
    requirement: "You need a method that finds all Accounts in a given Industry with an AnnualRevenue greater than a given minimum value. The results should be ordered by AnnualRevenue descending and limited to 10 records.",
    question: "Write an Apex method getTopAccounts(String industry, Decimal minRevenue) that queries and returns the matching Accounts.",
    placeholder: "public static List<Account> getTopAccounts(String industry, Decimal minRevenue) {\n    // your code here\n}",
    hint: "SELECT Id, Name, Industry, AnnualRevenue FROM Account WHERE Industry = :industry AND AnnualRevenue > :minRevenue ORDER BY AnnualRevenue DESC LIMIT 10"
  },
  {
    category: "SOQL — Parent Relationship",
    language: "SOQL / Apex",
    badge: "badge-soql",
    file: "solution.cls",
    requirement: "A page needs to display a list of Contacts with their parent Account's Name and Rating. The Contacts should belong to a specific Account passed as a parameter.",
    question: "Write an Apex method getContactsWithAccount(Id accountId) that queries Contacts and includes Account.Name and Account.Rating using a parent relationship query.",
    placeholder: "public static List<Contact> getContactsWithAccount(Id accountId) {\n    // your code here\n}",
    hint: "SELECT Id, FirstName, LastName, Email, Account.Name, Account.Rating FROM Contact WHERE AccountId = :accountId"
  },
  {
    category: "SOQL — Aggregate Query",
    language: "SOQL / Apex",
    badge: "badge-soql",
    file: "solution.cls",
    requirement: "A reporting method needs to return the total Opportunity Amount and count of Opportunities for each Account. Only include Accounts that have more than 2 Opportunities. Return the results as a List<AggregateResult>.",
    question: "Write an Apex method getOpportunitySummaryByAccount() that uses an aggregate SOQL query with GROUP BY and HAVING.",
    placeholder: "public static List<AggregateResult> getOpportunitySummaryByAccount() {\n    // your code here\n}",
    hint: "SELECT AccountId, Account.Name, COUNT(Id) oppCount, SUM(Amount) totalAmount FROM Opportunity GROUP BY AccountId, Account.Name HAVING COUNT(Id) > 2"
  },
  {
    category: "SOQL — Safe Single Record",
    language: "SOQL / Apex",
    badge: "badge-soql",
    file: "solution.cls",
    requirement: "A method receives a Contact Id and must return the full Contact record including Name, Email, Phone, and AccountId. If the record does not exist or the Id is invalid, return null instead of throwing an exception.",
    question: "Write an Apex method getContactById(Id contactId) that safely returns a Contact or null.",
    placeholder: "public static Contact getContactById(Id contactId) {\n    // your code here\n}",
    hint: "Wrap in try { return [SELECT Id, Name, Email, Phone, AccountId FROM Contact WHERE Id = :contactId]; } catch (QueryException e) { return null; }"
  },
  {
    category: "SOQL — Dynamic Query",
    language: "SOQL / Apex",
    badge: "badge-soql",
    file: "solution.cls",
    requirement: "You need a flexible search method that searches Account records by Name. The search term may be a partial name (the method should handle wildcards automatically). Results should be limited to 20 and ordered by Name ascending.",
    question: "Write an Apex method searchAccountsByName(String searchTerm) that uses a dynamic SOQL or wildcard LIKE query and returns matching Accounts.",
    placeholder: "public static List<Account> searchAccountsByName(String searchTerm) {\n    // your code here\n}",
    hint: "Use: String term = '%' + searchTerm + '%'; return [SELECT Id, Name, Industry FROM Account WHERE Name LIKE :term ORDER BY Name LIMIT 20]; Check for blank searchTerm."
  },

  // ── Apex Triggers ─────────────────────────────────────────────────
  {
    category: "Trigger — Before Insert",
    language: "Apex",
    badge: "badge-trigger",
    file: "ContactTrigger.cls",
    requirement: "When a new Contact is created without a Description, it should automatically be set to 'New contact — requires review'. If a Description is already provided, leave it unchanged. This must work when 1 or 1000 Contacts are inserted at once.",
    question: "Write a before insert trigger on Contact (ContactDefaultsTrigger) that sets the default Description for any blank Contact.",
    placeholder: "trigger ContactDefaultsTrigger on Contact (before insert) {\n    for (Contact c : Trigger.new) {\n        // your code here\n    }\n}",
    hint: "Check String.isBlank(c.Description). If blank, set c.Description = 'New contact — requires review'. No DML needed — before triggers modify Trigger.new directly."
  },
  {
    category: "Trigger — After Insert, Bulk",
    language: "Apex",
    badge: "badge-trigger",
    file: "AccountTrigger.cls",
    requirement: "When a new Account is inserted, automatically create a Task assigned to the Account Owner with Subject = 'Initial contact call', due tomorrow. Must handle bulk inserts (e.g. 200 Accounts at once) without violating governor limits.",
    question: "Write an after insert trigger on Account (AccountTaskTrigger) that creates one Task per Account. All DML must be outside any loop.",
    placeholder: "trigger AccountTaskTrigger on Account (after insert) {\n    List<Task> tasks = new List<Task>();\n    for (Account acc : Trigger.new) {\n        // build the Task here\n    }\n    // insert after loop\n}",
    hint: "Inside loop: tasks.add(new Task(WhatId=acc.Id, Subject='Initial contact call', ActivityDate=Date.today()+1, OwnerId=acc.OwnerId)); After loop: if (!tasks.isEmpty()) insert tasks;"
  },
  {
    category: "Trigger — Update & Field Change",
    language: "Apex",
    badge: "badge-trigger",
    file: "OpportunityTrigger.cls",
    requirement: "When an Opportunity's StageName is changed to 'Closed Won', automatically set the custom field Win_Date__c (Date) to today's date. If the stage changes to anything else, Win_Date__c should be cleared (set to null). Use Trigger.oldMap to detect the change.",
    question: "Write an after update trigger on Opportunity (OpportunityWinDateTrigger) that sets or clears Win_Date__c based on the StageName change.",
    placeholder: "trigger OpportunityWinDateTrigger on Opportunity (after update) {\n    List<Opportunity> toUpdate = new List<Opportunity>();\n    for (Opportunity opp : Trigger.new) {\n        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);\n        // your code here\n    }\n    if (!toUpdate.isEmpty()) update toUpdate;\n}",
    hint: "Compare opp.StageName != oldOpp.StageName. If new stage is 'Closed Won', add new Opportunity(Id=opp.Id, Win_Date__c=Date.today()). Else add with Win_Date__c=null."
  },
  {
    category: "Trigger — Before Delete (Validation)",
    language: "Apex",
    badge: "badge-trigger",
    file: "AccountTrigger.cls",
    requirement: "Prevent deletion of any Account where the Type field is 'Strategic Partner'. If a user or process tries to delete such an Account, show the error message: 'Strategic Partner accounts cannot be deleted. Please contact your administrator.'",
    question: "Write a before delete trigger on Account (AccountDeleteGuardTrigger) that blocks deletion of Strategic Partner accounts.",
    placeholder: "trigger AccountDeleteGuardTrigger on Account (before delete) {\n    for (Account acc : Trigger.old) {\n        // your code here\n    }\n}",
    hint: "Check acc.Type == 'Strategic Partner'. If true, call acc.addError('Strategic Partner accounts cannot be deleted. Please contact your administrator.');"
  },
  {
    category: "Trigger — Handler Pattern",
    language: "Apex",
    badge: "badge-trigger",
    file: "LeadTrigger.cls",
    requirement: "Refactor a Lead trigger to use a handler class. On before insert: if LeadSource is blank, set it to 'Web'. On after insert: create a Task for each Lead with Subject = 'Follow up with ' + Lead.FirstName. Use separate handler methods for each event.",
    question: "Write LeadTrigger (the trigger) and LeadTriggerHandler (the class) with two static methods.",
    placeholder: "trigger LeadTrigger on Lead (before insert, after insert) {\n    if (Trigger.isBefore && Trigger.isInsert) {\n        LeadTriggerHandler.setDefaultSource(Trigger.new);\n    }\n    if (Trigger.isAfter && Trigger.isInsert) {\n        LeadTriggerHandler.createFollowUpTasks(Trigger.new);\n    }\n}\n\npublic class LeadTriggerHandler {\n    public static void setDefaultSource(List<Lead> leads) {\n        // your code here\n    }\n    public static void createFollowUpTasks(List<Lead> leads) {\n        // your code here\n    }\n}",
    hint: "setDefaultSource: if blank, set l.LeadSource='Web'. createFollowUpTasks: build List<Task> with WhoId=lead.Id, Subject='Follow up with '+lead.FirstName, insert after loop."
  },

  // ── DML & Bulkification ───────────────────────────────────────────
  {
    category: "Apex — DML & Partial Success",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "A batch process receives a List<Lead> to insert. Some records may fail due to required field validation. Valid records must still be saved. The method should return a list of error messages for any failed records, one message per failed Lead.",
    question: "Write an Apex method insertLeads(List<Lead> leads) that uses Database.insert with partial success and returns List<String> error messages.",
    placeholder: "public static List<String> insertLeads(List<Lead> leads) {\n    List<String> errors = new List<String>();\n    // your code here\n    return errors;\n}",
    hint: "Database.SaveResult[] results = Database.insert(leads, false); Loop results: if (!sr.isSuccess()) errors.add(sr.getErrors()[0].getMessage());"
  },
  {
    category: "Apex — Upsert",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "An integration sends Account records from an external system. Each Account has a field External_Id__c (External Id field). Some Accounts already exist in Salesforce, some are new. One operation should handle both insert and update based on External_Id__c.",
    question: "Write an Apex method syncAccounts(List<Account> accounts) that uses upsert with External_Id__c as the match key and handles errors gracefully.",
    placeholder: "public static void syncAccounts(List<Account> accounts) {\n    // your code here\n}",
    hint: "Database.UpsertResult[] results = Database.upsert(accounts, Account.External_Id__c, false); Loop results: check ur.isSuccess(). For failures, log ur.getErrors()[0].getMessage()."
  },
  {
    category: "Apex — Map & Bulkification",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "Given a List<Contact>, update each Contact's Description to say 'Works at: ' + their Account Name. You must fetch the Account Names from the database. The solution must use only ONE SOQL query and ONE DML statement, even for 200+ Contacts.",
    question: "Write an Apex method stampAccountNameOnContacts(List<Contact> contacts) that updates the Description field on each Contact using a single SOQL and single DML.",
    placeholder: "public static void stampAccountNameOnContacts(List<Contact> contacts) {\n    // Step 1: collect Account Ids\n    // Step 2: one SOQL to get Account names\n    // Step 3: loop contacts, set Description\n    // Step 4: one DML update\n}",
    hint: "Collect AccountIds into a Set. Query: Map<Id,Account> accountMap = new Map<Id,Account>([SELECT Id, Name FROM Account WHERE Id IN :accountIds]); Loop contacts, set c.Description='Works at: '+accountMap.get(c.AccountId).Name; update contacts;"
  },

  // ── Debugging & Logging ────────────────────────────────────────────
  {
    category: "Apex — Debugging",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "You need a reusable logging utility that writes structured debug messages. Each log entry should show: the class/method context, the message, the number of SOQL queries used so far, and the CPU time consumed.",
    question: "Write an Apex class Logger with a static method log(String context, String message) that outputs a formatted debug line with governor limit stats.",
    placeholder: "public class Logger {\n    public static void log(String context, String message) {\n        // your code here\n    }\n}",
    hint: "Use System.debug('[' + context + '] ' + message + ' | SOQL: ' + Limits.getQueries() + '/' + Limits.getLimitQueries() + ' | CPU: ' + Limits.getCpuTime() + 'ms');"
  },

  // ── Email ──────────────────────────────────────────────────────────
  {
    category: "Apex — Email",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "When a Case is closed (Status = 'Closed'), send a customer satisfaction email to the Case's contact email (SuppliedEmail). The email subject should be 'Your case has been resolved' and the body should thank them and mention the Case Number.",
    question: "Write an Apex method sendCaseClosedEmail(Case closedCase) that sends the satisfaction email using Messaging.SingleEmailMessage.",
    placeholder: "public static void sendCaseClosedEmail(Case closedCase) {\n    // your code here\n}",
    hint: "Create Messaging.SingleEmailMessage mail. Set toAddresses = new List<String>{closedCase.SuppliedEmail}; subject = 'Your case has been resolved'; plainTextBody includes closedCase.CaseNumber. Call Messaging.sendEmail(new List<...>{mail});"
  },

  // ── Custom Metadata / Settings ─────────────────────────────────────
  {
    category: "Apex — Custom Settings",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "A Hierarchy Custom Setting called App_Config__c has a field Max_Export_Rows__c (Integer). You need a utility method that returns this value for the running user. If no setting exists, default to 1000.",
    question: "Write an Apex method getMaxExportRows() that reads the Custom Setting for the running user and returns the limit, defaulting to 1000.",
    placeholder: "public static Integer getMaxExportRows() {\n    // your code here\n}",
    hint: "App_Config__c config = App_Config__c.getInstance(UserInfo.getUserId()); if (config != null && config.Max_Export_Rows__c != null) return config.Max_Export_Rows__c.intValue(); return 1000;"
  },
  {
    category: "Apex — Custom Metadata",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "A Custom Metadata Type called Tax_Rate__mdt has fields: Country__c (text) and Rate__c (number). Write a method that returns the tax rate for a given country. Return 0 if no record is found for that country.",
    question: "Write an Apex method getTaxRate(String country) that queries Custom Metadata and returns the Rate__c value.",
    placeholder: "public static Decimal getTaxRate(String country) {\n    // your code here\n}",
    hint: "List<Tax_Rate__mdt> rates = [SELECT Rate__c FROM Tax_Rate__mdt WHERE Country__c = :country LIMIT 1]; return rates.isEmpty() ? 0 : rates[0].Rate__c;"
  },

  // ── Trigger — Recursion Prevention ────────────────────────────────
  {
    category: "Trigger — Recursion Prevention",
    language: "Apex",
    badge: "badge-trigger",
    file: "ContactTrigger.cls",
    requirement: "An after update trigger on Contact sends an email when the Email field changes. The email sending sometimes causes another update to the Contact, triggering the same logic again and sending duplicate emails. A static flag must prevent this.",
    question: "Write the ContactEmailChangeTrigger trigger and a ContactTriggerHelper class with a static Boolean flag to prevent the logic from running more than once per transaction.",
    placeholder: "public class ContactTriggerHelper {\n    public static Boolean hasRun = false;\n\n    public static void onEmailChange(List<Contact> newList, Map<Id, Contact> oldMap) {\n        // your code here\n    }\n}\n\ntrigger ContactEmailChangeTrigger on Contact (after update) {\n    if (!ContactTriggerHelper.hasRun) {\n        ContactTriggerHelper.onEmailChange(Trigger.new, Trigger.oldMap);\n    }\n}",
    hint: "In onEmailChange: set hasRun = true at start. Loop newList, compare c.Email != oldMap.get(c.Id).Email. For changed records, send email via Messaging.SingleEmailMessage."
  },

  // ── Trigger — Count Rollup ─────────────────────────────────────────
  {
    category: "Trigger — Count Rollup (Bulkified)",
    language: "Apex",
    badge: "badge-trigger",
    file: "CaseTrigger.cls",
    requirement: "When Cases are inserted, updated, or deleted, update the parent Account's Total_Cases__c field (custom Integer field) with the current count of all Cases for that Account. This must work for bulk operations with only one SOQL and one DML.",
    question: "Write the trigger CaseCountTrigger and a handler method updateCaseCount(Set<Id> accountIds) that recalculates and updates the count.",
    placeholder: "trigger CaseCountTrigger on Case (after insert, after update, after delete) {\n    Set<Id> accountIds = new Set<Id>();\n    for (Case c : (Trigger.isDelete ? Trigger.old : Trigger.new)) {\n        if (c.AccountId != null) accountIds.add(c.AccountId);\n    }\n    CaseCountHandler.updateCaseCount(accountIds);\n}\n\npublic class CaseCountHandler {\n    public static void updateCaseCount(Set<Id> accountIds) {\n        // your code here\n    }\n}",
    hint: "Query: SELECT AccountId, COUNT(Id) cnt FROM Case WHERE AccountId IN :accountIds GROUP BY AccountId. Build Map<Id,Integer>. Create Account list with Id + Total_Cases__c. update accounts;"
  },

  // ── Test Class ─────────────────────────────────────────────────────
  {
    category: "Apex — Test Class",
    language: "Apex",
    badge: "badge-apex",
    file: "solution_test.cls",
    requirement: "A trigger on Account automatically sets the Rating field to 'Hot' when AnnualRevenue > 1,000,000 on insert. Write a test class that validates both the positive case (revenue > 1M → Rating = Hot) and negative case (revenue <= 1M → Rating unchanged). Test with 200 records for bulk validation.",
    question: "Write a test class AccountRatingTriggerTest with @TestSetup, a bulk positive test, and a bulk negative test.",
    placeholder: "@isTest\npublic class AccountRatingTriggerTest {\n\n    @isTest\n    static void testBulkHotRating() {\n        // Insert 200 accounts with AnnualRevenue > 1,000,000\n        // Assert Rating == 'Hot' for all\n    }\n\n    @isTest\n    static void testBulkNoHotRating() {\n        // Insert 200 accounts with AnnualRevenue <= 1,000,000\n        // Assert Rating is NOT 'Hot'\n    }\n}",
    hint: "Create 200 Accounts in a loop with AnnualRevenue = 2000000 (positive) or 500000 (negative). insert accounts; Query back. Use System.assertEquals to check Rating for all records."
  },
  {
    category: "Apex — Test Class (DML)",
    language: "Apex",
    badge: "badge-apex",
    file: "solution_test.cls",
    requirement: "Write a test class for a method insertLeads(List<Lead>) that uses Database.insert with partial success. The test should verify: (1) valid records are inserted successfully, (2) invalid records (missing required fields) are not inserted, and (3) the returned error list has the right count.",
    question: "Write a test class LeadInsertServiceTest that covers both successful and failed insertions in the same test method.",
    placeholder: "@isTest\npublic class LeadInsertServiceTest {\n\n    @isTest\n    static void testPartialSuccess() {\n        // Create a mix of valid and invalid Lead records\n        // Call insertLeads()\n        // Assert correct counts\n    }\n}",
    hint: "Create valid Lead with required fields (LastName, Company). Create invalid Lead without required fields. Call insertLeads(leads). Assert errors.size() == 1. Query Leads to confirm only valid one was inserted."
  },

  // ── SOSL ────────────────────────────────────────────────────────────
  {
    category: "SOSL — Multi-Object Search",
    language: "SOSL / Apex",
    badge: "badge-soql",
    file: "solution.cls",
    requirement: "A global search page allows users to type a keyword that searches across Account (Name, Website) and Contact (FirstName, LastName, Email) at the same time. The method must return a combined list of results from both objects.",
    question: "Write an Apex method globalSearch(String keyword) using SOSL that searches both objects and returns all results as List<sObject>.",
    placeholder: "public static List<sObject> globalSearch(String keyword) {\n    if (String.isBlank(keyword)) return new List<sObject>();\n    // your code here\n}",
    hint: "List<List<sObject>> results = [FIND :keyword IN ALL FIELDS RETURNING Account(Id, Name), Contact(Id, FirstName, LastName, Email)]; List<sObject> combined = new List<sObject>(); combined.addAll(results[0]); combined.addAll(results[1]); return combined;"
  },

  // ── Extra Medium Questions ─────────────────────────────────────────
  {
    category: "Apex — String Utilities",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "A method receives a full name as a single String (e.g. 'John Michael Smith'). It should split it into First Name (first word), Last Name (last word), and Middle Name (everything in between). Return a Map with keys 'firstName', 'middleName', 'lastName'. If only two words, middleName should be empty string.",
    question: "Write an Apex method splitFullName(String fullName) that returns a Map<String, String> with firstName, middleName, and lastName.",
    placeholder: "public static Map<String, String> splitFullName(String fullName) {\n    // your code here\n}",
    hint: "Use fullName.trim().split(' '). parts[0] = firstName. parts[parts.size()-1] = lastName. Middle = String.join(parts sublist from 1 to size-1, ' '). Handle single word case."
  },
  {
    category: "Apex — Governor Limits Awareness",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "You have a helper method that queries related records. Before calling it, you want to check if there is SOQL capacity remaining in the current transaction. If fewer than 5 SOQL queries remain, skip the optional query and return an empty list instead.",
    question: "Write an Apex method safeQueryContacts(Id accountId) that checks remaining SOQL capacity before querying. Return an empty list if fewer than 5 queries remain.",
    placeholder: "public static List<Contact> safeQueryContacts(Id accountId) {\n    // your code here\n}",
    hint: "int remaining = Limits.getLimitQueries() - Limits.getQueries(); if (remaining < 5) return new List<Contact>(); return [SELECT Id, Name, Email FROM Contact WHERE AccountId = :accountId];"
  },
  {
    category: "Trigger — Undelete",
    language: "Apex",
    badge: "badge-trigger",
    file: "ContactTrigger.cls",
    requirement: "When a Contact is undeleted (restored from the Recycle Bin), automatically set the Description field to 'Record restored on ' + today's date (formatted as YYYY-MM-DD). This must handle bulk undelete of many Contacts at once.",
    question: "Write an after undelete trigger on Contact (ContactUndeleteTrigger) that stamps the restore date on Description.",
    placeholder: "trigger ContactUndeleteTrigger on Contact (after undelete) {\n    List<Contact> toUpdate = new List<Contact>();\n    for (Contact c : Trigger.new) {\n        // your code here\n    }\n    if (!toUpdate.isEmpty()) update toUpdate;\n}",
    hint: "String today = String.valueOf(Date.today()); toUpdate.add(new Contact(Id=c.Id, Description='Record restored on ' + today)); update toUpdate after loop."
  },
  {
    category: "Apex — Batch Apex",
    language: "Apex",
    badge: "badge-apex",
    file: "solution.cls",
    requirement: "Write a Batch Apex class that processes all Contacts where the Email field is blank. For each blank-email Contact, set the Email to 'unknown_' + Contact.Id + '@noemail.com'. Process in chunks of 200.",
    question: "Write the Batch Apex class FixBlankEmailBatch implementing Database.Batchable<sObject> with start, execute, and finish methods.",
    placeholder: "global class FixBlankEmailBatch implements Database.Batchable<sObject> {\n\n    global Database.QueryLocator start(Database.BatchableContext bc) {\n        // your code here\n    }\n\n    global void execute(Database.BatchableContext bc, List<Contact> contacts) {\n        // your code here\n    }\n\n    global void finish(Database.BatchableContext bc) {\n        // your code here (can be empty or send a completion email)\n    }\n}",
    hint: "start: return Database.getQueryLocator([SELECT Id, Email FROM Contact WHERE Email = null]); execute: for each contact set c.Email = 'unknown_' + c.Id + '@noemail.com'; update contacts; finish: optional System.debug or email."
  }
];

// ── Shuffle & Pick ───────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestionSet() {
  return shuffle(ALL_QUESTIONS).slice(0, 5);
}

let QUESTIONS = [];
