<?php 
$type = $_POST["type"];

$content = file_get_contents("snippet/".$type.".txt");
echo $content;
?>