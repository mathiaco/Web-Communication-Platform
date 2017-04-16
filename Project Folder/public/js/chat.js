var currentUser = '';
var channelRef = firebase.database().ref('chat/messages/channel/');

// Retrieves the user's full name from the database using the userID
firebase.database().ref('users/'+ currentUserID).once('value').then(function(snapshot){
    currentUser = snapshot.val().username;
});


//reads channel from database and displays it
function readChannel(){
  var ref = firebase.database().ref('chat/channels');
  var partOfChannel = false;
  var className = '';

  //cycles through the channels orders them alphabetically and
  ref.orderByValue().on("value", function(snapshot){
    snapshot.forEach(function(data){

        refChannelUsers = firebase.database().ref("chat/channels/" + data.key + "/users/");

        refChannelUsers.orderByValue().on("value", function(user1){
          user1.forEach(function(user2){
            if(currentUserID === user2.key){
              partOfChannel = true;
            }
          });
        });

      if(partOfChannel){
        document.getElementById('channel-container').innerHTML +=
        ('<div onClick="changeActive(this)" value="' + data.val().channelName + '" class="channel">' + data.val().channelName + '</div>');
        partOfChannel = false;
      }
    });
  });
}
//changes the active class
function changeActive(param){
  if(!($('#channel-container > .active'))){
    $param.addClass("active");
  }
  else{
    $('#channel-container > .active').removeClass("active");
    $(param).addClass("active");
  }
  displayMessages();
}

//sends message to database
$('#send-Message').submit(function (e){
  if(document.getElementById('messageBox').value == '' || currentChannel() === ''){
    //do nothing if form is empty
    document.getElementById('messageBox').value = '';
  }
  else{
    var ref = firebase.database().ref('chat/messages/channel/' + currentChannel());
    var message = document.getElementById('messageBox').value;

    ref.push({
      message: message,
      user: currentUser
    });

    //resets text box to empty
    document.getElementById('messageBox').value = '';
  }
  //prevents refresh of page when form is sent
  e.preventDefault();
});

//displays previous messages of channel in container
function displayMessages(){
  if($('#channel-container > .active').text() === ""){
    document.getElementById('chat-window-container').innerHTML =
    ('<h1 class="start-message">Please Select a Channel</h1>');
  }
  else{
    document.getElementById('chat-window-container').innerHTML = "";
    var ref = firebase.database().ref('chat/messages/channel/' + currentChannel());
    ref.orderByValue().once("value", function(snapshot){
      snapshot.forEach(function(data){
        var classAddition = '';
        if(currentUser === data.val().user){
          classAddition = 'currentUser';
        }
        if(!data.val().message == ''){
          document.getElementById('chat-window-container').innerHTML +=
          ('<div class="' + classAddition + ' total-message"><p class="message">' + data.val().message + '</p><h6 class="message-from-user">Sent By:' + data.val().user + '</h6></div>');
        }
      });
      updateScroll()
    });
  }
}

//adds new messages automatically across different people
channelRef.on("child_changed", function(){
  messageRef = firebase.database().ref('chat/messages/channel/' + currentChannel());
  document.getElementById('chat-window-container').innerHTML = '';
  messageRef.on("child_added", function(snapshot){
    if(!snapshot.val().message){
      //do nothing
    }
    else{
      var newPost = snapshot.val();
      var classAddition = '';

      if(currentUser === newPost.user){
        classAddition = 'currentUser';
      }

      document.getElementById('chat-window-container').innerHTML +=
      ('<div class="' + classAddition + ' total-message"><p class="message">' + newPost.message + '</p><h6 class="message-from-user">Sent By:' + newPost.user + '</h6></div>');
      updateScroll();
    }
  });
});


//determines what the currentChannel is
function currentChannel(){
  var text = $('#channel-container > .active').text();
  return(text);
}


//dynamic scrolling for chat
function updateScroll(){
  var elem = $('#chat-window-container')[0].scrollHeight;
  $('#chat-window-container').scrollTop(elem);
}

//loads function on load of page
  readChannel();
  displayMessages();
