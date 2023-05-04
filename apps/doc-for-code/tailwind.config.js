const tailwindcssPlugin = require('tailwindcss/plugin');
const lodash = require('lodash');

const theme = require('./config/theme.json');
const themeDynamic = require('./config/theme-dynamic.json');

const materialTheme = theme || themeDynamic;

const sizes = new Array(300)
  .fill(0)
  .map((_, i) => i)
  .reduce((all, cur) => ({ ...all, [cur]: `${cur}px` }));

const colors = {
  dark: {
    color: {
      primary: '#151111',
      secondary: '#000000',
      tertiary: '#000000',
    },
    bg: {
      primary: '#ffffff',
      secondary: '#ffffff',
      tertiary: '#ffffff',
    },
  },
  light: {
    color: {
      primary: '#ffffff',
      secondary: '#ffffff',
      tertiary: '#ffffff',
    },
    bg: {
      primary: '#000000',
      secondary: '#000000',
      tertiary: '#000000',
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-mode="dark"]'],
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: sizes,
      borderRadius: sizes,
      borderWidth: sizes,
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),

    tailwindcssPlugin(({ addUtilities }) => {
      Object.keys(colors.light.color).forEach(color => {
        addUtilities({
          [`.color-${color}`]: {
            color: colors.light.color[color],
          },
          [`.dark .color-${color}`]: {
            color: colors.dark.color[color],
          },
          [`.border-${color}`]: {
            color: colors.light.color[color],
          },
          [`.dark .border-${color}`]: {
            color: colors.dark.color[color],
          },
        });
      });
      Object.keys(colors.light.bg).forEach(color => {
        addUtilities({
          [`.bg-${color}`]: {
            backgroundColor: colors.light.bg[color],
          },
          [`.dark .bg-${color}`]: {
            backgroundColor: colors.dark.bg[color],
          },
        });
      });

      Object.keys(materialTheme.schemes.light).forEach(color => {
        const isContainer = color.endsWith('Container');
        const isOn = color.startsWith('on');
        const name = lodash
          .words(color.replace(/^on/g, '').replace(/Container$/g, ''))
          .map(w => w.toLowerCase())
          .join('-');
        const cssName1 = isContainer ? `bg-${name}` : `color-${name}`;
        const cssName = isOn ? `.on-${cssName1}` : `.${cssName1}`;
        addUtilities({
          [cssName]: isContainer
            ? { backgroundColor: materialTheme.schemes.light[color] }
            : { color: materialTheme.schemes.light[color] },
          [`.dark ${cssName}`]: isContainer
            ? { backgroundColor: materialTheme.schemes.dark[color] }
            : { color: materialTheme.schemes.dark[color] },
          ...(!isContainer && !isOn
            ? {
                [`.border-${name}`]: { borderColor: materialTheme.schemes.light[color] },
                [`.dark .border-${name}`]: { borderColor: materialTheme.schemes.dark[color] },
              }
            : {}),
        });
      });
    }),
  ],
};
