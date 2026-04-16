module.exports = function(api) {
  api.cache(true);

  const plugins = ['@babel/plugin-transform-runtime'];
  const presets = ['@babel/preset-env', '@babel/preset-typescript'];

  return { plugins, presets };
};
