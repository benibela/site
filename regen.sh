#/bin/sh
echo $1
java -cp ../../programs/data/jaxmlparser/publish FileParser process $1
cp _publish/index_de.html _publish/index.html
