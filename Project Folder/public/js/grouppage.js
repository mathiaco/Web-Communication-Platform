var postsRef;

//Initialize the page
function initializePage(){
  //initialize page Header with group name
  var ref = firebase.database().ref("classes/" + classID + "/groups/" + groupID);
  ref.orderByValue().on("value",function(snapshot){

      document.getElementById("groupName").innerHTML = snapshot.val().Group_Name;
  })

  refGroupUsers = firebase.database().ref("classes/" + classID + "/groups/" + groupID + "/users/");
  refClassUsers = firebase.database().ref("classes/" + classID + "/users/");
  $("#addUserBtnHolder").append(
    "<a href='#' id='addUserBtn' class='btn btn-success btn pull-right' data-toggle='modal' data-target='#addUsersModal'>Manage members</a>" +
    "<div class='modal fade' id='addUsersModal' tabindex='-1' role='dialog' aria-labelledby='addUsersModalLabel'>" +
    "<div class='modal-dialog' role='document'>" +
    "<div class='modal-content'>" +
    "<div class='modal-header'>" +
    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
    "<h4 class='modal-title' id='addUsersModalLabel'>Add a classmate to your group!</h4>" +
    "</div>" +
    "<div class='modal-body'>" +

    "<div class='row'>" +
    "<div class='col-lg-12'>" +
    "<div class='input-group custom-search-form' style='padding-bottom:20px;'>" +
    "<input id='searchClassInput' type='text' class='form-control' placeholder='Search...'>" +
    "<span class='input-group-btn'>" +
    "<button id='searchClassBtn' class='btn btn-success' type='button'>" +
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
    "<i class='fa fa-user fa-fw'></i> Current Members" +
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
  // Search and add user to the class.
  $("#searchClassBtn").click(function () {
    isFirstLoad = false;
    var userName = $("#searchClassInput").val();
    console.log(userName)

    refClassUsers.orderByChild("username").equalTo(userName).once("value").then(function (snapshot) {
      console.log(snapshot)
      snapshot.forEach(function (user) {
        console.log("R U SRS?")
        refGroupUsers.push({
          username: user.val().username,
          user_id: user.key
        });
      });
    });
  });

  // Fetches users that are in the class and displays them.
  refGroupUsers.orderByChild("username").on("child_added", function (snapshot, prevChildKey) {
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
      var removeBtn = "";
        removeBtn = "<button class='deleteUser pull-right btn btn-danger btn-xs'>Remove</button>";
      // If it's the page's first load, then append names.
      if (isFirstLoad) {
        $("#userList").append(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + user.username + "</span>" +
          removeBtn +
          "</span>"
        );
      }
      // If it's not the first load, then prepend names so they appear at the top.
      else {
        $("#userList").prepend(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + user.username + "</span>" +
          removeBtn +
          "</span>"
        );
      }

      // Deletes the user from the class database
      $(".deleteUser").click(function () {
        var userName = $(this).parent().find(".userName").text();
        refGroupUsers.orderByChild("username").equalTo(userName).once("value").then(function (user1) {
          user1.forEach(function (user2) {
            refGroupUsers.child(user2.key).remove();
          });
        });

      });
    }
    // Adjust member count displayed
    $("#memberCount").text(memberCount);
  });

  // Event triggers when class member is removed. Makes proper adjustments on screen
  // so that you no longer see the member on any list.
  refGroupUsers.orderByChild("username").on("child_removed", function (data) {
    $(".users:contains(" + data.val().username + ")").remove();
    memberCount--;
    $("#memberCount").text(memberCount);
  });

  // Adjust member count displayed
  $("#memberCount").text(memberCount);


}


// POST FUNCTIONALITY

// Write the post data to database
function writePostData(posts, user, title, content, icon, color) {
  var newPostRef = postsRef.push();
  var d = new Date();
  var numDate = d.getTime();
  newPostRef.set({
    user_id: user,
    title: title,
    content: content,
    icon: icon,
    color: color,
    date: numDate
  });
}

postsRef = firebase.database().ref("classes/" + classID + "/groups/" + groupID + "/posts");

$("#postBtn").click(function () {
  firebase.database().ref("classes/" + classID + "/groups/" + groupID + currentUserID).once("value").then(function (snapshot) {
    var user = snapshot.val();
    writePostData("posts/", currentUserID, $("#title-text").val(), $("#message-text").val(), user.icon, user.color);
  })
});

// Event trigger when database adds a new post. Also displays post on screen.
postsRef.on("child_added", function (snapshot, prevChildKey) {
  var newPost = snapshot.val();
  var date = timeSince(newPost.date);
  $("#postList").append(
    "<a href='/postpage?c=" + classID + "&p=" + snapshot.getKey() + "' class='list-group-item'>" +
    newPost.title +
    "<span class='pull-right text-muted small'><em>" + date + " ago</em>" +
    "</span>" +
    "</a>"
  )
});


//get classID and GroupID from the url
function getGroupID() {
  var pageURL = window.location.search.substring(1);
  pageURL = pageURL.split("=");
  groupID = pageURL[1].substring(0,20);
  classID = pageURL[2]
  console.log("GROUP ID: " + groupID)
  console.log("Class ID: " + classID)
}
$(".deleteGroupBtn" ).click(function () {
  $(".groupList:contains(" + data.val().username + ")").remove();
  ref.child(key).remove();
})


function isTA(){
  return true;
}

var groupID
var classID
var isFirstLoad = true;
var memberCount = 0;

getGroupID();
initializePage();


