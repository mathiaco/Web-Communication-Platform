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

function getURLVariables() {
    var pageURL = window.location.search.substring(1);
    pageURL = pageURL.split("=");
    classID = pageURL[1]
}

function initializePage() {
    var postsRef = firebase.database().ref("classes/" + urlParams["c"] + "/posts/" + urlParams["p"]);
    alert(urlParams["p"]);
    postsRef.on("value", function (snapshot, prevChildKey) {
        var newPost = snapshot.val();
        alert(newPost.title)
        $("#commentTimeline").append(
            "<li>" +
            "<div class='timeline-badge'><i class='fa fa-check'></i>" +
            "</div>" +
            "<div class='timeline-panel'>" +
            "<div class='timeline-heading'>" +
            "<h4 class='timeline-title'>" + newPost.title + "</h4>" +
            "<p><small class='text-muted'><i class='fa fa-clock-o'></i> 11 hours ago from " + newPost.username + "</small>" +
            "</p>" +
            "</div>" +
            "<div class='timeline-body'>" +
            "<p>" + newPost.content + "</p>" +
            "</div>" +
            "</div>" +
            "</li>"
        )

        firebase.database().ref("classes/" + urlParams["c"] + "/posts/" + urlParams["p"] + "/comments/").on("child_added", function (snapshot) {
            var newComment = snapshot.val();
            $("#commentTimeline").append(
                "<li class='timeline-inverted'>" +
                "<div class='timeline-badge'><i class='fa fa-check'></i>" +
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

initializeFirebase();
initializePage();

