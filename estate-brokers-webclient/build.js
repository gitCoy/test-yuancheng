({	appDir  : './', //基于build，根目录
    baseUrl : './app', //基于appDir，项目目录
    dir     : './dist', //基于build，输出目录
    optimize: 'uglify', //压缩方式
    mainConfigFile:'app/Lmain.js',
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        jquery: '../js/libs/zepto.min',
        underscore: '../js/libs/underscore',
        backbone: '../js/libs/backbone',
        zepto_extend:'../js/libs/zepto.extend',
        zepto_ui: '../js/libs/zepto.ui',
        zepto_iscroll: '../js/libs/zepto.iscroll',
        navigator: '../js/libs/widget/navigator',
        navigator_iscroll: '../js/libs/widget/navigator.iscroll',
        hhSwipe: '../js/libs/hhSwipe',
        touchslider: "../js/libs/touchslider",
        drowSelect: "../js/libs/drowSelect",
        calculatorLoan: "../js/libs/calculatorLoan",
        tabulous: '../js/libs/tabulous',
        slideout: '../js/libs/slideout.min',
        log: '../js/libs/log',
        http_utils: '../js/libs/http_utils',
        cache: '../js/libs/cache',
        loadUpdate: '../js/libs/zepto.loadUpdate',
        text: '../js/libs/text',
        webSocket: '../js/libs/zepto.websocket',
        moment: '../js/libs/moment.min',
        data: 'data',
        commonview: 'estatebrokers/commonview',
        main: 'estatebrokers/main',
        estates: 'estatebrokers/estates',
        properties: 'estatebrokers/properties',
        usercenter: 'estatebrokers/usercenter',
        delegate:'estatebrokers/delegate'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'zepto_extend': {
            deps: ['jquery'],
            exports: 'zepto_extend'
        },
        'zepto_ui': {
            deps: ['zepto_extend'],
            exports: 'zepto_ui'
        },
        'zepto_iscroll': {
            deps: ['zepto_extend','zepto_ui'],
            exports: 'zepto_iscroll'
        },
        'navigator': {
            deps: ['zepto_extend','zepto_ui','zepto_iscroll'],
            exports: 'navigator'
        },
        'navigator_iscroll': {
            deps: ['zepto_extend','zepto_ui','zepto_iscroll','navigator'],
            exports: 'navigator_iscroll'
        },
        'hhSwipe': {
            deps: ['jquery'],
            exports: 'hhSwipe'
        },
        'touchslider': {
            deps: ['jquery'],
            exports: 'touchslider'
        },
        'drowSelect': {
            exports: 'drowSelect'
        },
        'calculatorLoan': {
            deps:["jquery"],
            exports: 'calculatorLoan'
        },

        'log': {
            deps: ['underscore'],
            exports: 'Log'
        },
        'http_utils': {
            deps: ['jquery','underscore','backbone', 'log'],
            exports: 'Http'
        },
        'cache': {
            deps: ['underscore'],
            exports: 'Cache'
        },
        'loadUpdate': {
            deps: ['zepto_iscroll'],
            exports: 'loadUpdate'
        },
        'webSocket' : {
            deps: ['jquery'],
            exports: 'webSocket'
        },
        'moment' : {
            exports: 'moment'
        }
    },
    modules: [{
            name: 'Lmain'
        }
    ]
})
