// Inspssired by ...
// Mohsen Mansouryar

// Curved Partitions

// TODO:
// DEBUG

//// Main Part ///////////////////////////////////


// world constants
var hw, hh;
var fps = 60;
var last_frame = -1;

var n_lines = 20;
var depth = 13;
var gr = 1.61803398875;

var min_x;
var min_y;
var max_y;
var max_x;
var h, w;

var lines_x1;
var lines_y1;
var lines_x2;
var lines_y2;
var curr_n_lines = 0;

var rotation_angle;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);
	// createCanvas(2048, 2048);
 	max_y = height - 50;
	max_x = max_y*gr;

	h = max_y;
	w = max_x;
	min_x = (width - w)/2.;
	min_y = (height - h)/2.;
	// h = height;
	// w = width;

	hw = w / 2.;
	hh = h / 2.;
	background(255);

	ellipseMode(CORNER);  // Set ellipseMode to CORNER	
	createLines();
}

function createLines() {
	lines_x1 = new Array(n_lines*depth);
	lines_x2 = new Array(n_lines*depth);
	lines_y1 = new Array(n_lines*depth);
	lines_y2 = new Array(n_lines*depth);
	var c = 0;

	var d;
	var side_x = 0;
	var side_y = 0;
	var curr_width = w;
	var curr_height = h;
	var side = 1; // top left, top right, bottom right, bottom left
	var box_width;

	for (var curr_depth = 0; curr_depth < depth; curr_depth++) {
		switch (side) {
			case 1:
				box_width = curr_height;
				// line(side_x + box_width, side_y, side_x + box_width, side_y + box_width);
				d = box_width/float(n_lines);
				for (var i = 0; i<n_lines; i++) {
					// line(side_x, side_y + curr_height-i*d, side_x+(i+1)*d, side_y);
					lines_x1[c] = side_x;
					lines_y1[c] = side_y + curr_height-i*d;
					lines_x2[c] = side_x+(i+1)*d;
					lines_y2[c] = side_y;
					c++;
				}
				side_x = side_x + curr_width;
				side_y = side_y;
				curr_width = curr_width - curr_height;
				break;
			case 2:
				box_width = curr_width;
				// line(side_x - box_width, side_y + box_width, side_x, side_y + box_width);
				d = box_width/float(n_lines);
				for (var i = 0; i<n_lines; i++) {
					// line(side_x-curr_width+i*d, side_y, side_x, side_y+(i+1)*d);
					lines_x1[c] = side_x-curr_width+i*d;
					lines_y1[c] = side_y;
					lines_x2[c] = side_x;
					lines_y2[c] = side_y+(i+1)*d;
					c++;
				}
				side_x = side_x;
				side_y = side_y + curr_height;
				curr_height = curr_height - curr_width;
				break;
			case 3:
				box_width = curr_height;
				// line(side_x - box_width, side_y - box_width, side_x - box_width, side_y);
				d = box_width/float(n_lines);
				for (var i = 0; i<n_lines; i++) {
					// line(side_x, side_y-curr_height+i*d, side_x-(i+1)*d, side_y);
					lines_x1[c] = side_x;
					lines_y1[c] = side_y-curr_height+i*d;
					lines_x2[c] = side_x-(i+1)*d;
					lines_y2[c] = side_y;
					c++;
				}
				side_x = side_x - curr_width;
				side_y = side_y;
				curr_width = curr_width - curr_height;
				break;
			case 4:
				box_width = curr_width;
				// line(side_x, side_y - box_width, side_x + box_width, side_y- box_width);
				d = box_width/float(n_lines);
				for (var i = 0; i<n_lines; i++) {
					// line(side_x+curr_width-i*d, side_y, side_x, side_y-(i+1)*d);
					lines_x1[c] = side_x+curr_width-i*d;
					lines_y1[c] = side_y;
					lines_x2[c] = side_x;
					lines_y2[c] = side_y-(i+1)*d;
					c++;
				}
				side_x = side_x;
				side_y = side_y - curr_height;
				curr_height = curr_height - curr_width;
				break;
		}
		side = side + 1;
		if (side > 4)
			side = 1;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	switch (keyCode) {
		case 32: // Space key
			restart();
			break;
		case ENTER: // enter key
			saveCanvas();
			break;
		case SHIFT:
			clear();
		default:
			break;
	}
}
function restart() {
	clear();	
	last_frame = -1;
	curr_n_lines = 0;
}
function draw() {
	if (frameCount > 1*fps){
		if (last_frame < 0) {
			last_frame = frameCount;
		}
		main();
	}
}


function main() {
	var fn = (frameCount-last_frame);
	
	background(255);

	noFill();
	stroke(0, 255);
	push();
	translate(min_x, min_y);

	for (var i = 0; i < curr_n_lines; i++) {
		line(lines_x1[i], lines_y1[i], lines_x2[i], lines_y2[i]);
	}

	if (curr_n_lines < lines_x1.length && fn%7==0)
		curr_n_lines = curr_n_lines + 1;

	pop();
	
}






function randSelect(a, state) {
	// return randomGaussian(0.5, 0.3)*a; // mean, sd
	// if (state == 1) { // y
	// 	return normalcdf(0.5, 0.8, random())*a; // mean, sd, to
	// } else { // x
	// 	return normalcdf(0.5, 1.0, random())*a; // mean, sd, to
	// }
	return round(random(a));
}

function normalcdf(mean, sigma, to) 
{
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}

//////////////////////////////////////////////////