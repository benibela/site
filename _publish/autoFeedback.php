<?php
  $app=$_POST['app'];
  $ver=$_POST['ver'];
  if ($app == "") $app = $_GET['app'];
  $data=$_POST['data'];

  $message = "";
  foreach($_POST as $key => $value) 
    $message = $message. $key . " = " . $value . "\n";
  
  if ($app == "" && $ver == "" && $data == "") exit();
  
  function myget($data, $name) {
    $i = stripos($data, $name);
    if ($i === FALSE) return "";
    $i = $i + +strlen($name);
    $ito = stripos($data, "\n", $i);
    return trim(substr($data, $i, $ito - $i ));
  }
  $fromMail = myget($data, "Mail:");
  $fromName = myget($data, "Name:");
  if ($fromName == "") {
    $t = stripos($fromMail, "@");
    if ($t > 0)
      $fromName = substr($fromMail, 0, $t);
  }
  if ($fromName == "") $fromName = "ErrorReport";
  if ($fromMail == "") $fromMail = "noreply@benibela.de";
 
  $headers = "From: \"".$fromName."\" <".$fromMail.">\r\n" .
             "MIME-Version: 1.0\r\n".
             "Content-type: text/plain; charset=UTF-8\r\n";
  
 
  
#  mail("benito@benibela.de","[-[Fehler]-] in ".$app." ".$ver,"Fehler in ".$app." ".$ver.": \n\n".$data);
  mail("benito@benibela.de","[-[Fehler]-] in ".$app." ".$ver,"Fehler in ".$app." ".$ver.": \n\n".$message,$headers);

?>PHPOK
