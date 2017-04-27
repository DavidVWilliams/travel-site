var gulp = require('gulp'),
svgSprite = require('gulp-svg-sprite'),
rename = require('gulp-rename'),
del = require('del'),
svg2png = require('gulp-svg2png');

var config = {
  shape: {
		spacing: {
			padding: 1
		}
	},
	mode: {
		css: {
			variables: {
				replaceSvgWithPng: function() {
					return function(sprite, render) {
						return render(sprite).split('.svg').join('.png');
					}
				}
			},
			sprite: 'sprite.svg',
			render: {
				css: {
					template: './gulp/templates/sprite.css'
				}
			}
		}
	}
}

// Delete existing sprite folders before creating new sprite
gulp.task('beginClean', function() {
	return del(['./app/temp/sprite', './app/assets/images/sprites']);
});

// Create sprite file from svg files in icons directory
gulp.task('createSprite', ['beginClean'], function() {
	return gulp.src('./app/assets/images/icons/**/*.svg')
	.pipe(svgSprite(config))
		.pipe(gulp.dest('./app/temp/sprite/'));
});

// Create PNG from SVG
gulp.task('createPngCopy', ['createSprite'], function() {
	return	gulp.src('./app/temp/sprite/css/*.svg')
	.pipe(svg2png())
	.pipe(gulp.dest('./app/temp/sprite/css'));
});

// Copy sprite file from temp to images directory.  Dependent on createSprite task
gulp.task('copySpriteGraphic', ['createPngCopy'], function() {
	return gulp.src('./app/temp/sprite/css/**/*.{svg,png}')
		.pipe(gulp.dest('./app/assets/images/sprites'));
});

// Copy sprite CSS from temp directory to modules and renames to _sprite.css
gulp.task('copySpriteCSS', ['createSprite'], function() {
	return gulp.src('./app/temp/sprite/css/*.css')
		.pipe(rename('_sprite.css'))
		.pipe(gulp.dest('./app/assets/styles/modules'));
});

gulp.task('endClean', ['copySpriteGraphic', 'copySpriteCSS'], function() {
	return del('./app/temp/sprite');
});

gulp.task('icons', ['beginClean', 'createSprite', 'createPngCopy', 'copySpriteGraphic', 'copySpriteCSS', 'endClean']);