/**
 * @description       : 
 * @author            : Akash Yadav
 * @group             : 
 * @last modified on  : 07-31-2025
 * @last modified by  : Akash Yadav
**/
public with sharing class JobPostingController {

    /**
    * @description 
    * @author Akash Yadav | 07-30-2025 
    * @return List<Job_Posting__c> 
    **/
    @AuraEnabled(cacheable=true)
    public static List<Job_Posting__c> getJobPostingRecords(){
        try {
            List<Job_Posting__c> jobPostingRecords = [SELECT Id,
                                                            Name,
                                                            Position__r.Name,
                                                            Position__r.Location__c,
                                                            Position__r.Status__c,
                                                            Position__r.Type__c,
                                                            Position__r.Functional_Area__c,
                                                            Position__r.Days_Open__c,
                                                            Position__r.Open_Date__c,
                                                            Position__r.Close_Date__c
                                                            FROM Job_Posting__c
                                                            WHERE Position__r.Status__c='Open - Approved'
                                                            WITH SECURITY_ENFORCED];
        return jobPostingRecords;
        } catch (Exception e) {
            throw new MyCustomException(e,'Something went wrong while fetching Job Postings records.');
        }
    }
}