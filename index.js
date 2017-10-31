'use strict';

/**
 * Computing PageRank
 * @param {list of lists of integers} adjacencyList
 * @param {dict} personalised A dictionary containing the personalised probability of the node. Not indicating means 0. The values are normalized to 1.
 * @param {number} damping The probability of following the links.
 * @param {integer} maxIteration The maximum number of iterations in running the algorithm to prevent the code from running forever.
 * @param {function} callback A callback function with parameter list of pagerank values.
 * @return {numbers} A list of PageRank scores of which sum is equal to 1.
 */
module.exports = function (adjacencyList, damping = 0.85, personalised = undefined, maxIteration = 1000, threshold = 0.001, callback = undefined) {
  var pagerank = getPageRank(adjacencyList, personalised, damping, maxIteration, threshold);
  if (callback) {
    callback(pagerank);
  }
  return pagerank;
};

const rangeGen = N => [...(function * () {
    let i = 0;
    while (i < N) 
      yield i++
    }
  )()];

function getPageRank(adjacencyList, personalised, damping, maxIteration, threshold) {
  validateInput(adjacencyList, personalised, damping, maxIteration, threshold);
  var iteration = 1;
  var totalNodes = adjacencyList.length;
  var pagerankScores = new Array(totalNodes).fill(1);
  var pagerankSum = 1.0 * totalNodes;
  const allNodes = rangeGen(totalNodes);
  while (iteration < maxIteration) {
    var error = 0.0;
    ++iteration;
    var newPagerankScores = new Array(totalNodes).fill(0);
    for (let u = 0; u < totalNodes; ++u) {
      if (personalised === undefined) {
        newPagerankScores[u] += (1 - damping) * 1.0 / totalNodes;
      } else if (u in personalised) {
        newPagerankScores[u] += (1 - damping) * personalised[u];
      }
      let neighbours = adjacencyList[u];
      if (neighbours.length == 0) {
        neighbours = allNodes;
      }
      for (let v of neighbours) {
        newPagerankScores[v] += 1.0 * damping * pagerankScores[u] / neighbours.length;
      }
    }
    pagerankSum = 0.0;
    for (let u = 0; u < totalNodes; ++u) {
      pagerankSum += newPagerankScores[u];
      error = Math.max(error, Math.abs(newPagerankScores[u] - pagerankScores[u]));
    }
    pagerankScores = newPagerankScores;
    if (error < threshold) {
      break;
    }
  }

  for (let u = 0; u < totalNodes; ++u) {
    pagerankScores[u] /= pagerankSum;
  }

  return pagerankScores;
}

function initPagerankScores(adjacencyList) {
  return new Array(adjacencyList.length).fill(1);
}

function validateInput(adjacencyList, personalised, damping, maxIteration, threshold) {
  if (maxIteration <= 0) {
    throw "The maximum number of iterations must be greater than 0";
  }
  if (!Number.isInteger(maxIteration)) {
    throw "The maximum number of iterations should be an integer";
  }
  if (threshold <= 0 || threshold >= 1) {
    throw "The error threshold must be between 0 and 1 (exclusive)."
  }
  if (damping < 0 || damping > 1) {
    throw "The damping factor must be between 0 and 1 (inclusive)."
  }

  var totalNodes = adjacencyList.length;
  for (let ls of adjacencyList) {
    for (let i of ls) {
      if (i < 0 || i >= totalNodes) {
        throw `The adjacencylist can only have nodes with index 0 to ${totalNodes - 1}.`
      }
    }
  }

  if (personalised) {
    var sumP = 0.0;
    for (let p of Object.keys(personalised)) {
      if (p < 0 || p >= totalNodes) {
        throw `The personalised node must be an integer from 0 to ${totalNodes - 1} not ${p}.`
      }
      sumP += personalised[p];
    }
    if (sumP > 1.0) {
      console.warn(`Summation of personalised vector (${sumP}) is greater than 1.`);
      for (let p of Object.keys(personalised)) {
        personalised[p] /= sumP;
      }
    }
  }
  return true;
}