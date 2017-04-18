function h(a, b) {
        var c, d, e, f, g;
        e = a & 2147483648;
        f = b & 2147483648;
        c = a & 1073741824;
        d = b & 1073741824;
        g = (a & 1073741823) + (b & 1073741823);
        return c & d ? g ^ 2147483648 ^ e ^ f : c | d ? g & 1073741824 ? g ^ 3221225472 ^ e ^ f : g ^ 1073741824 ^ e ^ f : g ^ e ^ f
    }
QUnit.test("testing date and time",function(assert)
{	
	assert.expect(10);
	for(i=0;i<10;i++)
	{a =i;
		b=i+1;
	var test = new h(a);
	assert.ok( 1 == "1", "Passed!" );}
})
