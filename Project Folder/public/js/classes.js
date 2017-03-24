var classesRef;
var colCount = 1;

// Writes class data to database
function writeClasstData(name, title, content) {

    var newPostRef = classesRef.push();
    newPostRef.set({
        ta: name,
        title: title,
        description: content
    });
}

// Initialize the database to read and write data
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

// Button event for sending the class to the function that writes it to the database
$("#createClassBtn").click(function () {
    writeClasstData("Jeff", $("#class-title").val(), $("#description-text").val())
});


// OLD
// When class is added to database it'll display it
/*classesRef.on("child_added", function (snapshot, prevChildKey) {
    var newClass = snapshot.val();
    var color;

    // Changes color of panel heading for fun
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



    // append a new class with a specific key
    $("#classRow").append(
        "<div id=" + snapshot.getKey() + " class='col-lg-4'>" +
        "<div class='panel panel-" + color + "'>" +
        "<div class='panel-heading'>" +
        newClass.title +
        "<button id='" + snapshot.getKey() + "' class='btn btn-xs btn-danger pull-right' onClick='deleteBox(this.id)'><i class='fa fa-times'></i></button>" +
        "</div>" +
        "<div class='panel-body'>" +
        "<p>" + newClass.description + "</p>" +
        "</div>" +
        "<div class='panel-footer'>" +
        "<a href='/classpage?c=" + snapshot.getKey() + "' class='btn btn-default btn-default btn-block'>View</a>" +
        "</div>"
    )

});*/

// delete the specific class from the database and also the class will not be showed anymore on the webpage.
function deleteBox(id) {
    classesRef.child(id).remove();
    var idOfBox = id;
    $("div").remove("#" + idOfBox);
};

// allows user to join class when button is pressed
function joinClass(classID) {
    ref = firebase.database().ref("users/");
    ref.orderByChild("user_id").equalTo(currentUserID).once("value").then(function (snapshot) {
      snapshot.forEach(function (user) {
        firebase.database().ref("classes/" + classID + "/users/" + user.key).set({
          username: user.val().username,
          user_id: user.key
        });
      });
    });
}

// Ability to search for class
$("#classSearchBtn").click(function () {

    var className = $("#classSearchInput").val();
    ref = firebase.database().ref("classes/");

    // Finds the class you search based on the text input
    ref.orderByChild("title").equalTo(className).once("value").then(function (snapshot) {
        snapshot.forEach(function (classSearched) {
            $("#searchedClassesRow").append(
                "<div class='col-lg-4'>" +
                "<div class='panel panel-default'>" +
                "<div class='panel-heading'>" +
                classSearched.val().title +
                "</div>" +
                "<div class='panel-body'>" +
                "<p>" + classSearched.val().description + "</p>" +
                "</div>" +
                "<div class='panel-footer'>" +
                "<button id='" + classSearched.getKey() + "' type='button' class='btn btn-success btn-default btn-block' onClick='joinClass(this.id)'>Join</button>" +
                "</div>" +
                "</div>"
            )
        });
    });
});

firebase.database().ref("classes/").orderByChild("users/" + currentUserID + "/user_id").equalTo(currentUserID).once("value").then(function (snapshot) {
    var color;
    snapshot.forEach(function (childSnapshot) {
    var newClass = childSnapshot.val();

    // Changes color of panel heading for fun
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



    // append a new class with a specific key
    $("#classRow").append(
        "<div id=" + childSnapshot.getKey() + " class='col-lg-4'>" +
        "<div class='panel panel-" + color + "'>" +
        "<div class='panel-heading'>" +
        newClass.title +
        "<button id='" + childSnapshot.getKey() + "' class='btn btn-xs btn-danger pull-right' onClick='deleteBox(this.id)'><i class='fa fa-times'></i></button>" +
        "</div>" +
        "<div class='panel-body'>" +
        "<p>" + newClass.description + "</p>" +
        "</div>" +
        "<div class='panel-footer'>" +
        "<a href='/classpage?c=" + childSnapshot.getKey() + "' class='btn btn-default btn-default btn-block'>View</a>" +
        "</div>"
    )
    })
});