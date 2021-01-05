public with sharing  class sunLifeAccList {
    
  /**   @AuraEnabled
    public static List<Account> getAccList() {
        return [
            SELECT Id, Name, Industry,OwnerId,Phone,Website,AnnualRevenue 
            FROM Account
            WHERE Industry = 'Financial Services'];
    }**/

    @AuraEnabled (Cacheable=true)
    public static List<Account> fetchAcc(String field, String sortOrder, String filter){
        String filterStr = 'Financial Services';
        List<Account> rtnList =  new  List<Account> ();
        string tempInput = filter + '%';


        if (string.isNotBlank(filter)) {
            system.debug('---'+filter);
            return  rtnList = Database.query(' Select Id, Name,Account_Name_Nav__c, Industry,OwnerId,Owner.Name,Phone,Website,AnnualRevenue FROM Account WHERE (Industry =:filterStr AND Name LIKE :tempInput) ORDER BY '+field+' '+sortOrder);

        }else {
            return  rtnList = Database.query(' Select Id, Name,Account_Name_Nav__c, Industry,OwnerId,Owner.Name,Phone,Website,AnnualRevenue FROM Account WHERE Industry =:filterStr ORDER BY '+field+' '+sortOrder);

        }
    
}
}
