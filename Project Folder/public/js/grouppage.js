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


