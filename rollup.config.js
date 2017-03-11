import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import svelte from 'rollup-plugin-svelte';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/main.js',
  dest: 'public/dist/main.js',
  format: 'es',
  plugins: [
    eslint({
      include: [
        './src/**/*.js',
      ],
    }),
    commonjs({
      include: 'src/js/AI.js',
    }),
    babel({
      include: ['./src/**/*.js'],
    }),
    svelte({
      include: 'src/components/**.html',
    }),
  ],
};
