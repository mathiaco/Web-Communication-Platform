var classesRef;
var rowCount = 0;
function writePostData(name, title, content) {
  var newPostRef = classesRef.push();
  newPostRef.set({
      ta: name,
      title: title,
      description: content
  });
}

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

initializeFirebase();
classesRef = firebase.database().ref("classes/");

$("#createClassBtn").click( function() {
  writePostData("Jeff", $("#class-title").val(), $("#description-text").val())
});



classesRef.on("child_added", function(snapshot, prevChildKey) {
  var newClass = snapshot.val();
    $("#classRow").append(
        "<div class='col-lg-4'>" +
        "<div class='panel panel-purple'>" +
        "<div class='panel-heading'>" +
        newClass.title +
        "</div>" +
        "<div class='panel-body'>" +
        "<p>" + newClass.description + "</p>" +
        "</div>" +
        "<div class='panel-footer'>" +
        "<a href='/classpage' class='btn btn-default btn-default btn-block'>View</a>" +
        "</div>" +
        "</div>"
    )
});