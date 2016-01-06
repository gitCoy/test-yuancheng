define([
        'commonview/header','text!usercenter/tpl/usercenter.html', 'cache', 'zepto_iscroll','loadUpdate'],
    function (CommonHeaderView,usercenterPage) {
        var microchatcontPage =  $(usercenterPage).filter('#tpl-microchatcont').html();
        //页面布局

        var view = Backbone.View.extend({
            el: '#container',
            events: {
                'click button#toggle' : 'toggle'
            },
            initialize: function () {

            },
            render: function() {
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", "我的聊天记录", "#" ,"0"));
                $("title").html($(".hd-tit").text());
                if ($(".spinneredtop").length == 0) {
                    that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                }
                var template = _.template(microchatcontPage, {});
                that.$el.append(template);
                window.Utils.loadUpdate();

                //请求会话记录
                window.Utils.socket.send(JSON.stringify({
                        "MsgType": window.App.Request.SESSIONS,
                        "FromUserId": window.App.Const.UserID, // 普通用户Id
                        "ClientId": window.App.Const.StorID, // 门店Id
                    }
                ));
               window.Utils.Log.hideLoadAmin();
            }
        });
        return view;
    });
