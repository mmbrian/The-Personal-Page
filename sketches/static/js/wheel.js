var n_lines = 14; // n_lines + 1
var min_length = 50;
var max_length = 700;
var min_line_weight = 1;
var max_line_weight = 25;
var line_weights;
var line_lengths;
var line_alphas;
var init_alpha = 1;
var center_r = 100;

var alpha = 0;

var r_step = 0.001;
var r_step_velocity = 0.001;
var r = 0;

var level = 0;
var level_step = 0.07;

var bg_alpha = 30;
var bg_alpha_step = 10;

var hh, hw;
var ft;

function setup() {
	document.assetsLoaded = true;
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    
    createCanvas(windowWidth, windowHeight);

    hh = height / 2.;
    hw = width / 2.;


    center_r = min(width, height) / 5.;
    min_length = 0; //min(hh, hw);
    max_length = min(width, height) / 2. - center_r;

    resetLines();
}


function draw() {
    background(0, bg_alpha);

    noFill();
    strokeCap(PROJECT);

    push();
    translate(hw, hh);
    rotate(r);
    for (var i = 0; i < n_lines; i++) {
        push();
        ft = i / (n_lines - 1);
        var sr = center_r*sin(degrees(PI - (TWO_PI * ft)))/3.;
        // var sr = 0;
        rotate(PI - (TWO_PI * ft));
        // stroke(255*alpha, 255*alpha);
        stroke(255, line_alphas[i]);
        strokeWeight(line_weights[i]);
        line(0, sr + center_r, 0, sr + center_r + line_lengths[i] * level); // stright vertical line
        pop();
    }
    pop();
    updateLines();
}

function keyPressed() {
    switch (keyCode) {
        case 32: // Space key
            n_lines = n_lines + 1;
            resetLines();
            break;
        case ENTER: // enter key
            saveCanvas();
            break;
        case SHIFT:
            clear();
            break;
        // case UP_ARROW:
        //     level += level_step;
        //     break;
        // case DOWN_ARROW:
        //     if (level - level_step < 0) {
        //         level = 0;
        //     } else {
        //         level -= level_step;
        //     }
        //     break;
        // case LEFT_ARROW:
        //     if (bg_alpha - bg_alpha_step < 10) {
        //         bg_alpha = 10;
        //     } else {
        //         bg_alpha -= bg_alpha_step;
        //     }
        //     break;
        // case RIGHT_ARROW:
        //     if (bg_alpha + bg_alpha_step > 255) {
        //         bg_alpha = 255;
        //     } else {
        //         bg_alpha += bg_alpha_step;
        //     }
        //     break;
        default:
            break;
    }
}

function resetLines() {
    alpha = init_alpha;
    r = 0;
    line_lengths = new Array(n_lines);
    line_weights = new Array(n_lines);
    line_alphas = new Array(n_lines);
    for (var i = 0; i < n_lines; i++) {
        line_lengths[i] = random(min_length, max_length);
        line_alphas[i] = random(255);
        line_weights[i] = random(min_line_weight, max_line_weight);
    }
}

function updateLines() {
    // var reset = true;
    // var dl;
    // for (var i=0; i<n_lines; i++) {
    //   dl = line_lengths[i]
    //   line_lengths[i] = lerp(line_lengths[i], 0, 0.05);
    //   dl = dl - line_lengths[i];
    //   if (dl > .01) {
    //     reset = false;
    //   }
    // }
    // alpha = lerp(alpha, 1, 0.05);
    r = r + r_step;
    // if (reset) {
    //   resetLines();
    // }

    if (keyIsDown(DOWN_ARROW)) {
        if (level - level_step < 0) {
            level = 0;
        } else {
            level -= level_step;
        }
    }
    if (keyIsDown(UP_ARROW)) {
        level += level_step;
    }
    if (keyIsDown(LEFT_ARROW)) {
        if (bg_alpha - bg_alpha_step < 10) {
            bg_alpha = 10;
        } else {
            bg_alpha -= bg_alpha_step;
        }
    }
    if (keyIsDown(RIGHT_ARROW)) {
        if (bg_alpha + bg_alpha_step > 255) {
            bg_alpha = 255;
        } else {
            bg_alpha += bg_alpha_step;
        }
    }
    if (keyIsDown(83)) { // S
      if (r_step - r_step_velocity < 0) {
        r_step = 0;
      } else {
        r_step -= r_step_velocity
      }
    }
    if (keyIsDown(87)) { // W
      r_step += r_step_velocity
    }
  
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resetLines();
}

