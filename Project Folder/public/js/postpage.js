

// Write the comment data to database
function writeCommentData(ref, name, content, icon, color) {
    var commentRef = firebase.database().ref(ref);
    var newCommentRef = commentRef.push();
    newCommentRef.set({
        userid: currentUserID,
        username: name,
        content: content,
        icon: icon,
        color: color
    });
}

// Initializes the page and get the needed data inorder to display
function initializePage() {
    var invertComment = true;
    var postsRef = firebase.database().ref("classes/" + urlParams["c"] + "/posts/" + urlParams["p"]);

    // Reads the post data from the database
    postsRef.once("value").then(function (snapshot) {
        var newPost = snapshot.val();
        // Displays post data on page.
        firebase.database().ref("classes/" + urlParams["c"] + "/users/" + newPost.user_id).once("value").then(function (snapshotChild) {

            var user = snapshotChild.val();
            $("#commentTimeline").append(
                "<li>" +
                "<div class='timeline-badge " + user.color + "'><i class='fa " + user.icon + "'></i>" +
                "</div>" +
                "<div class='timeline-panel'>" +
                "<div class='timeline-heading'>" +
                "<h4 class='timeline-title'>" + newPost.title + "</h4>" +
                "<p><small class='text-muted'><i class='fa fa-clock-o'></i> 11 hours ago from " + user.username + "</small>" +
                "</p>" +
                "</div>" +
                "<div class='timeline-body'>" +
                "<p>" + newPost.content + "</p>" +
                "</div>" +
                "</div>" +
                "</li>"
            )
        })


        // Reads comments in the database, and automatically knows when a new child is added
        firebase.database().ref("classes/" + urlParams["c"] + "/posts/" + urlParams["p"] + "/comments/").on("child_added", function (snapshotChild) {
            var newComment = snapshotChild.val();
            var invertCode;
            // Dictates which side the comment will show up on.
            if (invertComment) {
                invertCode = "<li class='timeline-inverted'>"
                invertComment = false;
            }
            else {
                invertCode = "<li>"
                invertComment = true;
            }
            // Displays the comment
            $("#commentTimeline").append(
                invertCode +
                "<div class='timeline-badge " + newComment.color + "'><i class='fa " + newComment.icon + "'></i>" +
                "</div>" +
                "<div class='timeline-panel'>" +
                "<div class='timeline-heading'>" +
                "<p><small class='text-muted'><i class='fa fa-clock-o'></i> 11 hours ago from " + newComment.username + "</small>" +
                "</p>" +
                "</div>" +
                "<div class='timeline-body'>" +
                "<p>" + newComment.content + "</p>" +
                "</div>" +
                "</div>" +
                "</li>"
            )

        });
    });

    // Button Event for sending the comment to function that writes it to the database
    $("#commentBtn").click(function () {
        var username = "";
        var icon;
        var color;
        var time;
        firebase.database().ref("classes/" + urlParams["c"] + "/users/" + currentUserID).once("value").then(function (snapshot) {
            var user = snapshot.val();
            username = user.username;
            icon = user.icon;
            color = user.color;
            writeCommentData("classes/" + urlParams["c"] + "/posts/" + urlParams["p"] + "/comments/", username, $("#commentContent").val(), icon, color);
        });
    });
}


var urlParams;
// Gets the URL parameters
(window.onpopstate = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();

initializePage();
