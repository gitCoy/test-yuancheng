define([
        'commonview/header', 'commonview/footer' ,'text!commonview/tpl/common.html','text!usercenter/tpl/usercenter.html','usercenter/userCenterConllection',
        'slideout', 'cache'],
function (CommonHeaderView, CommonFooterView,commonPage,usercenterPage,UserCenterConllection,Slideout, Cache) {
    var mainSlideTpl =  $(commonPage).filter('#tpl-mainSlide').html();
    var UserCenterTopPage =  $(usercenterPage).filter('#tpl-userCenterTop').html();
    var MajorUserCenterTpl =  $(usercenterPage).filter('#tpl-majorUserCenter').html();
    //列表数据

    var view = Backbone.View.extend({
        el: '#container',
        events: {
            'click button#toggle' : 'toggle'
        },
        initialize: function () {

        },
        render: function(userCenterImg) {
            var that = this;
            that.$el.empty();
            if(userCenterImg){
                var delegeteImged = userCenterImg.delegate_banner_image || "";
                delegeteImged = delegeteImged.split(',');
                delegeteImged = delegeteImged[1] || "";
                delegeteImged = window.App.Const.THUMBNAILS_IMG_SERVER + delegeteImged + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + delegeteImged + window.App.Thumbnails.BANNER;
                delegeteImged = delegeteImged.replace(/\s+/g, '');
                userCenterImg = _.extend({}, userCenterImg, {
                    delegate_banner_image: delegeteImged || ""
                });
            }else{
                that.getUserCenterImg();
            }
            that.$el.append(mainSlideTpl);
            $("#mainSlide").append(new CommonHeaderView().render("headerWithMenuBtn", "个人中心", "#"));
            $("title").html($(".hd-tit").text());
            $("#mainSlide").append(new CommonFooterView().render("commonFooterPage","usercenter"));
            var template = _.template(MajorUserCenterTpl, {
                item_deleImg: userCenterImg
            });
            $("#mainSlide").append(template);
            that.getUserCenterCont();
            that.slideout();
        },
        slideout:function(){
            var menuP = $("#container").width() * 0.8;
            var slideout = new Slideout({
                'panel': document.getElementById('mainSlide'),
                'menu': document.getElementById('menu'),
                'padding': menuP,
                'tolerance': 70
            });
            $('#menuBtnA').bind('click', function() {
                slideout.toggle();
                if($(".slideMask").css("display") == "none"){
                    $(".header").addClass("headerMemu");
                    $(".slideMask").css("display","block");
                }else{
                    setTimeout(function(){$(".header").removeClass("headerMemu");},300)
                    $(".slideMask").css("display","none");
                }
            });
            $('.menu').bind('click', function(eve) {
                if (eve.target.nodeName === 'A') {
                    slideout.close();
                    $(".slideMask").css("display","none");
                    setTimeout(function(){$(".header").removeClass("headerMemu");},300);
                }
            });
            $('.slideMask').click(function() {
                slideout.close();
                $(".slideMask").css("display","none");
                setTimeout(function(){$(".header").removeClass("headerMemu");},300)
            })

        },
        getUserCenterCont: function() {
            var that = this;
            //如果有缓存则不请求服务器
            var data = Cache.getItem("usersCont");
            if(data && data.length != 0){
                that.creatUserCont(data,1);//1 表示从缓存里面获取的
            }else{
                var url = window.AppConfig.RemoteApiUrl + '/users/' + window.App.Const.UserID;
                var userCenterConllection = new UserCenterConllection(url);
                window.Utils.Http.get({
                    model: userCenterConllection,
                    data: {}
                }, function (resp) {
                    if (resp.resultCode === 'successful') {
                        window.Utils.Log.info(resp, "getHostEstate resp");
                        var data = userCenterConllection.getAll();
                        that.creatUserCont(data);
                    }else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        window.Utils.Log.loadAminFailing();
                        window.Utils.Log.hideLoadAmin();
                        var template = _.template(UserCenterTopPage, {
                            items: false
                        });
                    }
                });
            }
        },

        creatUserCont:function(data,CaNum){
            var items = [];
            if(CaNum != 1){
                _.each(data, function (item) {
                    items = item;
                });
            }else{
                items = data;
            }
            var name, head;
            if (items) {
                name = items.real_name || items.nick_name;
                head = items.avatarurl || items.avatarurl_wechat;

                head = /^((https|http|ftp|rtsp|mms)?:\/\/)/.test(head) ?  head : window.App.Const.THUMBNAILS_IMG_SERVER + head;
                if(head == window.App.Const.THUMBNAILS_IMG_SERVER + "undefined"){
                    head = "images/default.png";
                }
            }
            items = _.extend({}, items, {
                "uName": name,
                "uHead": head
            });
            Cache.setItem("usersCont", items);
            //window.Utils.Log.info(items.length, "items.length为;");
            var template = _.template(UserCenterTopPage, {
                items: items
            });
            $("#perHeader").empty();
            $("#perHeader").append(template);
            window.Utils.Log.hideLoadAmin();
        },
        getUserCenterImg: function() {
            var that = this;
            $.ajax({
                type: 'get',
                url: window.AppConfig.RemoteApiUrl + "/stores/" + window.App.Const.StorID,
                data: {},
                success: function(data){
                    that.render(data.result[0]);
                    var tmp = [];
                    if(!(data.result instanceof Array)) {
                        tmp.push(data.result);
                        data['result'] = tmp;
                    }
                    Cache.setItem("About_Us", data.result);
                    //this.append(data.project.html)
                },
                error: function(xhr, type){
                }
            })
        },
    });
    return view;
});
