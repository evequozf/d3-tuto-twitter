
// Standard javascript way of styling elements
var paragraphs = document.getElementsByTagName("p");
for (var i = 0; i < paragraphs.length; i++) {
  var paragraph = paragraphs.item(i);
  paragraph.style.setProperty("color", "blue", null);
}

// D3 can mass-style elements
d3.selectAll("p").style("color","red");

// D3 provide means to easily select elements and apply modifications
d3.select("svg").style("border","1px solid lightgray");


// D3 binds data to DOM elements
the_data = ["Hello","Web","Mardi"];

// Bind it to paragraphs, e.g. one paragraph for each word in the_data
d3.select(".content")
	.selectAll("p")
	.data(the_data).enter()
		.append("p")
		.text(function(d){return d});
//save explanation of how binding precisely works for further courses...

//apply constant value for background color
d3.select(".content").selectAll("p").style("background-color","lightgray");

// (from d3js.org) - Yet styles, attributes, and other properties can be specified as functions of data in D3, not just simple constants.
d3.select(".content").selectAll("p")
	.data(the_data)
	.style("color",function(d){
		if (d=="Mardi") 
			return "blue"; 
		else return "black";
	});



// D3 for visualization -> usually SVG
d3.select("svg")
	.append("circle")
	.attr("cx",50)
	.attr("cy",50)
	.attr("r",10);
d3.select("svg")
	.append("circle")
	.attr("cx",50)
	.attr("cy",100)
	.attr("r",10);

// we can style them alright
d3.selectAll("circle")
	.style("fill","none")
	.style("stroke","blue")

// D3 can also remove elements
d3.selectAll("circle").remove();


//Alright? -> if yes dive deeper (return to powerpoint)



