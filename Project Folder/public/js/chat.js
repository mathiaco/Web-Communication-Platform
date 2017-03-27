//TODO: Needs to add function to determine the current user
//TODO: add function to add channels and add people to the channel
//TODO: next sprint

//TODO: currently logged in userID
var currentUser = '';

//Retrieves the user's full name from the database using the userID
// firebase.database().ref('users/'+ currentUserID).once('value').then(function(snap){
//     currentUser = snap.val().displayName;
//
//     //TODO: take this statement out later
//     console.log(currentUser);
// });

//reads channel from database and displays it
function readChannel(){
  var ref = firebase.database().ref('channels');
  var className = '';

  //cycles through the channels orders them alphabetically and
  ref.orderByValue().on("value", function(snapshot){
    snapshot.forEach(function(data){
      document.getElementById('channel-container').innerHTML +=
      ('<div onClick="changeActive(this)" value="' + data.val() + '" class="channel">' + data.val() + '</div>');
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
  if(document.getElementById('messageBox').value == ''){
    //do nothing if form is empty
  }
  else{
    var ref = firebase.database().ref('messages/channel/' + currentChannel());
    var message = document.getElementById('messageBox').value;

    ref.push({
      message: message,
      user: currentUser
    });

    document.getElementById('messageBox').value = '';
  }
  addMessage();
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
    var ref = firebase.database().ref('messages/channel/' + currentChannel());
    ref.orderByValue().once("value", function(snapshot){
      snapshot.forEach(function(data){
        var classAddition = '';
        if(currentUser === data.val().user){
          classAddition = 'currentUser';
        }
        document.getElementById('chat-window-container').innerHTML +=
        ('<div class="' + classAddition + ' total-message"><p class="message">' + data.val().message + '</p><h6 class="message-from-user">Sent By:' + data.val().user + '</h6></div>');
      });
      updateScroll()
    });
  }
}

//adds new messages of channel in container
function addMessage(){
  var ref = firebase.database().ref('messages/channel/' + currentChannel());

  ref.once("child_added", function(snapshot){
    var newPost = snapshot.val();
    var classAddition = '';
    if(currentUser === newPost.user){
      classAddition = 'currentUser';
    }
    document.getElementById('chat-window-container').innerHTML +=
    ('<div class="' + classAddition + ' total-message"><p class="message">' + newPost.message + '</p><h6 class="message-from-user">Sent By:' + newPost.user + '</h6></div>');
    updateScroll()
  })
}

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
window.onload = function(){
  readChannel();
  displayMessages();
};
