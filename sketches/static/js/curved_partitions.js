// Inspssired by ...
// Mohsen Mansouryar

// Curved Partitions

// TODO:
// 1. generate splines (or C1 connected cubic bezier curves) of random length instead
// of single cubic bezier curves from top to bottom

//// Main Part ///////////////////////////////////


// world constants
var hw, hh;
var fps = 60;

var curve_sampling_resolution = 2000;

var num_curves = 25;
var num_curve_points = 4;
var curve_x_range = 350; // TODO: randomize
var lerp_factor = 0.05;
var min_dist = 1; // when two farthest points are closer than this threshold, create new curves
var color_change_chance = 0.40;

var curve_pts;
var curve_offsets;
var curve_colors;
var max_anchor_x = -1;

var old_curve_pts;
var old_curve_offsets;
var curr_curve_pts;
var curr_curve_offsets;

var last_frame = -1;
var pause = false;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);

	hw = width / 2.;
	hh = height / 2.;

	updateCurves(true, true);

	curve_colors = new Array(num_curves);
	for (var i=1; i<=num_curves; i++) {
		curve_colors[i-1] = color(random(255),random(255),random(255));
	}
}

function updateCurves(update_colors, update_curr_curves) {
	curve_pts = new Array(num_curves*8);
	curve_offsets = new Array(num_curves);
	max_anchor_x = -1;
	if (update_colors) {
		if (random() > color_change_chance) {
			update_colors = false;
		}
	}
	if (update_curr_curves) {
		// curve coordinates being drawn at every frame
		curr_curve_pts = new Array(num_curves*8);
		curr_curve_offsets = new Array(num_curves);
	}
	if (update_colors) {
		curve_colors = new Array(num_curves);
	}
	var max_x = curve_x_range*num_curves;
	for (var i=1; i<=num_curves; i++) {
		if (update_colors) {
			curve_colors[i-1] = color(random(255),random(255),random(255));
		}

		var xmin = ((i-1)/num_curves)*max_x;
		var xmax = (i/num_curves)*max_x;
		// generate a random curve in this rectangle which isn't self-intersecting
		// also first and last point must be at the top and bottom edges
		var x1 = random(xmin, xmax), y1=0;
		var x4 = random(xmin, xmax), y4=height;
		var x2 = random(xmin, xmax), y2 = random(height);
		var x3 = random(xmin, xmax), y3 = random(height);
		var new_curve = fixCurve(new Array(x1, y1, x2, y2, x3, y3, x4, y4));
		x2 = new_curve[0], y2 = new_curve[1];
		x3 = new_curve[2], y3 = new_curve[3];
		var start_ind = (i-1)*8;

		curve_pts[start_ind]=x1;
		curve_pts[start_ind+1]=y1;
		curve_pts[start_ind+2]=x2;
		curve_pts[start_ind+3]=y2;
		curve_pts[start_ind+4]=x3;
		curve_pts[start_ind+5]=y3;
		curve_pts[start_ind+6]=x4;
		curve_pts[start_ind+7]=y4;

		if (update_curr_curves) {
			curr_curve_pts[start_ind]=x1;
			curr_curve_pts[start_ind+1]=y1;
			curr_curve_pts[start_ind+2]=x2;
			curr_curve_pts[start_ind+3]=y2;
			curr_curve_pts[start_ind+4]=x3;
			curr_curve_pts[start_ind+5]=y3;
			curr_curve_pts[start_ind+6]=x4;
			curr_curve_pts[start_ind+7]=y4;		
		}

		// Now we calculate x offset of this curve s.t. curves do not intersect
		// Need to find minimum dx between two curves for each t
		// This will tell us how much we can shift the curve to the right towards
		// left s.t. we do not cross the curve to the left
		var dmin = max_x;
		for (var j=0; j<=curve_sampling_resolution; j++) { // 
			var t = j/curve_sampling_resolution;
			var xt = bezierPoint(x1, x2, x3, x4, t);
			var dx;
			if (i==1){
				// left curve is the edge > dx and dy are x and y
				dx = xt;
			} else {
				// need to find point from the curve on the left
				var ind = (i-2)*8;
				var lxt = bezierPoint(curve_pts[ind], curve_pts[ind+2], curve_pts[ind+4], curve_pts[ind+6], t);
				dx = xt - lxt;
			}
			if (dx < dmin) {
				dmin = dx;
			}
		}
		curve_offsets[i-1] = dmin;

		if (update_curr_curves) {
			curr_curve_offsets[i-1] = dmin;
		}
	}
	for (var i=1; i<=num_curves; i++) {
		curve_offsets[i] = curve_offsets[i] + curve_offsets[i-1];
		if (update_curr_curves) {
			curr_curve_offsets[i] = curr_curve_offsets[i] + curr_curve_offsets[i-1];
		}
	}

	var i = num_curves;
	var xoffset = curve_offsets[i-1];
	var start_ind = (i-1)*8;
	var x1 = curve_pts[start_ind]-xoffset;
	var x4 = curve_pts[start_ind+6]-xoffset;
	max_anchor_x = max(x1, x4);
}

function createNewCurves() {
	old_curve_pts = new Array(curve_pts.length);
	old_curve_offsets = new Array(num_curves);
	for (var i=num_curves; i>0; i--) {
		old_curve_offsets[i-1]=curve_offsets[i-1];
		var start_ind = (i-1)*8;
		old_curve_pts[start_ind]=curve_pts[start_ind];
		old_curve_pts[start_ind+1]=curve_pts[start_ind+1];
		old_curve_pts[start_ind+2]=curve_pts[start_ind+2];
		old_curve_pts[start_ind+3]=curve_pts[start_ind+3];
		old_curve_pts[start_ind+4]=curve_pts[start_ind+4];
		old_curve_pts[start_ind+5]=curve_pts[start_ind+5];
		old_curve_pts[start_ind+6]=curve_pts[start_ind+6];
		old_curve_pts[start_ind+7]=curve_pts[start_ind+7];
	}
	updateCurves(true, false); // do not change colors
}

function animateCurves() {
	var max_diffs = new Array(num_curves);
	for (var i=num_curves; i>0; i--) {
		curr_curve_offsets[i-1]=lerp(curr_curve_offsets[i-1], curve_offsets[i-1], lerp_factor);
		var start_ind = (i-1)*8;
		curr_curve_pts[start_ind]=lerp(curr_curve_pts[start_ind], curve_pts[start_ind], lerp_factor);
		curr_curve_pts[start_ind+1]=lerp(curr_curve_pts[start_ind+1], curve_pts[start_ind+1], lerp_factor);
		curr_curve_pts[start_ind+2]=lerp(curr_curve_pts[start_ind+2], curve_pts[start_ind+2], lerp_factor);
		curr_curve_pts[start_ind+3]=lerp(curr_curve_pts[start_ind+3], curve_pts[start_ind+3], lerp_factor);
		curr_curve_pts[start_ind+4]=lerp(curr_curve_pts[start_ind+4], curve_pts[start_ind+4], lerp_factor);
		curr_curve_pts[start_ind+5]=lerp(curr_curve_pts[start_ind+5], curve_pts[start_ind+5], lerp_factor);
		curr_curve_pts[start_ind+6]=lerp(curr_curve_pts[start_ind+6], curve_pts[start_ind+6], lerp_factor);
		curr_curve_pts[start_ind+7]=lerp(curr_curve_pts[start_ind+7], curve_pts[start_ind+7], lerp_factor);
		
		var d1 = abs(curr_curve_pts[start_ind]   - curve_pts[start_ind]);
		var d2 = abs(curr_curve_pts[start_ind+1] - curve_pts[start_ind+1]);
		var d3 = abs(curr_curve_pts[start_ind+3] - curve_pts[start_ind+3]);
		var d4 = abs(curr_curve_pts[start_ind+4] - curve_pts[start_ind+4]);
		var d5 = abs(curr_curve_pts[start_ind+5] - curve_pts[start_ind+5]);
		var d6 = abs(curr_curve_pts[start_ind+6] - curve_pts[start_ind+6]);
		var d7 = abs(curr_curve_pts[start_ind+7] - curve_pts[start_ind+7]);
		var max_diff = max(new Array(d1, d2, d3, d4, d5, d6, d7));
		max_diffs[i-1] = max_diff;
	}
	if (max(max_diffs) < min_dist) {
		createNewCurves();
	}
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


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	switch (keyCode) {
		case 32: // Space key
		case ENTER: // enter key
			// restart();
			pauseSketch();
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

function main() {
	clear();
	var fn = (frameCount-last_frame);
	if (!pause)
		animateCurves();

	// noFill();
	// fill(random(255),random(255),random(255));
	// noStroke();

	for (var i=num_curves; i>0; i--) {
		var xoffset = curr_curve_offsets[i-1];
		var start_ind = (i-1)*8;
		var x1 = curr_curve_pts[start_ind]-xoffset;
		var y1 = curr_curve_pts[start_ind+1];
		var x2 = curr_curve_pts[start_ind+2]-xoffset;
		var y2 = curr_curve_pts[start_ind+3];
		var x3 = curr_curve_pts[start_ind+4]-xoffset;
		var y3 = curr_curve_pts[start_ind+5];
		var x4 = curr_curve_pts[start_ind+6]-xoffset;
		var y4 = curr_curve_pts[start_ind+7];
		
		
		// bezier(x1, y1, x2, y2, x3, y3, x4, y4);	
		noStroke();
		// stroke(0);
		fill(curve_colors[i-1]);
		beginShape();
		vertex(0, 0);
		vertex(x1, y1);
		bezierVertex(x2, y2, x3, y3, x4, y4);
		vertex(0, height);
		endShape(CLOSE);

	}
}




function randSelect(a, state) {
	// return randomGaussian(0.5, 0.3)*a; // mean, sd
	// if (state == 1) { // y
	// 	return normalcdf(0.5, 0.8, random())*a; // mean, sd, to
	// } else { // x
	// 	return normalcdf(0.5, 1.0, random())*a; // mean, sd, to
	// }
	return random(a);
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