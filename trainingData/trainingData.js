const Jimp = require("jimp");
const colors = require("../colors");

module.exports = {
  getTraningCoords: function () {
    return new Promise((resolve, reject) => {
      let trainingCoords = {
        land: [],
        water: [],
        depthLine: [],
        depthNumber: [],
      };

      Jimp.read("./trainingData/training_all.png", async (err, landImg) => {
        if (err) return reject(err);

        for (let a = 5; a < landImg.bitmap.width - 5; a++) {
          for (let b = 5; b < landImg.bitmap.height - 5; b++) {
            let color = Jimp.intToRGBA(landImg.getPixelColor(a, b));

            if (colors.isRed(color)) {
              trainingCoords.land.push({
                type: "land",
                coords: [a, b],
              });
            }

            if (colors.isBlue(color)) {
              trainingCoords.water.push({
                coords: [a, b],
                type: "water",
              });
            }

            if (colors.isYellow(color)) {
              trainingCoords.depthLine.push({
                coords: [a, b],
                type: "depthLine",
              });
            }

            if (colors.isLightBlue(color)) {
              trainingCoords.depthNumber.push({
                coords: [a, b],
                type: "depthNumber",
              });
            }
          }
        }

        resolve(trainingCoords);
      });
    });
  },
  getBaseImg: function () {
    return new Promise((resolve, reject) => {
      Jimp.read("./trainingData/training_base.png", (err, baseImg) => {
        if (err) return reject(err);
        resolve(baseImg);
      });
    });
  },
  get_random_training_data: function (trainingCoords) {
    let shallowLength = Object.keys(trainingCoords).length;
    let randomShallowIndex = Object.keys(trainingCoords)[Math.floor(Math.random() * shallowLength)];

    let deepLength = trainingCoords[randomShallowIndex].length;
    let randomDeepIndex = Math.floor(Math.random() * deepLength);

    let randomCoord = trainingCoords[randomShallowIndex][randomDeepIndex];
    return randomCoord;
  },

  getExpectedResult: function (coordType) {
    switch (coordType) {
      case "land":
        return [0, 1, 0, 0];
      case "water":
        return [1, 0, 0, 0];
      case "depthLine":
        return [1, 0, 1, 0];
      case "depthNumber":
        return [1, 0, 0, 1];
    }
  },

  findBasePixelValues: function (trainingCoords, baseImg) {
    return new Promise((resolve) => {
      let m2m2 = baseImg.getPixelColor(trainingCoords.coords[0] - 2, trainingCoords.coords[1] - 2);
      let zm2 = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1] - 2);
      let p2m2 = baseImg.getPixelColor(trainingCoords.coords[0] + 2, trainingCoords.coords[1] - 2);
      let m1m1 = baseImg.getPixelColor(trainingCoords.coords[0] - 1, trainingCoords.coords[1] - 1);
      let zm1 = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1] - 1);
      let p1m1 = baseImg.getPixelColor(trainingCoords.coords[0] + 1, trainingCoords.coords[1] - 1);
      let m2z = baseImg.getPixelColor(trainingCoords.coords[0] - 2, trainingCoords.coords[1]);
      let m1z = baseImg.getPixelColor(trainingCoords.coords[0] - 1, trainingCoords.coords[1]);
      let zz = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1]);
      let p1z = baseImg.getPixelColor(trainingCoords.coords[0] + 1, trainingCoords.coords[1]);
      let p2z = baseImg.getPixelColor(trainingCoords.coords[0] + 2, trainingCoords.coords[1]);
      let m1p1 = baseImg.getPixelColor(trainingCoords.coords[0] - 1, trainingCoords.coords[1] + 1);
      let zp1 = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1] + 1);
      let p1p1 = baseImg.getPixelColor(trainingCoords.coords[0] + 1, trainingCoords.coords[1] + 1);
      let m2p2 = baseImg.getPixelColor(trainingCoords.coords[0] - 2, trainingCoords.coords[1] + 2);
      let zp2 = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1] + 2);
      let p2p2 = baseImg.getPixelColor(trainingCoords.coords[0] + 2, trainingCoords.coords[1] + 2);

      let m2m2Color = Jimp.intToRGBA(m2m2);
      let zm2Color = Jimp.intToRGBA(zm2);
      let p2m2Color = Jimp.intToRGBA(p2m2);
      let m1m1Color = Jimp.intToRGBA(m1m1);
      let zm1Color = Jimp.intToRGBA(zm1);
      let p1m1Color = Jimp.intToRGBA(p1m1);
      let m2zColor = Jimp.intToRGBA(m2z);
      let m1zColor = Jimp.intToRGBA(m1z);
      let zzColor = Jimp.intToRGBA(zz);
      let p1zColor = Jimp.intToRGBA(p1z);
      let p2zColor = Jimp.intToRGBA(p2z);
      let m1p1Color = Jimp.intToRGBA(m1p1);
      let zp1Color = Jimp.intToRGBA(zp1);
      let p1p1Color = Jimp.intToRGBA(p1p1);
      let m2p2Color = Jimp.intToRGBA(m2p2);
      let zp2Color = Jimp.intToRGBA(zp2);
      let p2p2Color = Jimp.intToRGBA(p2p2);

      let basePixelValues = [];
      basePixelValues.push(m2m2Color.r);
      basePixelValues.push(m2m2Color.g);
      basePixelValues.push(m2m2Color.b);
      basePixelValues.push(zm2Color.r);
      basePixelValues.push(zm2Color.g);
      basePixelValues.push(zm2Color.b);
      basePixelValues.push(p2m2Color.r);
      basePixelValues.push(p2m2Color.g);
      basePixelValues.push(p2m2Color.b);
      basePixelValues.push(m1m1Color.r);
      basePixelValues.push(m1m1Color.g);
      basePixelValues.push(m1m1Color.b);
      basePixelValues.push(zm1Color.r);
      basePixelValues.push(zm1Color.g);
      basePixelValues.push(zm1Color.b);
      basePixelValues.push(p1m1Color.r);
      basePixelValues.push(p1m1Color.g);
      basePixelValues.push(p1m1Color.b);
      basePixelValues.push(m2zColor.r);
      basePixelValues.push(m2zColor.g);
      basePixelValues.push(m2zColor.b);
      basePixelValues.push(m1zColor.r);
      basePixelValues.push(m1zColor.g);
      basePixelValues.push(m1zColor.b);
      basePixelValues.push(zzColor.r);
      basePixelValues.push(zzColor.g);
      basePixelValues.push(zzColor.b);
      basePixelValues.push(p1zColor.r);
      basePixelValues.push(p1zColor.g);
      basePixelValues.push(p1zColor.b);
      basePixelValues.push(p2zColor.r);
      basePixelValues.push(p2zColor.g);
      basePixelValues.push(p2zColor.b);
      basePixelValues.push(m1p1Color.r);
      basePixelValues.push(m1p1Color.g);
      basePixelValues.push(m1p1Color.b);
      basePixelValues.push(zp1Color.r);
      basePixelValues.push(zp1Color.g);
      basePixelValues.push(zp1Color.b);
      basePixelValues.push(p1p1Color.r);
      basePixelValues.push(p1p1Color.g);
      basePixelValues.push(p1p1Color.b);
      basePixelValues.push(m2p2Color.r);
      basePixelValues.push(m2p2Color.g);
      basePixelValues.push(m2p2Color.b);
      basePixelValues.push(zp2Color.r);
      basePixelValues.push(zp2Color.g);
      basePixelValues.push(zp2Color.b);
      basePixelValues.push(p2p2Color.r);
      basePixelValues.push(p2p2Color.g);
      basePixelValues.push(p2p2Color.b);

      resolve(basePixelValues);
    });
  },
};
