
var postsRef;

// Write the post data to database
function writePostData(posts, name, title, content) {
  var newPostRef = postsRef.push();
  newPostRef.set({
      username: name,
      title: title,
      content: content
  });
}

// Initialize the database to read and write data
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

// Button event listener to send data to function that writes to database
$("#postBtn").click( function() {
  writePostData("posts/", "Jeff", $("#title-text").val(), $("#message-text").val())
});


// Read post data from database and displays it, even if a new child is added.
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

