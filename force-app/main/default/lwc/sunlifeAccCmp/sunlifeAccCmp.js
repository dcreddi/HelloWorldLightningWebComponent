import { LightningElement, wire,track } from 'lwc';
//import getAccList from '@salesforce/apex/sunLifeAccList.getAccList';
import getAccListServer from '@salesforce/apex/sunLifeAccList.fetchAcc';
import { updateRecord } from 'lightning/uiRecordApi';
import NAME from '@salesforce/schema/Account.Name';
import ID from '@salesforce/schema/Account.Id';
import PHONE from '@salesforce/schema/Account.Phone';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';





const dataTablecolumns = [{
    label: 'Account Name', 
    fieldName: 'Account_Name_Nav__c',
    sortable : true, 
    type: 'url',
    typeAttributes: {value:{ fieldName: 'Account_Name_Nav__c' },label:{fieldName: 'Name'},target: '_parent' } ,
    editable: true
  },

  {
    label : 'Account Owner',
    fieldName : 'OwnerId',
    type : 'text',
    sortable : true,
    editable: true
  },
  {
    label: 'Phone Number', 
    fieldName: 'Phone',
    sortable : false, 
    type: 'phone',
    editable: true
  },
  {
    label: 'Website', 
    fieldName: 'Website',
    sortable : false, 
    type: 'url',
    editable: true
  },
  {
    label: 'Annual Revenue', 
    fieldName: 'AnnualRevenue',
    sortable : false, 
    type: 'currency',
    editable: true
  }
]

export default class SunlifeAccCmp extends LightningElement {
    @track accounts=[];
    columns = dataTablecolumns;
    sortBy='Name';
    sortDirection='asc';
    draftValues = [];
    filterKey ='';



   // @wire(getAccList) Accounts;

    @wire(getAccListServer,{field : '$sortBy',sortOrder : '$sortDirection',filter : '$filterKey'}) accList({error, data}) {
        if(data)
          this.accounts=Object.assign([], data);
          console.log('data',this.accounts);
        if(error)
          console.log(error);
      }
      onSort(event){
        let fieldName = event.detail.fieldName;
        let sortDirection = event.detail.sortDirection;
        
        this.sortBy = fieldName;
        this.sortDirection = sortDirection;
      }

      handleSave(event) {

        const fields = {}; 
        fields[ID.fieldApiName] = event.detail.draftValues[0].Id;
        fields[NAME.fieldApiName] = event.detail.draftValues[0].Name;
        fields[PHONE.fieldApiName] = event.detail.draftValues[0].Phone;


        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account updated',
                    variant: 'success'
                })
            );
            location.reload();
            
            
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    updateSearch(event) {

        this.filterKey = event.detail.value;
        console.log('---',this.filterKey);
    }
      /** since the owner is a id field sorting client side logic need more time so making the sort logic as a server call 
    onSort(event){
        let fieldName = event.detail.fieldName;
        let sortDirection = event.detail.sortDirection;
        
        this.sortBy = fieldName;
        this.sortDirection = sortDirection;
        
        this.sortData(fieldName, sortDirection);
      }

      sortData(fieldName, sortDirection) {
        let sortResult = Object.assign([], this.accounts);
        this.accounts = sortResult.sort(function(a,b){
          if(a[fieldName] < b[fieldName])
            return sortDirection === 'asc' ? -1 : 1;
          else if(a[fieldName] > b[fieldName])
            return sortDirection === 'asc' ? 1 : -1;
          else
            return 0;
        })
      }
       */
      
}