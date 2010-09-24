#/bin/sh
echo $1
java -cp ../../programs/data/jaxmlparser/publish FileParser $1 --print-changed-output-files process  > /tmp/webpageregen

if grep index_de.html /tmp/webpageregen; then 
cp _publish/index_de.html _publish/index.html
echo _publish/index.html >> /tmp/webpageregen 
fi



myarray=""
while read line
do myarray="$myarray ${line#_publish/}"
done < /tmp/webpageregen
echo "$myarray";

if [ "$myarray" != "" ]; then 
cd _publish
../upload.sh $myarray .
fi
