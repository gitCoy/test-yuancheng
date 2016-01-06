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
            delegate:'estatebrokers/delegate',
            microchat:'estatebrokers/microchat'
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
            },
            {
                name:'main/mainView',
                exclude: ['jquery', 'backbone', 'underscore']
            },
            {
                name: 'commonview/banner',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name: 'commonview/footer',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name: 'commonview/header',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name: 'commonview/search',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'delegate/delegateView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'estates/estateMajorView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'estates/estateMajorInfoView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'estates/estateInfoHouseListView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'microchat/microchatView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'microchat/microchatInfoView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'properties/aboutUsActiveInfoView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'properties/aboutUsTopView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'properties/aboutUsView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'properties/houseUrgentView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'properties/propertySearchView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'properties/propOnSaleDetailView',
                exclude: ['jquery', 'backbone', 'underscore']
            },  {
                name:'properties/publicInfoListView',
                exclude: ['jquery', 'backbone', 'underscore']
            }, {
                name:'usercenter/majorUserCenterView',
                exclude: ['jquery', 'backbone', 'underscore', 'usercenter/convenienceShopView', 'usercenter/myHouseoldView','usercenter/myEntrustView','usercenter/myNewhouseView','usercenter/myVillageView','usercenter/myToolboxView','usercenter/myRentalView']
            }, {
                name:'usercenter/convenienceShopView',
                exclude: ['jquery', 'backbone', 'underscore', 'usercenter/majorUserCenterView', 'usercenter/myHouseoldView','usercenter/myEntrustView','usercenter/myNewhouseView','usercenter/myVillageView','usercenter/myToolboxView','usercenter/myRentalView']
            }, {
                name:'usercenter/myEntrustView',
                exclude: ['jquery', 'backbone', 'underscore', 'usercenter/majorUserCenterView', 'usercenter/myHouseoldView','usercenter/convenienceShopView','usercenter/myNewhouseView','usercenter/myVillageView','usercenter/myToolboxView','usercenter/myRentalView']
            }, {
                name:'usercenter/myHouseoldView',
                exclude: ['jquery', 'backbone', 'underscore', 'usercenter/majorUserCenterView', 'usercenter/convenienceShopView','usercenter/myEntrustView','usercenter/myNewhouseView','usercenter/myVillageView','usercenter/myToolboxView','usercenter/myRentalView']
            }, {
                name:'usercenter/myNewhouseView',
                exclude: ['jquery', 'backbone', 'underscore', 'usercenter/majorUserCenterView', 'usercenter/myHouseoldView','usercenter/myEntrustView','usercenter/convenienceShopView','usercenter/myVillageView','usercenter/myToolboxView','usercenter/myRentalView']
            }, {
                name:'usercenter/myRentalView',
                exclude: ['jquery', 'backbone', 'underscore', 'usercenter/majorUserCenterView', 'usercenter/myHouseoldView','usercenter/myEntrustView','usercenter/myNewhouseView','usercenter/myVillageView','usercenter/myToolboxView','usercenter/convenienceShopView']
            }, {
                name:'usercenter/myToolboxView',
                exclude: ['jquery', 'backbone', 'underscore', 'usercenter/majorUserCenterView', 'usercenter/myHouseoldView','usercenter/myEntrustView','usercenter/myNewhouseView','usercenter/myVillageView','usercenter/convenienceShopView','usercenter/myRentalView']
            }, {
                name:'usercenter/myVillageView',
                exclude: ['jquery', 'backbone', 'underscore', 'usercenter/majorUserCenterView', 'usercenter/myHouseoldView','usercenter/myEntrustView','usercenter/myNewhouseView','usercenter/convenienceShopView','usercenter/myToolboxView','usercenter/myRentalView']
            }
    ]
})
