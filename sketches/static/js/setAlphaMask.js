

var last_frame = -1;

// world constants
var hw, hh;
var fps = 60;

var img, mask;
var i,j;
var allow_paint = true;

function preload() {
	img = loadImage('static/other/alphamask_assets/img.jpg');
	mask = loadImage('static/other/alphamask_assets/mask.png');
}


function setup() {
	document.assetsLoaded = true;

	//// Initializations
	frameRate(fps);
	// createCanvas(windowWidth, windowHeight);
	createCanvas(2048, 2048);

	hw = width / 2.;
	hh = height / 2.;

	blendMode(REPLACE);
	// blendMode(BLEND);

	background(0);
	set(0, 0, img);
  	updatePixels();

  	i=0;
  	j=0;
}

function draw() {
	// background(255); 
	if (frameCount > 3*fps){
		if (last_frame < 0) {
			last_frame = frameCount;
		}
		main();
		// main();
	}
}

function main(){ 
	// background(0);
	var fn = (frameCount-last_frame);

	// if (fn==0)
	// 	image(img, 0, 0);


	if (allow_paint) {
	  	var c, alpha;
		c = get(j, i);
		alpha = mask.get(j, i)[0];
		set(i, j, color(c[0], c[1], c[2], alpha));	
		updatePixels();

		j++;
		if (j==height) {
			j=0;
			i++;
		}
		if (i==width) { // done
			allow_paint = false;
		}
	}
}