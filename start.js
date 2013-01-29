var apiVersion = "v23.0";
// If you want to prevent dragging, uncomment this section
/*
 * function preventBehavior(e){ 
 * 	e.preventDefault(); 
 * };
 * document.addEventListener("touchmove", preventBehavior, false);
 */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 * see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 * for more details -jm */
/*
 * function handleOpenURL(url){
 * 	// do something with the url passed in.
 * }
 */
var forcetkClient;
var debugMode = true;
jQuery(document).ready(function() {
	//Add event listeners and so forth here
	SFHybridApp.logToConsole("onLoad: jquery ready");
	document.addEventListener("deviceready", onDeviceReady,false);
});
// When this function is called, PhoneGap has been initialized and is ready to roll 
function onDeviceReady() {
	SFHybridApp.logToConsole("onDeviceReady: PhoneGap ready");
	//Call getAuthCredentials to get the initial session credentials
	SalesforceOAuthPlugin.getAuthCredentials(salesforceSessionRefreshed, getAuthCredentialsError);
	//register to receive notifications when autoRefreshOnForeground refreshes the sfdc session
	document.addEventListener("salesforceSessionRefresh",salesforceSessionRefreshed,false);
	//enable buttons
	regLinkClickHandlers();
}
function salesforceSessionRefreshed(creds) {
	SFHybridApp.logToConsole("salesforceSessionRefreshed");
	forcetkClient = new forcetk.Client(creds.clientId, creds.loginUrl);
	forcetkClient.setSessionToken(creds.accessToken, apiVersion, creds.instanceUrl);
	forcetkClient.setRefreshToken(creds.refreshToken);
	forcetkClient.setUserAgentString(creds.userAgent);
	getInspections();			 
}
function getAuthCredentialsError(error) {
	SFHybridApp.logToConsole("getAuthCredentialsError: " + error);
}