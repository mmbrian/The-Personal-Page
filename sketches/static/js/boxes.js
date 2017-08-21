// Inspssired by ...
// Mohsen Mansouryar

// Curved Partitions

// TODO:
// 1. alpha changes rather rapidly as the order of layers changes. make it smooth.

//// Main Part ///////////////////////////////////




// world constants
var hw, hh;
var fps = 60;

var last_frame = -1;
var pause = false;

var nboxes = 50;
var min_side = 7;
var max_side = 250;
var boxes_x;
var boxes_y;
var boxes_init_s;
var boxes_s;
var boxes_clr;
var boxes_dir;
var min_v = 0.1;
var max_v = 1.3;
var boxes_init_v;
var boxes_curr_v;
var min_a = 0.0;
var max_a = 0.1;
var boxes_a;
var min_alpha = 255;
var max_alpha = 255;

// var min_rotation_v = 0.1;
// var max_rotation_v = 0.5;
// var boxes_rotation_speed;
// var boxes_r;


function setup() {
	document.assetsLoaded = true;
	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);
	hw = width / 2.;
	hh = height / 2.;

	boxes_x = new Array(nboxes);
	boxes_y = new Array(nboxes);
	boxes_s = new Array(nboxes);
	boxes_init_s = new Array(nboxes);
	boxes_dir = new Array(nboxes);
	boxes_clr = new Array(nboxes);
	boxes_a = new Array(nboxes);
	boxes_init_v = new Array(nboxes);
	boxes_curr_v = new Array(nboxes);
	// boxes_rotation_speed = new Array(nboxes);
	// boxes_r = new Array(nboxes);
	for (var i=0; i<nboxes; i++) {
		// boxes_r[i] = 0;
		// boxes_rotation_speed[i] = random(min_rotation_v, max_rotation_v);
		boxes_a[i] = random(min_a, max_a);
		boxes_init_v[i] = random(min_v, max_v);
		boxes_curr_v[i] = boxes_init_v[i];
		boxes_clr[i] = color(random(255),random(255),random(255),random(min_alpha,max_alpha));
		boxes_init_s[i] = random(min_side, max_side);
		boxes_s[i] = boxes_init_s[i];
		boxes_x[i] = random(width);
		boxes_y[i] = random(height);

		var dest_x = random(width);
		var dest_y = random(height);
		var l = dist(boxes_x[i], boxes_y[i], dest_x, dest_y);
		boxes_dir[i] = createVector((dest_x-boxes_x[i])/l, (dest_y-boxes_y[i])/l);
	}

	// angleMode(DEGREES); // Change the mode to DEGREES

	blendMode(MULTIPLY); 
	// blendMode(REPLACE); 
	// blendMode(SOFT_LIGHT); 
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	switch (keyCode) {
		case 32: // Space key
			pauseSketch();
			break;
		case ENTER: // enter key
			// restart();
			break;
		default:
			break;
	}
}
function pauseSketch() {
	pause = !pause;
}
function restart() {
	clear();	
	last_frame = -1;
}
function draw() {
	if (frameCount > 3*fps){
		if (last_frame < 0) {
			last_frame = frameCount;
		}
		main();
	}
}

function resetBox(i) {
	boxes_curr_v[i] = boxes_init_v[i];
	boxes_clr[i] = color(random(255),random(255),random(255),random(min_alpha,max_alpha));
	return random(min_side, max_side);
}

function animateBoxes() {
	for (var i=0; i<nboxes; i++) {
		boxes_curr_v[i] = boxes_curr_v[i] + boxes_a[i];
		boxes_x[i] = boxes_x[i]+boxes_dir[i].x*boxes_curr_v[i];
		boxes_y[i] = boxes_y[i]+boxes_dir[i].y*boxes_curr_v[i];
		boxes_s[i] = lerp(boxes_s[i], boxes_init_s[i], 0.01);

		if (boxes_x[i] - boxes_s[i] > width) {
			boxes_s[i] = resetBox(i);
			boxes_x[i] = -boxes_s[i]; 
		} else if (boxes_x[i] + boxes_s[i] < 0) {
			boxes_x[i] = width; 
			boxes_s[i] = resetBox(i);
		}
		if (boxes_y[i] - boxes_s[i] > height) {
			boxes_s[i] = resetBox(i);
			boxes_y[i] = -boxes_s[i]; 
		} else if (boxes_y[i] + boxes_s[i] < 0) {
			boxes_y[i] = height; 
			boxes_s[i] = resetBox(i);
		}
	}

}


function main() {
	var fn = (frameCount-last_frame);
	clear();
	// background(255);
	if (!pause)
		animateBoxes();
	for (var i=0; i<nboxes; i++) {
		push();  // Start a new drawing state

		noStroke();
		fill(boxes_clr[i]);

		translate(boxes_x[i], boxes_y[i]);

		// boxes_r[i] = boxes_r[i] + boxes_rotation_speed[i];
		// rotate(boxes_r[i]);

		rect(0, 0, boxes_s[i], boxes_s[i]);

		pop();  // Restore original state
	}
	
}



//////////////////////////////////////////////////