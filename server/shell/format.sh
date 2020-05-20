#!/usr/bin/env sh

# px转rem
px2rem $1/css/index.css -u 46.875
# 代码格式化
prettier --single-quote --write "$1/*.html"
prettier --single-quote --write "$1/**/*.{js,css}"
# 代码压缩
uglifycss $1/css/index.debug.css>$1/css/index.min.css
