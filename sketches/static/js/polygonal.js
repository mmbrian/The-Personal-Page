// Inspired by ... well it just came to my mind
// Mohsen Mansouryar

// Polygonal

//// Main Part ///////////////////////////////////

// world constants
var hw, hh;
var wc;

var fps = 60;
var npoly = 25;
var polygons;
var all_polygons;
var ncpoly = 13;

var nc_step = 1;
var curr_nc = 0;


var pangles;
var curr_angles;
var rotation_speeds;

var directions;

var alphas;
var ialphas;
var alpha_dirs;

function setup() {
	document.assetsLoaded = true;
	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);
	window.initVisualization();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	window.initVisualization();
}

window.initVisualization = function() {
	hw = width / 2.;
	hh = height / 2.;
	wc = createVector(hw, hh);

	all_polygons = [];
	polygons = [];
	pangles = [];
	directions = [];
	rotation_speeds = [];
	alphas = [];
	ialphas = [];
	alpha_dirs = [];
	for (var i = 0; i< npoly; i++) {
		polygons[i] = polygon(45 * (i+1), 3 + i);
		// polygons[i] = polygon(45 * (i+1), 5);
		pangles[i] = random(0, TWO_PI);
		directions[i] = 1;
		if (random(1) < 0.5)
			directions[i] = -1;
		rotation_speeds[i] = (PI/180./fps)*random(1, 10);

		// alphas[i] = max(0, 255 - i*13);
		alphas[i] = max(0, 255-i*5);
		ialphas[i] = alphas[i];
		alpha_dirs[i] = true;
	}


	// for (var j=0; j<ncpoly; j++) {
	// 	all_polygons[j] = [];

	// 	for (var i = 0; i< npoly; i++) {
	// 		all_polygons[j][i] = polygon(45 * (i+1), 4 + j);
	// 	}
	// }
}

function mouseDragged() {

}

function keyPressed() {
	switch (keyCode) {
		// case SHIFT: // backspace key
		// 	reversed = !reversed;
		// 	break;
		case ENTER: // enter key
			saveCanvas('polygonal_canvas_scr', 'png');
			// saveFrames('polygonal','jpg',15,22,null); // 15 and 22 are max values 15 sec, 22fps
			// print('done');

			// inverted = !inverted;
			break;
		// case UP_ARROW: // Up
		// 	wa += 0.01;
		// 	wa = constrain(wa, min_wa, max_wa);
		// 	break;
		// case DOWN_ARROW: // Down
		// 	wa -= 0.01;
		// 	wa = constrain(wa, min_wa, max_wa);
		// 	break;
		// case LEFT_ARROW:
		// 	wc.x -= 3;
		// 	wc.x = constrain(wc.x, 0, width);
		// 	break;
		// case RIGHT_ARROW:
		// 	wc.x += 3;
		// 	wc.x = constrain(wc.x, 0, width);
		// 	break;
		default:
			break;
	}
}

function draw() {
	if (!window.allowVisualization) return;

	fill(0, 255);
	rect(0, 0, width, height);

	curr_angles = [];
	for (var i = npoly-1; i>= 0; i--) {
		curr_angles[i] = pangles[i] + directions[i]*rotation_speeds[i]*frameCount;
	}

	// var cf = curr_nc;

	translate(hw, hh);
	for (var i = npoly-1; i>= 0; i--) {
		noStroke();
		// var clr = max(0, 255 - i*13);
		fill(alphas[i]);
		if (alpha_dirs[i]) {
			alphas[i] = lerp(alphas[i], 255-ialphas[i], 0.01);
			if (abs(alphas[i] - 255 + ialphas[i]) < 1)
				alpha_dirs[i] = !alpha_dirs[i];
		} else {
			alphas[i] = lerp(alphas[i], ialphas[i], 0.01);
			if (abs(alphas[i] - ialphas[i]) < 1)
				alpha_dirs[i] = !alpha_dirs[i];
		}

		rotate(curr_angles[i]);
		beginShape();


		vertex(polygons[i][0].x, polygons[i][0].y);
		// vertex(all_polygons[cf][i][0].x, all_polygons[cf][i][0].y);
		for (var j = 1; j< polygons[i].length; j++) {
		// for (var j = 1; j< all_polygons[cf][i].length; j++) {
			vertex(polygons[i][j].x, polygons[i][j].y);
			// vertex(all_polygons[cf][i][j].x, all_polygons[cf][i][j].y);
			
			// var midx = (polygons[i][j-1].x + polygons[i][j].x) / 2.;
			// var midy = (polygons[i][j-1].y + polygons[i][j].y) / 2.;
			// var eps = 1.3;
			// if (j%2==0) eps = 2-eps;
			// midx = eps*midx + (1-eps)*0;
			// midy = eps*midy + (1-eps)*0;

			// quadraticVertex(midx, midy, polygons[i][j].x, polygons[i][j].y);	

			// var next_ind = j+2;
			// var ctrl_ind = j+1;
			// if (next_ind >= polygons[i].length)
			// 	next_ind -= polygons[i].length;
			// if (ctrl_ind >= polygons[i].length)
			// 	ctrl_ind -= polygons[i].length;
			// quadraticVertex(polygons[i][ctrl_ind].x*eps, polygons[i][ctrl_ind].y*eps, polygons[i][next_ind].x, polygons[i][next_ind].y);	
		}
		// vertex(polygons[i][polygons[i].length-1].x, polygons[i][polygons[i].length-1].y);

		endShape(CLOSE);

		// stroke(255-clr);
		// noFill();
		// if (i>0) {
		// 	for (var j = 0; j< polygons[i].length; j++) {
		// 		var x = polygons[i][j].x;
		// 		var y = polygons[i][j].y;
		// 		// rotate(curr_angles[i-1] - curr_angles[i]);
		// 		line(x, y, polygons[i-1][j].x, polygons[i-1][j].y);
		// 	}
		// }
		rotate(-curr_angles[i]);
	}

	// if (frameCount % 5 == 0) {
	// 	if (curr_nc + nc_step >= ncpoly || curr_nc + nc_step < 0) {
	// 		nc_step *= -1;
	// 	}
	// 	curr_nc += nc_step;
	// }
}

//////////////////////////////////////////////////

//// tools ///////////////////////////////////////

function inScreen(p) {
  return p.x > 0 && p.x < width && p.y > 0 && p.y < height;
}

function polygon(radius, npoints) {
	var _x = 0; // center origin x
	var _y = 0; // center origin y
    var poly = [];
    var vi = 0;
    var angle = TWO_PI / npoints;
    for (var a = 0; a < TWO_PI; a += angle) {
      if (vi == npoints) break;
      var sx = _x + cos(a) * radius;
      var sy = _y + sin(a) * radius;

      // eps = random(.3);
      // sx = eps*_x + (1-eps)*sx;
      // sy = eps*_y + (1-eps)*sy;

      poly[vi++] = createVector(sx, sy);
    }
    return poly;
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