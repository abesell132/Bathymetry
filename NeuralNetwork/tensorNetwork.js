const tf = require("@tensorflow/tfjs-node-gpu");

// let model = tf.sequential();

// let hidden = tf.layers.dense({
//   units: 10,
//   activation: "sigmoid",
//   inputDim: 51,
// });
// let output = tf.layers.dense({
//   units: 4,
//   activation: "softmax",
// });

// model.add(hidden);
// model.add(output);

const fs = require("fs")

class TensorNetwork {
  constructor(inputs, targets) {
    this.inputs = inputs;
    this.targets = targets;

    let file = fs.readFileSync("../trainingData/trainingData.json")
    this.trainingData = JSON.parse(file);
    console.log(this.trainingData)
  }
}

module.exports = TensorNetwork;
