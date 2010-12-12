<?php 
$type = $_POST["type"];
$pos = strpos($type,"pv");
if($pos === false) {

} else {
	$type = str_replace("pv.", "", $type);
}

//$content = file_get_contents("http://vis.stanford.edu/protovis/jsdoc/symbols/pv.".$type.".html");
if (@file_get_contents("http://vis.stanford.edu/protovis/jsdoc/symbols/pv.".$type.".html")) {
$content = @file_get_contents("http://vis.stanford.edu/protovis/jsdoc/symbols/pv.".$type.".html");
$dom = new DOMDocument();
@$dom->loadHTML($content);
$xpath = new DOMXPath($dom);
$hrefs = $xpath->evaluate("//div[@id='content']");
foreach ($hrefs as $e) {
$children = $e->childNodes;
    foreach ($children as $child) {
        $tmp_doc = new DOMDocument();
        $tmp_doc->appendChild($tmp_doc->importNode($child,true));       
        $innerHTML .= $tmp_doc->saveHTML();
    }
}
echo $innerHTML;
} else {
echo "Please select a word that begins with pv (without the parentheses) like <span class='monospace'>pv.Scale</span>, <span class='monospace'>pv.Panel</span> or <span class='monospace'>pv.Scale.linear</span>";
}
?>