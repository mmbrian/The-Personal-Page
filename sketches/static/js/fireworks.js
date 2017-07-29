// Inspired by ?
// Mohsen Mansouryar
// web page goes here

// Fireworks

//// Main Part ///////////////////////////////////
var gravity;
// var w = 640, h = 480;
var w , h;
var maxN = 4;
var missiles;
var particles;
var fps = 60;

var explosion1, explosion2, launch;

function preload() {
  explosion1 = loadSound('static/other/fireworks_assets/firework_explode_1.mp3');
  explosion2 = loadSound('static/other/fireworks_assets/firework_explode_2.mp3');
  launch = loadSound('static/other/fireworks_assets/firework_rocket_launch.mp3');
}

function setup() {
	document.assetsLoaded = true;
	//// Initializations
	frameRate(fps);
	gravity = createVector(0, 0.1);

	w = windowWidth;
	h = windowHeight;
	createCanvas(w, h);

	missiles = [];
	append(missiles, new Missile());
	append(missiles, new Missile());

	particles = [];
}

function windowResized() {
	w = windowWidth;
	h = windowHeight;
	resizeCanvas(w, h);
}

function mouseClicked() {
	if (document.allowVisualization) {
		// if (mouseButton == LEFT) {
		if (missiles.length<maxN)
			append(missiles, new Missile());
		// } else {
		// 	if (missiles.length>0)
		// 		missiles.splice(missiles.length-1, 1);
		// }
	}
}

function draw() {
	background(0);
	// Waiting until preloader is completely gone (1100 = 550 + 550)
	if (document.allowVisualization && frameCount > (1100+3750)/1000. * fps) {
		for (var i=0; i<missiles.length; i++) {
			missiles[i].move();
			if (missiles[i].alive) {
				missiles[i].display();
				if (missiles[i].speed.y + random(0, 3)> 0) {
					particles = particles.concat(missiles[i].explode());
					if (random(1)<0.5) {
					  explosion1.play();
					} else {
					  explosion2.play();
					}
				}
				particles = particles.concat(missiles[i].sparkles());
			}
			if (outOfBounds(missiles[i].pos)) {
				missiles[i] = new Missile();
				launch.play();
			}
		}

		for (var i=particles.length-1; i>=0; i--) {
			if (!particles[i].alive) {
				particles.splice(i, 1);
			} else {
				particles[i].moveParticle();
				particles[i].displayParticle();
				if (outOfBounds(particles[i].pos)) {
					particles[i].alive = false;
				}
			}
		}
	}
}

// function mouseMoved() {
//   print(mouseX + " : " + mouseY);
// }

//////////////////////////////////////////////////

//// util ////////////////////////////////////////

function outOfBounds(v) {
	return v.x>w || v.x<0 || v.y>h;// || v.y<0;
}

//////////////////////////////////////////////////

//// Missle //////////////////////////////////////

var Missile = function() {
	this.pos = createVector(random(w/2.0-w/6.0, w/2.0+w/6.0), h + 0.0);
	// Setting direction towards center of the world
	this.dir = createVector(w/2.0, h/2.0);
	this.dir.sub(this.pos);
	this.dir.div(this.dir.mag());
	// Setting random radius (TODO: make it device independant)
	this.r = random(2, 5);
	// Setting initial speed (TODO: make it device independant)
	this.v0 = random(7, 13);
	this.speed = this.dir;
	this.speed.mult(this.v0);
	// Setting acceleration (TODO: make it device independant)
	if (random(1)<0.5)
	  this.sa = random(5, 16);
	else
	  this.sa = 1;

	this.t = 0;
	this.alive = true;
}

Missile.prototype.move = function() {
	var to = createVector(this.speed.x, this.speed.y);
	if (this.speed.y < 0) { 
	  // Rotating direction vector to simulate a swirling effect
	  var ch = sin(this.t*PI/this.sa) * (6-this.r); // (TODO: make it device independant)
	  var r = atan(ch/this.speed.mag());
	  to.rotate(r);
	  // Reducing acceleration
	  this.sa = lerp(this.sa, 2, 0.01); // (TODO: make it device independant)
	}

	this.pos.add(to);
	this.speed.add(gravity);
	this.t++;
}

Missile.prototype.explode = function() {
	// (TODO: make it device independant)
    var parts = int(random(1, 4)); // number of parts with different initial velocity
    
    var np = int(random(20, 95)); // (TODO: make it device independant)
    if (random(1)>.7) { // (TODO: make it device independant)
      np = 140;
      parts = 6;
    }
    var ret = [];

    var pv0 = random(1, 5); // (TODO: make it device independant)
    var alpha = random(0.4, 1); // (TODO: make it device independant)

    
    var psize = int(np/parts);
    for (var p=0; p<parts-1; p++) {
      pv0 = random(1, 3); // (TODO: make it device independant)

      for (var i=p*psize; i< (p+1)*psize; i++) {
      	append(ret, new Particle(this.pos, random(1.0*this.r, 2*this.r), pv0, false, alpha, null, 255, 255, 255));
      }
    }
    pv0 = random(1, 5); // (TODO: make it device independant)
    for (var i= (parts-1)*psize; i<np; i++) { // last part
      append(ret, new Particle(this.pos, random(1.0*this.r, 2*this.r), pv0, false, alpha, null, 255, 255, 255));
    }

    this.alive = false;
    return ret;
}

Missile.prototype.sparkles = function() {
    var np = int(random(3, 7)); // (TODO: make it device independant)
    var ret = [];
    var pv0 = random(0, 1); // (TODO: make it device independant)
    for (var i=0; i<np; i++) {
      append(ret, new Particle(this.pos, random(1, this.r/2.), pv0, true, 1, this.speed, 255, 255, 255));
    }
    return ret;
}

Missile.prototype.display = function() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
}

// PVector p, float r, float v0, boolean sparkle, float alpha, PVector mspeed, float cr, float cg, float cb
var Particle = function(p, r, v0, sparkle, alpha, mspeed, cr, cg, cb) {
	this.sparkle = sparkle;

    this.pos = createVector(p.x, p.y);

    if (this.sparkle) {
//      this.dir = PVector.random2D();
		this.dir = createVector(-mspeed.x, -mspeed.y);
		this.dir.div(this.dir.mag());
		this.dir.rotate(random(-PI/6., PI/6.));
    } else {
		this.dir = p5.Vector.random2D();
    }
    this.r = r;

    this.v0 = v0 + (random(1) < 0.5 ? 0 : random(-1, 1));
    this.speed = this.dir;
    this.speed.mult(this.v0);

    this.alive = true;
    // this.sparkle = sparkle;

    this.sg = createVector(gravity.x, gravity.y);
    this.sg.mult(alpha);
    
    this.cr = cr;
    this.cg = cg;
    this.cb = cb;
}

Particle.prototype.moveParticle = function() {
    this.pos.add(this.speed);
    this.r = lerp(this.r, 0.0, (this.sparkle ? 0.05 : 0.01));
    this.speed.add(this.sg);
}
  
Particle.prototype.displayParticle = function() {
    noStroke();
    fill(this.cr, this.cg, this.cb);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
}

//////////////////////////////////////////////////