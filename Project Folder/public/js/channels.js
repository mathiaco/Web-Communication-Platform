// function getChannelId(){
//   var pageURL = window.location.search.substring(1).split("-");
//   var channelId = pageURL[1];
// }
var colCount = 1;
var currentUser = '';

channelRef = firebase.database().ref("chat/channels");

firebase.database().ref('users/'+ currentUserID).once('value').then(function(snapshot){
    currentUser = snapshot.val().username;
});

$("#createChannelBtn").click(function (){
  channelRef.push({channelName: $('#channel-Name').val(), creator: currentUser});
});


channelRef.on("child_added", function(snapshot){
  var newChannel = snapshot.val();
  var creator = '';
  var color;

  creatorRef = firebase.database().ref("chat/channels/" + snapshot.getKey() + "/creator");

  creatorRef.once("value", function(snapshot){
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

    if(checkUser(creator, snapshot.getKey())){

      //allows deletion of channel if current user is the creator of the channel
      if(creator === currentUser){
        $("#classRow").append(
            "<div id="+snapshot.getKey()+" class='col-lg-4'>" +
            "<div class='panel panel-" + color + "'>" +
            "<div class='panel-heading'>" +
            newChannel.channelName +
            "</div>" +
            "<div class='panel-footer'>" +
            "<a href='/channelpage?c=" + snapshot.getKey() + "' class='btn btn-default btn-default btn-block'>View</a>"
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
            "<a href='/channelpage?c=" + snapshot.getKey() + "' class='btn btn-default btn-default btn-block'>View</a></div>"
          );
      }
    }
});

//removes channel
function deleteBox(id){
  channelRef.child(id).remove();
  var idOfBox = id;
  $("div").remove("#" + idOfBox);
}


//searches for channel
$("#channelSearchBtn").click(function(){
  var channelName = $("#channelSearchInput").val();

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

  channelRef.orderByChild("channelName").equalTo(channelName).once("value").then(function(snapshot){
      snapshot.forEach(function(data){
          $("#searchedChannelRow").append(
              "<div id="+snapshot.getKey()+" class='col-lg-4'>" +
              "<div class='panel panel-" + color + "'>" +
              "<div class='panel-heading'>" +
              data.val().channelName +
              "</div>" +
              "<div class='panel-footer'>" +
              "<a href='/channelpage?c=" + snapshot.getKey() + "' class='btn btn-default btn-default btn-block'>View</a></div>"
            );
      });
  });
});

function checkUser(creator, key){
  var display = false;
  if(creator === currentUser){
      display = true;
  }
  else{
    refChannelUsers = firebase.database().ref("chat/channels/" + key + "/users/");
    refChannelUsers.orderByValue().on("value", function(user1){
      user1.forEach(function(user2){
          if(currentUserID === user2.key){
            display = true;
          }
      });
    });
  }
  return display;
}
