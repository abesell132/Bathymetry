const training = require("./trainingData/trainingData");
const NeuralNetwork = require("./NeuralNetwork/index");

async function start() {
  try {
    let trainingCoords = await training.getTraningCoords();
    let baseImg = await training.getBaseImg();

    let trainingData = { values: [] };
    for (let a = 0; a < 10000; a++) {
      let trainingCoord = await training.get_random_training_data(trainingCoords);
      let trainingPixelValues = await training.createTrainingDataPoint(trainingCoord, baseImg);

      trainingData.values.push({
        inputs: trainingPixelValues,
        outputs: trainingCoord.type,
      });
    }

    let model = await NeuralNetwork.createModel();
    let cleanTrainingData = await NeuralNetwork.parseTrainingData(trainingData);
    await NeuralNetwork.trainModel(model, cleanTrainingData);
  } catch (e) {
    console.log(e);
  }
}

start();
