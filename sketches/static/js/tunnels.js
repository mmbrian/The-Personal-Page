var hh, hw;
var x, y;
var destx, desty;
var lr = 0.05;
var th = 4.5;
var state = 1;

function setup() {
	document.assetsLoaded = true;
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    // fullscreen(1);

    restart();
    x = hw;
    y = hh;
    destx = random(width);
    desty = random(height);
    // rectMode
}

function restart() {
    hw = width / 2.;
    hh = height / 2.;
}

function draw() {
    // if (!(dx == 0 && dy == 0))
    // 	background(0, 255);  
    // else
    background(0, 25);

    x = lerp(x, destx, lr);
    y = lerp(y, desty, lr);

    stroke(255, 150);
    fill(0, 255);
    // if (random() < 0.0000005) {
    // 	line(random(width), random(height), x, y);
    // } else {
    // if (state > 5)
        rect(x, y, destx - x, desty - y);
    // else
    //     ellipse(x, y, destx - x, desty - y);
    

    var dx = abs(destx - x);
    var dy = abs(desty - y);
    if (dx < th && dy < th) {
		updateDest();        
        background(0, 255);
        restart();
    }
}

function updateDest() {
	destx = random(width);
    desty = random(height);
    state = random(10);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    restart();
}