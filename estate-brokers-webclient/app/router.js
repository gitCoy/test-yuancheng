define(['backbone'], function (Backbone) {

    var Router = Backbone.Router.extend({

        routes: {
            //'index.html': '',
            '': 'index',
            'index': 'index',
            'propOnSale/:id': 'propOnSale',
            'properties/:estateId/:propertyId': 'propertyDetail',
            'propOnAnxious/:estateId/:propertyId': 'propOnAnxiousDetail',//
            'microchatInfo/:brokerId/:propertyId/:userName/:phone':'microchatInfo',
            'microchatInfo/:sessionId/:propertyId/:userName':'microchatInfoList',
            'usercenter': 'usercenter',
            'myentrust':'myentrust',
            'mytoolbox':'mytoolbox',
            'myvillage':'myvillage',
            'mynewhouse':'mynewhouse',
            'mymicrochat': 'mymicrochat',
            'convenienceShop':'convenienceShop',
            'aboutUsActive/:activityId':'aboutUsActive',
            'aboutUsPublic/:publicId':'aboutUsPublic',
            'search':'search',
            'estateMajor':'estateMajor',
            'majorInfo/:estateId':'majorInfo',
            'userMyEntrust/:propertyId':'userMyEntrust',
            'myrental':'myrental',
            'myhouseold':'myhouseold',
            'delegate':'delegate',
            'houseOnline':'houseonline',
            'houseUrgent':'houseurgent',
            'houseAnxious':'houseanxious',
            'aboutus':'aboutus',
            'aboutPublic':'aboutPublic',
            'storeAbout':'storeAbout',
            '*actions': 'index'
        },

        initialize: function () {
            this.routesHit = 0;
            //keep count of number of routes handled by your application
            Backbone.history.on('route', function() { this.routesHit++; }, this);
        },
        back: function() {
            if(this.routesHit > 1) {
                //more than one route hit -> user did not land to current page directly
                window.history.back();
            } else {
                //otherwise go to the home page. Use replaceState if available so
                //the navigation doesn't create an extra history entry
                this.navigate('index', {trigger:true, replace:true});
            }
        },
        index: function() {
            var url = 'main/mainController';
            //这里不能用模块依赖的写法，而改为url的写法，是为了grunt requirejs打包的时候断开依赖链，分开多个文件
            require([url], function (controller) {
                controller();
            });
        },

       estateMajor: function() {
            var url = 'estates/estateController';
            require([url], function(controller) {
                controller('LIST_ESTATES_MAJOR');
            });
        },
        majorInfo: function(estateId) {
            var url = 'estates/estateController';
            require([url], function(controller) {
                controller('LIST_ESTATES_MAJORINFO',estateId);
            });
        },


        propertyDetail: function(estateId, propertyId) {
            var url = 'properties/propertyController';
            require([url], function (controller) {
                controller('SHOW_PROPERTY_DETAIL', estateId, propertyId);
            });
        },

        propOnAnxiousDetail: function(estateId, propertyId) {
            var url = 'properties/propertyController';
            require([url], function (controller) {
                controller('SHOW_ANXIOUS_DETAIL', estateId, propertyId);
            });
        },
        aboutUsActive: function(activityId) {
            var url = 'properties/propertyController';
            require([url], function (controller) {
                controller('LIST_PROPERTIES_BY_ACTIVE',activityId);
            });
        },
        aboutPublic: function() {
            var url = 'properties/propertyController';
            require([url], function (controller) {
                controller('LIST_PROTERTY_ABOUTPUBLIC');
            });
        },

        houseonline: function() {
            var url = 'properties/propertyController';
            require([url], function(controller) {
                controller('LIST_PROTERTY_HOUSEONLINE');
            });
        },
        search: function() {
            var url = 'properties/propertyController';
            require([url], function(controller) {
                controller('LIST_PROTERTY_SEARCH');
            });
        },

        houseanxious: function() {
            var url = 'properties/propertyController';
            require([url], function(controller) {
                controller('LIST_PROTERTY_HOUSEANXIOUS');
            });
        },
        aboutUsPublic: function(publicId) {
            var url = 'properties/propertyController';
            require([url], function (controller) {
                controller('LIST_PROPERTIES_BY_PUBLICINFO',publicId);
            });
        },
        aboutus: function() {
            var url = 'properties/propertyController';
            require([url], function(controller) {
                controller('LIST_PROPERTIES_BY_ABOUTUS');
            });
        },
        storeAbout: function() {
            var url = 'properties/propertyController';
            require([url], function(controller) {
                controller('LIST_PROPERTIES_STOREABOUTUS');
            });
        },

        houseurgent: function() {
            var url = 'properties/propertyController';
            require([url], function(controller) {
                controller('LIST_PROTERTY_HOUSEURGENT');
            });
        },

        usercenter: function() {
            var url = 'usercenter/userCenterController';
            require([url], function(controller) {
                controller("SHOW_CENTER_CONT");
            });
        },
        userMyEntrust: function(propertyId) {
            var url = 'usercenter/userCenterController';
            require([url], function(controller) {
                controller("SHOW_CENTER_MYENTRUST",propertyId);
            });
        },
        convenienceShop: function() {
            var url = 'usercenter/userCenterController';
            require([url], function(controller) {
                controller("SHOW_CENTER_CONSHOP");
            });
        },

        myentrust: function() {
            var url = 'usercenter/userCenterController';
            require([url], function(controller) {
                controller("SHOW_CENTER_ENTRUST");
            });
        },
        mytoolbox: function(){
            var url = 'usercenter/userCenterController';
            require([url],function(controller){
                controller('SHOW_CENTER_TOOLBOX');
            });
        },
        myvillage: function(){
            var url = 'usercenter/userCenterController';
            require([url],function(controller){
                controller('SHOW_CENTER_VILLAGE');
            });
        },
        mynewhouse: function(){
            var url = 'usercenter/userCenterController';
            require([url],function(controller){
                controller('SHOW_CENTER_NEWHOUSE');
            });
        },
        myrental: function(){
            var url = 'usercenter/userCenterController';
            require([url],function(controller){
                controller('SHOW_CENTER_RENTAL');
            });
        },
        myhouseold: function(){
            var url = 'usercenter/userCenterController';
            require([url],function(controller){
                controller('SHOW_CENTER_HOUSEOLD');
            });
        },

        mymicrochat: function(){
            var url = 'usercenter/userCenterController';
            require([url],function(controller){
                controller('SHOW_MICO_CHATVIEW');
            });
        },

        delegate: function() {
            var url = 'delegate/delegateController';
            require([url], function(controller) {
                controller();
            });
        },
        microchatInfo: function(brokerId, propertyId, userName, phone) {
            var url = 'usercenter/userCenterController';
            require([url], function(controller) {
                controller('SHOW_MICO_CHATINFOVIEW', propertyId,brokerId, userName, phone);
            });
        },
        microchatInfoList: function(sessionId, propertyId, userName) {
            var url = 'usercenter/userCenterController';
            require([url], function(controller) {
                controller('SHOW_MICO_CHATLISTVIEW', propertyId,sessionId, userName);
            });
        },

        defaultAction: function () {
            location.hash = 'module2';
        }

    });

    var router = new Router();
    router.on('route', function (route, params) {
        console.log('hash change', arguments);  //这里route是路由对应的方法名
    });

    return router;
});
