import { LightningElement, wire } from 'lwc';
import getJobPostingRecords from '@salesforce/apex/JobPostingController.getJobPostingRecords';

// Updated column definitions to reference flattened field names
const COLUMNS = [
    { label: 'Position Name', fieldName: 'positionName', type: 'text' },
    { label: 'Location', fieldName: 'location', type: 'text' },
    { label: 'Department', fieldName: 'functionalArea', type: 'text' },
    { label: 'Position Open Date', fieldName: 'openDate', type: 'date' },
    { label: 'Position Close Date', fieldName: 'closeDate', type: 'date' },
    { label: 'Status', fieldName: 'status', type: 'text' },
];

export default class JobPostingLwc extends LightningElement {
    jobPostings;
    columns = COLUMNS;

    @wire(getJobPostingRecords)
    wiredJobPosting({ error, data }) {
        if (data) {
            console.log('Raw data from controller:', data);
            
            this.jobPostings = data.map(record => {
                return {
                    // Keep the original Id for key-field requirement
                    Id: record.Id,
                    positionName: record.Position__r?.Name || '',
                    location: record.Position__r?.Location__c || '',
                    functionalArea: record.Position__r?.Functional_Area__c || '',
                    openDate: record.Position__r?.Open_Date__c || '',
                    closeDate: record.Position__r?.Close_Date__c || '',
                    status: record.Position__r?.Status__c || '',
                    name: record.Name,
                    employmentWebsite: record.Employment_Website__c
                };
            });
            
            console.log('Transformed data for datatable:', this.jobPostings);
        } else if (error) {
            console.error('Error fetching jobPostings:', error);
        }
    }
}