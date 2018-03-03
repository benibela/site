#/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/../../manageUtils.sh

mirroredProject site

BASE=$HGROOT/sites/web5

case "$1" in
mirror)
  syncHg  
;;

checklinks)
  echo searching invalid internal links
  xidel -s --extract-include=xx --printed-node-format xml global.xml -e 'output-dir := "/tmp",source:="",language:=//language[1]' -e 'unchecked := ( 
    "documentation/internettools/xqts.html",
    "documentation/internettools/internettoolsxqts.html",
    "documentation/","bin/games/sirdslets/sirdslet_page.html",
    "documentation/internettools/xpath-functions.html")
  ' --extract-file common.xq  -f '//basefilename/(.||".xml")' --xquery '
    //a[not(starts-with(@href, "http")) and not(starts-with(@href,"//"))] ! (
      try { 
        let $oldref := extract(@href, "^\s*(\w+)_(\w+).html(#(.+))?", (1,2,4))
        return if (not($oldref[3] = ("", "top"))) then (
            if (local:get-id-target($oldref[3])("source") != $oldref[1]) then . 
            else if ((ancestor::*/@language)[last()] != $oldref[2]) then . 
            else ()
        ) else if (@auto and @auto != "*rss") then local:get-id-target(@auto)!()
        else if ($oldref[2] and (ancestor::*/@language)[last()] != $oldref[2] and @lang != $oldref[2]) then .
        else if (not(@auto) and not(file:exists("_publish/" || replace(@href,"#.*",""))) and not(@href = $unchecked)) then .
        else ()
      } catch * { . }
    ) ! ($url || ": " || outer-xml(.))
  ' 

  echo searching invalid external links
  xidel -s --user-agent "Mozilla/5.0 (X11; Linux x86_64; rv:31.0) Gecko/20100101 Firefox/31.0 Iceweasel/31.5.3" global.xml -f '//basefilename/(.||".xml")' --method HEAD --error-handling 2xx=skip,4xx=accept,5xx=accept,xx=accept -f '//a[starts-with(@href, "http")]/@href' -e '"failed:" || $url || " " || $headers[1]'
  
  echo done
;;

esac

