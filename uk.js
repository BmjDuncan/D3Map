//Draws map of UK---------------------------------------------
function drawMap(geojson){
//uses the mercator projection for lat lon to x,y and centers
var projection = d3.geoMercator()
.scale(1500)
.translate([400,300])
.center([0,55]);

var geoGenerator = d3.geoPath()
	.projection(projection);

//draws map
var map = d3.select("#content g.map")
	.selectAll("path")
	.data(geojson.features)
	.enter()
	.append("path")
	.attr("d", geoGenerator)
	.style("fill","green");

}



//Draws Circles----------------------------------------------
function drawCircles(dataset){
//uses the mercator projection for lat lon to x,y and centers
var projection = d3.geoMercator()
.scale(1500)
.translate([400,300])
.center([0,55]);

//creats an infobox that is invisible
var info=d3.select("body")
	.append("rect")
	.style("position","absolute")
    .style("opacity", 0)
	.style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "3px")
    .style("border-radius", "10px")
    .style("padding", "7px")
;

//makes infobox visible and on top when mouse enters circle to be called
var mouseover = function() {
    info
      .style("opacity", 1)
	  .style("z-index", "10")
    d3.select(this)
	.style("stroke-width",2)
      .style("opacity", 1)
};
  
//gives infobox information and placement relavtive to mouse whilst moving in circle
var mousemove = function() {
    info
      .html("Name: " +dataset[d3.select(this).attr("id")].Town +"<br> County: "+dataset[d3.select(this).attr("id")].County +"<br> Population: "+dataset[d3.select(this).attr("id")].Population)
      .style("top", d3.pointer(event)[1]+30+"px")
      .style("left", d3.pointer(event)[0]+30+"px")
};
//makes infobox invisible and behind when mouse leaves circle 
var mouseleave = function() {
    info
      .style("opacity", 0)
	  .style("z-index", "-1")
    d3.select(this)
	.style("stroke-width",1)
      .style("opacity", 0.8)
};

//draws new circles and removes old circles using join function to do both at the same time
var Circles=d3.select("#content g.map").selectAll("circle")
	.data(dataset)
	.join(
		function(enter){
			return enter
				.append("circle")
				.transition()
				.duration(1500)
				.ease(d3.easeBounce)
				.attr("cx", function(d){
					return projection([d.lng,d.lat])[0];
				} )
				.attr("cy",function(d){
					return projection([d.lng,d.lat])[1];
				} )
				.attr("r", function(d){
					return 0.02*Math.sqrt(d.Population);
				})
				.style("fill","red")
				.style("opacity", 0.8)
				.style("stroke", "black")
				.style("stroke-width",1);
		},
		function(update){
			return update
			.transition()
			.duration(1500)
			.ease(d3.easeBounce)
			.attr("cx", function(d){
					return projection([d.lng,d.lat])[0];
				} )
				.attr("cy",function(d){
					return projection([d.lng,d.lat])[1];
				} )
				.attr("r", function(d){
					return 0.02*Math.sqrt(d.Population);
				})
			},
		
		function(exit){
			return exit
			.transition()
			.duration(1500)
			.ease(d3.easeBounce)
			.attr("cx",1200)
			.remove();
		})
	.attr("id",function(d,i){return i})
	.style("z-index","3")
	.on("mouseover", mouseover)
	.on("mousemove", mousemove)
	.on("mouseleave", mouseleave);
		;
		
}

//Calls for UK MAP and Circles/Update Circles-------------------------
function loadMap(){
//reads UK map data can calls for make to be drawn
d3.json("https://gist.githubusercontent.com/carmoreira/49fd11a591e0ce2c41d36f9fa96c9b49/raw/e032a0174fc35a416cff3ef7cf1233973c018294/ukcounties.json")
	.then(function(json) {
		drawMap(json)
	});

//dectects slider value and movement and calls for new circles to be drawn when slider changes
var slider=document.getElementById("myRange");
var output=document.getElementById("value");
output.innerHTML=slider.value;
slider.oninput=function(){output.innerHTML=this.value;
}
slider.addEventListener("click",function(){
	d3.json("http://34.78.46.186/Circles/Towns/"+slider.value)
	.then(function(data) {
		drawCircles(data) 
	})
}); 
	
//reads inital data
 d3.json("http://34.78.46.186/Circles/Towns/25")
	.then(function(data) {
		drawCircles(data)
	}); 
	
	
}


window.onload=loadMap;