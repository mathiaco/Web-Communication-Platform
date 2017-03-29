

function initializePage(){
  refChannelUsers = firebase.database().ref("chat/channels/" + channelId + "/users");

  firebase.database().ref("chat/channels/" + channelId).once("value").then(function(snapshot){
    $("#channelName").text(snapshot.val().channelName);
    $("#channelMembers").append(
      "<span class='users list-group-item'>" +
      snapshot.val().creator +
      "</span>"
    );
    $("#userList").append(
      "<span class='users list-group-item'>" +
      snapshot.val().creator +
      "</span>"
    );
  });

  $("#addChannelBtnHolder").append(
    "<a href='#' id='addChannelBtn' class='btn btn-success btn pull-right' data-toggle='modal' data-target='#addUsersModal'>Add User</a>" +
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

  refChannelUsers.orderByChild("username").on("child_added", function(snapshot){
    var user = snapshot.val();
    //if its the pages first load then append names
    if(isFirstLoad){
      $("#channelMembers").append(
        "<span class='users list-group-item'>" +
        user.username +
        "</span>"
      );
    }
    // If it's not the first load, then prepend names so they appear at the top.
    else{
      $("#channelMembers").prepend(
        "<span class='users list-group-item'>" +
        user.username +
        "</span>"
      );
    }
    //if its the pages first load then append names
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
    //deletes the user from the class database
    $(".deleteUser").click(function(){
      var userName = $(this).parent().find(".userName").text();
      refChannelUsers.orderByChild("username").equalTo(userName).once("value").then(function (user1){
        user1.forEach(function (user2){
          refChannelUsers.child(user2.key).remove();
        });
      });
    });
  });
  //searches for user and adds to channel
  $("#searchUserBtn").click(function(){
    isFirstLoad = false;
    var userName = $("#searchUserInput").val();
    ref = firebase.database().ref("users/");
    ref.orderByChild("username").equalTo(userName).once("value").then(function(snapshot){
      snapshot.forEach(function(user){
        firebase.database().ref("chat/channels/" + channelId + "/users/" + user.key).set({
          username: user.val().username,
          user_id: user.key
        });
      });
    });
  });

  // Event triggers when class member is removed. Makes proper adjustments on screen
  // so that you no longer see the member on any list.
  refChannelUsers.orderByChild("username").on("child_removed", function(data){
    $(".users:contains(" + data.val().username + ")").remove();
  });
}

function getChannelId(){
  var pageURL = window.location.search.substring(1).split("=");
  channelId = pageURL[1];
}


var refChannelUsers;
var channelId;
var isFirstLoad = true;
var creator;

getChannelId();
initializePage();
