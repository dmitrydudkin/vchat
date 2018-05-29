module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/require-default-props": [0],
        "react/no-unused-prop-types": [2, {
            "skipShapeProps": true
        }],
        "react/forbid-prop-types": [0],
        "react/no-multi-comp": [0],
        "react/prefer-stateless-function": [0],
        "no-bitwise": [0],
        "import/no-extraneous-dependencies": [0],
        "no-console": [0]
    },
};
