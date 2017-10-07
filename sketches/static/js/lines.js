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

var n_lines = 100;
var lines_x;
var lines_y;
var lines_dest_x;
var lines_dest_y;
var alpha;
var alpha_rate;
var state = 0;

var rotation_angle;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);
	// createCanvas(2048, 2048);

	hw = width / 2.;
	hh = height / 2.;

	background(255);	
	rotation_angle = 0;
	alpha = 0;
	alpha_rate = random(0.0001, 0.001);
	state = random(1);
	createLines();
}

function createLines() {
	lines_x = new Array(n_lines);
	lines_y = new Array(n_lines);
	lines_dest_x = new Array(n_lines);
	lines_dest_y = new Array(n_lines);
	for (var i = 0; i < n_lines; i++) {
		if (random(1) <= .5) {
			lines_dest_x[i] = random(width);
			if (random(1) <= .5) {
				lines_dest_y[i] = 0;
			} else {
				lines_dest_y[i] = height;
			}
		} else {
			lines_dest_y[i] = random(height);
			if (random(1) <= .5) {
				lines_dest_x[i] = 0;
			} else {
				lines_dest_x[i] = width;
			}
		}
		lines_dest_x[i] = lines_dest_x[i] + (lines_dest_x[i] - hw)*8.5;
		lines_dest_y[i] = lines_dest_y[i] + (lines_dest_y[i] - hh)*8.5;

		lines_x[i] = hw;
		lines_y[i] = hh;
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

	alpha = 0;
	alpha_rate = random(0.0001, 0.001);
	state = random(1);
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
	

	// if (alpha < 250) { 
		alpha = lerp(alpha, 255, alpha_rate);

		for (var i = 0; i < n_lines; i++) {
			push();  // Start a new drawing state
			rotate(rotation_angle);
			if (state > 0.5) 
				translate(random(width), random(height));
			smooth();
			stroke(0, alpha);
			line(hw, hh, lines_dest_x[i], lines_dest_y[i]);
			
			rotation_angle = rotation_angle + PI/(180.);

			pop();
		}
	// }
	
	
	
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