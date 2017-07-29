// Inspssired by ...
// Mohsen Mansouryar

// Curves

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
var end_alpha = 255;
var alpha_steps = 10;
var curr_alpha_step = 1;

var curr_alpha = begin_alpha;
var min_iter = 30;
var max_iter = 120;
var iter;
var last_frame;
// var mx, my;

// var inverted = false;
// var reversed = false;
// var nstars = 250;
// var stars = [];

// var wclr = 0;

// world constants
var hw, hh;
// var wc;
// var min_wa = 1.01, max_wa = 1.1;
// var wa = min_wa;
// var width, height;

var fps = 60;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);

	hw = width / 2.;
	hh = height / 2.;

	x1n = random(width), x2n = random(width), x3n = random(width), x4n = random(width);
	y1n = random(height), y2n = random(height), y3n = random(height), y4n = random(height);
	x1p = random(width), x2p = random(width), x3p = random(width), x4p = random(width);
	y1p = random(height), y2p = random(height), y3p = random(height), y4p = random(height);

	p1c1x = random(width), p2c1x = random(width), p3c1x = random(width), p4c1x = random(width);
	p1c2x = random(width), p2c2x = random(width), p3c2x = random(width), p4c2x = random(width);
	p1c1y = random(height), p2c1y = random(height), p3c1y = random(height), p4c1y = random(height);
	p1c2y = random(height), p2c2y = random(height), p3c2y = random(height), p4c2y = random(height);

	iter = random(max_iter - min_iter) + min_iter;
	last_frame = 0;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
	
}

function keyPressed() {

}

function draw() {
	if (curr_alpha_step <= alpha_steps) {
		var fn = (frameCount-last_frame);
		var amt = fn/iter;

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

		var alpha_min = ((curr_alpha_step-1)/alpha_steps)*(end_alpha-begin_alpha);
		var alpha_max = (curr_alpha_step/alpha_steps)*(end_alpha-begin_alpha);
		// console.log(alpha_min);
		// console.log(alpha_max);
		// console.log(amt);
		curr_alpha = 255-lerp(alpha_min, alpha_max, amt);
		// console.log(curr_alpha);

		noFill();
		stroke(curr_alpha);
		bezier(x1, y1, x2, y2, x3, y3, x4, y4);
		fill(255);

		if (fn >= iter) {
			x1p = x1n, x2p = x2n, x3p = x3n, x4p = x4n;
			y1p = y1n, y2p = y2n, y3p = y3n, y4p = y4n;
			x1n = random(width), x2n = random(width), x3n = random(width), x4n = random(width);
			y1n = random(height), y2n = random(height), y3n = random(height), y4n = random(height);
			
			p1c1x = random(width), p2c1x = random(width), p3c1x = random(width), p4c1x = random(width);
			p1c2x = random(width), p2c2x = random(width), p3c2x = random(width), p4c2x = random(width);
			p1c1y = random(height), p2c1y = random(height), p3c1y = random(height), p4c1y = random(height);
			p1c2y = random(height), p2c2y = random(height), p3c2y = random(height), p4c2y = random(height);

			///////////////////////////////////////////////////////////////////// 
			/// number of curve to curve transition frames
			///////////////////////////////////////////////////////////////////// 
			// Random between a specific min and max
			iter = random(max_iter - min_iter) + min_iter;

			// // Based on point distances
			// var d1 = dist(x1p, y1p, x1n, y1n);
			// var d2 = dist(x2p, y2p, x2n, y2n);
			// var d3 = dist(x3p, y3p, x3n, y3n);
			// var d4 = dist(x4p, y4p, x4n, y4n);
			// var dmin = min(new Array(d1,d2,d3,d4));
			// var dmax = max(new Array(d1,d2,d3,d4));
			// iter = int(dmin);
			///////////////////////////////////////////////////////////////////// 

			last_frame = frameCount;
			curr_alpha_step = curr_alpha_step + 1;
		}
	}
}

//////////////////////////////////////////////////

//// tools ///////////////////////////////////////

function inScreen(p) {
  return p.x > 0 && p.x < width && p.y > 0 && p.y < height;
}

//////////////////////////////////////////////////

//// Star //////////////////////////////////////

// var Star = function(x1, y1) {
// 	this.p = createVector(x1, y1);
// 	this.alpha = 0;
// 	this.r = 2;
// 	this.init();
// }
  
// Star.prototype.init = function() {
// 	this.v = createVector(this.p.x, this.p.y);
// 	this.v.sub(wc);
// 	this.initial_dist = this.v.mag();
// 	this.v.normalize();
// }
  
// Star.prototype.draw = function() { 
// 	if (inverted)
// 		this.alpha = lerp(this.alpha, 0, 0.05);
// 	else
// 		this.alpha = lerp(this.alpha, 255, 0.05);  

// 	fill(this.alpha);
// 	noStroke();
// 	ellipse(this.p.x, this.p.y, this.r, this.r);
// 	this.update();
// }
  
// Star.prototype.update = function() { 
// 	if (!reversed)
// 		this.p.add(this.v);
// 	else
// 		this.p.sub(this.v);
// 	this.v.mult(wa);
// 	this.r = 1 + 0.02 * (p5.Vector.dist(this.p, wc) - this.initial_dist);
// }

//////////////////////////////////////////////////