import { terser } from "rollup-plugin-terser";

module.exports = [
    {
        input: 'src/js/validator.js',
        output: {
            file: 'bundle/validator.bundle.js',
            format: 'umd',
            name: 'Validator'
        },
    },
    {
        input: 'src/js/validator.js',
        output: {
            file: 'bundle/validator.bundle.min.js',
            format: 'umd',
            name: 'Validator'
        },
        plugins: [
            terser()
        ]
    },
];