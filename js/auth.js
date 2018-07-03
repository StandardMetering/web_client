/* global gapi */

let API_KEY = "AIzaSyBlG0DgcKrot1t_nKo8n3cU20oDlZqmHD4";
let CLIENT_ID = "438678561117-04vl6pt423vtr7dkmg5jc4mfbknna387.apps.googleusercontent.com";
var GoogleAuth;
var currentUser;
let SCOPE = "https://www.googleapis.com/auth/drive.metadata.readonly";
let standardMeteringURL = "localhost:63342";
let standardMeteringAuthEndpoint = "/api/user/info";


function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {

  let discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

  gapi.client.init( {
    'apiKey': API_KEY,
    'discoveryDocs': [discoveryUrl],
    'clientId': CLIENT_ID,
    'scope': SCOPE
  } ).then(function() {
    GoogleAuth = gapi.auth2.getAuthInstance();
    GoogleAuth.isSignedIn.listen(updateSignInStatus);
    GoogleAuth.signOut();
    currentUser = null;
    $("#sign-in-button").on( "click", signInButtonClicked);
  } );
}

function updateSignInStatus(isSignedIn) {

  if(!isSignedIn) {
    return;
  }

  let user = GoogleAuth.currentUser.get();

  if( user ) {
    let id_token = user.getAuthResponse().id_token;
    if( id_token ) {
      authenticateIdToken(id_token);
    } else {
      GoogleAuth.signOut();
    }
  }
}

function authenticateIdToken(id_token) {

  let xhr = new XMLHttpRequest();

  xhr.open('GET', standardMeteringAuthEndpoint );
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + id_token);
  xhr.addEventListener("load", handleAuthResponse);

  console.log( "Authenticating google user." );
  xhr.send();
}

function handleAuthResponse() {
  jsonData = JSON.parse(this.responseText);
  console.log(jsonData);

  if(jsonData.accepted) {
    handleNewUser(jsonData.data);
    currentUser = jsonData.data;
    currentUser.id_token = GoogleAuth.currentUser.get().getAuthResponse().id_token;

    let signInButton =  $("#sign-in-button");
    signInButton.html(jsonData.data.display_name);
    signInButton.on( "click", signOutButtonClicked);
  }
}

function signOutButtonClicked() {
  GoogleAuth.signOut();
  currentUser = null;
  let signInButton =  $("#sign-in-button");
  signInButton.html("Sign In");
  signInButton.on( "click", signInButtonClicked);
}

function signInButtonClicked() {
    GoogleAuth.signIn();
}

function getCurrentUser() {
  return currentUser;
}