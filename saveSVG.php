<?php 
session_start();
$svg = $_POST["svg"];
$id = $_POST["id"];


	$sessionfile = fopen("svg/".$id, "w");
	fputs($sessionfile, $svg);
	fclose($sessionfile);
	echo "Saved file";
?>