<?php
session_start(); 
	$error = "";
	$msg = "";
	$fileElementName = 'fileToUpload';

// Rudimentary file size handling
$file_size = @filesize($_FILES['fileToUpload']['tmp_name']);
if ($file_size > 1048576) {
	$_FILES[$fileElementName]['error'] = "2";
}

// Rudimentary file extension handling
$allowedExtensions = array("txt","csv", "js");

    if ($_FILES['fileToUpload']['tmp_name'] > '') {
      if (!in_array(end(explode(".",
            strtolower($_FILES['fileToUpload']['name']))),
            $allowedExtensions)) {
 			$_FILES[$fileElementName]['error'] = "8";
      }
    }
  

	if(!empty($_FILES[$fileElementName]['error']))
	{
		switch($_FILES[$fileElementName]['error'])
		{

			case '1':
				$error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
				break;
			case '2':
				$error = 'The uploaded file is too big. Please use a smaller data set.';
				break;
			case '3':
				$error = 'The uploaded file was only partially uploaded';
				break;
			case '4':
				$error = 'No file was uploaded.';
				break;

			case '6':
				$error = 'Missing a temporary folder';
				break;
			case '7':
				$error = 'Failed to write file to disk';
				break;
			case '8':
				$error = 'Please upload a text, js or CSV file.';
				break;
			case '999':
			default:
				$error = 'No error code avaiable';
		}
	}elseif(empty($_FILES['fileToUpload']['tmp_name']) || $_FILES['fileToUpload']['tmp_name'] == 'none')
	{
		$error = 'No file was uploaded..';
	}else 
	{
//$a = session_id();
$target_path = "uploads/";
$orig_name = $_FILES['fileToUpload']['name'];

$_FILES['fileToUpload']['name'] = $_SESSION['sessionid'];
$target_path = $target_path . basename( $_FILES['fileToUpload']['name']); 

	move_uploaded_file($_FILES['fileToUpload']['tmp_name'], $target_path);
			$msg .= "Successfully loaded " . $orig_name . ", ";
			$msg .= " with file size: " . @filesize($_FILES['fileToUpload']['tmp_name']) . "B.";
			//for security reason, we force to remove all uploaded file
			//@unlink($_FILES['fileToUpload']);		
	}		
	echo "{";
	echo				"error: '" . $error . "',\n";
	echo				"msg: '" . $msg . "'\n";
	echo "}";
?>