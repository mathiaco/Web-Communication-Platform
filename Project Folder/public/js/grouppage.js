
var postsRef;

function writePostData(posts, name, title, content) {
  var newPostRef = postsRef.push();
  newPostRef.set({
      username: name,
      title: title,
      content: content
  });
}

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
postsRef = firebase.database().ref("posts/");

$("#postBtn").click( function() {
  writePostData("posts/", "Jeff", $("#title-text").val(), $("#message-text").val())
});

postsRef.on("child_added", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();
  $("#postList").append(
    "<a href='#' class='list-group-item'>" + 
      newPost.title +
      "<span class='pull-right text-muted small'><em>4 minutes ago</em>" +
      "</span>" +
    "</a>"
  )
});

