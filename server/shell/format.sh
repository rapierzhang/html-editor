#!/usr/bin/env sh

prettier --single-quote --write "$1/*.html"
prettier --single-quote --write "$1/**/*.{js,css}"
