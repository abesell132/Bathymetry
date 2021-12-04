const tf = require("@tensorflow/tfjs-node-gpu");
const TensorModel = require("./TensorModel");

let labelList = ["land", "water", "depthLine", "depthNumber"];

module.exports = NeuralNetwork = {
  isTrainng: false,

  createModel: function (LEARNING_RATE = 0.1) {
    const optimizer = tf.train.sgd(LEARNING_RATE);

    let model = tf.sequential();

    let hiddenLayer = tf.layers.dense({ units: 15, inputShape: [51], activation: "sigmoid" });
    let outputLayer = tf.layers.dense({ units: 4, activation: "softmax" });

    model.add(hiddenLayer);
    model.add(outputLayer);

    model.compile({
      optimizer: optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  },
  parseTrainingData: function (trainingData) {
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

    return { xs, ys };
  },
  trainModel: function (model, trainingData) {
    return new Promise((resolve) => {
      if (NeuralNetwork.isTraining) return;
      NeuralNetwork.isTraining = true;
      model.fit(trainingData.xs, trainingData.ys, {
        shuffle: true,
        validationSplit: 0.1,
        epochs: 10,
        callbacks: {
          onBatchEnd: async (batch, logs) => {
            await tf.nextFrame();
          },
          onTrainEnd: () => {
            NeuralNetwork.isTraining = false;
            resolve();
          },
        },
      });
    });
  },
};
