const training = require("./trainingData/trainingData");
const fs = require("fs");

async function start() {
  try {
    let trainingCoords = await training.getTraningCoords();
    let baseImg = await training.getBaseImg();

    let trainingData = { values: [] };
    for (let a = 0; a < 10000; a++) {
      let trainingCoord = await training.get_random_training_data(trainingCoords);
      let trainingPixelValues = await training.findBasePixelValues(trainingCoord, baseImg);

      trainingData.values.push({
        inputs: trainingPixelValues,
        outputs: trainingCoord.type,
      });
    }

    await fs.writeFile("./trainingData/trainingData.json", JSON.stringify(trainingData), function (err) {
      if (err) return console.log(err);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
