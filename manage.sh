
#/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/../../manageUtils.sh

mirroredProject site

BASE=$HGROOT/sites/web5

case "$1" in
mirror)
  syncHg  
;;

esac

