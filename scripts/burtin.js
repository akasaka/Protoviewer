var width = 500;
var height = 500;
var innerRadius = 90;
var outerRadius = 200 - 10;

/* Colors. */
var drugColor = {
      Penicillin: "rgb(10, 50, 100)",
      Streptomycin: "rgb(200, 70, 50)",
      Neomycin: "black"
     }, gramColor = {
      positive: "rgba(174, 174, 184, .8)",
      negative: "rgba(230, 130, 110, .8)"
     };

/* Burtin's radius encoding is, as far as I can tell, sqrt(log(mic)). */
var min = Math.sqrt(Math.log(.001 * 1E4));
var max = Math.sqrt(Math.log(1000 * 1E4));
var a = (outerRadius - innerRadius) / (min - max);
var b = innerRadius - a * max;
function radius(mic) { return a * Math.sqrt(Math.log(mic * 1E4)) + b; }

/*
* The pie is split into equal sections for each bacteria, with a blank
* section at the top for the grid labels. Each wedge is further
* subdivided to make room for the three antibiotics, equispaced.
*/
var bigAngle = 2.0 * Math.PI / (data.length + 1);
var smallAngle = bigAngle / 7;

/* The root panel. */
var vis = new pv.Panel()
	.width(width)
	.height(height)
	.bottom(100);

/* Background wedges to indicate gram staining color. */
var bg = vis.add(pv.Wedge)
	.data(data) // assumes Burtin's order
	.left(width / 2)
	.top(height / 2)
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.angle(bigAngle)
	.startAngle(function(d) { return this.index * bigAngle + bigAngle / 2 - Math.PI / 2; })
	.fillStyle(function(d) { return gramColor[d.gram]; });

/* Antibiotics. */
bg.add(pv.Wedge)
	.angle(smallAngle)
	.startAngle(function(d) { return this.proto.startAngle() + smallAngle; })
	.outerRadius(function(d) { return radius(d.penicillin); })
	.fillStyle(drugColor.Penicillin)
	.add(pv.Wedge)
	.startAngle(function(d) { return this.proto.startAngle() + 2 * smallAngle; })
	.outerRadius(function(d) { return radius(d.streptomycin); })
	.fillStyle(drugColor.Streptomycin)
	.add(pv.Wedge)
	.outerRadius(function(d) { return radius(d.neomycin); })
	.fillStyle(drugColor.Neomycin);

/* Circular grid lines. */
bg.add(pv.Dot)
	.data(pv.range(-3, 4))
	.fillStyle(null)
	.strokeStyle("#eee")
	.lineWidth(1)
	.size(function(i) { return Math.pow(radius(Math.pow(10, i)), 2); })
	.anchor("top").add(pv.Label)
	.visible(function(i) { return i < 3; })
	.textBaseline("middle")
	.text(function(i) { return Math.pow(10, i).toFixed((i > 0) ? 0 : -i); });

/* Radial grid lines. */
bg.add(pv.Wedge)
	.data(pv.range(data.length + 1))
	.innerRadius(innerRadius - 10)
	.outerRadius(outerRadius + 10)
	.fillStyle(null)
	.strokeStyle("black")
	.angle(0);

/* Labels. */
bg.anchor("outer").add(pv.Label)
	.textAlign("center")
	.text(function(d) { return d.bacteria; });

/* Antibiotic legend. */
vis.add(pv.Bar)
	.data(pv.keys(drugColor))
	.right(width / 2 + 3)
	.top(function() { return height / 2 - 28 + this.index * 18; })
	.fillStyle(function(d) { return drugColor[d]; })
	.width(36)
	.height(12)
	.anchor("right").add(pv.Label)
	.textMargin(6)
	.textAlign("left");

/* Gram-stain legend. */
vis.add(pv.Dot)
	.data(pv.keys(gramColor))
	.left(width / 2 - 20)
	.bottom(function() { return -60 + this.index * 18; })
	.fillStyle(function(d) { return gramColor[d]; })
	.strokeStyle(null)
	.size(30)
	.anchor("right").add(pv.Label)
	.textMargin(6)
	.textAlign("left")
	.text(function(d) { return "Gram-" + d; });

vis.render();