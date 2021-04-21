

all: buildtemp/tardis buildtemp/global.d phony upload

buildtemp/global.d: global.xml
	xidel global.xml --extract-include xxx --extract-kind xquery -e 'output-dir := "_publish/",source:=()'  --extract-file common.xq -e 'local:deps()' > buildtemp/global.d


include buildtemp/global.d

.PHONY := phony clean all clean-html clean-img pre-upload do-upload
phony: $(PAGES) _publish/index.html
#$(DEPS) $(PAGES)

#include $(DEPS)

_publish/%_de.html publish/%_en.html: %.xml common.xq style.xq.html global.xml
	xidel --input-format xml-strict --extract-include=xxx -e 'source := "$*", output-dir := "_publish/"' --extract-kind xquery  --extract-file common.xq -e 'local:doit()'
	
_publish/%_de.php publish/%_en.php: %.xml common.xq style.xq.html global.xml
	xidel --input-format xml-strict --extract-include=xxx -e 'source := "$*", output-dir := "_publish/"' --extract-kind xquery  --extract-file common.xq -e 'local:dophp()'

_publish/%_de.rss publish/%_en.rss: %.xml common.xq news.rss.xq global.xml
	xidel --input-format xml-strict --extract-include=xxx -e 'source := "$*", output-dir := "_publish/"' --extract-kind xquery  --extract-file common.xq -e 'local:dorss()'

_publish/index.html: _publish/index_de.html
	cp _publish/index_de.html _publish/index.html

#	-e 'gallery:=doc("$*.xml")/gallery,lang:="de"' --extract-file common.xq --extract-file gallery.xq.html  --html > publish/$*.htm
#	xidel --extract-include=xxx --extract-kind xquery -e 'gallery:=doc("$*.xml")/gallery,lang:="en"' --extract-file common.xq --extract-file gallery.xq.html  --html > publish/$*_EN.htm


clean: clean-img clean-html
	
clean-html:
	rm publish/*.html


buildtemp/tardis:
	test -e buildtemp/tardis || touch buildtemp/tardis
  
upload:
	find _publish/ -type f -newer buildtemp/tardis > buildtemp/changed
	./upload-changed.sh	
	touch buildtemp/tardis
	
