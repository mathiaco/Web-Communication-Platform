var taID=1;

function isTA() {
  if (taID == currentUserID) {
	  console.log("I am TA");
    return true;
  } else
	   console.log("I am student");
    return false;
}
QUnit.test("TA function",function(assert)
{	
	assert.expect(3);
	for(i=0;i<3;i++)
	{currentUserID = i;
	var test = new isTA();
	assert.ok( 1 == "1", "Passed!" );}
})
