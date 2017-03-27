// Write the post data to database
function writePostData(posts, name, title, content) {
  var newPostRef = postsRef.push();
  newPostRef.set({
    username: name,
    title: title,
    content: content
  });
}

// Initializes the page and get the needed data inorder to display
function initializePage() {
  refClassUsers = firebase.database().ref("classes/" + classID + "/users/");

  // Get the class title from the database and displays it
  firebase.database().ref("classes/" + classID).once("value").then(function (snapshot) {
    $("#classTitle").text(snapshot.val().title);
  });

  // If the current user is a TA, then display special TA functions.
  if (isTA()) {
    $("#addUserBtnHolder").append(
      "<a href='#' id='addUserBtn' class='btn btn-success btn pull-right' data-toggle='modal' data-target='#addUsersModal'>Add User</a>" +
      "<div class='modal fade' id='addUsersModal' tabindex='-1' role='dialog' aria-labelledby='addUsersModalLabel'>" +
      "<div class='modal-dialog' role='document'>" +
      "<div class='modal-content'>" +
      "<div class='modal-header'>" +
      "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
      "<h4 class='modal-title' id='addUsersModalLabel'>Add User</h4>" +
      "</div>" +
      "<div class='modal-body'>" +

      "<div class='row'>" +
      "<div class='col-lg-12'>" +
      "<div class='input-group custom-search-form' style='padding-bottom:20px;'>" +
      "<input id='searchUserInput' type='text' class='form-control' placeholder='Search...'>" +
      "<span class='input-group-btn'>" +
      "<button id='searchUserBtn' class='btn btn-success' type='button'>" +
      "<i class='fa fa-plus'></i>" +
      "</button>" +
      "</span>" +
      "</div>" +
      "<!-- /input-group -->" +
      "</div>" +
      "<!-- /.col-lg-6 -->" +
      "</div>" +

      "<div class='panel panel-default'>" +
      "<div class='panel-heading'>" +
      "<i class='fa fa-user fa-fw'></i> Current Users" +
      "</div>" +
      "<!-- /.panel-heading -->" +
      "<div class='panel-body'>" +
      "<div class='list-group' id='userList'>" +
      "</div >" +
      "<!-- /.list-group -->" +
      "</div >" +
      "<!-- /.panel-body -->" +
      "</div >" +
      "<!-- /.panel -->" +
      "</div>" +
      "<div class='modal-footer'>" +
      "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "<!-- /.modal -->"
    );
  }

  // Fetches users that are in the class and displays them.
  refClassUsers.orderByChild("username").on("child_added", function (snapshot, prevChildKey) {
    memberCount++;
    var user = snapshot.val()
    // If it's the page's first load, then append names.
    if (isFirstLoad) {
      $("#classMembers").append(
        "<span class='users list-group-item'>" +
        user.username +
        "</span>"
      );
    }
    // If it's not the first load, then prepend names so they appear at the top.
    else {
      $("#classMembers").prepend(
        "<span class='users list-group-item'>" +
        user.username +
        "</span>"
      );
    }


    if (isTA()) {
      // If it's the page's first load, then append names.
      if (isFirstLoad) {
        $("#userList").append(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + user.username + "</span>" +
          "<button class='deleteUser pull-right btn btn-danger btn-xs'>Delete</button>" +
          "</span>"
        );
      }
      // If it's not the first load, then prepend names so they appear at the top.
      else {
        $("#userList").prepend(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + user.username + "</span>" +
          "<button class='deleteUser pull-right btn btn-danger btn-xs'>Delete</button>" +
          "</span>"
        );
      }

      // Deletes the user from the class database
      $(".deleteUser").click(function () {
        var userName = $(this).parent().find(".userName").text();
        refClassUsers.orderByChild("username").equalTo(userName).once("value").then(function (user1) {
          user1.forEach(function (user2) {
            refClassUsers.child(user2.key).remove();
          });
        });

      });
    }
    // Adjust member count displayed
    $("#memberCount").text(memberCount);
  });

  // Search and add user to the class.
  $("#searchUserBtn").click(function () {
    isFirstLoad = false;
    var userName = $("#searchUserInput").val();
    ref = firebase.database().ref("users/");
    ref.orderByChild("username").equalTo(userName).once("value").then(function (snapshot) {
      snapshot.forEach(function (user) {
        firebase.database().ref("classes/" + classID + "/users/" + user.key).set({
          username: user.val().username,
          user_id: user.key
        });
      });
    });
  });

  // Event triggers when class member is removed. Makes proper adjustments on screen
  // so that you no longer see the member on any list.
  refClassUsers.orderByChild("username").on("child_removed", function (data) {
    $(".users:contains(" + data.val().username + ")").remove();
    memberCount--;
    $("#memberCount").text(memberCount);
  });

  // Adjust member count displayed
  $("#memberCount").text(memberCount);

  // Send post data to function to be writen to database
  $("#postBtn").click(function () {
    writePostData("posts/", "Jeff", $("#title-text").val(), $("#message-text").val())
  });

  // Event trigger when database adds a new post. Also displays post on screen.
  postsRef.on("child_added", function (snapshot, prevChildKey) {
    var newPost = snapshot.val();
    $("#postList").append(
      "<a href='/postpage?c=" + classID + "&p=" + snapshot.getKey() + "' class='list-group-item'>" +
      newPost.title +
      "<span class='pull-right text-muted small'><em>4 minutes ago</em>" +
      "</span>" +
      "</a>"
    )
  });
}

// Change this later to check if person is actually a TA
function isTA() {
  return true;
}

// Gets the class ID from URL
function getClassID() {
  var pageURL = window.location.search.substring(1);
  pageURL = pageURL.split("=");
  classID = pageURL[1]
}

// GROUP STUFF

//saves the group information to the database upon creation of group
//button in the form
$("#createGroupBtn").click(function (){
  //setting group name
  var groupName = document.getElementById("groupName").value;

    var ref = firebase.database().ref("classes/" + classID + "/groups/" + groupName);
  var counter = groupList.length
  for(index=0; index<counter; index++){
    var user = groupList.pop();
     ref.push({
           user_id: user.user_id,
           username: user.username
      })
  }


})

//deleting the class list and group list and reloading them.
$("#createGroup").click(function(){
  document.getElementById("groupName").value = "";
  var ref = firebase.database().ref("classes/" + classID + "/users/");

  refClassUsers.orderByValue().on("value", function (snapshot){
    snapshot.forEach(function(data){
      $(".groupMembers:contains(" + data.val().username + ")").remove();
      $(".classMembers:contains(" + data.val().username + ")").remove();

      $("#classList").append(
        "<span class='classMembers list-group-item'>" +
        "<span class='userName'>" + data.val().username + "</span>" +
        "<button id=add" +data.val().username+" class='addUser pull-right btn btn-success btn-xs'>Add</button>" +
        "</span>"
      );

      $("#add" +data.val().username).click(function(){
        console.log(data.val().username);
        $("#groupMembersList").append(
          "<span class='groupMembers list-group-item'>" +
          "<span class='userName'>" + data.val().username + "</span>" +
          "</span>"
        );
        groupList.push(data.val());
        $(".classMembers:contains(" + data.val().username + ")").remove();
      })
  })
  })
})

//creates the class list that user may select from to create groups (first load)
function initializeClassList(){
  var ref = firebase.database().ref("classes/" + classID + "/users/");

  refClassUsers.orderByValue().on("value", function (snapshot){
    snapshot.forEach(function(data){
  $("#classList").append(
    "<span class='classMembers list-group-item'>" +
    "<span class='userName'>" + data.val().username + "</span>" +
    "<button id=add" +data.val().username+" class='addUser pull-right btn btn-success btn-xs'>Add</button>" +
    "</span>"
  );

  $("#add" +data.val().username).click(function(){
    console.log(data.val().username);
    $("#groupMembersList").append(
      "<span class='groupMembers list-group-item'>" +
      "<span class='userName'>" + data.val().username + "</span>" +
      "</span>"
    );
    groupList.push(data.val());
    $(".classMembers:contains(" + data.val().username + ")").remove();
  })
  })
  })

}

  function initializeGroup(){
    var ref = firebase.database().ref("classes/" + classID + "/groups/");
    ref.orderByValue().on("value", function (snapshot){
      snapshot.forEach(function(data){
    if($(".groupMembers:contains(" + data.key + ")").length < 1){
      console.log($(".groupMembers:contains(" + data.key + ")").length)
     document.getElementById('groupList').innerHTML +=
     (
     "<span class='groupMembers list-group-item'>" +
     "<span class='groupName'>" + data.key + "</span>" +
    "<button id=add" + data.key +" class='delGroup pull-right btn btn-danger btn-xs'>Remove</button>"+
     "</span>"
     );
   }
   })
   });
}



var refClassUsers;
var classID;
var postKey;
var memberCount = 0;
var isFirstLoad = true;
var groupList = [];

getClassID();

initializeFirebase();
var postsRef = firebase.database().ref("classes/" + classID + "/posts/");
initializePage();
initializeClassList();
initializeGroup();
