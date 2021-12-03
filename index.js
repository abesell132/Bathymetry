const training = require("./trainingData/trainingData");
const NeuralNetwork = require("./NeuralNetwork");

async function start() {
  try {
    let trainingCoords = await training.getTraningCoords();
    let baseImg = await training.getBaseImg();
    let nn = new NeuralNetwork(51, [27, 13], 4);

    let trainingCoord = await training.get_random_training_data(trainingCoords);
    let trainingPixelValues = await training.findBasePixelValues(trainingCoord, baseImg);
    let expectedResult = await training.getExpectedResult(trainingCoord.type);

    await console.time("Training");

    await nn.train(trainingPixelValues, expectedResult);
    await console.timeEnd("Training");
  } catch (e) {
    console.log(e);
  }
}

start();
