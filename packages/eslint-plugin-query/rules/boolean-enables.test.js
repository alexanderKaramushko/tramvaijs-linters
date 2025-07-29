const { RuleTester } = require('@typescript-eslint/rule-tester');
const booleanEnabled = require('./boolean-enabled');
const { normalizeIndent } = require('./test-utils');

const ruleTester = new RuleTester({
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    es6: true,
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
  },
});

ruleTester.run('boolean-enabled', booleanEnabled, {
  valid: [
    {
      code: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: true,
        })
      `,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        const isEnabled: boolean | undefined = undefined;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: !!isEnabled,
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        const isEnabled = (flag: boolean) => {
          if (flag) {
            return;
          }
          return true;
        };
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: !!isEnabled(),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        const isEnabled = (flag: boolean) => {
          if (flag) {
            return false;
          }
          return true;
        };
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: isEnabled(),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
  ],
  invalid: [
    {
      code: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: undefined,
        })
      `,
      output: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(undefined),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        let isEnabled;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: isEnabled,
        })
      `,
      output: normalizeIndent`
        let isEnabled;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(isEnabled),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        let isEnabled: boolean | undefined;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: isEnabled,
        })
      `,
      output: normalizeIndent`
        let isEnabled: boolean | undefined;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(isEnabled),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        let isEnabled = (flag: boolean) => {
          if (flag) {
            return true
          }
        };
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: isEnabled(),
        })
      `,
      output: normalizeIndent`
        let isEnabled = (flag: boolean) => {
          if (flag) {
            return true
          }
        };
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(isEnabled()),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        const isEnabled = (flag: boolean) => {
          if (flag) {
            return;
          }

          return true;
        };
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: isEnabled(),
        })
      `,
      output: normalizeIndent`
        const isEnabled = (flag: boolean) => {
          if (flag) {
            return;
          }

          return true;
        };
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(isEnabled()),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: '',
        })
      `,
      output: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(''),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: 0,
        })
      `,
      output: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(0),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: null,
        })
      `,
      output: normalizeIndent`
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(null),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        let enabled: any;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled,
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        let enabled: any;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: enabled as boolean | undefined,
        })
      `,
      output: normalizeIndent`
        let enabled: any;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(enabled as boolean | undefined),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        const obj: { enabled?: boolean } = { enabled: true };
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: obj.enabled,
        })
      `,
      output: normalizeIndent`
        const obj: { enabled?: boolean } = { enabled: true };
        const clientProfileQuery = useGetClientProfileQuery({
          enabled: Boolean(obj.enabled),
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
    {
      code: normalizeIndent`
        let enabled: boolean | null = null;
        const clientProfileQuery = useGetClientProfileQuery({
          enabled,
        })
      `,
      errors: 1,
      filename: `${__dirname}/file.ts`,
    },
  ],
});
