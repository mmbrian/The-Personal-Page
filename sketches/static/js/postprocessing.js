// Mohsen Mansouryar
// web page goes here

// Post Processing formely named "Project Transition" tries to show my emphasis on
// post processing in digital photography and fill the gap between raw image and how
// it turns into a final displayable image. I believe this is not very much focused
// in photography nonetheless it is a very fundamental part of DP.

//// Main Part ///////////////////////////////////
var w , h;
var img_w = 1024;
var img_h = 683;
var offset_x, offset_y;
var fps = 60;
var num_images = 5;
var sketch_canvas;

var source, target;
var t, t_frac;
var max_t = 10;
var lerp_fac = 0.005;

var diff_clr, ic;

var pause = true;
var from_image, to_image;
var start_fading_in = true;
var image_alpha = 0;

var images;
function preload() {
	images = [];
	for (var i=0; i<num_images; i++) { 
		append(images, loadImage('static/other/postprocessing_assets/' + i + '.jpg'))
	}
}

function setup() {
	document.assetsLoaded = true;
	//// Initializations
	frameRate(fps);

	w = img_w;
	h = img_h;
	sketch_canvas = createCanvas(w, h);
	offset_x = (windowWidth - img_w)/2.0;
	offset_y = (windowHeight - img_h)/2.0;	
	sketch_canvas.position(offset_x, offset_y);

	from_image = 0;
	to_image = 1;
	initializeTransition(from_image, to_image);
}

function windowResized() {
	offset_x = (windowWidth - img_w)/2.0;
	offset_y = (windowHeight - img_h)/2.0;	
	sketch_canvas.position(offset_x, offset_y);
}

function initializeTransition(from, to) {
	source = images[from];
	target = images[to];

	ic = [];
	source.loadPixels();
	var i = 0;
	while (i < source.pixels.length) {
		append(ic, new Clr(source.pixels[i],
						   source.pixels[i+1],
						   source.pixels[i+2],
						   source.pixels[i+3]));
		if (from == 0) {
			source.pixels[i+3] = 0;
		}
		i+=4;
	}
	if (from == 0) {
		source.updatePixels();
	}

	diff_clr = [];
	target.loadPixels();
	i = 0;
	while (i < target.pixels.length) {
		append(diff_clr, new Clr(target.pixels[i] - source.pixels[i],
								 target.pixels[i+1] - source.pixels[i+1],
								 target.pixels[i+2] - source.pixels[i+2],
								 target.pixels[i+3] - source.pixels[i+3]));

		i+=4;
	}

	t = 0.0;
	t_frac = 1.0 / max_t;
}

function startFrame() {
	return frameCount;
}

function draw() {
	background(0);
	// Waiting until preloader is completely gone (1100 = 550 + 550)
	if (document.allowVisualization && frameCount-window.starting_frame > (1100+3750)/1000. * fps) {
		image(source, 0, 0);
		if (start_fading_in) {
			var i = 0;
			image_alpha = lerp(image_alpha, 255, 0.01); 
			while (i < source.pixels.length) {
				source.pixels[i+3] = image_alpha;
				i+=4;
			}
			if (image_alpha > 250) {
				start_fading_in = false;
				pause = false;
			}
			source.updatePixels();
		}
		if (pause) return;

		t = lerp(t, max_t, lerp_fac);
		if (max_t - t < 1) {
			from_image += 1;
			to_image += 1;
			if (to_image > num_images-1) {
				pause = true;
				to_image = num_images-1;
				from_image = num_images-1;
			}
			initializeTransition(from_image, to_image);
		}

		var i = 0;
		var j = 0;
		while (i < diff_clr.length) {
			var rr, gg, bb, aa, coeff;
			coeff = t*t_frac;
			//coeff = sqrt(coeff);
			rr = ic[i].r + diff_clr[i].r*sqrt(coeff);
			gg = ic[i].g + diff_clr[i].g*sqrt(coeff);
			bb = ic[i].b + diff_clr[i].b*sqrt(coeff);
			aa = ic[i].a + diff_clr[i].a*sqrt(coeff);
			source.pixels[j] = rr;
			source.pixels[j+1] = gg;
			source.pixels[j+2] = bb;
			source.pixels[j+3] = aa;
			i+=1;
			j+=4;
		}
		source.updatePixels();

		stroke(15);
		strokeWeight(5);
		strokeCap(SQUARE);
		line(0, h, w * (t/(max_t-1.0)), h);
	}
}

function keyPressed() {
	if (keyCode === LEFT_ARROW) {
		pause = false;
	} else if (keyCode === RIGHT_ARROW) {
		pause = true;
	} 
}

//////////////////////////////////////////////////

//// util ////////////////////////////////////////

function pixel(x, y) {
	return x + y * w;
}

//////////////////////////////////////////////////

var Clr = function(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}

//////////////////////////////////////////////////