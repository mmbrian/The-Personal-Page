// Inspssired by ...
// Mohsen Mansouryar

// Curved Partitions

// TODO:
// 1. alpha changes rather rapidly as the order of layers changes. make it smooth.

//// Main Part ///////////////////////////////////




// world constants
var hw, hh;
var fps = 60;


var t_num_curves = 7; // top
var b_num_curves = 7; // bottom
var l_num_curves = 13; // left
var r_num_curves = 13; // right

var t_top_index = 0;
var b_top_index = 0;
var l_top_index = 0;
var r_top_index = 0;

var x_limit, y_limit; // controls how far from the edges the curves can get

var lerp_factor = 0.02;
var min_dist = 1; // when two farthest points are closer than this threshold, create new curves
var color_change_chance = 0.40;
var min_alpha = 0.;

var t_curve_pts;
var t_curve_colors;
var curr_t_curve_pts;

var b_curve_pts;
var b_curve_colors;
var curr_b_curve_pts;

var l_curve_pts;
var l_curve_colors;
var curr_l_curve_pts;

var r_curve_pts;
var r_curve_colors;
var curr_r_curve_pts;

var last_frame = -1;
var pause = false;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);

	hw = width / 2.;
	hh = height / 2.;

	x_limit = width/4.;
	y_limit = height/2.;

	updateCurves(true, true);
}

function updateCurveColors() {
	t_curve_colors = new Array(t_num_curves);
	b_curve_colors = new Array(b_num_curves);
	r_curve_colors = new Array(r_num_curves);
	l_curve_colors = new Array(l_num_curves);
	for (var i=1; i<=t_num_curves; i++) {
		t_curve_colors[i-1] = color(random(255),random(255),random(255));
	}
	for (var i=1; i<=b_num_curves; i++) {
		b_curve_colors[i-1] = color(random(255),random(255),random(255));
	}
	for (var i=1; i<=r_num_curves; i++) {
		r_curve_colors[i-1] = color(random(255),random(255),random(255));
	}
	for (var i=1; i<=l_num_curves; i++) {
		l_curve_colors[i-1] = color(random(255),random(255),random(255));
	}
}

function updateTopCurves(update_curr_curves) {
	// Top curves
	t_curve_pts = new Array(t_num_curves*8);
	if (update_curr_curves) {
		// curve coordinates being drawn at every frame
		curr_t_curve_pts = new Array(t_num_curves*8);
	}
	for (var i=1; i<=t_num_curves; i++) {
		if (i-1==t_top_index) {
			var ymin = -y_limit;
			var ymax = 0;	
		} else {
			var ymin = 0;
			var ymax = y_limit;	
		}
		// generate a random curve in this rectangle which isn't self-intersecting
		// also first and last point must be at the top and bottom edges
		var x1 = 0, y1=random(ymin, ymax);
		var x4 = width, y4=random(ymin, ymax);
		var x2 = random(width), y2 = random(ymin, ymax);
		var x3 = random(width), y3 = random(ymin, ymax);
		var new_curve = fixCurve(new Array(x1, y1, x2, y2, x3, y3, x4, y4));
		x2 = new_curve[0], y2 = new_curve[1];
		x3 = new_curve[2], y3 = new_curve[3];
		var start_ind = (i-1)*8;

		t_curve_pts[start_ind]=x1;
		t_curve_pts[start_ind+1]=y1;
		t_curve_pts[start_ind+2]=x2;
		t_curve_pts[start_ind+3]=y2;
		t_curve_pts[start_ind+4]=x3;
		t_curve_pts[start_ind+5]=y3;
		t_curve_pts[start_ind+6]=x4;
		t_curve_pts[start_ind+7]=y4;
		if (update_curr_curves) {
			curr_t_curve_pts[start_ind]=x1;
			curr_t_curve_pts[start_ind+1]=y1;
			curr_t_curve_pts[start_ind+2]=x2;
			curr_t_curve_pts[start_ind+3]=y2;
			curr_t_curve_pts[start_ind+4]=x3;
			curr_t_curve_pts[start_ind+5]=y3;
			curr_t_curve_pts[start_ind+6]=x4;
			curr_t_curve_pts[start_ind+7]=y4;		
		}
	}
}

function updateBottomCurves(update_curr_curves) {
	// Bottom curves
	b_curve_pts = new Array(b_num_curves*8);
	if (update_curr_curves) {
		// curve coordinates being drawn at every frame
		curr_b_curve_pts = new Array(b_num_curves*8);
	}
	for (var i=1; i<=b_num_curves; i++) {
		if (i-1==b_top_index) {
			var ymin = height;
			var ymax = height + y_limit;
		} else {
			var ymin = height - y_limit;
			var ymax = height;
		}
		
		// generate a random curve in this rectangle which isn't self-intersecting
		// also first and last point must be at the top and bottom edges
		var x1 = 0, y1=random(ymin, ymax);
		var x4 = width, y4=random(ymin, ymax);
		var x2 = random(width), y2 = random(ymin, ymax);
		var x3 = random(width), y3 = random(ymin, ymax);
		var new_curve = fixCurve(new Array(x1, y1, x2, y2, x3, y3, x4, y4));
		x2 = new_curve[0], y2 = new_curve[1];
		x3 = new_curve[2], y3 = new_curve[3];
		var start_ind = (i-1)*8;

		b_curve_pts[start_ind]=x1;
		b_curve_pts[start_ind+1]=y1;
		b_curve_pts[start_ind+2]=x2;
		b_curve_pts[start_ind+3]=y2;
		b_curve_pts[start_ind+4]=x3;
		b_curve_pts[start_ind+5]=y3;
		b_curve_pts[start_ind+6]=x4;
		b_curve_pts[start_ind+7]=y4;
		if (update_curr_curves) {
			curr_b_curve_pts[start_ind]=x1;
			curr_b_curve_pts[start_ind+1]=y1;
			curr_b_curve_pts[start_ind+2]=x2;
			curr_b_curve_pts[start_ind+3]=y2;
			curr_b_curve_pts[start_ind+4]=x3;
			curr_b_curve_pts[start_ind+5]=y3;
			curr_b_curve_pts[start_ind+6]=x4;
			curr_b_curve_pts[start_ind+7]=y4;		
		}
	}
}

function updateLeftCurves(update_curr_curves) {
	// Left curves
	l_curve_pts = new Array(l_num_curves*8);
	if (update_curr_curves) {
		// curve coordinates being drawn at every frame
		curr_l_curve_pts = new Array(l_num_curves*8);
	}
	for (var i=1; i<=l_num_curves; i++) {
		if (i-1==l_top_index) {
			var xmin = -x_limit;
			var xmax = 0;
		} else {
			var xmin = 0;
			var xmax = x_limit;
		}
		
		// generate a random curve in this rectangle which isn't self-intersecting
		// also first and last point must be at the top and bottom edges
		var y1 = 0, x1=random(xmin, xmax);
		var y4 = height, x4=random(xmin, xmax);
		var x2 = random(xmin, xmax), y2 = random(height);
		var x3 = random(xmin, xmax), y3 = random(height);
		var new_curve = fixCurve(new Array(x1, y1, x2, y2, x3, y3, x4, y4));
		x2 = new_curve[0], y2 = new_curve[1];
		x3 = new_curve[2], y3 = new_curve[3];
		var start_ind = (i-1)*8;

		l_curve_pts[start_ind]=x1;
		l_curve_pts[start_ind+1]=y1;
		l_curve_pts[start_ind+2]=x2;
		l_curve_pts[start_ind+3]=y2;
		l_curve_pts[start_ind+4]=x3;
		l_curve_pts[start_ind+5]=y3;
		l_curve_pts[start_ind+6]=x4;
		l_curve_pts[start_ind+7]=y4;
		if (update_curr_curves) {
			curr_l_curve_pts[start_ind]=x1;
			curr_l_curve_pts[start_ind+1]=y1;
			curr_l_curve_pts[start_ind+2]=x2;
			curr_l_curve_pts[start_ind+3]=y2;
			curr_l_curve_pts[start_ind+4]=x3;
			curr_l_curve_pts[start_ind+5]=y3;
			curr_l_curve_pts[start_ind+6]=x4;
			curr_l_curve_pts[start_ind+7]=y4;		
		}
	}
}

function updateRightCurves(update_curr_curves) {
	// Right curves
	r_curve_pts = new Array(r_num_curves*8);
	if (update_curr_curves) {
		// curve coordinates being drawn at every frame
		curr_r_curve_pts = new Array(r_num_curves*8);
	}
	for (var i=1; i<=r_num_curves; i++) {
		if (i-1==r_top_index) {
			var xmin = width;
			var xmax = width + x_limit;
		} else {
			var xmin = width - x_limit;
			var xmax = width;
		}
		
		// generate a random curve in this rectangle which isn't self-intersecting
		// also first and last point must be at the top and bottom edges
		var y1 = 0, x1=random(xmin, xmax);
		var y4 = height, x4=random(xmin, xmax);
		var x2 = random(xmin, xmax), y2 = random(height);
		var x3 = random(xmin, xmax), y3 = random(height);
		var new_curve = fixCurve(new Array(x1, y1, x2, y2, x3, y3, x4, y4));
		x2 = new_curve[0], y2 = new_curve[1];
		x3 = new_curve[2], y3 = new_curve[3];
		var start_ind = (i-1)*8;

		r_curve_pts[start_ind]=x1;
		r_curve_pts[start_ind+1]=y1;
		r_curve_pts[start_ind+2]=x2;
		r_curve_pts[start_ind+3]=y2;
		r_curve_pts[start_ind+4]=x3;
		r_curve_pts[start_ind+5]=y3;
		r_curve_pts[start_ind+6]=x4;
		r_curve_pts[start_ind+7]=y4;
		if (update_curr_curves) {
			curr_r_curve_pts[start_ind]=x1;
			curr_r_curve_pts[start_ind+1]=y1;
			curr_r_curve_pts[start_ind+2]=x2;
			curr_r_curve_pts[start_ind+3]=y2;
			curr_r_curve_pts[start_ind+4]=x3;
			curr_r_curve_pts[start_ind+5]=y3;
			curr_r_curve_pts[start_ind+6]=x4;
			curr_r_curve_pts[start_ind+7]=y4;		
		}
	}
}

function updateCurves(update_colors, update_curr_curves) {
	if (update_colors) {
		updateCurveColors();
	}

	updateTopCurves(update_curr_curves);
	updateBottomCurves(update_curr_curves);
	updateLeftCurves(update_curr_curves);
	updateRightCurves(update_curr_curves);
}

function createNewTopCurves() {
	t_curve_colors[t_top_index] = color(random(255),random(255),random(255));
	t_top_index = t_top_index + 1;
	if (t_top_index >= t_num_curves) {
		t_top_index = 0;
	}
	updateTopCurves(false);
}

function createNewLeftCurves() {
	l_curve_colors[l_top_index] = color(random(255),random(255),random(255));
	l_top_index = l_top_index + 1;
	if (l_top_index >= l_num_curves) {
		l_top_index = 0;
	}
	updateLeftCurves(false);
}

function createNewBottomCurves() {
	b_curve_colors[b_top_index] = color(random(255),random(255),random(255));
	b_top_index = b_top_index + 1;
	if (b_top_index >= b_num_curves) {
		b_top_index = 0;
	}
	updateBottomCurves(false);
}

function createNewRightCurves() {
	r_curve_colors[r_top_index] = color(random(255),random(255),random(255));
	r_top_index = r_top_index + 1;
	if (r_top_index >= r_num_curves) {
		r_top_index = 0;
	}	
	updateRightCurves(false);
}

function createNewCurves() {
	createNewRightCurves();
	createNewBottomCurves();
	createNewLeftCurves();
	createNewTopCurves();
	// t_curve_colors[t_top_index] = color(random(255),random(255),random(255));
	// l_curve_colors[l_top_index] = color(random(255),random(255),random(255));
	// b_curve_colors[b_top_index] = color(random(255),random(255),random(255));
	// r_curve_colors[r_top_index] = color(random(255),random(255),random(255));

	// // if (switch_top_curve) {
	// 	t_top_index = t_top_index + 1;
	// 	if (t_top_index >= t_num_curves) {
	// 		t_top_index = 0;
	// 	}

	// 	b_top_index = b_top_index + 1;
	// 	if (b_top_index >= b_num_curves) {
	// 		b_top_index = 0;
	// 	}

	// 	r_top_index = r_top_index + 1;
	// 	if (r_top_index >= r_num_curves) {
	// 		r_top_index = 0;
	// 	}

	// 	l_top_index = l_top_index + 1;
	// 	if (l_top_index >= l_num_curves) {
	// 		l_top_index = 0;
	// 	}
	// // }
	// // switch_top_curve = !switch_top_curve;

	// updateCurves(false, false); // do not change colors
}

function animateCurves() {
	var t_max_diffs = new Array(t_num_curves);
	for (var i=t_num_curves; i>0; i--) {
		var start_ind = (i-1)*8;
		curr_t_curve_pts[start_ind]=lerp(curr_t_curve_pts[start_ind], t_curve_pts[start_ind], lerp_factor);
		curr_t_curve_pts[start_ind+1]=lerp(curr_t_curve_pts[start_ind+1], t_curve_pts[start_ind+1], lerp_factor);
		curr_t_curve_pts[start_ind+2]=lerp(curr_t_curve_pts[start_ind+2], t_curve_pts[start_ind+2], lerp_factor);
		curr_t_curve_pts[start_ind+3]=lerp(curr_t_curve_pts[start_ind+3], t_curve_pts[start_ind+3], lerp_factor);
		curr_t_curve_pts[start_ind+4]=lerp(curr_t_curve_pts[start_ind+4], t_curve_pts[start_ind+4], lerp_factor);
		curr_t_curve_pts[start_ind+5]=lerp(curr_t_curve_pts[start_ind+5], t_curve_pts[start_ind+5], lerp_factor);
		curr_t_curve_pts[start_ind+6]=lerp(curr_t_curve_pts[start_ind+6], t_curve_pts[start_ind+6], lerp_factor);
		curr_t_curve_pts[start_ind+7]=lerp(curr_t_curve_pts[start_ind+7], t_curve_pts[start_ind+7], lerp_factor);
		
		var d1 = abs(curr_t_curve_pts[start_ind]   - t_curve_pts[start_ind]);
		var d2 = abs(curr_t_curve_pts[start_ind+1] - t_curve_pts[start_ind+1]);
		var d3 = abs(curr_t_curve_pts[start_ind+3] - t_curve_pts[start_ind+3]);
		var d4 = abs(curr_t_curve_pts[start_ind+4] - t_curve_pts[start_ind+4]);
		var d5 = abs(curr_t_curve_pts[start_ind+5] - t_curve_pts[start_ind+5]);
		var d6 = abs(curr_t_curve_pts[start_ind+6] - t_curve_pts[start_ind+6]);
		var d7 = abs(curr_t_curve_pts[start_ind+7] - t_curve_pts[start_ind+7]);
		t_max_diffs[i-1] = max(new Array(d1, d2, d3, d4, d5, d6, d7));
	}
	var b_max_diffs = new Array(b_num_curves);
	for (var i=b_num_curves; i>0; i--) {
		var start_ind = (i-1)*8;
		curr_b_curve_pts[start_ind]=lerp(curr_b_curve_pts[start_ind], b_curve_pts[start_ind], lerp_factor);
		curr_b_curve_pts[start_ind+1]=lerp(curr_b_curve_pts[start_ind+1], b_curve_pts[start_ind+1], lerp_factor);
		curr_b_curve_pts[start_ind+2]=lerp(curr_b_curve_pts[start_ind+2], b_curve_pts[start_ind+2], lerp_factor);
		curr_b_curve_pts[start_ind+3]=lerp(curr_b_curve_pts[start_ind+3], b_curve_pts[start_ind+3], lerp_factor);
		curr_b_curve_pts[start_ind+4]=lerp(curr_b_curve_pts[start_ind+4], b_curve_pts[start_ind+4], lerp_factor);
		curr_b_curve_pts[start_ind+5]=lerp(curr_b_curve_pts[start_ind+5], b_curve_pts[start_ind+5], lerp_factor);
		curr_b_curve_pts[start_ind+6]=lerp(curr_b_curve_pts[start_ind+6], b_curve_pts[start_ind+6], lerp_factor);
		curr_b_curve_pts[start_ind+7]=lerp(curr_b_curve_pts[start_ind+7], b_curve_pts[start_ind+7], lerp_factor);
		
		var d1 = abs(curr_b_curve_pts[start_ind]   - b_curve_pts[start_ind]);
		var d2 = abs(curr_b_curve_pts[start_ind+1] - b_curve_pts[start_ind+1]);
		var d3 = abs(curr_b_curve_pts[start_ind+3] - b_curve_pts[start_ind+3]);
		var d4 = abs(curr_b_curve_pts[start_ind+4] - b_curve_pts[start_ind+4]);
		var d5 = abs(curr_b_curve_pts[start_ind+5] - b_curve_pts[start_ind+5]);
		var d6 = abs(curr_b_curve_pts[start_ind+6] - b_curve_pts[start_ind+6]);
		var d7 = abs(curr_b_curve_pts[start_ind+7] - b_curve_pts[start_ind+7]);
		b_max_diffs[i-1] = max(new Array(d1, d2, d3, d4, d5, d6, d7));
	}
	var l_max_diffs = new Array(l_num_curves);
	for (var i=l_num_curves; i>0; i--) {
		var start_ind = (i-1)*8;
		curr_l_curve_pts[start_ind]=lerp(curr_l_curve_pts[start_ind], l_curve_pts[start_ind], lerp_factor);
		curr_l_curve_pts[start_ind+1]=lerp(curr_l_curve_pts[start_ind+1], l_curve_pts[start_ind+1], lerp_factor);
		curr_l_curve_pts[start_ind+2]=lerp(curr_l_curve_pts[start_ind+2], l_curve_pts[start_ind+2], lerp_factor);
		curr_l_curve_pts[start_ind+3]=lerp(curr_l_curve_pts[start_ind+3], l_curve_pts[start_ind+3], lerp_factor);
		curr_l_curve_pts[start_ind+4]=lerp(curr_l_curve_pts[start_ind+4], l_curve_pts[start_ind+4], lerp_factor);
		curr_l_curve_pts[start_ind+5]=lerp(curr_l_curve_pts[start_ind+5], l_curve_pts[start_ind+5], lerp_factor);
		curr_l_curve_pts[start_ind+6]=lerp(curr_l_curve_pts[start_ind+6], l_curve_pts[start_ind+6], lerp_factor);
		curr_l_curve_pts[start_ind+7]=lerp(curr_l_curve_pts[start_ind+7], l_curve_pts[start_ind+7], lerp_factor);
		
		var d1 = abs(curr_l_curve_pts[start_ind]   - l_curve_pts[start_ind]);
		var d2 = abs(curr_l_curve_pts[start_ind+1] - l_curve_pts[start_ind+1]);
		var d3 = abs(curr_l_curve_pts[start_ind+3] - l_curve_pts[start_ind+3]);
		var d4 = abs(curr_l_curve_pts[start_ind+4] - l_curve_pts[start_ind+4]);
		var d5 = abs(curr_l_curve_pts[start_ind+5] - l_curve_pts[start_ind+5]);
		var d6 = abs(curr_l_curve_pts[start_ind+6] - l_curve_pts[start_ind+6]);
		var d7 = abs(curr_l_curve_pts[start_ind+7] - l_curve_pts[start_ind+7]);
		l_max_diffs[i-1] = max(new Array(d1, d2, d3, d4, d5, d6, d7));
	}
	var r_max_diffs = new Array(r_num_curves);
	for (var i=r_num_curves; i>0; i--) {
		var start_ind = (i-1)*8;
		curr_r_curve_pts[start_ind]=lerp(curr_r_curve_pts[start_ind], r_curve_pts[start_ind], lerp_factor);
		curr_r_curve_pts[start_ind+1]=lerp(curr_r_curve_pts[start_ind+1], r_curve_pts[start_ind+1], lerp_factor);
		curr_r_curve_pts[start_ind+2]=lerp(curr_r_curve_pts[start_ind+2], r_curve_pts[start_ind+2], lerp_factor);
		curr_r_curve_pts[start_ind+3]=lerp(curr_r_curve_pts[start_ind+3], r_curve_pts[start_ind+3], lerp_factor);
		curr_r_curve_pts[start_ind+4]=lerp(curr_r_curve_pts[start_ind+4], r_curve_pts[start_ind+4], lerp_factor);
		curr_r_curve_pts[start_ind+5]=lerp(curr_r_curve_pts[start_ind+5], r_curve_pts[start_ind+5], lerp_factor);
		curr_r_curve_pts[start_ind+6]=lerp(curr_r_curve_pts[start_ind+6], r_curve_pts[start_ind+6], lerp_factor);
		curr_r_curve_pts[start_ind+7]=lerp(curr_r_curve_pts[start_ind+7], r_curve_pts[start_ind+7], lerp_factor);
		
		var d1 = abs(curr_r_curve_pts[start_ind]   - r_curve_pts[start_ind]);
		var d2 = abs(curr_r_curve_pts[start_ind+1] - r_curve_pts[start_ind+1]);
		var d3 = abs(curr_r_curve_pts[start_ind+3] - r_curve_pts[start_ind+3]);
		var d4 = abs(curr_r_curve_pts[start_ind+4] - r_curve_pts[start_ind+4]);
		var d5 = abs(curr_r_curve_pts[start_ind+5] - r_curve_pts[start_ind+5]);
		var d6 = abs(curr_r_curve_pts[start_ind+6] - r_curve_pts[start_ind+6]);
		var d7 = abs(curr_r_curve_pts[start_ind+7] - r_curve_pts[start_ind+7]);
		r_max_diffs[i-1] = max(new Array(d1, d2, d3, d4, d5, d6, d7));
	}


	var m1 = max(t_max_diffs);
	var m2 = max(b_max_diffs);
	var m3 = max(r_max_diffs);
	var m4 = max(l_max_diffs);
	// if (max(new Array(m1, m2, m3, m4)) < min_dist) {
	// 	createNewCurves();
	// }
	if (m1 < min_dist) 
		createNewTopCurves();
	if (m2 < min_dist) 
		createNewBottomCurves();
	if (m3 < min_dist) 
		createNewRightCurves();
	if (m4 < min_dist) 
		createNewLeftCurves();
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
	var fn = (frameCount-last_frame);
	clear();
	// background(0);
	if (!pause)
		animateCurves();

	// noFill();
	// fill(random(255),random(255),random(255));
	// noStroke();

	
	var alpha_step = (255-min_alpha)/(t_num_curves-2);
	var alpha = min_alpha;
	for (var i=t_top_index; i>0; i--) {
		var start_ind = (i-1)*8;
		var x1 = curr_t_curve_pts[start_ind];
		var y1 = curr_t_curve_pts[start_ind+1];
		var x2 = curr_t_curve_pts[start_ind+2];
		var y2 = curr_t_curve_pts[start_ind+3];
		var x3 = curr_t_curve_pts[start_ind+4];
		var y3 = curr_t_curve_pts[start_ind+5];
		var x4 = curr_t_curve_pts[start_ind+6];
		var y4 = curr_t_curve_pts[start_ind+7];
				
		noStroke();
		// fill(t_curve_colors[i-1], alpha);
		fill(t_curve_colors[i-1]._getRed(), t_curve_colors[i-1]._getGreen(), t_curve_colors[i-1]._getBlue(), alpha);
		alpha = alpha + alpha_step;
		alpha = min(alpha, 255);
		
		beginShape();
		vertex(0, 0);
		vertex(x1, y1);
		bezierVertex(x2, y2, x3, y3, x4, y4);
		vertex(width, 0);
		endShape(CLOSE);
	}
	for (var i=t_num_curves; i>t_top_index; i--) {
		var start_ind = (i-1)*8;
		var x1 = curr_t_curve_pts[start_ind];
		var y1 = curr_t_curve_pts[start_ind+1];
		var x2 = curr_t_curve_pts[start_ind+2];
		var y2 = curr_t_curve_pts[start_ind+3];
		var x3 = curr_t_curve_pts[start_ind+4];
		var y3 = curr_t_curve_pts[start_ind+5];
		var x4 = curr_t_curve_pts[start_ind+6];
		var y4 = curr_t_curve_pts[start_ind+7];
				
		noStroke();
		// fill(t_curve_colors[i-1], alpha);
		fill(t_curve_colors[i-1]._getRed(), t_curve_colors[i-1]._getGreen(), t_curve_colors[i-1]._getBlue(), alpha);
		alpha = alpha + alpha_step;
		alpha = min(alpha, 255);

		beginShape();
		vertex(0, 0);
		vertex(x1, y1);
		bezierVertex(x2, y2, x3, y3, x4, y4);
		vertex(width, 0);
		endShape(CLOSE);
	}
	console.log(alpha - alpha_step);

	alpha_step = (255-min_alpha)/(r_num_curves-2);
	alpha = min_alpha;
	for (var i=r_top_index; i>0; i--) {
		var start_ind = (i-1)*8;
		var x1 = curr_r_curve_pts[start_ind];
		var y1 = curr_r_curve_pts[start_ind+1];
		var x2 = curr_r_curve_pts[start_ind+2];
		var y2 = curr_r_curve_pts[start_ind+3];
		var x3 = curr_r_curve_pts[start_ind+4];
		var y3 = curr_r_curve_pts[start_ind+5];
		var x4 = curr_r_curve_pts[start_ind+6];
		var y4 = curr_r_curve_pts[start_ind+7];
				
		noStroke();
		// fill(r_curve_colors[i-1]);
		fill(r_curve_colors[i-1]._getRed(), r_curve_colors[i-1]._getGreen(), r_curve_colors[i-1]._getBlue(), alpha);
		alpha = alpha + alpha_step;
		alpha = min(alpha, 255);

		beginShape();
		vertex(width, 0);
		vertex(x1, y1);
		bezierVertex(x2, y2, x3, y3, x4, y4);
		vertex(width, height);
		endShape(CLOSE);
	}
	for (var i=r_num_curves; i>r_top_index; i--) {
		var start_ind = (i-1)*8;
		var x1 = curr_r_curve_pts[start_ind];
		var y1 = curr_r_curve_pts[start_ind+1];
		var x2 = curr_r_curve_pts[start_ind+2];
		var y2 = curr_r_curve_pts[start_ind+3];
		var x3 = curr_r_curve_pts[start_ind+4];
		var y3 = curr_r_curve_pts[start_ind+5];
		var x4 = curr_r_curve_pts[start_ind+6];
		var y4 = curr_r_curve_pts[start_ind+7];
				
		noStroke();
		// fill(r_curve_colors[i-1]);
		fill(r_curve_colors[i-1]._getRed(), r_curve_colors[i-1]._getGreen(), r_curve_colors[i-1]._getBlue(), alpha);
		alpha = alpha + alpha_step;
		alpha = min(alpha, 255);

		beginShape();
		vertex(width, 0);
		vertex(x1, y1);
		bezierVertex(x2, y2, x3, y3, x4, y4);
		vertex(width, height);
		endShape(CLOSE);
	}

	alpha_step = (255-min_alpha)/(b_num_curves-2);
	alpha = min_alpha;
	for (var i=b_top_index; i>0; i--) {
		var start_ind = (i-1)*8;
		var x1 = curr_b_curve_pts[start_ind];
		var y1 = curr_b_curve_pts[start_ind+1];
		var x2 = curr_b_curve_pts[start_ind+2];
		var y2 = curr_b_curve_pts[start_ind+3];
		var x3 = curr_b_curve_pts[start_ind+4];
		var y3 = curr_b_curve_pts[start_ind+5];
		var x4 = curr_b_curve_pts[start_ind+6];
		var y4 = curr_b_curve_pts[start_ind+7];
				
		noStroke();
		// fill(b_curve_colors[i-1]);
		fill(b_curve_colors[i-1]._getRed(), b_curve_colors[i-1]._getGreen(), b_curve_colors[i-1]._getBlue(), alpha);
		alpha = alpha + alpha_step;
		alpha = min(alpha, 255);

		beginShape();
		vertex(0, height);
		vertex(x1, y1);
		bezierVertex(x2, y2, x3, y3, x4, y4);
		vertex(width, height);
		endShape(CLOSE);
	}
	for (var i=b_num_curves; i>b_top_index; i--) {
		var start_ind = (i-1)*8;
		var x1 = curr_b_curve_pts[start_ind];
		var y1 = curr_b_curve_pts[start_ind+1];
		var x2 = curr_b_curve_pts[start_ind+2];
		var y2 = curr_b_curve_pts[start_ind+3];
		var x3 = curr_b_curve_pts[start_ind+4];
		var y3 = curr_b_curve_pts[start_ind+5];
		var x4 = curr_b_curve_pts[start_ind+6];
		var y4 = curr_b_curve_pts[start_ind+7];
				
		noStroke();
		// fill(b_curve_colors[i-1]);
		fill(b_curve_colors[i-1]._getRed(), b_curve_colors[i-1]._getGreen(), b_curve_colors[i-1]._getBlue(), alpha);
		alpha = alpha + alpha_step;
		alpha = min(alpha, 255);

		beginShape();
		vertex(0, height);
		vertex(x1, y1);
		bezierVertex(x2, y2, x3, y3, x4, y4);
		vertex(width, height);
		endShape(CLOSE);
	}

	alpha_step = (255-min_alpha)/(l_num_curves-2);
	alpha = min_alpha;
	for (var i=l_top_index; i>0; i--) {
		var start_ind = (i-1)*8;
		var x1 = curr_l_curve_pts[start_ind];
		var y1 = curr_l_curve_pts[start_ind+1];
		var x2 = curr_l_curve_pts[start_ind+2];
		var y2 = curr_l_curve_pts[start_ind+3];
		var x3 = curr_l_curve_pts[start_ind+4];
		var y3 = curr_l_curve_pts[start_ind+5];
		var x4 = curr_l_curve_pts[start_ind+6];
		var y4 = curr_l_curve_pts[start_ind+7];
				
		noStroke();
		// fill(l_curve_colors[i-1]);
		fill(l_curve_colors[i-1]._getRed(), l_curve_colors[i-1]._getGreen(), l_curve_colors[i-1]._getBlue(), alpha);
		alpha = alpha + alpha_step;
		alpha = min(alpha, 255);

		beginShape();
		vertex(0, 0);
		vertex(x1, y1);
		bezierVertex(x2, y2, x3, y3, x4, y4);
		vertex(0, height);
		endShape(CLOSE);
	}
	for (var i=l_num_curves; i>l_top_index; i--) {
		var start_ind = (i-1)*8;
		var x1 = curr_l_curve_pts[start_ind];
		var y1 = curr_l_curve_pts[start_ind+1];
		var x2 = curr_l_curve_pts[start_ind+2];
		var y2 = curr_l_curve_pts[start_ind+3];
		var x3 = curr_l_curve_pts[start_ind+4];
		var y3 = curr_l_curve_pts[start_ind+5];
		var x4 = curr_l_curve_pts[start_ind+6];
		var y4 = curr_l_curve_pts[start_ind+7];
				
		noStroke();
		// fill(l_curve_colors[i-1]);
		fill(l_curve_colors[i-1]._getRed(), l_curve_colors[i-1]._getGreen(), l_curve_colors[i-1]._getBlue(), alpha);
		alpha = alpha + alpha_step;
		alpha = min(alpha, 255);

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