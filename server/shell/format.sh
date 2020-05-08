#!/usr/bin/env sh

px2rem $1/css/index.css -u 23.4375
mv $1/css/index.debug.css $1/css/index.build.css

prettier --single-quote --write "$1/*.html"
prettier --single-quote --write "$1/**/*.{js,css}"
