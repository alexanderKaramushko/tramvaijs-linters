const fs = require('node:fs');
const path = require('node:path');

const { name, version } = fs.readFileSync(
  path.join(__dirname, './package.json'),
  'utf-8'
);

const plugin = {
  meta: {
    name,
    version,
  },
  configs: {},
  rules: {
    'boolean-enabled': require('./rules/boolean-enabled'),
  },
  processors: {},
};

plugin.configs = {
  ...plugin.configs,
  recommended: [
    {
      plugins: {
        query: plugin,
      },
      rules: {
        'boolean-enabled': 'error',
      },
    },
  ],
};

module.exports = plugin;
