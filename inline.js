//REST SF code for mobile Inspector application.
function regLinkClickHandlers() {
    var $j = jQuery.noConflict();
    $j('select').selectmenu();
    $j('#link_reset').click(function() {
        SFHybridApp.logToConsole("link_reset clicked");
        $j("#div_inspection_list").html("")
        $j("#console").html("")
    });
    $j('#link_logout').click(function() {
        SFHybridApp.logToConsole("link_logout clicked");
        SalesforceOAuthPlugin.logout();
    });
    $j('#link_fetch_inspections').click(function() {
    	getInspections();
    });
    
    
// TIME STUFF START
	$j('#btnstart').css({
        position: 'relative', // from pianoKey class
        left: '0px',
        top: gap,
        width: '50px',
        height: '21px',
    }).click(function() {
		var d = new Date();
		var e;
		var dd = dateFormat(d, "dd/mm/yyyy HH:MM");
		$j('#txtstart').val(dd);
		$j("#txtend").scroller('option', 'minDate', d);
		return false;
    });
	$j('#btnend').css({
        position: 'relative', // from pianoKey class
        left: '0px',
        top: gap,
        width: '50px',
        height: '21px',
    }).click(function() {
		var d = new Date();
		var dd = dateFormat(d, "dd/mm/yyyy HH:MM");
    	$j('#txtend').val(dd);
    	return false;
    });
  // start Mobiscroll
    $j("#txtstart").scroller({ 
    	preset: 'datetime',
    	dateFormat: 'dd/mm/yy',
    	timeFormat : 'HH:ii',
        theme: 'android-ics light' 
    });
    $j("#txtend").scroller({ 
    	preset: 'datetime',
    	dateFormat: 'dd/mm/yy',
    	timeFormat : 'HH:ii',
        theme: 'android-ics light'
    });
  // end Mobiscroll
// TIME STUFF START
	
	
	
    $j('#btnback').click(function() {
		window.location ="#page1";
    	return false;
    });
    $j('#btnbackmap').click(function() {
		window.location ="#page2";
    	return false;
    });
    $j('#btnbackphoto').click(function() {
		window.location ="#page2";
    	return false;
    });
    $j('#btnbacknote').click(function() {
		window.location ="#page2";
    	return false;
    });
    $j('#btnmap').click(function() {
		window.location ="#pageMap";
   		return false;
    });    
    $j('#btnnotes').click(function() {
		window.location ="#pageNote";
   		return false;
    });    
    $j('#btnsave').click(function() {
    	var savedata = {
    		"Start__c": stringToSalesForceDate($j("#txtstart").val()),
    		"End__c": stringToSalesForceDate($j("#txtend").val())
    	};
    	forcetkClient.upsert("Inspection__c", "Id", cI.Id, savedata, endSave, onErrorSfdc);
    	savedata = {
    		"ParentId": cI.Id,
        	"Title": "Mobile Note",
        	"Body": $j("textarea#Textbin").val()
       	};
    	forcetkClient.create("Note", savedata, endSave, onErrorSfdc);
    	return false;
    });
// Start Notes
    $j('#btnqnotes').click(function() {
    	alert("Notes Button clicked");
		window.location ="#pageNotes";
   		return false;
    });
    $j(".draggable").click(function(){
        var newText = $j(this).text();
        var oldText = $j("textarea#Textbin").val();
        $j("textarea#Textbin").val((oldText.length != 0) ? oldText + " " + newText : newText);
    });
// end Quick Notes
   
// start Camera
    $j('#btnpicture').click(function() {
		window.location ="#pagePhoto";
   		return false;
    });
    
    $j('#btntakephoto').click(function() {
    	navigator.camera.getPicture(cameraSuccess, cameraFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL});
    });
// end Camera

}

   
//BACK BUTTON OVERRIDE START
document.addEventListener("backbutton", yourCallbackFunction, false);
//BACK BUTTON OVERRIDE END 
function yourCallbackFunction(){
	var $j = jQuery.noConflict();
	var firstLevelPages = new Array("page1");
	var secondLevelPages = new Array("page2");
	var thirdLevelPages = new Array("pageMap","pagePhoto","pageNotes");

	var currentPage = window.location.toString();
	currentPage = currentPage.substring(currentPage.indexOf("#") + 1);
	
	if($j.inArray(currentPage, thirdLevelPages) !== -1){
		window.location ="#page2";
	}else if($j.inArray(currentPage, secondLevelPages) !== -1){
		window.location ="#page1";
	}else{
		navigator.app.exitApp();
	}
}

// CAMERA FUNCTIONS
function cameraSuccess(imageData) {
	// Update the image on screen
    var imageHolder = document.getElementById('myPhotoHolder');
    var newImg = $j("<img/>").css({"width":"100%"}).attr({"src":"data:image/jpeg;base64,"+imageData}).appendTo(imageHolder);
}
function cameraFail(message) {
    alert('Failed because: ' + message);
}

// DATE FUNCTIONS
function stringToDateObject(start){
	// format we use is: "dd/mm/yyyy HH:MM"
    var year = start.substring(6,10);
    var month = start.substring(3,5);
    var day = start.substring(0,2);
    var hours = start.substring(11,13);
    var minutes = start.substring(14,16);
    var d = new Date(year, month, day, hours, minutes, 00, 00);
    return d; 
}
function stringToSalesForceDate(start){
	// FROM: 10/09/2007 07:30
	// TO:   2007-09-10T07:30:00-16:00
	var d = start.substring(6,10);
	d += "-";
	d += start.substring(3,5);
	d += "-";
	d += start.substring(0,2);
	d += "T";
	d += start.substring(11,13);
	d += ":";
	d += start.substring(14,16);
	d += ":00-00:00";
	return d;
}
function salesForceDateToString(start){
	// FROM: 2007-09-10T07:30:00-16:00
	// TO:   10/09/2007 07:30
	var d = start.substring(8,10);
	d += "/";
	d += start.substring(5,7);
	d += "/";
	d += start.substring(0,4);
	d += " ";
	d += start.substring(11,13);
	d += ":";
	d += start.substring(14,16);
	return d;
}
function endSave() {
	window.location ="#page1";
   	return false;
}
function getInspections() {
	SFHybridApp.logToConsole("auto load the inspections");
    forcetkClient.query("SELECT Id, Application__r.FullAddress__c, Application__r.Applicant__r.Name,Inspecting_Officer__r.Name,Inspection_Type__c, Requested_Date__c FROM Inspection__c", onSuccessInspections, onErrorSfdc);
}
var cI = {}, cA = {}, cApplicant = {}, cAgent = {};
//Populate a front list of the items for this BC officer
function onSuccessInspections(response) {
    var $j = jQuery.noConflict();    
    SFHybridApp.logToConsole("onSuccessInspections: received " + response.totalSize + " inspections");
    $j("#div_inspection_list").html("")
    var ul = $j('<ul data-role="listview" data-inset="true" data-theme="b" data-divider-theme="c" data-dividertheme="a"></ul>');
    $j("#div_inspection_list").append(ul);
    //Construct the list of inspections
    ul.append($j('<li data-role="list-divider">Inspections: ' + response.totalSize + '</li>'));
    $j.each(response.records, function(i, inspection) {
    	   //SFHybridApp.logToConsole(JSON.stringify(inspection));
           var newLi = $j("<li>");    		
           var newA = $j("<a>").text((i+1) + " - " + inspection.Application__r.FullAddress__c  + "(" + inspection.Inspection_Type__c + ") " + inspection.Application__r.Applicant__r.Name);
           //For each link add a call to populate the data and navigate
           newA.click({"id": inspection.Id}, function(event) {
	           goInspection(event.data.id);           
           });
           newLi.append(newA);
           
           ul.append(newLi);
       });
    
    $j("#div_inspection_list").trigger( "create" );
}

//Fill out the list of old inspections for this application
function onSuccessOldInspections(response) {
    var $j = jQuery.noConflict();    
      
    SFHybridApp.logToConsole("onSuccessInspections: received " + response.totalSize + " inspections");
    
    $j("#div_old_inspection_list").html("")
    var ul = $j('<ul data-role="listview" data-inset="true" data-theme="b" data-divider-theme="c" data-dividertheme="a"></ul>');
    $j("#div_old_inspection_list").append(ul);
    
    //Construct the list of inspections
    ul.append($j('<li data-role="list-divider">Prior Inspections: ' + response.totalSize + '</li>'));
    $j.each(response.records, function(i, inspection) {

           var newLi = $j("<li>");    		
           var newA = $j("<a>").text((i+1) + " " + ((inspection.Decision__c)? inspection.Decision__c: "No Decision") + " - " + inspection.Requested_Date__c);
           
           //For each link add a call to populate the data and navigate
           //newA.click({"id": inspection.Id}, function(event) {
           //           goInspection(event.data.id);           
           //});
           
           newLi.append(newA);
           
           ul.append(newLi);
       });
    
    $j("#div_old_inspection_list").trigger( "create" );
}

//Load details from the inspection object
function onSuccessVisit(response) {
    var $j = jQuery.noConflict();    
	//cache the item so that the form actions can use it
	cI = response;
	if(cI.Start__c) {
		$j("#txtstart").val(salesForceDateToString(cI.Start__c));
	}else{
		$j("#txtstart").empty();
	}
	if(cI.End__c) {
		$j("#txtend").val(salesForceDateToString(cI.End__c));
	}else{
		$j("#txtend").empty();
	}
	if(cI.Decision__c) {
		$j("#select-choice-0").val(cI.Decision__c);
	}else{
		$j("#select-choice-0").empty();
	}
    //SFHybridApp.logToConsole(JSON.stringify(response));         
    forcetkClient.retrieve("BCApplication__c", response.Application__c, null, onSuccessApplication, onErrorSfdc);     
    forcetkClient.query("SELECT Id, Body FROM Note WHERE ParentId='"+cI.Id+"'", onSuccessNotes, onErrorSfdc);
    
    
}

//Load details from the main application object
function onSuccessApplication(response) {
    var $j = jQuery.noConflict();    
    cA = response;
	$j("#bcapplication").empty();
    $j("#bcapplication").append("<h3>Application " + cA.Name + "</h3>");
    $j("#bcapplication").append("<label>Site:</label>  <span>"+cA.FullAddress__c+"</span><br/>");
    $j("#bcapplication").append("<label>Proposed Works:</label>  <span>"+cA.Proposed_Works__c+"</span><br/>");
    $j("#bcapplication").append("<label>Deposit Date:</label>  <span>"+cA.Deposit_Date__c+"</span><br/>");
    $j("#bcapplication").append("<label>Type:</label> <span>"+cA.Developer_Type__c+"</span><br/>");
    $j("#bcapplication").append("<label>Purpose:</label> <span>"+cA.Purpose_Group__c+"</span><br/>");
	//SFHybridApp.logToConsole(JSON.stringify(response));
    if (response.Applicant__c) {
    	forcetkClient.retrieve("Contact", response.Applicant__c, null, onSuccessApplicant, onErrorSfdc);
    }        
    if (response.Agent__c) { 
    	forcetkClient.retrieve("Contact", response.Agent__c, null, onSuccessAgent, onErrorSfdc); 
    }        
    //Get other inspections on this application
    forcetkClient.query("SELECT Id, Decision__c, Application__r.Applicant__r.Name, Inspection_Type__c, Requested_Date__c FROM Inspection__c WHERE Application__c='"+cA.Id+"' AND Id !='"+cI.Id+"' ORDER BY Requested_Date__c", onSuccessOldInspections, onErrorSfdc);
    //Get the map for the location of this application
    forcetkClient.query("SELECT Id, UPRN__r.Latitude__c, UPRN__r.Longitude__c FROM BCApplication__c WHERE Id='"+cA.Id+"'", onSuccessMap, onErrorSfdc);
    //Get Attachments associated with this application
    forcetkClient.query("SELECT Id, Name, Body from Attachment WHERE ParentId='"+cA.Id+"'", onSuccessPhoto, onErrorSfdc);
}

//Load details from the agent object
function onSuccessAgent(response) {
    var $j = jQuery.noConflict();    
    $j("#agent").empty();
    $j("#agent").append("<h3>Agent</h3>");
    $j("#agent").append("<label>Name:</label> <span>" + cAgent.Name + "</span><br/>");
    $j("#agent").append("<label>Address:</label> <span>"+cAgent.MailingStreet+" " + cAgent.MailingCity + " " + cAgent.MailingPostalCode + "</span><br/>");
    cAgent = response;
}

//Load details from the note object
function onSuccessNotes(response) {
    var $j = jQuery.noConflict();        
    $j("#notes").empty();
    $j("#notes").append("<h3>Notes</h3>");
    $j.each(response.records, function(i, note) {
	$j("#notes").append(note.Body);
	
    });
    $j("textarea#Textbin").val('');
}
function onSuccessMap(response) {
    var lat = response.records[0].UPRN__r.Latitude__c;
    var lon = response.records[0].UPRN__r.Longitude__c;
	initializeMap(lat, lon);
}

function initializeMap(lat, lon) {
	var myCenter = new google.maps.LatLng(lat, lon);
	var myOptions = {
		zoom: 11,
		center: myCenter,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById("mymap"), myOptions);
}

function onSuccessPhoto(response){
	var $j = jQuery.noConflict();
	var baseUri = "https://c.eu1.content.force.com/servlet/servlet.FileDownload?file=";
	var imageHolder = $j('#myPhotoHolder');
	imageHolder.children("img").remove();
	$j.each(response.records, function(){
		var newImg = $j("<img/>").css({"width":"100%"}).attr({"src":"data:image/jpeg;base64,"+baseUri+this.Id}).appendTo(imageHolder);
		/*
		var imgId = this.Id;
		$j.ajax({
			url: "https://c.eu1.content.force.com/servlet/servlet.FileDownload",
			data: {
				"file" : imgId
			},
			success: function(msg){
				alert(msg);
			}
		});
		*/
	});
}



//Load details from the applicant object
function onSuccessApplicant(response) {
    var $j = jQuery.noConflict();    
	$j("#applicant").empty();
    $j("#applicant").append("<h3>Applicant</h3>");
    $j("#applicant").append("<label>Name:</label> <span>" + cApplicant.Name + "</span><br/>");
    $j("#applicant").append("<label>Address:</label> <span>"+cApplicant.MailingStreet+" " + cApplicant.MailingCity + " " + cApplicant.MailingPostalCode + "</span><br/>");
    cApplicant = response;
};




//General error handler
function onErrorSfdc(error) {
    SFHybridApp.logToConsole("onErrorSfdc: " + JSON.stringify(error));
    alert('Error getting details.');
}

//Load details section and show it to the user (multipage layout)
function goInspection(id) {
	window.location = "#page2";
	forcetkClient.retrieve("Inspection__c", id, null, onSuccessVisit, onErrorSfdc);	
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
