/* Sizing and scales. */
var w = 500,
    h = 400,
    |quantitative1| = pv.Scale.linear(0, |maxquantitative1|).range(0, w),
    |quantitative2| = pv.Scale.linear(0, |maxquantitative2|).range(0, h),
    c = pv.Scale.linear(0, |maxquantitative2|).range("orange", "brown");

/* The root panel. */
var vis = new pv.Panel()
    .width(w)
    .height(h)
    .bottom(20)
	.left(20)
    .right(10)
    .top(5);

/* Y-axis and ticks. */
vis.add(pv.Rule)
    .data(|quantitative2|.ticks())
    .bottom(|quantitative2|)
    .strokeStyle(function(d) { return d ? "#eee" : "#000"; })
	.anchor("left").add(pv.Label)
    .visible(function(d) { return d > 0 && d < |maxquantitative2|;})
    .text(|quantitative2|.tickFormat);

/* X-axis and ticks. */
vis.add(pv.Rule)
    .data(|quantitative1|.ticks())
    .left(|quantitative1|)
    .strokeStyle(function(d) { return d ? "#eee" : "#000";})
	.anchor("bottom").add(pv.Label)
    .visible(function(d) { return d > 0 && d < |maxquantitative1|;})
    .text(|quantitative2|.tickFormat);

/* The dot plot! */
vis.add(pv.Dot)
    .data(data)
    .left(function(d) { return |quantitative1|(d.|quantitative1|);})
    .bottom(function(d) { return |quantitative2|(d.|quantitative2|); })
    .strokeStyle(function(d)  { return c(d.|quantitative2|); })
    .fillStyle(function()  { return this.strokeStyle().alpha(.2); });

vis.render();