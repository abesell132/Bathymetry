const tf = require("@tensorflow/tfjs-node-gpu");

let model = tf.sequential();

let hidden = tf.layers.dense({
  units: 10,
  activation: "sigmoid",
  inputDim: 51,
});
let output = tf.layers.dense({
  units: 4,
  activation: "softmax",
});

model.add(hidden);
model.add(output);
