import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import beep from '@rollup/plugin-beep';
import replace from '@rollup/plugin-replace';
import closure from '@ampproject/rollup-plugin-closure-compiler';
import esbuild from 'rollup-plugin-esbuild';
import progress from 'rollup-plugin-progress';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import packageJson from './package.json';

export default {
  banner: '#!/usr/bin/env node',
  input: 'src/bin/index.ts',
  output: [
    { file: 'dist/bundle.js', format: 'es' },
    { file: 'dist/bundle.cjs', format: 'cjs' }
  ],
  external: (({ dependencies = {}, peerDependencies = {}, devDependencies = {} }) => {
    const externals = [...Object.keys(dependencies), ...Object.keys(peerDependencies), ...Object.keys(devDependencies)];
    const externalsMap = new Map(externals.map(key => [key, key]));

    return id => externalsMap.has(id) || Boolean(externals.find(key => id.startsWith(`${key}/`)));
  })(packageJson),
  plugins: [
    beep(),
    progress({ clearLine: true }),
    json(),
    replace({
      preventAssignment: true,
      delimiters: ['', ''],
      '#!/usr/bin/env node': ''
    }),
    esbuild({
      include: /\.ts$/,
      exclude: /node_modules/,
      sourceMap: false,
      minify: true,
      target: 'es2019' // default, or 'es20XX', 'esnext'
    }),
    closure(), // optional
    commonjs({ include: /\/node_modules\//, sourceMaps: false }),
    nodeResolve({
      extensions: ['.js', '.ts'],
      preferBuiltins: true,
      browser: false
    }),
    globals(),
    builtins()
  ]
};
