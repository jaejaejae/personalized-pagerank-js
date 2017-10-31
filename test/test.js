'use strict';

var expect = require('chai').expect;
var assert = require('chai').assert;
var personalizedPageRank = require('../index');

function checkFloatArray(ls, expectedLs, delta) {
  assert(ls.length == expectedLs.length);
  for (let i = 0; i < ls.length; ++i) {
    expect(ls[i])
      .to
      .be
      .closeTo(expectedLs[i], delta);
  }
}

function checkSumArray(ls, expectedSum, delta) {
  let sum = 0;
  for (let l of ls) {
    sum += l;
  }
  expect(sum)
    .to
    .be
    .closeTo(expectedSum, delta);
}

describe('#personalizedPageRank', function () {
  var cyclicGraph;
  var connectedGraph;
  var danglingGraph;
  const threshold = 0.01;

  before(function () {
    /**
     * Adjacency Matrix Declaration
     * */
    // cyclicGraph = [   [     0, 1, 0   ],   [     0, 0, 1   ],   [1, 0, 0] ];
    // connectedGraph = [   [     0, 1, 0, 1   ],   [ 0, 0, 0, 1   ],   [     1, 0,
    // 0, 0   ],   [0, 0, 1, 0] ]; danglingGraph = [ [ 0, 1, 0, 0   ],   [     0, 0,
    // 1, 0   ],   [     1, 0, 0, 1   ],   [0, 0, 0, 0] ];

    /**
     * Adjacency List Declaration
     */
    cyclicGraph = [[1], [2], [0]
    ];
    connectedGraph = [
      [
        1, 3
      ],
      [3],
      [0],
      [2]
    ];
    danglingGraph = [
      [1],
      [2],
      [
        0, 3
      ],
      [] // This is a dangling node.
    ];
  });

  describe('pagerank validation', function () {
    it('should normalise the personalised vector to 1', function () {
      var personalisedVector = {
        0: 1.0,
        1: 1.0,
        2: 2.0
      };
      var normalizedPersonalisedVector = {
        0: 0.25,
        1: 0.25,
        2: 0.5
      };
      var scores = personalizedPageRank(cyclicGraph, 0.85, personalisedVector, 2, 0.5);
      expect(personalisedVector)
        .to
        .deep
        .equal(normalizedPersonalisedVector);
    });

    it('should not allow invalid out-of-index adjacency list', function () {
      expect(() => personalizedPageRank([
        [1]
      ], 0.85))
        .to
        .throw();
    });

    it('should not allow invalid out-of-index preference vector', function () {
      expect(() => personalizedPageRank([[1], [0]
      ], 0.85, {2: 0.8}))
        .to
        .throw();
    });

    it('should only allow damping factor to be 0 from 1', function () {
      expect(() => personalizedPageRank(cyclicGraph, -0.1))
        .to
        .throw();
      expect(() => personalizedPageRank(cyclicGraph, 1.1))
        .to
        .throw();
    });

    it('should only allow positive integer maximum number of iterations', function () {
      expect(() => personalizedPageRank(cyclicGraph, 0.85, undefined, 1.1))
        .to
        .throw();
      expect(() => personalizedPageRank(cyclicGraph, 0.85, undefined, -2))
        .to
        .throw();
    });
  });

  describe('pagerank without personalization', function () {
    it('should give equal score on cyclic graph', function () {
      const scores = personalizedPageRank(cyclicGraph, 0.85, undefined, 200, threshold, undefined);
      const totalNodes = cyclicGraph.length;
      const expectedScores = new Array(totalNodes).fill(1.0 / totalNodes);
      checkSumArray(scores, 1, threshold * 10);
      checkFloatArray(scores, expectedScores, threshold * 10);
    });

    it('should give correct PageRank values in the normal graph', function () {
      const scores = personalizedPageRank(connectedGraph, 0.85, undefined, 100, threshold, undefined);
      const expectedScores = [0.27643143604609594, 0.153577084051318, 0.28239539717581963, 0.28759608272676634];
      checkSumArray(scores, 1, threshold * 10);
      checkFloatArray(scores, expectedScores, threshold * 10);
    });

    it('should be able to deal with dangling nodes', function () {
      const scores = personalizedPageRank(danglingGraph, 0.85, undefined, 100, threshold * 0.1, undefined);
      const expectedScores = [0.21370906701224518, 0.2645985423017749, 0.30798332367373477, 0.21370906701224518];
      checkSumArray(scores, 1, threshold * 10);
      checkFloatArray(scores, expectedScores, threshold * 10);
    });
  });

  describe('pagerank with personalization', function () {
    it('should give equal score on cyclic graph', function () {
      const personalised = {
        0: 0.8,
        1: 0.1,
        2: 0.1
      };
      const scores = personalizedPageRank(cyclicGraph, 0.85, personalised, 200, threshold, undefined);
      const totalNodes = cyclicGraph.length;
      const expectedScores = [0.3664730256020338, 0.33158913900340176, 0.3019378353945645];
      checkSumArray(scores, 1, threshold * 10);
      checkFloatArray(scores, expectedScores, threshold * 10);
    });

    it('should give correct PageRank values in the normal graph', function () {
      const personalised = {
        0: 0.8,
        1: 0.1,
        2: 0.1
      };
      const scores = personalizedPageRank(connectedGraph, 0.85, personalised, 200, threshold, undefined);
      const totalNodes = cyclicGraph.length;
      const expectedScores = [0.32233111368965606, 0.1531815533614323, 0.2508555395130727, 0.27363179343583904];
      checkSumArray(scores, 1, threshold * 10);
      checkFloatArray(scores, expectedScores, threshold * 10);
    });

    it('should be able to deal with dangling nodes', function () {
      const personalised = {
        0: 0.8,
        1: 0.1,
        2: 0.1
      };
      const scores = personalizedPageRank(danglingGraph, 0.85, personalised, 200, threshold, undefined);
      const totalNodes = cyclicGraph.length;
      const expectedScores = [0.2663339437160614, 0.2792345393049101, 0.29146215683406046, 0.16296936014496802];
      checkSumArray(scores, 1, threshold * 10);
      checkFloatArray(scores, expectedScores, threshold * 10);
    });
  });
});