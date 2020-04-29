#!/usr/bin/env sh


prettier --single-quote --write "/Applications/XAMPP/xamppfiles/htdocs/html-editor/server/public/html/$1/*.html"
prettier --single-quote --write "/Applications/XAMPP/xamppfiles/htdocs/html-editor/server/public/html/$1/**/*.{js,css}"
