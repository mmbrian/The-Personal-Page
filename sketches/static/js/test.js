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
var last_frame = -1;

var radius = 0;
var initial_radius_speed = 0.1;
var min_init_speed = 0.05;
var max_init_speed = 0.25;
var radius_acceleration = 0.1;
var min_acceleration = 0.1;//0.03;
var max_acceleration = 0.5;//0.1;
var radius_speed = initial_radius_speed;

var clr = 0;
var state = 1;
var initial_clr_speed = 0.1;
var clr_speed = initial_clr_speed;
var clr_acceleration = 0.05;

var cx, cy;
var max_radius;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);

	hw = width / 2.;
	hh = height / 2.;

	cx = hw, cy = hh;
	max_radius = sqrt(hw*hw+hh*hh); // half diameter since initial center is in the middle
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
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
	last_frame = -1;
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


	noStroke();
	fill(clr);
	smooth();
	ellipse(cx, cy, radius*2, radius*2);
	updateRadius();

	// test();
}

function test() {
	var c1x = random(width), c2x = random(width);
	var c1y = random(height), c2y = random(height);
	var d = dist(c1x, c1y, c2x, c2y);
	var r1 = random(d), r2 = random(d-r1);
	var r = min(r1, r2), R = max(r1, r2);

	var r3 = sqrt(d*d-r*r+2*r*R); // centered from the larger circle (c1)
	// Now intersect circles (c1, r3) and (c2, r)
	
	// This gives 2 intersection a, b
	var r4 = sqrt(d*d-R*R+2*r*R); // centered from the smaller circle (c2)
	// Now intersect circles (c2, r4) and (c1, R)
	
	// This gives 2 intersection c, d
	// find the pair (a, c) or (a, c) with both on one side of the line between c1, c2
	// the other pair is the other tangent

}


function updateRadius() {
	if (radius <= max_radius) {
		radius = radius + radius_speed;
		radius_speed = radius_speed + radius_acceleration;

		// clr = clr + clr_speed;
		// clr_speed = clr_speed + clr_acceleration;		
		var t = radius/max_radius;
		t = 1.6*t;
		clr = (!state ? t*255 : (255 - t*255));
		clr = min(max(clr, 0), 255);
	} else {
		// clr = 255-clr;
		state = 1-state;
		radius = 0;
		
		// radius_speed = initial_radius_speed;
		radius_speed = random(min_init_speed, max_init_speed);
		radius_acceleration = random(min_acceleration, max_acceleration);
		cx = random(width);
		cy = random(height);
		var max_x = max(cx, width-cx);
		var max_y = max(cy, height-cy);
		max_radius = sqrt(max_x*max_x+max_y*max_y);
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

var cc_intersection = function(c1x, c1y, c2x, c2y) {
	// TODO: port the python code below
}

    // def circle_intersection(self, circle1, circle2):
    //     '''
    //     @summary: calculates intersection points of two circles
    //     @param circle1: tuple(x,y,radius)
    //     @param circle2: tuple(x,y,radius)
    //     @result: tuple of intersection points (which are (x,y) tuple)
    //     '''
    //     # return self.circle_intersection_sympy(circle1,circle2)
    //     x1,y1,r1 = circle1
    //     x2,y2,r2 = circle2
    //     # http://stackoverflow.com/a/3349134/798588
    //     dx,dy = x2-x1,y2-y1
    //     d = sqrt(dx*dx+dy*dy)
    //     if d > r1+r2:
    //         print "#1"
    //         return None # no solutions, the circles are separate
    //     if d < abs(r1-r2):
    //         print "#2"
    //         return None # no solutions because one circle is contained within the other
    //     if d == 0 and r1 == r2:
    //         print "#3"
    //         return None # circles are coincident and there are an infinite number of solutions

    //     a = (r1*r1-r2*r2+d*d)/(2*d)
    //     h = sqrt(r1*r1-a*a)
    //     xm = x1 + a*dx/d
    //     ym = y1 + a*dy/d
    //     xs1 = xm + h*dy/d
    //     xs2 = xm - h*dy/d
    //     ys1 = ym - h*dx/d
    //     ys2 = ym + h*dx/d

    //     return (xs1,ys1),(xs2,ys2)


//////////////////////////////////////////////////