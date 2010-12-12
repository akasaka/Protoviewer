<?php 
session_start();

include("config.php");

$id = $_POST["id"];
$title = $_POST["title"];
$public = $_POST["public"];
$sid = $_SESSION['sessionid'];


// Connect to the database
$db = mysql_connect("$dbHost", "$dbUser", "$dbPass") or die ("Error connecting to database.");
$db_found = mysql_select_db("$dbDatabase", $db) or die ("Couldn't select the database.");

$result = mysql_query("SELECT * FROM ".$dbTable." where sessionid = '".$sid."'", $db);
$num_rows = mysql_num_rows($result);
if ($num_rows == 0) {

	if ($result=mysql_query("insert into protoviewer (id,title,public,sessionid) VALUES ('$id','$title', '$public', '$sid')", $db)) {
	 echo "Successfully saved! Share the following link: http://www.rioleo.org/protoviewer/?share=".$id;
	}
} else {
	if ($result=mysql_query("update protoviewer set id = '$id', public = '$public', title = '$title' where sessionid = '$sid'", $db)) {
	 echo "Successfully updated! Share the following link: http://www.rioleo.org/protoviewer/?share=".$id;
	}
}

?>