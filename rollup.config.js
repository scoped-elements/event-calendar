import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const from = `function getElementWithPayload(x, y) {
    for (let el of document.elementsFromPoint(x, y)) {
        if (hasPayload(el)) {
            return el;
        }
    }
    return null;
}`;
const to = `function getElementWithPayload(x, y, root = document) {
  for (let el of root.elementsFromPoint(x, y)) {
    if (el.shadowRoot) return getElementWithPayload(x, y, el.shadowRoot);
    else if (hasPayload(el)) {
      return el;
    }
  }
  return null;
}`;

export default {
  input: `src/index.ts`,
  output: [{ dir: 'dist', format: 'es', sourcemap: true }],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash-es')
  external: [/lit/],
  watch: {
    include: 'src/**',
  },
  plugins: [
    replace({
      [from]: to,
      delimiters: ['', ''],
    }),
    postcss({
      inject: false,
    }),
    postcssLit({
      importPackage: 'lit',
    }),
    typescript({
      target: 'es6',
    }),
    resolve(),
    commonjs({}),
  ],
};
