<?php 

$id = $_GET["id"];

$dbHost = "p50mysql213.secureserver.net";
$dbUser = "musicsurvey";
$dbPass = "Alohario1005";
$dbDatabase = "musicsurvey";

// Connect to the database

$db = mysql_connect("$dbHost", "$dbUser", "$dbPass") or die ("Error connecting to database.");
$db_found = mysql_select_db("$dbDatabase", $db) or die ("Couldn't select the database.");

if ($result=mysql_query("select * from protoviewer where id = '".$id."'", $db)) {

while($row = mysql_fetch_array($result))
  {
	$rowid = $row['sessionid'];
	$rowtitle = $row['title'];
  }
}
	$content = file_get_contents("uploads/".$rowid);
	//$data = json_decode($content);
	echo "var data = ".$content.";";
	echo "$('.chartcodetype').html('".$rowtitle."');";
	echo "$.ajax({ type: 'POST', url: 'saveCode.php',data:'type=share&id=".$id."',success: function(data) { editor.setCode(data);runCode();}});";
?>