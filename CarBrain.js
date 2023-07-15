const CAR_POSITION_ARGUMENTS = 2;
class CarBrain {
  constructor(car, weights) {
    this.car = car;
    this.score = 0;
    this.b = {};
    this.dir = { x: 1, y: 0 };
    const hidden_layer = tf.layers.dense({
      inputShape: [car.sensors.length + CAR_POSITION_ARGUMENTS],
      units: 32,
      activation: 'relu'
    });
    const out_layer = tf.layers.dense({ units: 4, activation: 'sigmoid' });
    const seq = tf.sequential({
      layers: [
        hidden_layer,
        out_layer,
      ]
    });
    this.model = seq;
    this.iq = 0;
  }

  dispose() {
    this.model.dispose();
  }

  setWeights(weights) {
    this.model.setWeights(weights);
  }

  mutate(rate) {
    return tf.tidy(() => {
      const weights = this.model.getWeights();
      const new_weights = [];
      weights.forEach((w, i) => {
        const shape = w.shape;
        let vals = w.dataSync();
        vals = vals.map(v => random(1) < rate ? v + randomGaussian() : v);
        new_weights[i] = tf.tensor(vals, shape);
      })
      return new_weights;
    })
  }

  predict() {
    return tf.tidy(() => {
      const input_layer = this.car.sensors.map(sens => sens.val / (width * height))
        .concat([this.car.x / width, this.car.y / height])
      const xs = tf.tensor2d([input_layer]);
      const ys = this.model.predict(xs);
      const prediction = ys.dataSync();
      return prediction;
    })
  }

  controlCar() {
    const prediction = this.predict();
    let direction;
    const PREDICTION_THRESH = 0.5;
    // UP
    if (prediction[0] > PREDICTION_THRESH)
      direction = { x: 0, y: -1 };
    // DOWN
    else if (prediction[1] > PREDICTION_THRESH)
      direction = { x: 0, y: 1 };
    // LEFT
    else if (prediction[2] > PREDICTION_THRESH)
      direction = { x: -1, y: 0 };
    // RIGHT
    else if (prediction[3] > PREDICTION_THRESH)
      direction = { x: 1, y: 0 };
    else
      direction = { x: 0, y: 0 };
    this.car.move(direction, 1 / 5);
  }
}