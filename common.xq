xquery version "4.0-xidel";
declare function local:eval($tpl) {
  eval($tpl, {"language": "xquery"})
};
declare function local:write($file, $data, $format){
  if ($format = "php") then
    local:write($file, x:replace-nodes($data, $data//processing-instruction(php), function($php) {
      processing-instruction {"php"} {$php||"?"}
    }), "html")
  else 
    file:write($output-dir || $file, $data, 
      <output:serialization-parameters xmlns:output="http://www.w3.org/2010/xslt-xquery-serialization">
        <output:method value="{$format}"/>
      </output:serialization-parameters>
    )
};
declare function local:language-filter($node, $language-id){
  x:transform($node, function($e){
    if ($e/@language 
        and $e/@language != $language-id 
        and $e/(preceding-sibling::*,following-sibling::*)[name() = $e/name() and @language = $language-id] ) then ()
    else  switch(name($e))
      case "a" return if ($e/@auto) then
        switch ($e/@auto)
          case "*rss" return
            <a href="{get("fileinfo")/basefilename}_{$language/id}.rss"><img src="img/design/feed.png"/></a>  
          default return let $target := local:get-id-target($e/@auto) 
          return <a href="{$target('source')}_{$language/id}.html#{$e/@auto}">{if (normalize-space($e)) then $e/node() else $target('title')}</a>
        else $e
      case "insert"  return
        if ($e/@value = "currentyear") then year-from-dateTime(current-date())
        else $e
      default return $e
  })
};
declare function local:language-filter($node){
  local:language-filter($node, $language/id)
};
declare function local:file-url($fileinfo, $language){
  if ($fileinfo/url) then $fileinfo/url
  else x"{$fileinfo/basefilename}_{$language/id}{ ($fileinfo/extension, ".html")[1] }"
};
declare function local:file-url($fileinfo){
  local:file-url($fileinfo, $language)
};
declare function local:file-url(){
  local:file-url($fileinfo, $language)
};
declare function local:rss-url($fi,$lang){
  x"{$fi/basefilename}_{$lang/id}.rss"
};
declare function local:remember-id($id, $title){
  file:write-text("buildtemp/ids/" || $id || "-" || $language/id, serialize-json({
    "title": $title,
    "source": $source
  }))
};
declare function local:get-id-target($id){
  jn:parse-json(file:read-text("buildtemp/ids/" || $id || "-" || $language/id))
};
declare function local:writeSiteMap($fileparent){
  for $fi in $fileparent/fileinfo[not(hidden = "YES")] return (
     <li><a href="{local:file-url($fi)}#top">{
         if ($fi/basefilename = $fileinfo/basefilename) then attribute class { "activepage" } else (),
         $fi/title/node()
       }</a></li>,
     if ($fi/fileinfo) then
       <li><ul class="menulink_sublist">{local:writeSiteMap($fi)}</ul></li>
     else ()
  )
};
declare variable $global-raw := doc("global.xml")/global;
declare function local:deps(){
	 "PAGES := " || join( 
	   for $fi in $global-raw//fileinfo, 
	       $l in $global-raw/language 
	   let $url := local:file-url($fi, $l) 
	   where not(contains($url, "//"))
     return ($url,
       if ($fi/@make-rss) then local:rss-url($fi, $l)
       else ()
     ) ! ($output-dir || .) )
};
declare function local:make($inputstyle, $outputfunction, $format){ 
  (
  $file-raw := doc($source || ".xml")/file,
  $style.template := file:read-text($inputstyle),
  for $l in $global-raw/language return (
    $language := $l,
    $global := local:language-filter($global-raw),
    $fileinfo := $global//fileinfo[basefilename = $source],
    $file := local:language-filter( $file-raw ),
    local:write($outputfunction($fileinfo, $l),  local:eval($style.template), $format)
  )[0]
  )[0]
};
declare function local:doit(){ 
  local:make("style.xq.html", local:file-url#2, "html")
};
declare function local:dophp(){ 
  local:make("style.xq.html", local:file-url#2, "php")
};
declare function local:dorss(){ 
  local:make("news.rss.xq", local:rss-url#2, "xml") 
};
()
