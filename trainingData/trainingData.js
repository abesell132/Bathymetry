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

  createTrainingDataPoint: function (trainingCoords, baseImg) {
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

      let trainingDataPoint = {
        label: trainingCoords.label,
        m2m2ColorR: m2m2Color.r / 255,
        m2m2ColorG: m2m2Color.g / 255,
        m2m2ColorB: m2m2Color.b / 255,
        zm2ColorR: zm2Color.r / 255,
        zm2ColorG: zm2Color.g / 255,
        zm2ColorB: zm2Color.b / 255,
        p2m2ColorR: p2m2Color.r / 255,
        p2m2ColorG: p2m2Color.g / 255,
        p2m2ColorB: p2m2Color.b / 255,
        m1m1ColorR: m1m1Color.r / 255,
        m1m1ColorG: m1m1Color.g / 255,
        m1m1ColorB: m1m1Color.b / 255,
        zm1ColorR: zm1Color.r / 255,
        zm1ColorG: zm1Color.g / 255,
        zm1ColorB: zm1Color.b / 255,
        p1m1ColorR: p1m1Color.r / 255,
        p1m1ColorG: p1m1Color.g / 255,
        p1m1ColorB: p1m1Color.b / 255,
        m2zColorR: m2zColor.r / 255,
        m2zColorG: m2zColor.g / 255,
        m2zColorB: m2zColor.b / 255,
        m1zColorR: m1zColor.r / 255,
        m1zColorG: m1zColor.g / 255,
        m1zColorB: m1zColor.b / 255,
        zzColorR: zzColor.r / 255,
        zzColorG: zzColor.g / 255,
        zzColorB: zzColor.b / 255,
        p1zColorR: p1zColor.r / 255,
        p1zColorG: p1zColor.g / 255,
        p1zColorB: p1zColor.b / 255,
        p2zColorR: p2zColor.r / 255,
        p2zColorG: p2zColor.g / 255,
        p2zColorB: p2zColor.b / 255,
        m1p1ColorR: m1p1Color.r / 255,
        m1p1ColorG: m1p1Color.g / 255,
        m1p1ColorB: m1p1Color.b / 255,
        zp1ColorR: zp1Color.r / 255,
        zp1ColorG: zp1Color.g / 255,
        zp1ColorB: zp1Color.b / 255,
        p1p1ColorR: p1p1Color.r / 255,
        p1p1ColorG: p1p1Color.g / 255,
        p1p1ColorB: p1p1Color.b / 255,
        m2p2ColorR: m2p2Color.r / 255,
        m2p2ColorG: m2p2Color.g / 255,
        m2p2ColorB: m2p2Color.b / 255,
        zp2ColorR: zp2Color.r / 255,
        zp2ColorG: zp2Color.g / 255,
        zp2ColorB: zp2Color.b / 255,
        p2p2ColorR: p2p2Color.r / 255,
        p2p2ColorG: p2p2Color.g / 255,
        p2p2ColorB: p2p2Color.b / 255,
      };

      basePixelValues.push(zm2Color.g / 255);
      basePixelValues.push(zm2Color.b / 255);
      basePixelValues.push(p2m2Color.r / 255);
      basePixelValues.push(p2m2Color.g / 255);
      basePixelValues.push(p2m2Color.b / 255);
      basePixelValues.push(m1m1Color.r / 255);
      basePixelValues.push(m1m1Color.g / 255);
      basePixelValues.push(m1m1Color.b / 255);
      basePixelValues.push(zm1Color.r / 255);
      basePixelValues.push(zm1Color.g / 255);
      basePixelValues.push(zm1Color.b / 255);
      basePixelValues.push(p1m1Color.r / 255);
      basePixelValues.push(p1m1Color.g / 255);
      basePixelValues.push(p1m1Color.b / 255);
      basePixelValues.push(m2zColor.r / 255);
      basePixelValues.push(m2zColor.g / 255);
      basePixelValues.push(m2zColor.b / 255);
      basePixelValues.push(m1zColor.r / 255);
      basePixelValues.push(m1zColor.g / 255);
      basePixelValues.push(m1zColor.b / 255);
      basePixelValues.push(zzColor.r / 255);
      basePixelValues.push(zzColor.g / 255);
      basePixelValues.push(zzColor.b / 255);
      basePixelValues.push(p1zColor.r / 255);
      basePixelValues.push(p1zColor.g / 255);
      basePixelValues.push(p1zColor.b / 255);
      basePixelValues.push(p2zColor.r / 255);
      basePixelValues.push(p2zColor.g / 255);
      basePixelValues.push(p2zColor.b / 255);
      basePixelValues.push(m1p1Color.r / 255);
      basePixelValues.push(m1p1Color.g / 255);
      basePixelValues.push(m1p1Color.b / 255);
      basePixelValues.push(zp1Color.r / 255);
      basePixelValues.push(zp1Color.g / 255);
      basePixelValues.push(zp1Color.b / 255);
      basePixelValues.push(p1p1Color.r / 255);
      basePixelValues.push(p1p1Color.g / 255);
      basePixelValues.push(p1p1Color.b / 255);
      basePixelValues.push(m2p2Color.r / 255);
      basePixelValues.push(m2p2Color.g / 255);
      basePixelValues.push(m2p2Color.b / 255);
      basePixelValues.push(zp2Color.r / 255);
      basePixelValues.push(zp2Color.g / 255);
      basePixelValues.push(zp2Color.b / 255);
      basePixelValues.push(p2p2Color.r / 255);
      basePixelValues.push(p2p2Color.g / 255);
      basePixelValues.push(p2p2Color.b / 255);

      resolve(basePixelValues);
    });
  },
};
