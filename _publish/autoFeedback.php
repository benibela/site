<?php
  $app=$_POST['app'];
  $ver=$_POST['ver'];
  if ($app == "") $app = $_GET['app'];
  $data=$_POST['data'];

  $message = "";
  foreach($_POST as $key => $value) 
    $message = $message. $key . " = " . $value . "\n";
  
  
  function myget($data, $name) {
    $i = stripos($data, $name);
    if ($i === FALSE) return "";
    $i = $i + +strlen($name);
    $ito = stripos($data, "\n", $i);
    return trim(substr($data, $i, $ito - $i ));
  }
  $fromName = myget($data, "Name:");
  if ($fromName == "") $fromName = "ErrorReport";
  $fromMail = myget($data, "Mail:");
  if ($fromMail == "") $fromMail = "noreply@benibela.de";
 
  $headers = "From: ".$fromName." <".$fromMail.">";
 
  
#  mail("benito@benibela.de","[-[Fehler]-] in ".$app." ".$ver,"Fehler in ".$app." ".$ver.": \n\n".$data);
  mail("benito@benibela.de","[-[Fehler]-] in ".$app." ".$ver,"Fehler in ".$app." ".$ver.": \n\n".$message,$headers);

?>PHPOK
