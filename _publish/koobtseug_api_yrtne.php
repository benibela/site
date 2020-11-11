<?php
  include 'config.php';
  
  $mailheaders = "From: \"$configownername\" <$configmail>\r\n" .
                 "MIME-Version: 1.0\r\n".
                 "Content-type: text/plain; charset=UTF-8\r\n";

  
  function processText($Text){
    $Text=nl2br($Text);
    $Text= stripslashes($Text);
    $Text=preg_replace("/\[b\]/","<b>",$Text);
    $Text=preg_replace("/\[\/b\]/","</b>",$Text);
    $Text=preg_replace("/\[i\]/","<i>",$Text);
    $Text=preg_replace("/\[\/i\]/","</i>",$Text);
    $Text=preg_replace("/\[u\]/","<span style='text-decoration: underline;'>",$Text);
    $Text=preg_replace("/\[\/u\]/","</span>",$Text);
    $Text=preg_replace("/'/","\"",$Text);
    return $Text;
  }
  
  $configdbPDO = "mysql:host=localhost;dbname=$configdb";  
  $db = new PDO( $configdbPDO, $configdbname, $configdbpass );
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
  
  $Name=$_POST['input2'];
  $Mail=$_POST['input3'];
  $Site=$_POST['input7'];
  $sitetitle=$_POST['input6'];
  $ICQ=$_POST['input5'];
  $IP=getenv('REMOTE_ADDR');
  $host=gethostbyaddr($IP);
  $lang=$lang;
  $Browser=getenv('HTTP_USER_AGENT');
  $Time=time();
  $Text=$_POST['input1'];
  $thread= isset($_POST['thread']) ? $_POST['thread'] : "" ;
  $botTrapMustHave=$_POST['input10'];
  $botTrapMustNotHave=$_POST['input11'];
  $returnparam = "";

  if (strcasecmp($Name, $configownername) === 0 || strcasecmp($Name, $configownernick) === 0) {
    $Text = str_replace(array("\r\n", "\r"), "\n", $Text);
    $lines = explode("\n",  $Text);
    //echo "'".$lines[0]."'<br/>'".$lines[1]."'<br/>";
    $row = "";
    if (($_POST['inputp'] === $configadminpass)) {
      if ($lines[0] === "COMMAND:DELETE-ENTRY:"){
        $cond=" FROM Guestbook WHERE `ID` = ".intval($lines[1]);
        $todelete = $db->query("SELECT `ID`,`Name`, `Text`, `comment`, `Mail` ".$cond);
        if ($todelete->rowCount() != 1) $TextOld = "Don't delete: <br/>Wrong number of entries: ".$todelete->rowCount();
        else {
          $row = $todelete->fetch( PDO::FETCH_BOTH )  ;
          $TextOld = "Delete: $row[ID]<br/>".$row['Name']."<br/>".$row['Text']."<br/>".$row['comment']."<br/>";
          $db->query("DELETE ".$cond);
        }
      } else if ($lines[0] === "COMMAND:DELETE-ENTRIES:"){
        for ($curid=intval($lines[1]);$curid<=intval($lines[2]);$curid++){
          $cond=" FROM Guestbook WHERE `ID` = ".$curid;
          $todelete = $db->query("SELECT `ID`,`Name`, `Text`, `comment`, `Mail` ".$cond);
          if ($todelete->rowCount() != 1) $TextOld .= "Don't delete: <br/>Wrong number of entries: ". $todelete->rowCount();
          else {
            $row = $todelete->fetch( PDO::FETCH_BOTH );
            $TextOld .= "Delete: ".$row['ID']."<br/>".$row['Name']."<br/>".$row['Text']."<br/>".$row['comment']."<br/>";
            $db->query("DELETE ".$cond);
          }
        }
      } else if ($lines[0] === "COMMAND:MARK-ENTRY:"){
        $flag = intval($lines[1]);
        $cond=" WHERE `ID` = ".intval($lines[2]);
        $tochange = $db->query("SELECT `ID`,`Name`, `Text`, `comment`, `Mail`, `flags` FROM Guestbook ".$cond);
        if ($tochange->rowCount() != 1) $TextOld = "Not found: <br/>Wrong number of entries: ".$tochange->rowCount();
        else {
          $row=$tochange->fetch( PDO::FETCH_BOTH );
          $TextOld = "Marked: ".$row['ID']."<br/>".$row['Name'];
          $db->query("UPDATE Guestbook SET flags='".($row["flags"] ^ $flag)."' ".$cond);
        }
      } else if ($lines[0] === "COMMAND:REPLY-TO:"){
        $cond=" WHERE `ID` = ".intval($lines[1]);
        $tochange = $db->query("SELECT `ID`,`Name`, `Text`, `comment`, `Mail` FROM Guestbook ".$cond);
        if ($tochange->rowCount() != 1) $TextOld = "Don't reply: <br/>Wrong number of entries: ".$tochange->rowCount();
        else {
          $newComment=implode("\n",array_splice($lines,2,count($lines)-2));
          $row=$tochange->fetch( PDO::FETCH_BOTH );
          $TextOld = "Reply to: $row[ID]<br/>$row[Name]<br/>$row[Text]<br/>$row[comment]<br/>--------------<br/>".$newComment;
          $db->query("UPDATE Guestbook SET comment=".$db->quote(processText($newComment)).", commenttime=$Time ".$cond);
        }
      } else $TextOld = "Der Beitrag wurde nicht akzeptiert.";
      $returnparam = "?edom=nimda";
    } else $TextOld = "Der angegebene Name ist nicht erlaubt.";
    echo $TextOld;    
    
    $mailto = "benito@benibela.de";
    $title = "[Guestbook]: ".$Name;
    if ($row) {
      $title = $title.", ".$row['Name'];
      if ($row['Mail']) $mailto = $mailto.", ".$row['Mail'];
      $TextOld = str_replace( ["<br>","<br/>"], ["\n","\n"], $TextOld);
    } else $TextOld = "Mail: ".$Mail."\nIP:".$IP."\nBrowser:".$Browser."\nSite: ".$Site."\nBlocked: ".$blockBecause."\n\n".$TextOld."\n\n-----------------------------------\n\n".$Text;
    mail($mailto, $title, $TextOld, $mailheaders);
  } else {  
    $Text=processText($Text);
    if (isset($_POST['input4'])) {$flags=$FLAG_HIDEMAIL;}
    else {$flags=0;}
    
    
    $TextOld=$Text;
    $blockBecause=0;
    if (is_int(strpos(strtolower($Browser),"pussycat"))) {
      $blockBecause=1;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Gästebucheintrag wurde wegen ungültigem Browser nicht akzeptiert!.</b></span><br/>Folgende Browser sollten auf jeden Fall funktionieren: FireFox, Opera und Internet Explorer";
      else $Text="<span style=\"color: red\"><b>Due to the use of a blocked browser your entry has not been accepted.</b></span><br/>If you use on of the following, it should work: FireFox, Opera und Internet Explorer";
    }

    if ($botTrapMustHave != "yes" || $botTrapMustNotHave != "" ) {
      $blockBecause=2;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Bot-Falle nicht deaktiviert.</b></span>";
      else $Text="<span style=\"color: red\"><b>You have failed to disarm the bot trap.</b></span>";
    }

    if (substr_count($Text,"http://")>=2) {
      $flags |= $FLAG_PENDING;
    }
    if ($_POST['input8']!="") {
      $blockBecause=9;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Bot test failed.</b></span>";
      else $Text="<span style=\"color: red\"><b>Bot test failed.</b></span>";
    }
   
    if (!preg_match('#\w+#', $Text)) {
      $blockBecause=10;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Gästebucheintrag wurde nicht akzeptiert.</b></span><br/>Bitte einen Text eingeben.";
      else $Text="<span style=\"color: red\"><b>Please insert a text.</b></span>";
    }
    
    if (($Name==$Mail) && ($Name!="")) {
      $blockBecause=12;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Name und E-Mailaddresse müssen unterschiedlich sein</b></span>";
      else $Text="<span style=\"color: red\"><b>Name and mail addy must differ</b></span>";
    }

    if (($Name==$Site) && ($Name!="")) {
      $blockBecause=13;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Name und Homepageaddresse müssen unterschiedlich sein</b></span>";
      else $Text="<span style=\"color: red\"><b>Name and homepage addy must differ</b></span>";
    }

    if (($Mail==$Site) && ($Mail!="")) {
      $blockBecause=14;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Mail- und Homepageaddresse müssen unterschiedlich sein</b></span>";
      else $Text="<span style=\"color: red\"><b>Mail and homepage addy must differ</b></span>";
    }

    if (!preg_match('#^$|.+@.+\..+#', $Mail)) {
      $blockBecause=15;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Ungültige E-Mailadresse (du kannst auch keine angeben, nur eben keine falsche)</b></span>";
      else $Text="<span style=\"color: red\"><b>Invalid mail address (You don't need to give one, but you are not allowed to input an invalid one)</b></span>";
    }

    if (!preg_match('#^$|.+\..+#', $Site)) {
      $blockBecause=16;
      if ($lang=="de") $Text="<span style=\"color: red\"><b>Ungültige Homepageadresse (du kannst auch keine angeben, nur eben keine falsche)</b></span>";
      else $Text="<span style=\"color: red\"><b>Invalid website address (You don't need to give one, but you are not allowed to input an invalid one)</b></span>";
    }

    if (!preg_match('#^$|^http(s?)://#', $Site)) $Site="http://".$Site;  

    if ($blockBecause==0) {
      $stmt = $db->prepare("INSERT INTO `Guestbook` (`Name`, `Mail`, `Site`,`sitetitle`, `ICQ`, `Text`, `flags`, `IP`, `host`, `lang`, `Browser`, `Time`, `thread`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      $entrydata = [$Name, $Mail, $Site, $sitetitle, $ICQ, $Text, $flags, $IP, $host, $lang, $Browser, $Time, $thread];
      for ($i=0;$i<count($entrydata);$i++)
        $stmt->bindParam($i + 1, $entrydata[$i]);
      $stmt->execute();
      if ($lang == "de") {
        echo "Danke für deinen Eintrag ".htmlspecialchars($Name)."<br/>";
        echo "Er lautet: <br/><p style=\"padding-left:1em\">".htmlspecialchars($Text)."</p>";
      } else {
        echo "Thanks for your entry, ".htmlspecialchars($Name).".<br/>";
        echo "You entry is: <br/><p style=\"padding-left:1em\">".htmlspecialchars($Text)."</p>";
      }
      mail($configmail,"[Gästebuch $thread]: ".$Name,"Mail: ".$Mail."\nIP:".$IP."\nBrowser:".$Browser."\nSite: ".$Site."\nBlocked: ".$blockBecause."\n\n".$TextOld."\n\n-----------------------------------\n\n".$Text."\n\nSender headers:\n".http_build_query ( getallheaders(), "", "\n"));
    } else {
      if ($lang == "de") {
        echo "Dein Eintrag wurde nicht angenommen.<br/>";
        echo "Der Grund hierfür ist: <br/><p style=\"padding-left:1em\">".$Text."</p>";
      } else {
        echo "Your entry was not accepted.<br/>";
        echo "This is because: <br/><p style=\"padding-left:1em\">".$Text."</p>";
      }
    }
  }
  
      
    unset($db);
    
?>
