import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'firebase/app',
  'firebase/firestore',
  'firebase/auth',
  'firebase/analytics',
];

export default [
  {
    input: 'src/index.ts',
    external,
    output: [
      { file: pkg.main, format: 'cjs', inlineDynamicImports: true, exports: 'default' },
      { file: pkg.module, format: 'es', inlineDynamicImports: true },
    ],
    plugins: [resolve({ extensions }), typescript()],
  },
];
