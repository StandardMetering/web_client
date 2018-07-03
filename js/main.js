let standardMeteringGetAllInstallsEndpoint = "/api/install/all";
let addQueryParameter = "?";
let csvParameter = "format=csv";

function handleNewUser(user) {
  if(user.admin_rights) {
    $(".admin-functions").css("visibility", "visible");
  } else {
    $(".admin-functions").css("visibility", "hidden");
  }
}

function getAllInstallsPressed() {
  let user = getCurrentUser();

  if( !user || !user.admin_rights) {
    alert("You must be an admin to access this functionality");
    return;
  }

  getAllInstallsFromServer( user );
}

function getAllInstallsFromServer(user) {

  if( !user || !user.admin_rights) {
    alert("You must be an admin to access this functionality");
    return;
  }

  let xhr = new XMLHttpRequest();

  xhr.open('GET',
    standardMeteringGetAllInstallsEndpoint
    + addQueryParameter
    + csvParameter);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + user.id_token);
  xhr.addEventListener("load", handleAllInstallsResponse);

  console.log( "Authenticating google user." );
  xhr.send();
}

function handleAllInstallsResponse() {
  let response = this.responseText;
  download("allInstalls.csv", response);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}