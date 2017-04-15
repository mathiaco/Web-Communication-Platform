var colCount = 1;
var currentUser = '';
var currentChannelID = '';

channelRef = firebase.database().ref("chat/channels");

firebase.database().ref('users/'+ currentUserID).once('value').then(function(snapshot){

    currentUser = snapshot.val().username;
});

//when button is pressed
$("#createChannelBtn").click(function (){

  var hashChannelName = md5($('#channel-Name').val());

  channelRef.once("value", function(snapshot){
    if(snapshot.child(hashChannelName).exists()){
      document.getElementById("already-Exists").innerHTML = "This Channel Already Exists!";
      document.getElementById("channel-Name").value = "";
    }
    else{
      channelRef.child(hashChannelName).set({
        channelName: $("#channel-Name").val(),
        creator: currentUser
      });
    firebase.database().ref("chat/channels/" + hashChannelName + "/users/" + currentUserID).set({
      user_id: currentUserID,
      username: currentUser
    });
    firebase.database().ref("chat/messages/channel/" + $("#channel-Name").val()).push({
      message: "",
      user: currentUser
    });
    $("#postModal").modal('hide');
    }
  });
});

//for when enter is pressed
$("#send-Channel").submit(function (){

  var hashChannelName = md5($('#channel-Name').val());

  channelRef.once("value", function(snapshot){
    if(snapshot.child(hashChannelName).exists()){
      document.getElementById("already-Exists").innerHTML = "This Channel Already Exists!";
      document.getElementById("channel-Name").value = "";
    }
    else{
    channelRef.child(hashChannelName).set({
      channelName: $("#channel-Name").val(),
      creator: currentUser
    });
    firebase.database().ref("chat/channels/" + hashChannelName + "/users/" + currentUserID).set({
      user_id: currentUserID,
      username: currentUser
    });
    firebase.database().ref("chat/messages/channel/" + $("#channel-Name").val()).push({
      message: "",
      user: ""
    });
    $("#postModal").modal('hide');
    }
  });
});

//ads channel in real time to the screen
channelRef.on("child_added", function(snapshot){
  var newChannel = snapshot.val();
  var creator = '';
  var color;

  creatorRef = firebase.database().ref("chat/channels/" + snapshot.getKey() + "/creator").once("value", function(snapshot){
    creator = snapshot.val();
  });

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

    if(checkUser(snapshot.getKey())){
      //allows deletion of channel if current user is the creator of the channel
      if(creator === currentUser){
              $("#classRow").append(
                  "<div id="+snapshot.getKey()+" class='col-lg-4'>" +
                  "<div class='panel panel-" + color + "'>" +
                  "<div class='panel-heading'>" +
                  newChannel.channelName +
                  "</div>" +
                  "<div class='panel-footer'>" +
                  "<button id=" + snapshot.getKey() + " class='btn btn-default btn-default btn-block' onClick='selectedChannel(this.id)' data-toggle='modal' data-target='#view'>View</button>"
                  + "<br/>" + "<button  id="+ snapshot.getKey()+"  class='btn btn-default btn-default btn-block'  onClick='deleteBox(this.id)' >Delete Box</button>"+
                  "</div>"
              );
      }
      else{
        $("#classRow").append(
            "<div id="+snapshot.getKey()+" class='col-lg-4'>" +
            "<div class='panel panel-" + color + "'>" +
            "<div class='panel-heading'>" +
            newChannel.channelName +
            "</div>" +
            "<div class='panel-footer'>" +
            "<button id=" + snapshot.getKey() + " class='btn btn-default btn-default btn-block' onClick='selectedChannel(this.id)' data-toggle='modal' data-target='#view'>View</button>"
          );
      }
    }
});

//removes channel
function deleteBox(id){
  var name = '';
  firebase.database().ref("chat/channels/" + id + "/channelName").once("value", function(snapshot){
    name = snapshot.val();
  });
  firebase.database().ref("chat/messages/channel/" + name).remove();
  channelRef.child(id).remove();
  $("div").remove("#" + id);
}

$("#add-User").submit(function(e){
  document.getElementById('userSearchResults').innerHTML = '';

  refChannelUsers = firebase.database().ref("chat/channels/" + currentChannelID + "/users");
  var userName = $("#user-Search").val();
  ref = firebase.database().ref("users/");
  ref.orderByChild("username").equalTo(userName).once("value").then(function(snapshot){
    snapshot.forEach(function(user){
      $("#userSearchResults").append(
        "<span  class='users list-group-item'>" +
          user.val().username +
        "</span></br>"
      );
      refChannelUsers.orderByChild("user_id").equalTo(user.val().user_id).once("value").then(function(snapshot){
        if(!snapshot.exists()){
          $("#userSearchResults").append(
            "<button style='float: right;' id='" + user.val().username + "' class='btn btn-success' onClick='addUserToChannel(this.id,ref)' type='button'>" +
            "<i style='height: 5px;' class='fa fa-plus'></i>" +
            "</button>"
          );
        }
      });
    });
  });
  e.preventDefault();
});

//searches users in view box to add to channel
$("#searchUserBtn").click(function(e){
  document.getElementById('userSearchResults').innerHTML = '';

  refChannelUsers = firebase.database().ref("chat/channels/" + currentChannelID + "/users");
  var userName = $("#user-Search").val();
  ref = firebase.database().ref("users/");
  ref.orderByChild("username").equalTo(userName).once("value").then(function(snapshot){
    snapshot.forEach(function(user){
      $("#userSearchResults").append(
        "<span  class='users list-group-item'>" +
          user.val().username +
        "</span></br>"
      );
      refChannelUsers.orderByChild("user_id").equalTo(user.val().user_id).once("value").then(function(snapshot){
        if(!snapshot.exists()){
          $("#userSearchResults").append(
            "<button style='float: right;' id='" + user.val().username + "' class='btn btn-success' onClick='addUserToChannel(this.id,ref)' type='button'>" +
            "<i style='height: 5px;' class='fa fa-plus'></i>" +
            "</button>"
          );
        }
      });
    });
  });
  e.preventDefault();
});


function addUserToChannel(userSelected,ref){
  var creator = '';


  creatorRef = firebase.database().ref("chat/channels/" + currentChannelID + "/creator").once("value", function(snapshot){
    creator = snapshot.val();
  });

  ref.orderByChild("username").equalTo(userSelected).once("value").then(function(snapshot){
    snapshot.forEach(function(user){
      console.log(currentChannelID);
      firebase.database().ref("chat/channels/" + currentChannelID + "/users/" + user.key).set({
        username: user.val().username,
        user_id: user.key
      });
      if(creator === currentUser){
        $("#userList").append(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + user.val().username + "</span>" +
          "<button id='" + user.val().user_id + " " + currentChannelID + "' class='deleteUser pull-right btn btn-danger btn-xs' onClick='removeUserChannel(this.id)'>Delete</button>" +
          "</span>"
        );
      }
      else{
        $("#userList").append(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + user.val().username + "</span>" +
          "</span>"
        );
      }
    });
  });
  document.getElementById('userSearchResults').innerHTML = '';
}

function selectedChannel(id){
  var creator = '';

  creatorRef = firebase.database().ref("chat/channels/" + id + "/creator").once("value", function(snapshot){
    creator = snapshot.val();
  });

  refChannelUsers = firebase.database().ref("chat/channels/" + id + "/users");

  refChannelUsers.once("value").then(function(snapshot){
      document.getElementById('userList').innerHTML = '';
    snapshot.forEach(function(user){
      if(creator === currentUser){
        if(creator === user.val().username){
          $("#userList").append(
            "<span class='users list-group-item'>" +
            "<span class='userName'>" + user.val().username + "</span>" +
            "</span>"
          );
        }
        else{
          $("#userList").append(
            "<span class='users list-group-item'>" +
            "<span class='userName'>" + user.val().username + "</span>" +
            "<button id='" + user.val().user_id + " " + id + "' class='deleteUser pull-right btn btn-danger btn-xs' onClick='removeUserChannel(this.id)'>Delete</button>" +
            "</span>"
          );
        }
      }
      else{
        $("#userList").append(
          "<span class='users list-group-item'>" +
          "<span class='userName'>" + user.val().username + "</span>" +
          "</span>"
        );
      }
    });
  });
  currentChannelID = id;
}

$("#leaveChannel").click(function(e){
  firebase.database().ref("chat/channels/" + currentChannelID + "/users/" + currentUserID).remove();
  $("#" + currentChannelID + "").remove();
});

function updatePage(){

}
function removeUserChannel(id){
  channelid = id.substr(9);
  userid = id.substr(0,8);
  firebase.database().ref("chat/channels/" + channelid + "/users/" + userid).remove();

  document.getElementById('userList').innerHTML = ''
  selectedChannel(channelid);
}


function checkUser(key){
  var display = false;
    refChannelUsers = firebase.database().ref("chat/channels/" + key + "/users/");
    refChannelUsers.orderByValue().on("value", function(user1){
      user1.forEach(function(user2){
          if(currentUserID === user2.key){
            display = true;
          }
      });
    });
  return display;
}


function erase(){
  document.getElementById("already-Exists").innerHTML = "";
  document.getElementById("channel-Name").value = "";
}
