<?php
session_start(); 
$fileAsArray = Array();
$firstRow = Array();
$counter = 0;
if (($handle = fopen("uploads/".$_SESSION['sessionid'], "r")) !== FALSE) {


	// Is it JSON?
$contents = fread($handle, filesize("uploads/".$_SESSION['sessionid'])); 

$pos = strpos($contents, "{");

if($pos === false) {


	echo "var data = [";
	$row = "";
$continue = 1;
$handle = fopen("uploads/".$_SESSION['sessionid'], "r");
$countline == 0;
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {

		if ($counter == 0) {
		$rowcount = count($data);
			for ($i = 0; $i < $rowcount; $i++) {
			    $firstRow[] = $data[$i];
			} 
		}	
		else {

			if (count($data) != $rowcount) {
				echo "\nMismatched data lengths on line: ".$countline.".\n You will need to modify the original file.";
				$continue = 0;
				} else {
					if ($continue) {
						$row .= "{\n";
						$stringy = "";
										for ($i = 0; $i < $rowcount; $i++) {
											$stringy .= "\t\"".$firstRow[$i]."\":\"".$data[$i]."\",\n";
										}
						$trimmed = rtrim($stringy, ",\n");
						$row .= $trimmed;
						$row .= "\n},\n";
						$countline++;
					}
				}


			}

		$counter++;
	
	}
		$trimmedrow = rtrim($row, ",\n");
		echo $trimmedrow;
	echo "\n];";
} else {
	echo "var data =".$contents;
}
fclose($handle);
}



?>