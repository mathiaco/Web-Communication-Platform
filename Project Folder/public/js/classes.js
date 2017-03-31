var classesRef;
var colCount = 1;
var color;
classesRef = firebase.database().ref("classes/");
var icons = ["fa-glass", "fa-music", "fa-heart", "fa-star", "fa-plane", "fa-coffee",
    "fa-cutlery", "fa-thumbs-up", "fa-flash", "fa-gamepad", "fa-tree"];
var userColors = ["success", "warning", "info", "default", "danger"];

// Writes class data to database
function writeClasstData(taID, title, description) {
    var newClassRef = classesRef.push();
    var classKey = newClassRef.getKey();
    newClassRef.set({
        ta: taID,
        title: title,
        description: description
    });
    joinClass(classKey);
    listClass(classKey, title, description, taID);
}

// delete the specific class from the database and also the class will not be showed anymore on the webpage.
function deleteBox(id) {
    classesRef.child(id).remove();
    var idOfBox = id;
    $("div").remove("#" + idOfBox);
};

// allows user to join class when button is pressed
function joinClass(classID) {
    var rndColor = Math.floor(Math.random() * 5) + 0;
    var rndIcon = Math.floor(Math.random() * 11) + 0;

    ref = firebase.database().ref("users/");
    ref.orderByChild("user_id").equalTo(currentUserID).once("value").then(function (snapshot) {
        snapshot.forEach(function (user) {
            firebase.database().ref("classes/" + classID + "/users/" + user.key).set({
                username: user.val().username,
                user_id: user.key,
                icon: icons[rndIcon],
                color: userColors[rndColor]
            });
        });
    });
}

// Lists all classes under "Your classes"
function listClass(classKey, title, description, taID) {
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

    var taDeleteBtn = "";
    if (taID == currentUserID)
        taDeleteBtn = "<button id='" + classKey + "' class='btn btn-xs btn-danger pull-right' onClick='deleteBox(this.id)'><i class='fa fa-times'></i></button>";

    // append a new class with a specific key
    $("#classRow").append(
        "<div id=" + classKey + " class='col-lg-4'>" +
        "<div class='panel panel-" + color + "'>" +
        "<div class='panel-heading'>" +
        title +
        taDeleteBtn +
        "</div>" +
        "<div class='panel-body'>" +
        "<p>" + description + "</p>" +
        "</div>" +
        "<div class='panel-footer'>" +
        "<a href='/classpage?c=" + classKey + "' class='btn btn-default btn-default btn-block'>View</a>" +
        "</div>"
    )
}

// Button event for sending the class to the function that writes it to the database
$("#createClassBtn").click(function () {
    writeClasstData(currentUserID, $("#class-title").val(), $("#description-text").val())
});

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

// Fetch all classes current user is a member of
firebase.database().ref("classes/").orderByChild("users/" + currentUserID + "/user_id").equalTo(currentUserID).once("value").then(function (snapshot) {

    snapshot.forEach(function (childSnapshot) {
        var newClass = childSnapshot.val();

        // Called to display classes on page
        listClass(childSnapshot.getKey(), newClass.title, newClass.description, newClass.ta);
    })
});

