const DEFAULT_SPEED = 1;
class Car {
  constructor(image_or_color = 'rgba(0,255,0, 0.25)', pos = { x: 0, y: 0 }, speed = DEFAULT_SPEED, using_sensors = false) {
    this.x = pos.x;
    this.y = pos.y;
    this.speed = speed;
    this.width = 40;
    this.height = 60;
    this.shade = image_or_color;
    this.using_sensors = using_sensors;
    if (using_sensors)
      this.sensors = [
        // front-mid
        new Sensor(this.x + (this.width / 2), this.y, -90),
        // back-mid
        new Sensor(this.x + (this.width / 2), this.y + this.height, 90),
        // front-right
        new Sensor(this.x + this.width, this.y, -45),
        // back-right
        new Sensor(this.x + this.width, this.y + this.height, 45),
        // mid-right
        new Sensor(this.x + this.width, this.y + this.height / 2, 0),
        // mid-left1
        new Sensor(this.x, this.y + this.height / 2, 180),
        // mid-left2
        new Sensor(this.x, this.y + this.height / 2, -180),
        // front-left
        new Sensor(this.x, this.y, -135),
        // back-left
        new Sensor(this.x, this.y + this.height, 135),
      ];
  }

  move(dir, speed = DEFAULT_SPEED) {
    this.x += speed * dir.x;
    this.y += speed * dir.y;
    if (this.using_sensors) {
      this.sensors.forEach(sensor => {
        sensor.x += speed * dir.x;
        sensor.y += speed * dir.y;
      })
    }
  }

  isColiding(other_car) {
    return (abs(other_car.x - this.x) < (other_car.width + this.width) / 2 && abs(other_car.y - this.y) < (other_car.height + this.height) / 2)
  }

  calcSensorsDistanceToObject(objs) {
    if (this.using_sensors) {
      for (let i = 0; i < this.sensors.length; i++) {
        const sensor = this.sensors[i];
        sensor.val = height * width;
        for (const obj of objs) {
          if (sensor.inFOV(obj.x + obj.width / 2, obj.y + obj.height / 2)) {
            const d = dist(sensor.x, sensor.y, obj.x + obj.width, obj.y + obj.height);
            if (sensor.val > d) {
              this.sensors[i].setVal(d);
              // console.log(d, this.sensors.map(sen => sen.val));
            }
          }
        }
      }
    }
  }

  showSensors() {
    this.sensors.forEach(sens => sens.show());
    // console.log(this.sensors.map(sen => sen.val));
  }

  draw() {
    if (this.shade === 'yellow') {
      fill(this.shade);
      if (this.using_sensors)
        this.showSensors();
      rect(this.x, this.y, this.width, this.height);
      noFill();
    } else {
      image(this.shade, this.x, this.y, this.width, this.height);
    }
  }
}
