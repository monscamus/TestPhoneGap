//REST SF code for mobile Inspector application.

function regLinkClickHandlers() {
    var $j = jQuery.noConflict();
    $j('#link_fetch_inspections').click(function() {
                                           SFHybridApp.logToConsole("link_fetch_inspections clicked");
                                           forcetkClient.query("SELECT Application__r.Applicant__r.Name,Inspecting_Officer__r.Name,Inspection_Type__c, Requested_Date__c FROM Inspection__c", onSuccessInspections, onErrorSfdc); 

                                           });
    
    
    $j('#link_reset').click(function() {
                           SFHybridApp.logToConsole("link_reset clicked");
                           $j("#div_inspection_list").html("")
                           $j("#console").html("")
                           });
                           
    $j('#link_logout').click(function() {
             SFHybridApp.logToConsole("link_logout clicked");
             SalesforceOAuthPlugin.logout();
             });
}




function onSuccessInspections(response) {
    var $j = jQuery.noConflict();
    SFHybridApp.logToConsole("onSuccessInspections: received " + response.totalSize + " inspections");
    
    $j("#div_inspection_list").html("")
    var ul = $j('<ul data-role="listview" data-inset="true" data-theme="a" data-dividertheme="a"></ul>');
    $j("#div_inspection_list").append(ul);
    
    ul.append($j('<li data-role="list-divider">Inspections: ' + response.totalSize + '</li>'));
    $j.each(response.records, function(i, inspection) {
    		SFHybridApp.logToConsole(JSON.stringify(inspection));
    		SFHybridApp.logToConsole("APPLICANT:: " + JSON.stringify(inspection.Applicant__r));
    		
           var newLi = $j("<li><a href='#'>" + (i+1) + " - " + inspection.Inspection_Type__c + "</a></li>");
           ul.append(newLi);
           });
    
    $j("#div_inspection_list").trigger( "create" )
}

function onErrorSfdc(error) {
    SFHybridApp.logToConsole("onErrorSfdc: " + JSON.stringify(error));
    alert('Error getting inspection details!');
}