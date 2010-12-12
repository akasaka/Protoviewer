/* Sizing and scales. */
var w = 400,
    h = 200,
    x = pv.Scale.linear(0, 9.9).range(0, w),
    y = pv.Scale.linear(0, 14).range(0, h);

/* The root panel. */
var vis = new pv.Panel()
    .width(w)
    .height(h)
    .bottom(20)
    .left(20)
    .right(10)
    .top(5);

/* X-axis and ticks. */
vis.add(pv.Rule)
    .data(x.ticks())
    .visible(function(d) { return d; })
    .left(x)
    .bottom(-5)
    .height(5)
	.anchor("bottom").add(pv.Label)
    .text(x.tickFormat);

/* The stack layout. */
vis.add(pv.Layout.Stack)
    .layers(data)
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); })
	.layer.add(pv.Area);

/* Y-axis and ticks. */
var view = vis.add(pv.Rule)
    .data(y.ticks(3))
    .bottom(y)
    .strokeStyle(function(d) { return d ? "rgba(128,128,128,.2)" : "#000"; })
	.anchor("left").add(pv.Label)
    .text(y.tickFormat);

vis.render();
