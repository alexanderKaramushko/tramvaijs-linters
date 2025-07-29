// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-bitwise */
// eslint-disable-next-line import/no-unresolved
const { ESLintUtils } = require('@typescript-eslint/utils');
const ts = require('typescript');
const tsutils = require('ts-api-utils');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Checks a value of the enabled-flag for query-functions to be explicitly converted to boolean',
      recommended: 'warn',
      url: `https://github.com/Tinkoff/linters/tree/master/packages/docs/boolean-enabled.mdx`,
    },
    messages: {
      conversionRequired:
        'A value must must be explicitly converted to boolean via !! or Boolean or use only boolean type',
    },
    fixable: 'code',
  },
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);

    return {
      CallExpression: (node) => {
        if (
          node.callee.type === 'Identifier' &&
          node.arguments.length > 0 &&
          (node.callee.name.endsWith('Query') ||
            node.callee.name.endsWith('query'))
        ) {
          const [firstArg] = node.arguments;

          if (firstArg.type === 'ObjectExpression') {
            const enabledProperty = firstArg.properties.find(
              ({ type, key }) =>
                type === 'Property' &&
                key.type === 'Identifier' &&
                key.name === 'enabled'
            );

            const type = parserServices.getTypeAtLocation(enabledProperty);

            const hasUndefined = !!type.types?.some(
              ({ flags }) => flags & ts.TypeFlags.Undefined
            );

            if (
              tsutils.isTypeFlagSet(
                type,
                ts.TypeFlags.Null |
                  ts.TypeFlags.Undefined |
                  ts.TypeFlags.VoidLike |
                  ts.TypeFlags.StringLike |
                  ts.TypeFlags.NumberLike |
                  ts.TypeFlags.BigIntLike |
                  ts.TypeFlags.TypeParameter |
                  ts.TypeFlags.Any |
                  ts.TypeFlags.Unknown |
                  ts.TypeFlags.Never
              ) ||
              (tsutils.isUnionType(type) && hasUndefined)
            ) {
              context.report({
                messageId: 'conversionRequired',
                node,
                *fix(fixer) {
                  if (enabledProperty.key.name === enabledProperty.value.name) {
                    return;
                  }

                  yield fixer.insertTextBefore(
                    enabledProperty.value,
                    'Boolean('
                  );

                  yield fixer.insertTextAfter(enabledProperty.value, ')');
                },
              });
            }
          }
        }
      },
    };
  },
};
