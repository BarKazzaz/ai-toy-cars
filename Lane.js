function setLineDash(list) {
  drawingContext.setLineDash(list);
}

class Lane {
  constructor(pos) {
    this.x = pos;
    this.width = 80;
    this.cars = [];
    this.next_car_speed = function* (i = 0) {
      while (true)
        yield 3;
    }();
  }

  addCar() {
    this.cars.push(
      new Car(red_car_image, { x: this.x + this.width / 5, y: -30 }, this.next_car_speed.next().value));
  }

  update() {
    this.cars.forEach((car, car_index) => {
      car.move({ x: 0, y: 1 });
      if (car.y > height - 10) this.cars.splice(car_index, 1);
    })
  }

  draw() {
    setLineDash([5, 10, 30, 10]); // dashed line pattern
    stroke('rgb(226,189,0)');
    line(this.x, 0, this.x, height);
    line(this.x + this.width, 0, this.x + this.width, height);
    setLineDash([]);
    this.cars.forEach((car, car_index) => {
      car.draw();
    });
  }
}