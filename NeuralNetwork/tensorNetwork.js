const tf = require("@tensorflow/tfjs-node-gpu");
const fs = require("fs");

let labelList = ["land", "water", "depthLine", "depthNumber"];

let trainingData = JSON.parse(fs.readFileSync("../trainingData/trainingData.json"));

let colors = [];
let labels = [];
for (let record of trainingData.values) {
  colors.push(record.inputs);
  labels.push(labelList.indexOf(record.outputs));
}

let xs = tf.tensor2d(colors);
let labelsTensor = tf.tensor1d(labels, "int32");

let ys = tf.oneHot(labelsTensor, 4).cast("float32");
labelsTensor.dispose();

let model = tf.sequential();
const hidden = tf.layers.dense({
  units: 15,
  inputShape: [51],
  activation: "sigmoid",
});

const output = tf.layers.dense({
  units: 4,
  activation: "softmax",
});
model.add(hidden);
model.add(output);

const LEARNING_RATE = 0.25;
const optimizer = tf.train.sgd(LEARNING_RATE);

model.compile({
  optimizer: optimizer,
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

let isTraining = false;

train();

async function train() {
  if (isTraining) {
    return;
  }
  isTraining = true;
  // This is leaking https://github.com/tensorflow/tfjs/issues/457
  await model.fit(xs, ys, {
    shuffle: true,
    validationSplit: 0.1,
    epochs: 10,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(epoch);
        lossY.push(logs.val_loss.toFixed(2));
        accY.push(logs.val_acc.toFixed(2));
        lossX.push(lossX.length + 1);
        lossP.html("Loss: " + logs.loss.toFixed(5));
      },
      onBatchEnd: async (batch, logs) => {
        await tf.nextFrame();
      },
      onTrainEnd: () => {
        istraining = false;
        console.log("finished");
      },
    },
  });
}

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

// const fs = require("fs");

// class TensorNetwork {
//   constructor(inputs, targets) {
//     this.inputs = inputs;
//     this.targets = targets;

//     let file = fs.readFileSync("../trainingData/trainingData.json");
//     this.trainingData = JSON.parse(file);
//     console.log(this.trainingData);
//   }
// }

// module.exports = TensorNetwork;
