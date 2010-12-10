/* Sizing and scales. */
var w = 550,
    h = 300,
    x = pv.Scale.linear(data, function(d) { return d.x; }).range(0, w),
    y = pv.Scale.linear(0, 4).range(0, h);
 
/* The root panel. */
var vis = new pv.Panel()
    .width(w)
    .height(h)
    .bottom(20)
    .left(20)
    .right(10)
    .top(5);
 
/* X-axis ticks. */
vis.add(pv.Rule)
    .data(x.ticks())
    .visible(function(d) { return d > 0; })
    .left(x)
    .strokeStyle("#eee")
  .add(pv.Rule)
    .bottom(-5)
    .height(5)
    .strokeStyle("#000")
  .anchor("bottom").add(pv.Label)
    .text(x.tickFormat);
 
/* Y-axis ticks. */
vis.add(pv.Rule)
    .data(y.ticks(5))
    .bottom(y)
    .strokeStyle(function(d) { return d ? "#eee" : "#000"; })
  .anchor("left").add(pv.Label)
    .text(y.tickFormat);
 
/* The line. */
var view = vis.add(pv.Line)
    .data(data)
    .interpolate("step-after")
    .left(function(d) { return x(d.x); })
    .bottom(function(d) { return y(d.y); })
    .lineWidth(3);
 
vis.render();
 