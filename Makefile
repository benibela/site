

all: buildtemp/tardis buildtemp/global.d phony upload

buildtemp/global.d: global.xml
	xidel global.xml \
	 -e '"PAGES := " || join( //basefilename/(x"_publish/{.}_de.html", x"_publish/{.}_en.html") )' > buildtemp/global.d
#	 -e '"DEPS := " || join( //basefilename/x"buildtemp/{.}.d" )' \
	 

include buildtemp/global.d

.PHONY := phony clean all clean-html clean-img pre-upload do-upload
phony: $(PAGES) 
#$(DEPS) $(PAGES)

#buildtemp/%.d: %.xml
#	xidel $*.xml -e '"$*.xml: " || join( ( /*/local-name()!x"{.}.xq.html", //photo/(x"publish/img/{replace(@src, "\.", "_small.")}", x"publish/img/{replace(@src, "\.", "_large.")}")))' > buildtemp/$*.d

#include $(DEPS)


_publish/%_de.html publish/%_en.html: %.xml common.xq style.xq.html
	xidel --input-format xml-strict --extract-include=xxx -e 'source := "$*", output-dir := "_publish/"' --extract-kind xquery  --extract-file common.xq
	
#	-e 'gallery:=doc("$*.xml")/gallery,lang:="de"' --extract-file common.xq --extract-file gallery.xq.html  --html > publish/$*.htm
#	xidel --extract-include=xxx --extract-kind xquery -e 'gallery:=doc("$*.xml")/gallery,lang:="en"' --extract-file common.xq --extract-file gallery.xq.html  --html > publish/$*_EN.htm


clean: clean-img clean-html
	
clean-html:
	rm publish/*.html


buildtemp/tardis:
	test -e buildtemp/tardis || touch buildtemp/tardis
  
upload:
	find _publish/ -type f -newer buildtemp/tardis > buildtemp/changed
	#./upload-changed.sh	
	touch buildtemp/tardis
	
