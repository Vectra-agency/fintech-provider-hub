import next from 'eslint-config-next';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...next,
  ...nextTs,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'docs/**', 'next-env.d.ts', 'functions/**', '.wrangler/**'],
  },
];

export default config;
