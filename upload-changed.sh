#!/bin/sh
cd _publish
sed -e 's:_publish:.:' ../buildtemp/changed | xargs --verbose -- bash -c '../upload.sh $0 $@ ./'
