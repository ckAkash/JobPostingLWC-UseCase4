import { LightningElement, wire, track } from 'lwc';
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
    jobPostings = [];
    columns = COLUMNS;
    filteredJobPostings = [];
    value = 'all'; // Default to 'all' to show all job postings initially

    @wire(getJobPostingRecords)
    wiredJobPosting({ error, data }) {
        if (data) {
            // Transform the raw data to a format suitable for the data table
            this.jobPostings = data.map(record => {
                return {
                    Id: record.Id,
                    positionName: record.Position__r?.Name || '',
                    location: record.Position__r?.Location__c || '',
                    functionalArea: record.Position__r?.Functional_Area__c || '',
                    openDate: record.Position__r?.Open_Date__c || '',
                    closeDate: record.Position__r?.Close_Date__c || '',
                    status: record.Position__r?.Status__c || '',
                };
            });

            // Initially show all job postings
            this.filteredJobPostings = this.jobPostings;
            console.log('Transformed data for datatable:', this.jobPostings);
        } else if (error) {
            console.error('Error fetching jobPostings:', error);
        }
    }

    get options() {
        return [
            { label: 'All', value: 'all' },
            { label: 'Finance', value: 'finance' },
            { label: 'Information Technology', value: 'information technology' },
            { label: 'Trainee', value: 'trainee' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.filterJobPostings(); // Apply filter when department is selected
    }

    filterJobPostings() {
        if (this.value === 'all') {
            // Show all job postings if 'All' is selected
            this.filteredJobPostings = this.jobPostings;
        } else {
            // Filter job postings based on the selected department
            this.filteredJobPostings = this.jobPostings.filter(posting =>
                posting.functionalArea.toLowerCase() === this.value.toLowerCase()
            );
        }
    }
}
