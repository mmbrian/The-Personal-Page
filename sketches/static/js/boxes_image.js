// Inspssired by ...
// Mohsen Mansouryar

// Curves


var last_frame = -1;

// world constants
var hw, hh;
var fps = 60;


var boxes_x = [];
var boxes_y = [];
var boxes_r = [];
var boxes_a = [];

// var min_r = 10;
// var max_r = 200;
var min_r = 50;
var max_r = 500;
var min_alpha = 0.0;
var max_alpha = 255.0;

// var nboxes_per_turn = 150;
// var nturns = 30;
var nboxes_per_turn = 125;
var nturns = 25;
var nboxes; // in case of fewer boxes

var nboxes_drawn;

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

	generateBoxes(false);
}


function keyPressed() {

	

// 
	switch (keyCode) {
		case ENTER:
			saveCanvas();
			break;
		case 32: // Space key
			generateBoxes(true);
			break;
		// case 65: // A
		// 	saveCanvas();
		// 	break;
	// 		generateBox(0)
	// 		break;
	// 	case 68: // D
	// 		generateBox(1)
	// 		break;
	// 	case 74: // J
	// 		generateBox(2)
	// 		break;
	// 	case 76: // L
	// 		generateBox(3)
	// 		break;
		default:
			// generateBox();
			break;
	}
}

// function generateBox(i) {
// 	var w4th = width/4.;
// 	var h4th = height/4.;
// 	boxes_x.push(randSelect(w4th, 0) + i*w4th);
// 	boxes_y.push(randSelect(height, 0));
function generateBoxes(redraw) {
	nboxes_drawn = 0;
	nboxes = 0;
	var _nboxes = nturns * nboxes_per_turn;
	boxes_x = new Array(_nboxes);
	boxes_y = new Array(_nboxes);
	boxes_a = new Array(_nboxes);
	boxes_r = new Array(_nboxes);

	var c = 0;
	for (var t=0; t<nturns; t++) {
		// for (var i=0; i<nboxes_per_turn; i++) {
		var nboxes_this_turn = ((nturns-t)/nturns)*nboxes_per_turn;	
		nboxes = nboxes + nboxes_this_turn;
		for (var i=0; i<nboxes_this_turn; i++) {			
			
			// boxes_x[t*nboxes_per_turn + i] = randSelect(width, 0);
			// boxes_y[t*nboxes_per_turn + i] = randSelect(height, 0);
			// boxes_r[t*nboxes_per_turn + i] = min_r + randSelect(max_r - min_r, 0);
			// boxes_a[t*nboxes_per_turn + i] = randSelect(width, 0);

			// boxes_x[c] = randSelect(width, 0);
			// boxes_y[c] = randSelect(height, 0);
			boxes_r[c] = min_r + randSelect(max_r - min_r, 0);
			var min_offset = randSelect(max_r,0);
			boxes_x[c] = min_offset + randSelect(width-2*min_offset, 1);
			boxes_y[c] = min_offset + randSelect(height-2*min_offset, 0);
			// boxes_x[c] = min(max(min_offset, randSelect(width, 1)), width-min_offset);
			// boxes_y[c] = min(max(min_offset, randSelect(height, 0)), height-min_offset);
			// boxes_r[c] = min(min_r + randSelect(max_r - min_r, 0), min(width - boxes_x[c], height - boxes_y[c]));
			boxes_a[c] = 5;
			// boxes_a[c] = min_alpha + ((t+1.0)/nturns)*(max_alpha - min_alpha);
			// print(((t+1.0)/nturns)*(max_alpha - min_alpha));

			// boxes_x.push(randSelect(width, 0));
			// boxes_y.push(randSelect(height, 0));
			// boxes_r.push(min_r + randSelect(max_r - min_r, 0));
			// boxes_a.push(a);

			c++;
		}
	}

	if (redraw)
		last_frame = frameCount;
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

function main() {
	// background(0);
	var fn = (frameCount-last_frame);

	// if (fn%15 == 10) {
	// 	if (keyIsDown(65)) // A
	// 		generateBox(0);
	// 	if (keyIsDown(68)) // D
	// 		generateBox(1);
	// 	if (keyIsDown(74)) // J
	// 		generateBox(2);
	// 	if (keyIsDown(76)) // L
	// 		generateBox(3);
	// }

	if (fn == 3) { // draw background
		noStroke();
		fill(0);
		rect(0,0, width, height);
		stroke(0);
	}

	// stroke(0);
	// strokeWeight(5.0);
	if (nboxes_drawn < nboxes) {
		// for (var i=0; i<nboxes; i++) {
			// stroke(0, boxes_a[nboxes_drawn]);
			noStroke();
			fill(255, boxes_a[nboxes_drawn]);
			// var offset = boxes_r[nboxes_drawn]/2.;
			var offset = boxes_r[nboxes_drawn]/2.;
			rect(boxes_x[nboxes_drawn]-offset, boxes_y[nboxes_drawn]-offset, boxes_r[nboxes_drawn], boxes_r[nboxes_drawn]);
			nboxes_drawn = nboxes_drawn + 1;
			// boxes_a[i] = lerp(boxes_a[i], 0, 0.01);
			// boxes_r[i] = lerp(boxes_r[i], width, 0.05);
			// boxes_r[i] = 975;


			// boxes_a[i] = lerp(boxes_a[i], 0, 0.1);
			// boxes_r[i] = lerp(boxes_r[i], 500, 0.05);
			// if (boxes_a[i]<1) {
			// 	deleted.push(i);	
			// }
		// }
	} else {
		print('done');
	}
	// for (var i=deleted.length-1; i>=0; i--) {
	// 	boxes_a.splice(deleted[i], 1);
	// 	boxes_r.splice(deleted[i], 1);
	// 	boxes_x.splice(deleted[i], 1);
	// 	boxes_y.splice(deleted[i], 1);
	// }

	
	// noStroke();
	// fill(0);
	// ellipse(hw,hh,175,175);
	// fill(255);
	// ellipse(hw,hh,75,75);
}



function randSelect(a, state) {
	// // return randomGaussian(0.5, 0.3)*a; // mean, sd
	// if (state == 0) { // y
	// 	return normalcdf(0.5, 0.7, random())*a; // mean, sd, to
	// } else { // x
	// 	return normalcdf(0.5, 1.1, random())*a; // mean, sd, to
	// }
	// if (state == 0)
		return random(a);
	// else
	// 	return min_r*15 + random(a-min_r*15);

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
