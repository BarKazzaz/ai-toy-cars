tf.setBackend('cpu');
let generation_number = 1;
let cars, next_cars;
let lane;
const lane_positions = [0, 80, 160, 240, 320,];
const num_cars = 50;
const car_positions = [];
for (let i = 0; i < num_cars; i++) { car_positions.push(150); }
let lanes;
let collision = false;
let brain;
let count = 300;
let difficulity = 0;
let current_frame = 0;
let lvl;
const FRAME_RATE = 30;
let green_car_image;
let red_car_image;
let slider;
const update_speeds = [1, 2, 3, 5, 6, 10, 15];
let last_update_speed;

function preload() {
  green_car_image = loadImage('images/green.png');
  red_car_image = loadImage('images/red_rotated.png');
}

function setup() {
  frameRate(FRAME_RATE);
  createCanvas(400, 400);
  slider = createSlider(0, 6, 0, 1);
  last_update_speed = 1;
  slider.position(10, 10);
  slider.style('width', '80px');
  cars = car_positions.map(g => new Car(green_car_image, { x: g, y: height - 100 }, 1, true));
  next_cars = [];
  cars.forEach(car => {
    car.brain = new CarBrain(car);
  })
  lanes = lane_positions.map(position => new Lane(position));
  lvl = lvl1.slice(); // copy level
}

function draw() {
  background(80);
  const update_speed = update_speeds[slider.value()];
  if (update_speed !== last_update_speed) {
    current_frame = 0;
    last_update_speed = update_speed;
  }
  for (let i = 0; i < update_speed; i++) {
    lanes.forEach(
      lane => {
        lane.update();
        cars.forEach((car, i) => {
          car.calcSensorsDistanceToObject(lane.cars);
          car.brain.controlCar(car);
          lane.cars.forEach(other_car => {
            if (car.isColiding(other_car)) carDied(i);
          })
          if (car.x + car.width >= width || car.x <= 0 || car.y + car.height > height || car.y < 0) {
            carDied(i);
          }
        })
      })
  }

  current_frame += update_speed;

  lanes.forEach(l => l.draw());
  cars.forEach(car => car.draw());

  if (cars.length === 0) {
    generateNextCars();
    generation_number++;
    document.getElementById('gen-num').innerText = generation_number.toString();
    restartLevel(lvl1);
  }

  if (current_frame % 30 === 0) {
    const next_lanes = getNextLanesFromLevel(lvl);
    next_lanes.forEach(lane_index => lanes[lane_index].addCar());
    current_frame = 0;
  }
  document.getElementById('update-speed').innerText = update_speed.toString();
  cars.forEach(car => car.brain.iq++);
}


function generateNextCars() {
  tf.tidy(() => {
    cars = car_positions.map(g => new Car(green_car_image, { x: g, y: height - 100 }, 1, true));
    const best_brain = next_cars.reduce((prev, cur) => prev.brain.iq > cur.brain.iq ? prev : cur).brain;
    cars.forEach(car => {
      const mutated_weights = best_brain.mutate(0.1);
      car.brain = new CarBrain(car);
      car.brain.setWeights(mutated_weights);
    })
    next_cars.forEach(c => c.brain.dispose());
    next_cars = [];
  })
}


function restartLevel(to_level) {
  lanes.forEach(lane => lane.cars = []);
  setTimeout(() => {
    lvl = to_level.slice();
  }, 3000)
}


function gameOver() {
  clear();
  textSize(32);
  fill('white')
  textAlign(CENTER, CENTER);
  text('Game Over', width / 2, height / 2);
}

function reverseString(s) {
  return s.toString().split('').reverse().join("");
}

function getNextLanesFromLevel(lvl) {
  if (lvl.length === 0)
    return [];
  const bn = reverseString(lvl.pop());
  const next_lanes = [];
  for (let i = 1; i <= 32; i *= 2) {
    if (Number.parseInt(bn, 2) & i)
      next_lanes.push(Math.log2(i));
  }
  return next_lanes;
}

function carDied(i) {
  next_cars.push(cars.splice(i, 1)[0]);
}

function keyPressed() {
  const car = cars[0];
  if (keyCode === LEFT_ARROW) {
    car.move({ x: -10, y: 0 });
  } else if (keyCode === RIGHT_ARROW) {
    car.move({ x: 10, y: 0 });
  } else if (keyCode === UP_ARROW) {
    car.move({ x: 0, y: -10 });
  } else if (keyCode === DOWN_ARROW) {
    car.move({ x: 0, y: 10 });
  }
}