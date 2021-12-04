// const tf = require("@tensorflow/tfjs-node-gpu");
// const TensorModel = require("./TensorModel");
// const fs = require("fs");

// let labelList = ["land", "water", "depthLine", "depthNumber"];

// let trainingData = JSON.parse(fs.readFileSync("../trainingData/trainingData.json"));

// let colors = [];
// let labels = [];
// for (let record of trainingData.values) {
//   colors.push(record.inputs);
//   labels.push(labelList.indexOf(record.outputs));
// }

// let xs = tf.tensor2d(colors);
// let labelsTensor = tf.tensor1d(labels, "int32");
// let ys = tf.oneHot(labelsTensor, 4).cast("float32");
// labelsTensor.dispose();

// let model = new TensorModel({ units: 15, inputShape: [51], activation: "sigmoid" }, { units: 4, activation: "softmax" });

// const LEARNING_RATE = 0.1;
// const optimizer = tf.train.sgd(LEARNING_RATE);

// model.compile({
//   optimizer: optimizer,
//   loss: "categoricalCrossentropy",
//   metrics: ["accuracy"],
// });

// let isTraining = false;
// train();

// async function train() {
//   if (isTraining) {
//     return;
//   }
//   isTraining = true;
//   // This is leaking https://github.com/tensorflow/tfjs/issues/457
//   await model.fit(xs, ys, {
//     shuffle: true,
//     validationSplit: 0.1,
//     epochs: 10,
//     callbacks: {
//       onEpochEnd: (epoch, logs) => {
//         console.log(epoch);
//       },
//       onBatchEnd: async (batch, logs) => {
//         await tf.nextFrame();
//       },
//       onTrainEnd: () => {
//         istraining = false;
//         console.log("finished");
//       },
//     },
//   });
// }
