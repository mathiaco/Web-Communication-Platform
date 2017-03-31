/*
    Script to create Plot.ly graph using Github contribution statistics data

    Needs the following in the HTML:
     <!-- Plotly.js -->
     <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

    Needs the Github data to be stored in
    var repoStats

    Inputs:
        - repoStats

    Outputs:
        - Plotly graphs in a div

    Plotly Graphs will be inserted in a div with the id = "graphsContainer"
 */

//Array holding the information to be displayed on graph
var repoStats2 = [];

//Variables
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var author = "";
var total = 0;
var x = [];
var y = [];
var maxCommit = 0;

//Loops through the repoStats json data
for(val in repoStats){

    var additions = 0;
    var deletions = 0;
    //Counts the additions and deletions for each author
    for(week in repoStats[val].weeks){
        additions = additions + repoStats[val].weeks[week].a;
        deletions = deletions + repoStats[val].weeks[week].d;
    }

    for(week in repoStats[val].weeks){
        //Converts date from unix to Date format
        var date = new Date(repoStats[val].weeks[week].w * 1000);
        //add date to X
        x.push(months[date.getMonth()] + " " + date.getDate());
        //add commits to Y
        y.push(repoStats[val].weeks[week].c);
        //Look for biggest commit
        if(maxCommit < repoStats[val].weeks[week].c){
            maxCommit = repoStats[val].weeks[week].c;
        }
    }

    //Adds the converted data to a javascript object
    repoStats2.push(
        {
            author: repoStats[val].author.login,
            total: repoStats[val].total,
            x: x,
            y: y
        }
    );
    //Resets the x and y variable
    x = [];
    y = [];
}

var repoGraph = document.getElementById("graphsContainer");

/*
    Creating div for each contributor in the repository
 */
for(i in repoStats2) {
    //Create divs for each author
    var div = document.createElement("div");
    div.setAttribute("id","graph"+ (repoStats2.length - i - 1));
    div.setAttribute("style","width: 60%; height: 300px");
    repoGraph.appendChild(div);
}
/*
    Populating the divs with graphs using Plotly
 */
for(j in repoStats2){
    Plotly.newPlot("graph"+j,
        [{
            x: repoStats2[j].x, y: repoStats2[j].y
        }],
        {
            title: repoStats2[j].author,
            xaxis:
            {
                title: "Week"
            },
            yaxis: {
                range: [0, maxCommit],
                title: "Number of Commits"
            }
        },{staticPlot: true});
}
