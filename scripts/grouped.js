var n = 3, m = 4;

/* Sizing and scales. */
var w = 400,
    h = 250,
    x = pv.Scale.linear(0, 1.1).range(0, w),
    y = pv.Scale.ordinal(pv.range(n)).splitBanded(0, h, 4/5);

/* The root panel. */

var vis = new pv.Panel()
    .width(w)
    .height(h)
    .bottom(20)
    .left(20)
    .right(10)
    .top(5);

/* The bars. */
var bar = vis.add(pv.Panel)
    .data(data)
    .top(function() { return y(this.index); })
    .height(y.range().band)
  .add(pv.Bar)
    .data(function(d) { return d; })
    .top(function() { return this.index * y.range().band / m; })
    .height(y.range().band / m)
    .left(0)
    .width(x)
    .fillStyle(pv.Colors.category20().by(pv.index));

/* The value label. */
bar.anchor("right").add(pv.Label)
    .textStyle("white")
    .text(function(d) { return d.toFixed(1); });

/* The variable label. */
bar.parent.anchor("left").add(pv.Label)
    .textAlign("right")
    .textMargin(5)
    .text(function() { return "ABCDEFGHIJK".charAt(this.parent.index); });

/* X-axis ticks. */
var view = vis.add(pv.Rule)
    .data(x.ticks(5))
    .left(x)
    .strokeStyle(function(d) { return d ? "rgba(255,255,255,.3)" : "#000"; })
  .add(pv.Rule)
    .bottom(0)
    .height(5)
    .strokeStyle("#000")
  .anchor("bottom").add(pv.Label)
    .text(x.tickFormat);

vis.render();
