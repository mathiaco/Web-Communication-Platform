
function initializeFirebase() {
  var config = {
    apiKey: "AIzaSyC0_XhkEWujv03WECUWtR0Hck9WH_hjkoU",
    authDomain: "group3db-f028e.firebaseapp.com",
    databaseURL: "https://group3db-f028e.firebaseio.com",
    storageBucket: "group3db-f028e.appspot.com",
    messagingSenderId: "164875081133"
  };
  firebase.initializeApp(config);
}

function getClassID() {
  var pageURL = window.location.search.substring(1);
  pageURL = pageURL.split("=");
  classID = pageURL[1]
}

var classID;
getClassID();

initializeFirebase();

firebase.database().ref("classes/" + classID).once("value").then(function (snapshot) {
  $("#classTitle").text(snapshot.val().title);
  var refClassUsers = firebase.database().ref("classes/" + classID + "/users/").orderByValue();
  refClassUsers.once("value").then(function (childSnapshot) {
    childSnapshot.forEach(function (childChildSnapshot) {
      $("#classMembers").append(
        "<a href='#' class='list-group-item'>" +
        childChildSnapshot.val() +
        "</a>"
      )
    })
  })
})

