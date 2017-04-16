var postCount=0;
var numGroups=0;
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

// Initializes the page and get the needed data inorder to display
function initializePage() {
  refClassUsers = firebase.database().ref("classes/" + classID + "/users/");

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
    var user = snapshot.val();
    // If it's the page's first load, then append names.
    if (isFirstLoad) {
      $("#classMembers").append(
        "<span class='users list-group-item'>" +
        "<span class='userName'>" + "<a href='/profile/id/" + user.user_id + " '>" + user.username + "</a>" + "</span>" +
        "</span>"
      );
    }
    // If it's not the first load, then prepend names so they appear at the top.
    else {
      $("#classMembers").prepend(
        "<span class='users list-group-item'>" +
        "<span class='userName'>" + "<a href='/profile/id/" + user.user_id + " '>" + user.username + "</a>" + "</span>" +
        "</span>"
      );
    }


    if (isTA()) {
      var removeBtn = "";
      if (user.user_id != currentUserID) {
        removeBtn = "<button class='deleteUser pull-right btn btn-danger btn-xs'>Remove</button>";
      }
      // If it's the page's first load, then append names.
      if (isFirstLoad) {
        $("#userList").append(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + "<a href='/profile/id/" + user.user_id + " '>" + user.username + "</a>" + "</span>" +
          removeBtn +
          "</span>"
        );
      }
      // If it's not the first load, then prepend names so they appear at the top.
      else {
        $("#userList").prepend(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + "<a href='/profile/id/" + user.user_id + " '>" + user.username + "</a>" + "</span>" +
          removeBtn +
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
    firebase.database().ref("classes/" + classID + "/users/" + currentUserID).once("value").then(function (snapshot) {
      var user = snapshot.val();
      writePostData("posts/", currentUserID, $("#title-text").val(), $("#message-text").val(), user.icon, user.color);
    })
  });

  // Event trigger when database adds a new post. Also displays post on screen.
  postsRef.on("child_added", function (snapshot, prevChildKey) {
    postCount++;
    var newPost = snapshot.val();
    var date = timeSince(newPost.date);
    $("#postList").append(
      "<a href='/postpage?c=" + classID + "&p=" + snapshot.getKey() + "' class='list-group-item'>" +
      newPost.title +
      "<span class='pull-right text-muted small'><em>" + date + " ago</em>" +
      "</span>" +
      "</a>"
    )
      // Adjust Post count displayed
      $("#postCount").text(postCount);
  });
}

// Change this later to check if person is actually a TA
function isTA() {
  if (taID == currentUserID) {
    return true;
  } else
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
$("#createGroupBtn").click(function () {
  //setting group name
  var groupName = document.getElementById("groupName").value;
  var groupID;
  var ref = firebase.database().ref("classes/" + classID + "/groups/");
  var counter = groupList.length
  ref.push({
    Group_Name: groupName
  })

  ref.on("child_added", function (snapshot, prevChildKey) {
    groupID = snapshot.getKey();
  });
  for (index = 0; index < counter; index++) {
    var user = groupList.pop();
    var ref = firebase.database().ref("classes/" + classID + "/groups/" + groupID + "/users/");
    ref.push({
      user_id: user.user_id,
      username: user.username
    })
  }
    // Adjust Group count displayed
    $("#groupCount").text(numGroups);
})

//deleting the class list and group list and reloading them.
$("#createGroup").click(function () {
  document.getElementById("groupName").value = "";
  var ref = firebase.database().ref("classes/" + classID + "/users/");

  refClassUsers.orderByValue().on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      $(".groupMembers:contains(" + data.val().username + ")").remove();
      $(".classMembers:contains(" + data.val().username + ")").remove();

      $("#classList").append(
        "<span class='classMembers list-group-item'>" +
        "<span class='userName'>" + data.val().username + "</span>" +
        "<button id=add" + data.val().username + " class='addUser pull-right btn btn-success btn-xs'>Add</button>" +
        "</span>"
      );

      $("#add" + data.val().username).click(function () {
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
// Does this do anything? - Jeff
//creates the class list that user may select from to create groups (first load)
/*nction initializeClassList() {
  var ref = firebase.database().ref("classes/" + classID + "/users/");

  refClassUsers.orderByValue().on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      $("#classList").append(
        "<span class='classMembers list-group-item'>" +
        "<span class='userName'>" + data.val().username + "</span>" +
        "<button id=add" + data.val().username + " class='addUser pull-right btn btn-success btn-xs'>Add</button>" +
        "</span>"
      );

      $("#add" + data.val().username).click(function () {
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
}*/

function initializeGroup() {

  var ref = firebase.database().ref("classes/" + classID + "/groups/");


  ref.orderByValue().on("child_added", function (snapshot) {
    var removeBtn = "";
    if (isTA()) {
      console.log(snapshot.key)
      removeBtn = "<button id='" + snapshot.key + "' class='delGroup pull-right btn btn-danger btn-xs'>Remove</button>";
    }

    if ($(".groupList:contains(" + snapshot.val().Group_Name + ")").length < 1) {
      console.log($(".groupMembers:contains(" + snapshot.key + ")").length)
      document.getElementById('groupList').innerHTML +=
        (
          "<span class='list-group-item'>" +
          "<a href='/grouppage?c=" + snapshot.key + "/class?c=" + classID + "'>" +
          snapshot.val().Group_Name +
          "</a>" +
          removeBtn +
          "</span>"
        );
      numGroups++;
        // Adjust Group count displayed
        $("#groupCount").text(numGroups);
    }

    $(".delGroup").click(function () {
      var groupElement = $(this);
      numGroups--;
      var key = $(this).attr("id");
      ref.on("child_removed", function (data) {
        groupElement.closest("span").remove();
      })
      firebase.database().ref("classes/" + classID + "/groups/").child(key).remove();
        // Adjust Group count displayed
        $("#groupCount").text(numGroups);
    });// Adjust Group count displayed
      $("#groupCount").text(numGroups);
  });
}

$("#manageGroups").click(function () {
  var ref = firebase.database().ref("classes/" + classID + "/groups/")
  $("#classList").append(
    "<span class='classMembers list-group-item'>" +
    "<span class='userName'>" + data.val().username + "</span>" +
    "<button id=add" + data.val().username + " class='addUser pull-right btn btn-success btn-xs'>Add</button>" +
    "</span>"
  );
})

// Calculates the amount of time sinve the given date and current date
function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}



var refClassUsers;
var classID;
var postKey;
var memberCount = 0;
var isFirstLoad = true;
var groupList = [];
var taID = "";

getClassID();


var postsRef = firebase.database().ref("classes/" + classID + "/posts/");
// Get the class title from the database and displays it
firebase.database().ref("classes/" + classID).once("value").then(function (snapshot) {
  $("#classTitle").text(snapshot.val().title);
  taID = snapshot.val().ta;
    $("#ta").append(
    "<a href= 'profile/id/" + taID+ "'>" +
        taID + "</a>"
    );
    initializePage();
  initializeGroup();
});

//initializeClassList(); Do we need this?
