var uploader = document.getElementById("uploader");
var fileButton = document.getElementById('fileButton');
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

fileButton.addEventListener('change',function(e){

    var file= e.target.files[0];
      //create a storage
    var storageRef = firebase.storage().ref('documents/' + file.name);
      //upload file
    var task =storageRef.put(file);

      //update progress bar
    task.on('state_changed',
      function progress(snapshot){
           var percentage =(snapshot.bytesTransferred/snapshot.totalBytes)*100;
           uploader.value= percentage;
      },

      function error(err){
            //handle unsuccessful uploads
      },
      function complete(){
           // handle successful uploads
         var postKey = firebase.database().ref('StoringDocuments/').push().key;
         var downLUrl = task.snapshot.downloadURL;
         var updates={};
         var postData={
         url: downLUrl
         };
         updates['StoringDocuments/' + postKey] =postData;
         firebase.database().ref().update(updates);
        console.log(downLUrl);
      }
    );
});
