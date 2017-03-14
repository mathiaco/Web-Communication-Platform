var classesRef;
var colCount = 1;
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
  var color;
    if (colCount == 1) {
        color = "purple";
        colCount++;
    }
    else if (colCount == 2) {
        color = "pink";
        colCount++;
    }
    else if (colCount == 3) {
        color = "orange";
        colCount = 1;
    }
    $("#classRow").append(
        "<div class='col-lg-4'>" +
        "<div class='panel panel-" + color + "'>" +
        "<div class='panel-heading'>" +
        newClass.title +
        "</div>" +
        "<div class='panel-body'>" +
        "<p>" + newClass.description + "</p>" +
        "</div>" +
        "<div class='panel-footer'>" +
        "<a href='/classpage?c=" + snapshot.getKey() + "' class='btn btn-default btn-default btn-block'>View</a>" +
        "</div>" +
        "</div>"
    )
});