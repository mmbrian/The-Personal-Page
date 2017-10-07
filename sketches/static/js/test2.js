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


var img;
var map;

var n_agents = 200;
var agents_x, agents_y, agents_alive;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);

	hw = width / 2.;
	hh = height / 2.;

	img = createImage(width, height);

	map = new Array(height);
	for (var i = 0; i < height; i++) {
	  map[i] = new Array(width);
	  for (var j = 0; j < width; j++) {
	  	map[i][j] = false;
	  }
	}

	agents_x = new Array();
	agents_y = new Array();
	agents_alive = new Array();

	for (var i=0; i<n_agents; i++) {
		var x = randSelect(width);
		var y = randSelect(height);
		while (map[y][x]) {
			x = randSelect(width);
			y = randSelect(height);		
		}
		createAgent(x, y);
	}
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

function updateImage() {
	var xys = updateAgents();
	var _x, _y;
	img.loadPixels();
	for (var i=0; i<xys.length; i++) {
		_x = xys[i];
		_y = xys[i+1];
		i++;
		img.set(_x, _y, color(0, 0, 0));
	}
	img.updatePixels();
}

function createAgent(x, y) {
	append(agents_x, x);
	append(agents_y, y);
	append(agents_alive, true);
}

function updateAgents() {
	var xys = new Array();
	for (var i=0; i<agents_x.length; i++) {
		if (agents_alive[i] && typeof agents_x[i] != 'undefined') {
			append(xys, agents_x[i]);
			append(xys, agents_y[i]);

			var ii = agents_y[i];
			var jj = agents_x[i];
			var ijs = new Array();
			for (var ni = -1; ni <= 1; ni++) {
				for (var nj = -1; nj <= 1; nj++) {
					if (!map[ii+ni][jj+nj]) {
						append(ijs, ii+ni);
						append(ijs, jj+nj);
					}
				}	
			}
			if (ijs.length > 0) { // can evolve
				var c = int(random(ijs.length/2));
				print(' ');print(' ');
				print(c);
				print(ijs.length);
				agents_y[i] = ijs[2*c];
				agents_x[i] = ijs[2*c+1];
				print(' ');
				print(agents_x[i]);
				print(agents_y[i]);
				map[agents_y[i]][agents_x[i]] = true;
			} else {
				agents_alive[i] = false;
			}

		}
	}
	return xys;
}

function main() {
	var fn = (frameCount-last_frame);
	updateImage();
	image(img, 0, 0);
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