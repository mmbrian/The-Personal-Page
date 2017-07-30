// Inspssired by ...
// Mohsen Mansouryar

// Curves

// TODO:
// 1. draw the sketch on a canvas and rotate the old one around center i.e.
// everything looks like it is rotating like an inwards spiral
// 2. choose a 3d curve in color cube starting from white to black, then choose
// colors from this curve in each frame

//// Main Part ///////////////////////////////////
var x1p, x2p, x3p, x4p; // p for previous
var y1p, y2p, y3p, y4p; // p for previous
var x1, x2, x3, x4;
var y1, y2, y3, y4;
var x1n, x2n, x3n, x4n; // n for next
var y1n, y2n, y3n, y4n; // n for next

// curve parameters for each bezier point (each point moves on a random curve)
var p1c1x, p1c2x, p1c1y, p1c2y;
var p2c1x, p2c2x, p2c1y, p2c2y;
var p3c1x, p3c2x, p3c1y, p3c2y;
var p4c1x, p4c2x, p4c1y, p4c2y;

var begin_alpha = 0;
var end_alpha = 200;
var alpha_steps = 13;
var curr_alpha_step = 1;

var xmin, xmax, ymin, ymax;

var curr_alpha = begin_alpha;
var min_iter = 45;
var max_iter = 75;
var iter;
var last_frame = -1;

// world constants
var hw, hh;
var fps = 60;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);

	hw = width / 2.;
	hh = height / 2.;

	xmin = 0, xmax = width;
	ymin = 0, ymax = height;

	x1n = randX(), x2n = randX(), x3n = randX(), x4n = randX();
	y1n = randY(), y2n = randY(), y3n = randY(), y4n = randY();
	x1p = randX(), x2p = randX(), x3p = randX(), x4p = randX();
	y1p = randY(), y2p = randY(), y3p = randY(), y4p = randY();

	p1c1x = randX(), p2c1x = randX(), p3c1x = randX(), p4c1x = randX();
	p1c2x = randX(), p2c2x = randX(), p3c2x = randX(), p4c2x = randX();
	p1c1y = randY(), p2c1y = randY(), p3c1y = randY(), p4c1y = randY();
	p1c2y = randY(), p2c2y = randY(), p3c2y = randY(), p4c2y = randY();

	fixCurves();

	updateIter();
}

function fixCurves() {
	// Makes sure the bezier curves do not cross themselves
	var new_curve = fixCurve(new Array(x1p, y1p, x2p, y2p, x3p, y3p));
	x2p = new_curve[0], y2p = new_curve[1];
	x3p = new_curve[2], y3p = new_curve[3];

	new_curve = fixCurve(new Array(x1n, y1n, x2n, y2n, x3n, y3n));
	x2n = new_curve[0], y2n = new_curve[1];
	x3n = new_curve[2], y3n = new_curve[3];

	new_curve = fixCurve(new Array(x1p, y1p, p1c1x, p1c1y, p1c2x, p1c2y));
	p1c1x = new_curve[0], p1c1y = new_curve[1];
	p1c2x = new_curve[2], p1c2y = new_curve[3];

	new_curve = fixCurve(new Array(x2p, y2p, p2c1x, p2c1y, p2c2x, p2c2y));
	p2c1x = new_curve[0], p2c1y = new_curve[1];
	p2c2x = new_curve[2], p2c2y = new_curve[3];

	new_curve = fixCurve(new Array(x3p, y3p, p3c1x, p3c1y, p3c2x, p3c2y));
	p3c1x = new_curve[0], p3c1y = new_curve[1];
	p3c2x = new_curve[2], p3c2y = new_curve[3];

	new_curve = fixCurve(new Array(x4p, y4p, p4c1x, p4c1y, p4c2x, p4c2y));
	p4c1x = new_curve[0], p4c1y = new_curve[1];
	p4c2x = new_curve[2], p4c2y = new_curve[3];
}
function fixCurve(pts_coords) {
	// In order to avoid self intersecting curves, we make sure the control polygon
	// is a simple polygon i.e. we re order ctrl points until it becomes simple
	var v1x, v1y, c1x, c1y, c2x, c2y, v2x, v2y;
	v1x = pts_coords[0], v1y = pts_coords[1];
	c1x = pts_coords[2], c1y = pts_coords[3];
	c2x = pts_coords[4], c2y = pts_coords[5];
	v2x = pts_coords[6], v2y = pts_coords[7];
	if (intersect(v1x, v1y, c1x, c1y, v2x, v2y, c2x, c2y)) // swap p2 with p3
		return new Array(c2x, c2y, c1x, c1y);
	return new Array(c1x, c1y, c2x, c2y);
}

function isOnRight(px, py, qx, qy, rx, ry) {
  // (qx ry - qy rx) - (px ry - py rx) + (px qy - py qx)
  return (qx * ry - qy * rx) - (px * ry - py * rx) + (px * qy - py * qx) > 0;
}
function intersect(px, py, qx, qy, rx, ry, ux, uy) {
  c1 = isOnRight(px, py, qx, qy, rx, ry); 
  c2 = isOnRight(px, py, qx, qy, ux, uy);
  c3 = isOnRight(rx, ry, ux, uy, px, py);
  c4 = isOnRight(rx, ry, ux, uy, qx, qy);
  return ((c1 || c2) && !(c1 && c2)) && ((c3 || c4) && !(c3 && c4));
}

function randX() {
	// return random(xmin, xmax+1);
	return randSelect(xmax-xmin, 0)+xmin;
}

function randY() {
	// return random(ymin, ymax+1);
	return randSelect(ymax-ymin, 1)+ymin;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
	
}

function keyPressed() {
	switch (keyCode) {
		case 32: // Space key
		case ENTER: // enter key
			restart();
			break;
		default:
			break;
	}
}
function restart() {
	clear();

	xmin = 0, xmax = width;
	ymin = 0, ymax = height;

	x1n = randX(), x2n = randX(), x3n = randX(), x4n = randX();
	y1n = randY(), y2n = randY(), y3n = randY(), y4n = randY();
	x1p = randX(), x2p = randX(), x3p = randX(), x4p = randX();
	y1p = randY(), y2p = randY(), y3p = randY(), y4p = randY();

	p1c1x = randX(), p2c1x = randX(), p3c1x = randX(), p4c1x = randX();
	p1c2x = randX(), p2c2x = randX(), p3c2x = randX(), p4c2x = randX();
	p1c1y = randY(), p2c1y = randY(), p3c1y = randY(), p4c1y = randY();
	p1c2y = randY(), p2c2y = randY(), p3c2y = randY(), p4c2y = randY();

	x1=x1p, x2=x2p, x3=x3p, x4=x4p;
	y1=y1p, y2=y2p, y3=y3p, y4=y4p;

	fixCurves();

	updateIter();

	curr_alpha_step = 1;
	last_frame = -1;
}
function draw() {
	if (frameCount > 3*fps && curr_alpha_step <= alpha_steps){
		if (last_frame < 0) {
			last_frame = frameCount;
		}
		main();
	}
}

function main() {
	var fn = (frameCount-last_frame);
	var amt = fn/iter;

	// just keeping bezier curve from previous frame
	var ox1 = x1, ox2 = x2, ox3 = x3, ox4 = x4;
	var oy1 = y1, oy2 = y2, oy3 = y3, oy4 = y4;
	updateCurve(amt);

	var alpha_min = ((curr_alpha_step-1)/alpha_steps)*(end_alpha-begin_alpha);
	var alpha_max = (curr_alpha_step/alpha_steps)*(end_alpha-begin_alpha);
	curr_alpha = 200-lerp(alpha_min, alpha_max, amt);

	drawBezierCurve(ox1, ox2, ox3, ox4, oy1, oy2, oy3, oy4);

	if (fn >= iter) {
		// updateBounds();
		x1p = x1n, x2p = x2n, x3p = x3n, x4p = x4n;
		y1p = y1n, y2p = y2n, y3p = y3n, y4p = y4n;
		x1n = randX(), x2n = randX(), x3n = randX(), x4n = randX();
		y1n = randY(), y2n = randY(), y3n = randY(), y4n = randY();
		
		updateTransitionCurves();
		updateIter();

		last_frame = frameCount;
		curr_alpha_step = curr_alpha_step + 1;
	}
}

function updateBounds() {
	// make the bounding box smaller in each iteration
	xmin = (curr_alpha_step/alpha_steps)*hw;
	xmax = width - xmin;
	ymin = (curr_alpha_step/alpha_steps)*hh;
	ymax = height - ymin;
}

function drawBezierCurve(ox1, ox2, ox3, ox4, oy1, oy2, oy3, oy4) {
	///////////////////////////////////////////////////////////////////// 
	/// Controls how to draw the bezier curve in this frame
	///////////////////////////////////////////////////////////////////// 
	// // Simply draw the curve only with stroke and no relation to the old curve
	// noFill();
	// stroke(curr_alpha);
	// bezier(x1, y1, x2, y2, x3, y3, x4, y4);	

	// Connect the end points of this curve and the one from previous frame
	noFill();
	// fill(0,0,255);
	stroke(0,0,0,150);
	// noStroke();
	beginShape();
	vertex(ox1, oy1);
	bezierVertex(ox2, oy2, ox3, oy3, ox4, oy4);
	vertex(x4, y4);
	bezierVertex(x3, y3, x2, y2, x1, y1);
	// fill(curr_alpha);
	fill(0,153,57, curr_alpha);
	endShape(CLOSE);

	stroke(255);
	line(x1, y1, ox1, oy1);
	line(x4, y4, ox4, oy4);
	///////////////////////////////////////////////////////////////////// 
}

function updateCurve(amt) {
	///////////////////////////////////////////////////////////////////// 
	/// How bezier points move from one state to another
	/////////////////////////////////////////////////////////////////////
	// // Linear interpolation i.e. points move on lines
	// x1 = lerp(x1p, x1n, amt);
	// x2 = lerp(x2p, x2n, amt);
	// x3 = lerp(x3p, x3n, amt);
	// x4 = lerp(x4p, x4n, amt);
	// y1 = lerp(y1p, y1n, amt);
	// y2 = lerp(y2p, y2n, amt);
	// y3 = lerp(y3p, y3n, amt);
	// y4 = lerp(y4p, y4n, amt);
	// Points move on random bezier curves
	x1 = bezierPoint(x1p, p1c1x, p1c2x, x1n, amt);
	y1 = bezierPoint(y1p, p1c1y, p1c2y, y1n, amt);
	x2 = bezierPoint(x2p, p2c1x, p2c2x, x2n, amt);
	y2 = bezierPoint(y2p, p2c1y, p2c2y, y2n, amt);
	x3 = bezierPoint(x3p, p3c1x, p3c2x, x3n, amt);
	y3 = bezierPoint(y3p, p3c1y, p3c2y, y3n, amt);
	x4 = bezierPoint(x4p, p4c1x, p4c2x, x4n, amt);
	y4 = bezierPoint(y4p, p4c1y, p4c2y, y4n, amt);
	/////////////////////////////////////////////////////////////////////
}

function updateTransitionCurves() {
	///////////////////////////////////////////////////////////////////// 
	/// choosing how transition curves for each bezier point should be in
	/// the next round
	///////////////////////////////////////////////////////////////////// 
	// if (random()>0.5) {
		/// make sure previous curve and new curve have a C1 junction
		// p1 moved on the curve defined by x1p > p1c1 > p1c2 > x1n
		// therefore the new p1c1 should be colinear with x1n and p1c2
		// (for C1 the length should also be the same)
		
		// var new_curve = fixCurve(new Array(x1p, y1p, x2p, y2p, x3p, y3p));
		// x2p = new_curve[0], y2p = new_curve[1];
		// x3p = new_curve[2], y3p = new_curve[3];

		// new_curve = fixCurve(new Array(x1n, y1n, x2n, y2n, x3n, y3n));
		// x2n = new_curve[0], y2n = new_curve[1];
		// x3n = new_curve[2], y3n = new_curve[3];


		var dx = x1p-p1c2x, dy = y1p-p1c2y;
		p1c1x = x1p + dx;
		p1c1y = y1p + dy;
		dx = x2p-p2c2x, dy = y2p-p2c2y;
		p2c1x = x2p + dx;
		p2c1y = y2p + dy;
		dx = x3p-p3c2x, dy = y3p-p3c2y;
		p3c1x = x3p + dx;
		p3c1y = y3p + dy;
		dx = x4p-p4c2x, dy = y4p-p4c2y;
		p4c1x = x4p + dx;
		p4c1y = y4p + dy;

		p1c2x = randX(), p2c2x = randX(), p3c2x = randX(), p4c2x = randX();
		p1c2y = randY(), p2c2y = randY(), p3c2y = randY(), p4c2y = randY();


		

	// } else {
	// 	/// Curves have a C0 junction
	// 	p1c1x = randX(), p2c1x = randX(), p3c1x = randX(), p4c1x = randX();
	// 	p1c2x = randX(), p2c2x = randX(), p3c2x = randX(), p4c2x = randX();
	// 	p1c1y = randY(), p2c1y = randY(), p3c1y = randY(), p4c1y = randY();
	// 	p1c2y = randY(), p2c2y = randY(), p3c2y = randY(), p4c2y = randY();

	// 	fixCurves();
	// }
	///////////////////////////////////////////////////////////////////// 
}

function updateIter() {
	///////////////////////////////////////////////////////////////////// 
	/// number of curve to curve transition frames
	///////////////////////////////////////////////////////////////////// 
	// Random between a specific min and max
	iter = randSelect(max_iter - min_iter, 0) + min_iter;

	// // Based on point distances
	// var d1 = dist(x1p, y1p, x1n, y1n);
	// var d2 = dist(x2p, y2p, x2n, y2n);
	// var d3 = dist(x3p, y3p, x3n, y3n);
	// var d4 = dist(x4p, y4p, x4n, y4n);
	// var dmin = min(new Array(d1,d2,d3,d4));
	// var dmax = max(new Array(d1,d2,d3,d4));
	// iter = int(dmin);
	///////////////////////////////////////////////////////////////////// 
}

function randSelect(a, state) {
	// return randomGaussian(0.5, 0.3)*a; // mean, sd
	if (state == 1) { // y
		return normalcdf(0.5, 0.8, random())*a; // mean, sd, to
	} else { // x
		return normalcdf(0.5, 1.0, random())*a; // mean, sd, to
	}
	// return random(a);

}

// function generateRandomIntervals(interlen) {
// 	arr = new Array(interlen);
// 	for (var i=0; i<)
// }


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