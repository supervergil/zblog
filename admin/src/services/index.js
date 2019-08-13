const context = require.context("./", false, /\.js$/);
const services = context
  .keys()
  .filter(key => key !== "./index.js")
  .reduce(
    (result, key) => ({
      ...result,
      [key.match(/([^/]+)\.js$/)[1]]: context(key).default
    }),
    {}
  );

export default services;
