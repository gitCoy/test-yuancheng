define(
    ['text!commonview/tpl/common.html'],
    function (commonPage) {

        var commonHeaderWithBackBtnPage =  $(commonPage).filter('#tpl-headerWithBackBtn').html();
        var commonHeaderWithMenuBtnPage =  $(commonPage).filter('#tpl-headerWithMenuBtn').html();
        var router = window.Utils.Router;
        var headerView = Backbone.View.extend({
            initialize: function () {

            },
            events: {
                "click [href='##']": "onHeaderBackClicked",
                'click .hd-back': "onBackClicked",
                'click .storeTitle':"onStroeTitle"
                //'click #storeName li':"onChangeStoreId"
            },
            onBackClicked: function() {
                if($('.delegate').length > 0) {
                    router.navigate("myentrust", {trigger:true});
                } else {
                    window.stop();
                    router.back();

                }

            },
            onStroeTitle: function(){
                var storeH = $("#storeName.active");
                if(storeH.length <= 0){
                    //$("#storeName").css({"top":"-100%"});
                    $("#storeName").addClass("active");
                    $("#mainSlide").append("<div id='mask'></div>");
                    $(".header").css("box-shadow","0 1px 2px #8e8e8e");
                    $("#mask").bind("touchstart",function(e) {
                        e.stopPropagation();
                        return false;
                    })

                }else{

                    $("#storeName").removeClass("active");
                    $(".header").css("box-shadow","none");
                    $("#mask").remove();
                    //$("#storeName").css({"top": 44});

                }
            },
            onHeaderBackClicked: function () {
                //alert(22);
            },
            showTemplateByType: function (type) {
                var self = this;
                var elType = {
                    'headerWithBackBtn': commonHeaderWithBackBtnPage,
                    'headerWithMenuBtn': commonHeaderWithMenuBtnPage
                }
                self.el = elType[type];
            },

            /**
             *
             * @param type
             * @param title
             * @param href
             * @param headerType   0: None     1: Withphone
             * @returns {*}
             *
             */

            render: function (type, title, href, headerType, metaData,storMenu) {
                var self = this;
                var params = {
                    title: title,
                    headerType: headerType || 0,
                    storMenu:storMenu || 0
                };

                //$("title").html(title);
                if(typeof metaData === "object") for(var attr in metaData) {
                    params[attr] = metaData[attr];
                }

                //设置
                if(metaData && typeof metaData === 'string' && metaData === "delegate") {
                    params['entrustType'] = metaData;
                } else {
                    params['entrustType'] = "headBacker";
                }
                if (href) {
                    params['href'] = href;
                } else {
                    params['href'] = "../";
                }
                self.showTemplateByType(type);
                params['stores'] = eval("("+ window.localStorage.myStores +")");
                var template = _.template(self.el, params);
                self.$el.append(template);
                return self.$el;
            }
        });
        return headerView;
    });
