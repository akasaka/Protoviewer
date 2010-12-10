/* Sizing and scales. */
var w = 550,
    h = 550,
    r = w / 2,
    a = pv.Scale.linear(0, pv.sum(data)).range(0, 2 * Math.PI);
 
/* The root panel. */
var vis = new pv.Panel()
    .width(w)
    .height(h);
 
/* The wedge, with centered label. */
var view = vis.add(pv.Wedge)
    .data(data.sort(pv.reverseOrder))
    .bottom(w / 2)
    .left(w / 2)
    .innerRadius(r - 40)
    .outerRadius(r)
    .angle(a)
    .event("mouseover", function() { return this.innerRadius(0); })
    .event("mouseout", function() { return this.innerRadius(r - 40); })
    .anchor("center").add(pv.Label)
    .visible(function(d) { return d > .15; })
    .textAngle(0)
    .text(function(d) { return d.toFixed(2); });
 
vis.render();