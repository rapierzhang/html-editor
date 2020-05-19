#########################################################################
# File Name: init.sh
# Author: zmy
# Created Time: 二  5/19 10:35:18 2020
#########################################################################
#!/bin/bash
dirPath=`pwd`
echo $dirPath

sudo npm i -g px2rem prettier uglifycss

cd $dirPath/server/
npm i
chmod +x ./shell/format.sh
chmod +x ./shell/release.sh

cd $dirPath/client
npm i

