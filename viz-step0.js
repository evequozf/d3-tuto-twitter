/*****************************************************
                      INIT
*****************************************************/

var margin = {top: 10, right: 10, bottom: 25, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var w = width + margin.left + margin.right;
var h = height + margin.top + margin.bottom;

var svg = d3.select("svg")
    .attr("width", w)
    .attr("height", h)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var thedata; //global variable to hold the loaded data


/** Scales **/

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()  //linear
    .range([height, 0]);
    
var r = d3.scale.sqrt()
    .range([2, 20]);

var color = d3.scale.category20();


/*****************************************************
                LOAD DATA AND DISPLAY
*****************************************************/

d3.csv("TimelineSession_alltweets.csv", function(error, data) {
  
  //keep all fields, changing types when needed
  data.forEach(function(d) {
    //date -> format from "Wed Mar 18 20:15:52 CET 2015" to ""Wed Mar 18 20:15:52 2015"
    d.date = new Date(Date.parse(d.date.replace("CET ","")));
    d.retweetedstatus = +d.retweetedstatus; //1 si retweet
    d.retweets = +d.retweets;
    d.favorites = +d.favorites;
    d.actions = d.retweets+d.favorites;
    d.followers = +d.followers;
    d.reach = +d.reach;
    d.nom = d['Nom Prénom'];
  });
  
  //filter to retain only original tweets
  thedata = data.filter(function(d) { return d.retweetedstatus == 0;});

  x.domain(d3.extent(thedata, function(d) { return d.date; })).nice();
  y.domain(d3.extent(thedata, function(d) { return d.reach; })).nice(); 
  r.domain(d3.extent(thedata, function(d) { return d.actions; })).nice(); 

  //draw dots for tweets
  svg.selectAll(".dot")
      .data(thedata)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function(d){ return r(d.actions); })
      .attr("cx", function(d) { return x(d.date); })  
      .attr("cy", function(d) { return y(d.reach); }) 
      .style("stroke", function(d) { return color(d.Parti); })
      .style("fill", function(d) { return color(d.Parti); });



  attachTooltip(); //defined below, not part of course
});














/*****************************************************
                    TOOLTIP
*****************************************************/
var ttip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
    
function getTooltip(d) {
  	var s = 
		'<div class="name">'+d.nom+"</div>"
		+'<div class="parti"><span class="filterPartiIcon" style="background-color:'
			+color(d.Parti)
			+'"></span>'
			+d.Parti+" - Canton "+d.Canton/*+" - "+d.Conseil*/+"</div>"
		+'<div class="tweet">'+d.text+"</div>"
		+"<table><tr><td>Visibilité*   </td><td>"
			+(d.reach)+"</td></tr>"
		+"<tr><td>Popularité**   </td><td>"
			+(d.actions)+"</td></tr>"
		+"<tr><td class=time>Envoyé le</td><td>"
			+d.date.toLocaleString()+"</td></tr>"
		+"<table>"
	;
	return s;
}

function attachTooltip() {
   svg.selectAll(".dot")
		  .on("mouseover", function(d) { 
		  		//console.log(d3.event.pageX+" "+d3.event.pageY);
				if(!d3.select(this).classed("muted")) {
					d3.select(this).style("fill-opacity",1); 
					ttip.transition()        
						.duration(100)      
						.style("opacity", 1);      
					ttip.html(getTooltip(d))
						.style("left", (d3.event.pageX + 
							(d3.event.pageX > (width-200) ? -380 : 10)) 
							+ "px")        
						.style("top", (d3.event.pageY - 40) + "px");
				}   
			})
		  .on("mouseout",  function(d) { 
		  		if(!d3.select(this).classed("muted")) {
					d3.select(this).style("fill-opacity",0);
					ttip.transition()        
						.duration(200)      
						.style("opacity", 0);  
				}
			}); 
}