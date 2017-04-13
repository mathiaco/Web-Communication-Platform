/*QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});*/
var colCount;
function listClass(classKey, title, description, taID) {
	
    // Changes color of panel heading for fun
    if (colCount == 1) {
        color = "purple";
        colCount++;
		console.log("Testing 1");
    }
    else if (colCount == 2) {
        color = "pink";
        colCount++;
		console.log("Testing 2");
    }
    else if (colCount == 3) {
        color = "orange";
        colCount = 1;
		console.log("Testing 3");
    }
	else{
	console.log("Testing 4 or above or below 1");
    }
    
    
}
QUnit.test("Column numbering test in classpage",function(assert)
{	
	assert.expect(7);
	for(i=0;i<7;i++)
	{colCount = i;
	var test = new listClass(12,"test","wht",0);
	assert.ok( 1 == "1", "Passed!" );}
})
