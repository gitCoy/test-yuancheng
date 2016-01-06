define([
        'commonview/header', 'text!usercenter/tpl/usercenter.html', 'cache','zepto_iscroll','loadUpdate'],
    function (CommonHeaderView,usercenterPage) {
        var microchatInfoPage =  $(usercenterPage).filter('#tpl-microchatInfo').html();
        //主页

        var view = Backbone.View.extend({
            el: '#container',
            events: {
                'click button#toggle' : 'toggle'
            },
            initialize: function () {
            },
            render: function(brokerId, propertyId, userName, phone) {
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", userName || "匿名", "#" ,"0"));
                $("title").html($(".hd-tit").text());
                var template = _.template(microchatInfoPage, {item:userName});
                that.$el.append(template);
                window.onresize = function (){
                    var footTop = $(".wcw-dialog-footer").offset().top;
                    var fyscorH = $("#fyScroller").height();
                    var windH = $(window).height();
                    var scrollT = fyscorH - windH - footTop - 44;
                    $("#fyScroller").css("transform","translate(0px, -"+ scrollT +"px) scale(1) translateZ(0px)")
                };
                window.Utils.Log.hideLoadAmin();
                if (phone) {
                    //请求聊天历史记录
                    window.Utils.socket.send(JSON.stringify({
                            "MsgType": window.App.Request.HISTORICAL,
                            "FromUserId": window.App.Const.UserID, // 普通用户Id
                            "ClientRepId": brokerId, // 经纪人Id
                            "ClientId": window.App.Const.StorID, // 门店Id
                            "ResourceId": propertyId // 房源Id
                        }
                    ));
                    that._bindEvent(brokerId);
                    that.$(".we-phone a").attr("href", "tel:" + phone);
                } else {
                    window.Utils.socket.send(JSON.stringify({
                            "MsgType": window.App.Request.HISTORICAL_F,
                            "FromUserId": window.App.Const.UserID, // 普通用户Id
                            "SessionId": brokerId // sessionId
                        }
                    ));
                    $('#weChat').attr('data-session', brokerId);

                    that.$(".hd-tit").html(userName);
                    that._bindEvent(propertyId);
                    that.$(".we-phone").empty();
                    //that.$(".we-phone a").attr("href", "tel:"+phone);
                }
                window.Utils.loadUpdate.prototype._initNoLoad();
            },
            _bindEvent : function(brokerId) {
                var that = this;
                $('#sendMsg .wcw-dialog-sendBtn').bind('click', function(e) {
                    $msg =  $('#sendMsg textarea').val();
                    if ($msg && !/^\s+$/.test($msg)) that.sendMsg($msg, brokerId);
                })
                $('#sendMsg textarea').bind('keypress',function(event){
                    if(event.keyCode == "13") {
                        $msg =  $('#sendMsg textarea').val();
                        if ($msg && !/^\s+$/.test($msg)) that.sendMsg($msg, brokerId);
                        event.stopPropagation();
                    }
                });
            },
            sendMsg: function(msg, brokerId) {
                var meicon = $('#weChat').attr('data-me-icon') || 'images/ph-rImg.jpeg';
                var cell = "";
                cell += '<li class="wcw-dialog-history clearfix"><div class="wcw-dialog-img-right"><a href="#"><img src="'+meicon+'"></a></div>'
                cell += '<div class="wcw-dialog-arrow-item wcw-dialog-right"><div class="wcw-dialog-content">' + msg + '</div><div class="wcw-dialog-arrow-right">'
                cell += '<svg width="7px" height="12px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 7 12" enable-background="new 0 0 7 12" xml:space="preserve"><path fill="#B2E281" d="M-1,1c0,0,8-0.188,8,0.047s0,1.875,0,1.875L-1,11"></path></svg>';
                cell += '</div></div></li>';
                $('#weChat').append(cell);
                $("body").scrollTop($('body').get(0).scrollHeight);
                $('#sendMsg textarea').val("");

                //发送一条消息
                window.Utils.socket.send(JSON.stringify({
                        "MsgType": window.App.Request.MESSAGE,
                        "FromUserId": window.App.Const.UserID, //发送消息的用户
                        "ToUserId": brokerId, //接收消息的用户
                        "SessionId": $('#weChat').attr('data-session'), //当前会话Id 如果是从房源
                        "CreateTime": new Date().getTime(), //消息创建时间
                        "Content": msg //消息内容
                    }
                ));
            }
        });
        return view;
    });
