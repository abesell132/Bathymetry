const math = require("mathjs");

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.lastIndex = function () {
  return this.length - 1;
};

class NeuralNetwork {
  constructor(input_layer_size, hidden_layer_sizes, output_layer_size) {
    this.inputNodeCount = input_layer_size;
    this.hiddenNodeCounts = hidden_layer_sizes;
    this.outputNodeCount = output_layer_size;

    this.hiddenWeights = [];
    this.hiddenBiases = [];
    for (let a = 0; a < this.hiddenNodeCounts.length; a++) {
      if (a == 0) {
        this.hiddenWeights.push(math.ones(this.hiddenNodeCounts[a], this.inputNodeCount));
      } else {
        this.hiddenWeights.push(math.ones(this.hiddenNodeCounts[a], this.hiddenNodeCounts[a - 1]));
      }
      this.hiddenBiases.push(math.ones(this.hiddenNodeCounts[a], 1));
    }

    this.outputWeights = math.ones(this.outputNodeCount, this.hiddenNodeCounts[this.hiddenNodeCounts.lastIndex()]);
    this.outputBias = math.ones(this.outputNodeCount, 1);
  }

  log() {
    console.log("Input Nodes: " + this.inputNodeCount);
    console.log("Output Nodes: " + this.outputNodeCount);

    console.table("Hidden Weights: " + this.hiddenWeights);
    console.log("Output Weights: " + this.outputWeights);
  }

  predict(inputs) {
    inputs = inputs.map((el) => [el]);

    let hiddenResult = this.get_hidden_layer_results(inputs);
    let outputResult = this.get_output_layer_result(hiddenResult);

    return outputResult;
  }

  train(inputs, targets) {
    inputs = inputs.map((el) => [el]); //
    targets = targets.map((el) => [el]); //

    let hiddenResults = this.get_hidden_layer_results(inputs); //
    let outputResult = this.get_output_layer_result(hiddenResults.last());

    // Calculate the output layer error
    let outputErrors = math.subtract(targets, outputResult); //
    let outputGradients = this.get_output_gradient(outputResult, outputErrors); //

    let transposedHiddenResults = []; //
    let transposedHiddenWeights = []; //
    for (let a = 0; a < hiddenResults.length; a++) {
      transposedHiddenWeights.push(math.transpose(this.hiddenWeights[a])); //
      transposedHiddenResults.push(math.transpose(hiddenResults[a])); //
    }
    let outputWeightDeltas = math.multiply(outputGradients, transposedHiddenResults.last()); //

    // Adjust output weights and bias
    this.outputWeights = math.add(this.outputWeights, outputWeightDeltas);
    this.outputBias = math.add(this.outputBias, outputGradients);

    // Calculate the hidden layer error
    if (outputErrors._data.length == 1) outputErrors = outputErrors._data[0];

    for (let a = hiddenResults.length - 1; a >= 0; a--) {
      let hiddenLayerError;
      if (a == hiddenResults.length - 1) {
        hiddenLayerError = math.multiply(transposedHiddenWeights[a], toScalar(outputErrors)); //
      } else {
        hiddenLayerError = math.multiply(transposedHiddenWeights[a], toScalar(transposedHiddenWeights[a + 1])); //
      }

      let prevLayerTransposed;
      if (a == 0) {
        prevLayerTransposed = math.transpose(inputs);
      } else {
        prevLayerTransposed = math.transpose(hiddenResults[a - 1]);
      }

      let layerWeightDeltas = math.multiply(layerBiasGradient, prevLayerTransposed);

      let layerBiasDelta = hiddenResult.map(dsigmoid); //
      layerBiasDelta = math.multiply(hiddenLayerError, layerBiasDelta); //
      layerBiasDelta = math.multiply(layerBiasDelta, this.learningRate); //

      this.hiddenWeights[a] = math.add(this.hiddenWeights[a], layerWeightDeltas);
      this.hiddenBiases[a] = math.add(this.hiddenBiases[a], layerBiasGradient);
    }
  }

  get_hidden_layer_results(inputs) {
    let layerResults = [];

    for (let a = 0; a < this.hiddenNodeCounts.length; a++) {
      let layerResult;
      if (a == 0) {
        console.log(a);
        layerResult = math.multiply(this.hiddenWeights[a], inputs);
      } else {
        layerResult = math.multiply(this.hiddenWeights[a], this.hiddenWeights[a - 1]);
      }

      console.log(layerResult);
      layerResult = math.add(layerResult, this.hiddenBiases[a]);
      layerResult = layerResult.map((value) => sigmoid(value));
      layerResults.push(layerResult);
    }
    return layerResults;
  }

  get_output_layer_result(hiddenResult) {
    let outputResult = math.multiply(this.outputWeights, hiddenResult);
    outputResult = math.add(outputResult, this.outputBias);
    outputResult = outputResult.map((value) => sigmoid(value));
    return outputResult;
  }

  get_output_gradient(outputResult, outputErrors) {
    let outputGradients = outputResult.map(dsigmoid);
    outputGradients = math.multiply(outputGradients, outputErrors);
    outputGradients = math.multiply(outputGradients, this.learningRate);
    return outputGradients;
  }
}

module.exports = NeuralNetwork;

const sigmoid = (t) => 1 / (1 + Math.pow(Math.E, -t));
const dsigmoid = (x) => x * (1 - x);
const toScalar = (arr) => arr[0];
