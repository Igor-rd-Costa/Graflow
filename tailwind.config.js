import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                'turquoise-900': '#003E41',
                'turquoise-800': '#004E51',
                'turquoise-700': '#005E61',
                'turquoise-600': '#006E71',
                'turquoise-500': '#007E81',
                'turquoise-400': '#008E91',
                'turquoise-300': '#009EA1',
                'turquoise-200': '#00AEB1',
                'turquoise-150': '#00DEE1',
                'turquoise-100': '#00AEB144',
                'turquoise-50':  '#00AEB122'
            },
            textColor: {
                'turquoise-900': '#003E41',
                'turquoise-800': '#004E51',
                'turquoise-700': '#005E61',
                'turquoise-600': '#006E71',
                'turquoise-500': '#007E81',
                'turquoise-400': '#008E91',
                'turquoise-300': '#009EA1',
                'turquoise-200': '#00AEB1',
                'turquoise-150': '#00DEE1',
                'turquoise-100': '#00AEB144',
                'turquoise-50':  '#00AEB122'
            },
            ringColor: {
                'turquoise-900': '#003E41',
                'turquoise-800': '#004E51',
                'turquoise-700': '#005E61',
                'turquoise-600': '#006E71',
                'turquoise-500': '#007E81',
                'turquoise-400': '#008E91',
                'turquoise-300': '#009EA1',
                'turquoise-200': '#00AEB1',
                'turquoise-100': '#00AEB144',
                'turquoise-50':  '#00AEB122'
            },
            borderColor: {
                'turquoise-900': '#003E41',
                'turquoise-800': '#004E51',
                'turquoise-700': '#005E61',
                'turquoise-600': '#006E71',
                'turquoise-500': '#007E81',
                'turquoise-400': '#008E91',
                'turquoise-300': '#009EA1',
                'turquoise-200': '#00AEB1',
                'turquoise-100': '#00AEB144',
                'turquoise-50':  '#00AEB122'
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
