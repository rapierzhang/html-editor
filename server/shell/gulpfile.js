const { series, parallel, dest, src } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-px2rem-plugin');
const uglify = require('gulp-uglify');
const uglifyCss = require('gulp-uglifycss');
const babel = require('gulp-babel');
const prettier = require('gulp-prettier');
const minimist = require('minimist');

const knownOptions = {
    string: ['pid'],
    default: { pid: '' },
};
const options = minimist(process.argv.slice(2), knownOptions);
const path = `../public/html/${options.pid}`;

function cssFormat() {
    return src(`${path}/css/index.css`)
        .pipe(prettier())
        .pipe(dest(`${path}/css`));
}

function css() {
    return src(`${path}/css/index.css`)
        .pipe(
            autoprefixer({
                // browsers: ['iOS >= 7', 'Android >= 4.0', 'Firefox > 20', 'ie >= 9', 'last 2 versions',  'last 2 versions'],
                cascade: false,
            }),
        )
        .pipe(
            px2rem({
                width_design: 750,
                valid_num: 6,
                pieces: 16,
                ignore_px: [1, 2],
            }),
        )
        .pipe(uglifyCss())
        .pipe(dest(`${path}/dist`));
}

function javascriptFormat() {
    return src(`${path}/js/index.js`)
        .pipe(prettier())
        .pipe(dest(`${path}/js`));
}

function javascript() {
    return src(`${path}/js/index.js`)
        .pipe(babel())
        .pipe(uglify())
        .pipe(dest(`${path}/dist`));
}

exports.build = series(parallel(css, javascript), parallel(cssFormat, javascriptFormat));
