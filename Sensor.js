const DELTA = 45;

class Sensor {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.val = 0;
  }

  setVal(value) {
    this.val = value;
    return this;
  }

  inFOV(x, y) {
    const v0 = createVector(this.x, this.y);
    const v1 = createVector(50, 0);
    const v2 = createVector(x - this.x, y - this.y);
    let ang = degrees(
      v1.angleBetween(v2)
    );
    // console.log(ang);
    const in_fov = (this.angle - DELTA <= ang) && (ang <= this.angle + DELTA);
    if (in_fov)
      drawArrow(v0, v2, 'red');
    return in_fov;
  }

  show() {
    stroke('red');
    strokeWeight(10);
    point(this.x, this.y);
    stroke(0);
    strokeWeight(1);
  }
}
// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}