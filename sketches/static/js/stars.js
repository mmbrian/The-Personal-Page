// Inspired by an old windows screen saver
// Mohsen Mansouryar

// Stars

//// Main Part ///////////////////////////////////
var mx, my;

var inverted = false;
var reversed = false;
var nstars = 250;
var stars = [];

var wclr = 0;

// world constants
var hw, hh;
var wc;
var min_wa = 1.01, max_wa = 1.1;
var wa = min_wa;
var width, height;

var fps = 60;

function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);

	hw = width / 2.;
	hh = height / 2.;
	wc = createVector(hw, hh);

	stars = [];
	for (var i = 0; i< nstars; i++)
		stars[i] = new Star(random(width), random(height));
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
	if (mouseY < my) {
		wa += 0.005;
	} else if (mouseY > my) {
		wa -= 0.005;
	} else { // do nothing
	}

	wa = constrain(wa, min_wa, max_wa);
	mx = mouseX;
	my = mouseY;
}

function keyPressed() {
	switch (keyCode) {
		case SHIFT: // backspace key
			reversed = !reversed;
			break;
		case ENTER: // enter key
			inverted = !inverted;
			break;
		case UP_ARROW: // Up
			wa += 0.01;
			wa = constrain(wa, min_wa, max_wa);
			break;
		case DOWN_ARROW: // Down
			wa -= 0.01;
			wa = constrain(wa, min_wa, max_wa);
			break;
		case LEFT_ARROW:
			wc.x -= 3;
			wc.x = constrain(wc.x, 0, width);
			break;
		case RIGHT_ARROW:
			wc.x += 3;
			wc.x = constrain(wc.x, 0, width);
			break;
		default:
			break;
	}
}

function draw() {
	if (inverted)
		wclr = lerp(wclr, 255, 0.05);
	else
		wclr = lerp(wclr, 0, 0.05);
	fill(wclr, 55 + (wa - min_wa) / (max_wa - min_wa) * 200);
	rect(0, 0, width, height);

	for (var i = 0; i< nstars; i++) {
		if (!inScreen(stars[i].p))
			stars[i] = new Star(random(width), random(height));
		stars[i].draw();
	}
}

//////////////////////////////////////////////////

//// tools ///////////////////////////////////////

function inScreen(p) {
  return p.x > 0 && p.x < width && p.y > 0 && p.y < height;
}

//////////////////////////////////////////////////

//// Star //////////////////////////////////////

var Star = function(x1, y1) {
	this.p = createVector(x1, y1);
	this.alpha = 0;
	this.r = 2;
	this.init();
}
  
Star.prototype.init = function() {
	this.v = createVector(this.p.x, this.p.y);
	this.v.sub(wc);
	this.initial_dist = this.v.mag();
	this.v.normalize();
}
  
Star.prototype.draw = function() { 
	if (inverted)
		this.alpha = lerp(this.alpha, 0, 0.05);
	else
		this.alpha = lerp(this.alpha, 255, 0.05);  

	fill(this.alpha);
	noStroke();
	ellipse(this.p.x, this.p.y, this.r, this.r);
	this.update();
}
  
Star.prototype.update = function() { 
	if (!reversed)
		this.p.add(this.v);
	else
		this.p.sub(this.v);
	this.v.mult(wa);
	this.r = 1 + 0.02 * (p5.Vector.dist(this.p, wc) - this.initial_dist);
}

//////////////////////////////////////////////////