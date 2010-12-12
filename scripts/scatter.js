/* Sizing and scales. */
var w = 550,
   h = 400,
   |quantitative1| = pv.Scale.linear(0, |maxquantitative1|).range(0, w),
   |quantitative2| = pv.Scale.linear(0, |maxquantitative2|).range(0, h),
   |quantitative3| = pv.Scale.log(1, 100).range("orange", "brown");

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
   .visible(function(d) { return d > 0 && d < 1; })
   .text(|quantitative2|.tickFormat);

/* X-axis and ticks. */
vis.add(pv.Rule)
   .data(|quantitative1|.ticks())
   .left(|quantitative1|)
   .strokeStyle(function(d) { return d ? "#eee" : "#000"; })
   .anchor("bottom").add(pv.Label)
   .visible(function(d) { return d > 0 && d < 100; })
   .text(|quantitative1|.tickFormat);

/* The dot plot! */
var view = vis.add(pv.Panel)
   .data(data)
   .add(pv.Dot)
   .left(function(d) { return |quantitative1|(d.|quantitative1|); })
   .bottom(function(d) { return |quantitative2|(d.|quantitative2|); })
   .strokeStyle(function(d) { return |quantitative3|(d.|quantitative3|); })
   .fillStyle(function() { return this.strokeStyle().alpha(.2); })
   .size(function(d) { return d.|quantitative3|; })
   .title(function(d) { return d.|quantitative3|.toFixed(1); });

vis.render();