# personalized-pagerank-js
A Javascript package for computing personalized pagerank.
[![Build Status](https://travis-ci.org/jaejaejae/personalized-pagerank-js.svg?branch=master)](https://travis-ci.org/jaejaejae/personalized-pagerank-js)
[![Coverage Status](https://coveralls.io/repos/github/jaejaejae/personalized-pagerank-js/badge.svg?branch=master)](https://coveralls.io/github/jaejaejae/personalized-pagerank-js?branch=master)
=========

A library that computes personalised pagerank vector via power iteration.

## Installation

  `npm install personalized-pagerank-js`

## Usage

    var ppr = require('personalized-pagerank-js');

    var scores = ppr(adjacencyList, personalised, damping, maxIteration, threshold);
  
  Output should be pagerank score of all nodes.

## Tests

  `npm test`

## TO-do

* Support edge list input.

* Support more pagerank algorithms.

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.