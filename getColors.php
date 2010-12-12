<?php 

function rgb2html($r, $g=-1, $b=-1)
{
    if (is_array($r) && sizeof($r) == 3)
        list($r, $g, $b) = $r;

    $r = intval($r); $g = intval($g);
    $b = intval($b);

    $r = dechex($r<0?0:($r>255?255:$r));
    $g = dechex($g<0?0:($g>255?255:$g));
    $b = dechex($b<0?0:($b>255?255:$b));

    $color = (strlen($r) < 2?'0':'').$r;
    $color .= (strlen($g) < 2?'0':'').$g;
    $color .= (strlen($b) < 2?'0':'').$b;
    return '#'.$color;
}

$hue = $_POST["hue"];
$dataclasses = $_POST["classes"];
$colors = $_POST["colorstring"];

$colorobject = json_decode($colors);
$colors = stripslashes($colors);
$obj = json_decode($colors);

$min = 17;
$max = 32;
$ranges = (int)$dataclasses - 2;
$delta = ($max - $min)/$ranges;
echo "// Colors by ColorBrewer.org, Cynthia A. Brewer, Penn State.\n";
echo "// Profile: '".$hue."' with ".$dataclasses." data classes\n";

echo "var col = function(v) {\n";
for ($i = 1; $i <= (int)$dataclasses; $i++) {
	$hex = rgb2html($obj->{(string)$i});
	$valu = $min + $delta*($i - 1);

	if ($i != (int)$dataclasses) {
		echo "if (v < ".$valu.") return '".$hex."';\n";
	} else {
		echo "return '".$hex."';\n};";
	}
}
?>