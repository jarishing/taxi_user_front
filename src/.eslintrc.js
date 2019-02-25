module.exports = {
    "extends": "standard",
    "rules": {
        /**
         * 
         * Webpack would disable logging on production,
         * so reverse the logging in development 
         */
        "no-console": "off",
        "indent": [
            "error",
            4
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};