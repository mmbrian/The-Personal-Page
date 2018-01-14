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

var min_x;
var min_y;
var max_y;
var max_x;
var h, w;

var circles_r, circles_alpha;
var circles_alive;

var rotation_angle;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);
	// createCanvas(2048, 2048);
 	max_y = height;// - 50;
	max_x = max_y;//*gr;

	h = max_y;
	w = max_x;
	min_x = (width - w)/2.;
	min_y = (height - h)/2.;
	// h = height;
	// w = width;

	hw = w / 2.;
	hh = h / 2.;
	background(0);

	ellipseMode(CENTER);  // Set ellipseMode to CORNER	

	circles_r = new Array();
	circles_alpha = new Array();
	circles_alive = new Array();
}

function createCircle(alpha) {
	append(circles_alive, true);
	append(circles_r, 0);
	append(circles_alpha, alpha);
}

function updateCircles() {
	for (var i=0; i<circles_alpha.length; i++) {
		if (circles_alive[i]) {
			if (circles_r[i] > width) 
				circles_alive[i] = false;
			circles_r[i] = lerp(circles_r[i], w*2, 0.01);
		}
	}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	switch (keyCode) {
		case 32: // Space key
			//restart();
			createCircle(random(100));
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
	
	// background(0);

	// noFill();
	// stroke(0, 255);
	noStroke();
	push();
	translate(min_x, min_y);

	for (var i=0; i<circles_alpha.length; i++) {
		if (circles_alive[i]) {
			fill((fn%2==0) ? 255 : 0, circles_alpha[i]);
			ellipse(w/2., h/2., circles_r[i]*2, circles_r[i]*2);
		}
	}

	updateCircles()

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