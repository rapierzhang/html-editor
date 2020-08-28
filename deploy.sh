#########################################################################
# File Name: deploy.sh
# Author: zhangmingyang
# mail: zhangmingyang@sogou-inc.com
# Created Time: 四  5/21 15:58:39 2020
#########################################################################
#!/bin/bash
dirpath=`pwd`
echo $dirpath
# echo '------ 前端部署 start ------'
# cd client
# cnpm i
# npm run build
# echo '------ 前端部署 end ------'
# echo '------ 服务端部署 start ------'
# cd $dirpath/server
# cnpm i
# pm2 restart html-editor
# echo '------ 服务端部署 end ------'
echo '------ 安装 start ------'
cnpm i
echo '------ 安装 end ------'
echo '------ 前端部署 start ------'
npm run build:client
echo '------ 前端部署 end ------'
echo '------ 服务端部署 start ------'
npm run build:server
echo '------ 服务端部署 end ------'
