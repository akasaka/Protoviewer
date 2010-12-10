<?php 


$dbHost = "p50mysql213.secureserver.net";
$dbUser = "musicsurvey";
$dbPass = "Alohario1005";
$dbDatabase = "musicsurvey";

// Connect to the database

$db = mysql_connect("$dbHost", "$dbUser", "$dbPass") or die ("Error connecting to database.");
$db_found = mysql_select_db("$dbDatabase", $db) or die ("Couldn't select the database.");

if ($result=mysql_query("select * from protoviewer where public = 'true'", $db)) {
	
	while($row = mysql_fetch_array($result))
	  {
		$rowid = $row['sessionid'];
		$rowtitle = $row['title'];
		$content = file_get_contents("svg/".$row['id']);
		//$data = json_decode($content);
		//$content = str_replace("width
		$stripped = stripslashes($content);
		//$stripped = str_replace("svg", "svg xmlns='http://www.w3.org/2000/svg'", $stripped);
		preg_match_all('@\s(width=)"\d+(\.\d+)?"@',$stripped, $arr, PREG_PATTERN_ORDER);
		$stripped = str_replace($arr[0][0], " width='200'", $stripped);
		preg_match_all('@\s(height=)"\d+(\.\d+)?"@',$stripped, $arr, PREG_PATTERN_ORDER);
		$stripped = str_replace($arr[0][0], " height='200'", $stripped);
		echo "<div class='gallery' id='".$row['id']."' style='float:left;width:210px;margin-right:10px;border:5px solid #aaa;'>";
		echo "<div style='float:left;margin-left:10px;margin-top:10px;font-size:15px;width:210px;'>";
		echo $rowtitle;
		echo "</div>";
		echo "<div style='float:left;width:210px;'>";
		echo $stripped;
		echo "</div>";
		echo "</div>";
		echo "<script type='text/javascript'>";
		echo "$('#".$row['id']."').click(function() { window.location = 'http://www.rioleo.org/protoviewer/?share=".$row['id']."'; })";
		echo "</script>";
	  }
}
?>