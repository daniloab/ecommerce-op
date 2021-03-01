const config = require('@eop/babel');

const { createTransformer } = require('babel-jest');

module.exports = createTransformer({
  ...config,
});
