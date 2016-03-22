declare function local:eval($tpl) {
  eval($tpl, {"language": "xquery"})
};
declare function local:write-html($file, $data){
  file:write($output-dir || $file, $data, 
    <output:serialization-parameters xmlns:output="http://www.w3.org/2010/xslt-xquery-serialization">
      <output:method value="html"/>
    </output:serialization-parameters>
  )
};
declare function local:language-filter($node, $language-id){
  transform($node, function($e){
    if ($e/@language) then
      if ($e/@language != $language-id) then 
        if ( $e/(preceding-sibling::*,following-sibling::*)[name() = $e/name() and @language = $language-id] ) then ()
        else $e
      else $e
    else if ($e/@auto and name($e) = "a") then
      let $target := local:get-id-target($e/@auto) 
      return <a href="{$target('source')}_{$language/id}.html#{$e/@auto}">{$target('title')}</a>
    else $e
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
declare function local:remember-id($id, $title){
  file:write("buildtemp/ids/" || $id || "-" || $language/id, serialize-json({
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
     return $output-dir || $url )
};
declare function local:doit(){ 
  (
  (:$source := "index",
  $output-dir := "_publish/",:)
  $file-raw := doc($source || ".xml")/file,
  $style.template := file:read-text("style.xq.html"),
  for $l in $global-raw/language return (
    $language := $l,
    $global := local:language-filter($global-raw),
    $fileinfo := $global//fileinfo[basefilename = $source],
    $file := local:language-filter( $file-raw ),
    local:write-html( local:file-url(),  local:eval($style.template))
  )[0]
  )[0]
};
()