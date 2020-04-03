const path = require('path');

module.exports = {
    contentBase: 'build',
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
    proxy: {
        '/gateway/*': {
            target: 'http://172.16.129.200:8200/',
            pathRewrite: {
                '^/gateway': '/'
            },
            secure: false,
            changeOrigin: true
        },
        '/vdtimg/*': {
            target: 'http://192.168.60.205/',
            secure: false,
            changeOrigin: true
        },
        '/tree/*': {
            target: 'http://localhost:8080/',
            secure: false,
            changeOrigin: true
        },
        // '/test-upload/*': {
        //     target: 'http://192.168.0.114:9120/',
        //     secure: false,
        //     changeOrigin: true,
        //     pathRewrite: {
        //         '^/test-upload': '/'
        //     }
        // }
    }
};