module.exports = {
    entry:  './src/js/entry.js',
    output: {
        path:     '/build/js/',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test:   /\.js/,
                loader: 'babel',
                include: __dirname + '/src',
            }
        ],
    }
};
