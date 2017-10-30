# personalized-pagerank-js
A Javascript package for computing personalized pagerank.
[![Build Status](https://travis-ci.org/jaejaejae/personalized-pagerank-js.svg?branch=master)](https://travis-ci.org/jaejaejae/personalized-pagerank-js)
[![Coverage Status](https://coveralls.io/repos/github/jaejaejae/personalized-pagerank-js/badge.svg?branch=master)](https://coveralls.io/github/jaejaejae/personalized-pagerank-js?branch=master)
=========

A small library that adds commas to numbers

## Installation

  `npm install personalized-pagerank-js`

## Usage

    var pagerank = require('personalized-pagerank-js');

    var scores = pagerank(adjacencyMatrix, dampingFactor, personalizedScore, error, maxIterations);
  
  Output should be pagerank score of all the adjacency matrix.

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.