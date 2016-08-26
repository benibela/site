<?php if ($_REQUEST['thread']){?>
<html>
	<head>
    <title>BeniBela online</title>
     
    <link rel="stylesheet" href="css/guestbook.css"/>
    <script type="text/javascript" src="js/guestbook.js"></script>
    
    <link rel="stylesheet" href="css/all.css">
    <!--[if IE]><link rel="stylesheet" href="css/ie.css"><![endif]-->    
    <!--[if lte IE 6]><link rel="stylesheet" href="css/lte_ie6.css"><![endif]-->
    <link rel="stylesheet" media="print" href="css/print.css"> 
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" media="only screen and (max-width: 560px)" href="css/mobile.css">
    <style>html, body {overflow-y: auto}</style>
</head>
    <body style="background-color: #FFFFDD">
<?php }?>
<div id="topInputBox">
<table id="secondInputBox"><tr><td id="inputRow">
<?php 
  include 'config.php';
  $adminmode = $_GET['edom'] == "nimda";
  echo '<form action="koobtseug_yrtne_'.$lang.'.php?lang='.$lang.'" method="post" id="inputbox">'; 
?>
    <table>
      <tr>
        <td><?php if ($lang == "de") { ?>Eintrag (notwendig):<?php } else { ?>Entry (necessary):<?php } ?></td>
        <td><textarea name="input1" rows="6" id="entryBox"></textarea></td>
      </tr>
      <tr>
        <td>&#160;</td>
        <td><input type="button" value="b" id="boldBtn" style="font-weight:bold; width:2em; text-align:center;" onClick="javascript:boldClicked();"/>
            <input type="button" value="i" id="italicBtn" style="font-style: italic; width:2em; text-align:center;" onClick="javascript:italicClicked();"/>
            <input type="button" value="u" id="underlineBtn" style="font-decoration: underline; width:2em; text-align:center;" onClick="javascript:underlinedClicked();"/>
            <input type="button" value="http://" id="httpBtn"  style="width:auto; text-align:center;" onClick="javascript:httpClicked();"/>
            <input type="button" value="mailto:" id="mailBtn" style="width:auto; text-align:center;" onClick="javascript:mailClicked();"/>
            <input type="button" value="img " id="imgBtn" style="width:auto; text-align:center;" onClick="javascript:imgClicked();"/></td>
      </tr>
      <?php if ($adminmode) { ?>
      <tr>
        <td>Password:</td>
        <td><input type="text" name="inputp"/></td>
      </tr>
      <?php } ?>
      <tr>
        <td>Name:</td>
        <td><input type="text" name="input2"/></td>
      </tr>
      <tr>
        <td>E-Mail:</td>
        <td><input type="text" name="input3"/></td>
      </tr>
      <tr>
        <td>&#160;</td>
        <td><input type="checkbox" name="input4" value="yes" style="width: auto"/>
          <?php if ($lang == "de") {echo "E-Mail Adresse verbergen";} else {echo "hide mail addy";} ?></td>
      </tr>
      <tr>
        <td>ICQ:</td>
        <td><input type="text" name="input5"/></td>
      </tr>
      <tr>
        <td>
          <?php if ($lang == "de") { ?>Homepage-Titel:<?php } else { ?>title of your homepage:<?php } ?>
       </td>
       <td><input type="text" name="input6"/></td>
     </tr>
     <tr>
       <td>
         <?php if ($lang == "de") { ?>Homepage-URL:<?php } else { ?>url of your homepage:<?php } ?>
       </td>
       <td><input type="hidden" name="input8"/><input type="text" name="input7"/></td>
     </tr>
     </table>
     <?php if ($_REQUEST["thread"]) echo '<input type="hidden" name="thread" value="'.htmlspecialchars($_REQUEST["thread"]).'"/>'; ?> 
     <input type="submit" value="Absenden"/>
    <!-- <p><br/><?php if ($lang == "de") { ?>Falls jemand  hier nur einen Eintrag machen möchte, um bessere Rankings bei Suchmaschinen zu erreichen (wie in den letzten 40 - nun gelöschten - Einträgen), kann er es vergessen:<br/>Das Gästebuch wird auf Grund der robots-Einstellung von Suchmaschinen (schon immer) vollkommen ignoriert.<?php } else { ?>The guestbook is (and always was) completely ignored by every search engine due to the robots settings, so spamming is useless."<?php } ?></p>-->
<?php echo '</form>' ?>
 </td></tr>
 
<?php 
  $FLAG_HIDEMAIL = 1;
  $FLAG_SPAM = 2;
  
  if ($lang=="de") {
    $tr = array ( 
      "showspam" => "Als Spam markiert. Trotzdem zeigen"
    ); 
  } else {
    $tr = array ( 
      "showspam" => "marked as spam. show anyways"
    ); 
  }

  $db=@mysql_connect("localhost",$configdbname,$configdbpass) or die ("Verbindung zum SQL-Server konnte nicht hergestellt werden.");
  #@mysql_set_charset('latin1',$db);
  @mysql_select_db($configdb,$db) or die ("Datenbankverbindung konnte nicht hergestellt werden.");
  $cond = ($adminmode ? "" : "WHERE `thread` = '".mysql_real_escape_string($_REQUEST['thread'])."'");
  $result=@mysql_query("SELECT `ID`,`Name`, `Mail`, `Site`, `sitetitle`,`ICQ`, `Text`, `flags`, `Time`, `comment` FROM Guestbook $cond ORDER BY `ID` DESC",$db) or die ("Gästebuch konnte nicht gelesen werden");
  if ($result) {
    if (mysql_num_rows ( $result ) == 0) echo '<tr class="emptyrow"><td> ' . ($lang == "de" ? "Bisher keine Kommentare" : "No comments yet")  .   ' </td></tr>';
    while ($row=mysql_fetch_array($result)) {
      ?>
      <tr class="emptyrow"><td>&#160;</td></tr>
      <tr><td class="entryrowtitle">
        <?php 
          $id = $row['ID'];
          if ($adminmode) echo '<button onclick="guestbookDelete('.$id.')">X</button> <button onclick="guestbookSpamMark('.$id.')">spam</button>';
          echo "<span class='cap'>".$row['ID'].". ";
          if ($lang=="de") {
            echo "Geschrieben von</span>: ";
          } else {
            echo "written by</span>: ";
          } 
          $name=$row['Name'];
          if (empty($name)) 
            if ($lang=="de") $name=" -- unbekannt -- ";
            else $name=" -- unknown -- "; 
          if ((!empty($row['Mail'])) && (($row['flags'] & $FLAG_HIDEMAIL) == 0)) {
            echo "<a href=\"mailto:{$row['Mail']}\">{$name}</a>";
          } else {
            echo $name; 
          }
          if (!empty($row['ICQ'])){ 
            echo '<a href="http://www.icq.com/whitepages/about_me.php?uin='.$row['ICQ'].'">';
            echo '<img style="border: none;" src="http://status.icq.com/online.gif?icq='.$row['ICQ'].'&img=5"></a>';
          }
          if ((!empty($row['Site']))) {
            echo "<br/>";#\n <span class='cap'>";
            if ($lang=="de") {
              echo "Homepage: ";
            } else {
              echo "homepage: ";
            } 
            echo '<a href="'.$row['Site'].'">'.(empty($row['sitetitle'])?$row['Site']:$row['sitetitle']).'</a>';
          }
          echo "<br/>\n";
          if ($lang=="de") {
            $name_tag[0]  =  "Sonntag";        
            $name_tag[1]  =  "Montag"; 
            $name_tag[2]  =  "Dienstag"; 
            $name_tag[3]  =  "Mittwoch"; 
            $name_tag[4]  =  "Donnerstag"; 
            $name_tag[5]  =  "Freitag"; 
            $name_tag[6]  =  "Samstag"; 

            $name_monat[1]    =  "Januar"; 
            $name_monat[2]    =  "Februar"; 
            $name_monat[3]    =  "M&auml;rz"; 
            $name_monat[4]    =  "April"; 
            $name_monat[5]    =  "Mai"; 
            $name_monat[6]    =  "Juni"; 
            $name_monat[7]    =  "Juli"; 
            $name_monat[8]    =  "August"; 
            $name_monat[9]    =  "September"; 
            $name_monat[10]  =  "Oktober"; 
            $name_monat[11]  =  "November"; 
            $name_monat[12]  =  "Dezember"; 

            $num_tag  =  date( "w",$row['Time']); 
            $num_monat  =  date( "n",$row['Time']); 
            echo $name_tag[$num_tag].date(" d-",$row['Time'])."{$name_monat[$num_monat]}".date("-Y H:i:s",$row['Time']);
          } else {
            echo date("l Y-F-d h:i:s a",$row['Time']);
          } 
      ?></td></tr><tr>
      <?php 
        echo '<td class="';
        if (!empty($row['comment'])) echo "entryrow2"; else echo "entryrow";
        echo '">';
        if ($row['flags'] & $FLAG_SPAM) { 
          echo "<button onclick='guestbookShowSpam(this)' value=\"".htmlspecialchars($row['Text'])."\"> $tr[showspam] </button>";
        } else {
          echo $row['Text'];
        }
        echo '</td>';
      ?></tr><?php
        if (!empty($row['comment'])) {
          echo '<tr><td class="commentrow">';
          echo '<span class="cap">';
          if ($lang=="de") {
            echo "Kommentar von $configownercommented: <br/>";
          } else {
            echo "Comment by $configownercommented:<br/>";
          }
          echo '</span>';
          echo $row['comment'];
          echo '</td></tr>';
        } else if ($adminmode) {
          echo '<tr><td class="commentrow">';
          echo '<button onclick="guestbookComment('.$id.')">comment</button>';
          echo '</td></tr>';
        }
    }
  }
  mysql_close($db);
?></table></div>

<?php if ($_REQUEST['thread']){?>
</body>
</html><?php }?>