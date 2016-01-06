define([
        'commonview/header', 'commonview/footer' ,
        'text!delegate/tpl/delegate.html', 'cache','delegate/delegateCollection',
        'estates/estateCollection','tabulous','drowSelect','calculatorLoan'],
    function (CommonHeaderView, CommonFooterView,delegatePage, Cache,DelegateCollection,EstateCollection) {

        var DelegatePage =  $(delegatePage).filter('#tpl-delegatecont').html();
        var DelegatecentPage =  $(delegatePage).filter('#tpl-delegatecent').html();
        var view = Backbone.View.extend({
            el: '#container',
            events: {
            },
            initialize: function () {
                window.Utils.Log.hide_reminder();
            },
            render: function(delegeteImg) {
                var that = this;
                if(delegeteImg){
                    var delegeteImged = delegeteImg.delegate_banner_image || "";
                    delegeteImged = delegeteImged.split(',');
                    delegeteImged = window.App.Const.THUMBNAILS_IMG_SERVER + delegeteImged[0] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + delegeteImged[0] + window.App.Thumbnails.BANNER;
                    delegeteImg = _.extend({}, delegeteImg, {
                        delegate_banner_image: delegeteImged || ""
                    });
                }else{
                    that.getDelegateImg();
                }
                var redminText = ["","暂无小区","","","","请正确输入面积","请正确输入价格","请正确输入电话号码"];
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", "发布委托", "#" ,"0", "delegate"));
                $("title").html($(".hd-tit").text());
                var template_deleImg = _.template(DelegatecentPage, {
                    item_deleImg: delegeteImg
                });
                that.$el.append(template_deleImg);
                that.$el.append(new CommonFooterView().render("commonFooterPage","delegate"));
                that.getMajorEstates();
                new diy_select();

                Zepto('#wtc-tabs').tabulous({
                    effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                });
                that.$("#wtcsPublish").click(function(){
                    var argPd = "1";
                    var i = 0;
                    var argStr = new init_wtcz_cs(1);
                    for(var key in argStr){
                        if(i>4 && i<8 && i!=7) {
                            if (!(/^[0-9]{1,10}$/.test(argStr[key])) || argStr[key] == 0) {
                                window.Utils.Log.reminderCommon(redminText[i], 1);
                                argPd = "";
                                break;
                            }
                        }else if(i == 7){
                            if (!(/^(0?1[358]\d{9})$|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/.test(argStr[key])) || argStr[key] == 0) {
                                window.Utils.Log.reminderCommon(redminText[i], 1);
                                argPd = "";
                                break;
                            }
                        }else{
                            if (argStr[key] == "") {
                                window.Utils.Log.reminderCommon(redminText[i], 1);
                                argPd = "";
                                break;
                            }
                        }
                        i += 1;
                    }
                    if(argPd != "" || argPd != 0){
                        window.Utils.Log.reminderCommon("是否确认？");
                        $(".reminderVerify").click(function(){
                            that.postentrustBygift(argStr);
                            window.Utils.Log.hide_reminder();
                        });
                    }
                });

                that.$("#wtczPublish").click(function(){
                    var argPd = "1";
                    var i = 0;
                    var argStr = new init_wtcz_cs(2);
                    for(var key in argStr){
                        if(i>4 && i<8 && i!=7) {
                            if (!(/^[0-9]{1,10}$/.test(argStr[key])) || argStr[key] == 0) {
                                window.Utils.Log.reminderCommon(redminText[i], 1);
                                argPd = "";
                                break;
                            }
                        }else if(i == 7){
                            if (!(/^(0?1[358]\d{9})$|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/.test(argStr[key])) || argStr[key] == 0) {
                                window.Utils.Log.reminderCommon(redminText[i], 1);
                                argPd = "";
                                break;
                            }
                        }else{
                            if (argStr[key] == "") {
                                window.Utils.Log.reminderCommon(redminText[i], 1);
                                argPd = "";
                                break;
                            }
                        }
                        i += 1;
                    }
                    if(argPd != ""){
                        window.Utils.Log.reminderCommon("是否确认？");
                        $(".reminderVerify").click(function(){
                            //alert(argStr.price);
                            that.postentrustBygift(argStr);
                            window.Utils.Log.hide_reminder();
                        });
                    }
                });
                //var template = _.template(entrustgiftPage, {});
                // that.$el.append(template);
                //模板加载完毕时重新加载drowSelect
                //that.postentrustBygift();
            },
            getDelegateImg: function() {
                var that = this;
                $.ajax({
                    type: 'get',
                    url: window.AppConfig.RemoteApiUrl + "/stores/" + window.App.Const.StorID,
                    data: {},
                    success: function(data){
                        var tmp = [];
                        if(!(data.result instanceof Array)) {
                            tmp.push(data.result);
                            data['result'] = tmp;
                        }
                        that.render(data.result[0]);
                        Cache.setItem("About_Us", data.result);
                        //this.append(data.project.html)
                    },
                    error: function(xhr, type){
                    }
                })
            },
            getMajorEstates: function() {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var items = [];
                    if (resp.resultCode ===  'successful') {
                        window.Utils.Log.info(resp, "getPropertiesByEstate resp");
                        var data = estateCollection.getAll();
                        _.each(data, function (item) {
                            items.push(item);
                        });
                        Cache.setItem("PropertiesMajorInfo", items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        var template = _.template(DelegatePage, {
                            items: items
                        });

                        $(".select_estate").empty();
                        $(".select_estate").append(template);
                        var ulselectestate = $("ul.select_estate");
                        if(ulselectestate[0].children[0]){
                            $(".estateName a").html( ulselectestate[0].children[0].innerHTML);
                        }
                        window.Utils.Log.hideLoadAmin();
                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(DelegatePage, {
                            items: false
                        });
                    }
                };
                var url = window.AppConfig.RemoteApiUrl + '/estates/' + window.App.Const.StorID;
                //var url = 'app/data/major_store.json';
                var estateCollection =  new EstateCollection(url);
                window.Utils.Http.get({
                    model: estateCollection,
                    data: {}
                }, getPropertiesServiceCallBack);
            },
            postentrustBygift: function(arg) {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    if (resp.resultCode ===  'successful') {
                        window.Utils.Log.reminder("上传成功");
                        $("input").val("");
                    }else{
                        window.Utils.Log.reminder("上传失败");
                    }
                }
                var url = window.AppConfig.RemoteApiUrl + '/delegate';
                var delegateCollection = new DelegateCollection(url);
                var obj = {
                    delegateId: "",
                    userId: window.App.Const.UserID,
                    storeId: window.App.Const.StorID,
                    estateId: arg.estateId,
                    delegateTitle: arg.delegateTitle,
                    delegateType: arg.delegateType,
                    buzzMode: arg.buzzMode,
                    roomInfo: arg.roomInfo,
                    square: arg.square,
                    price: arg.price,
                    phones: arg.phones,
                    comments: arg.comments
                };
                window.Utils.Http.post({
                    dataType: "json",
                    contentType: 'application/json',
                    model: delegateCollection,
                    data: JSON.stringify(obj)
                },getPropertiesServiceCallBack)
            }
        });
        return view;
    });
