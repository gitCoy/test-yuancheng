
define(['commonview/header','usercenter/userCenterConllection', 'text!usercenter/tpl/usercenter.html'],
    function (CommonHeaderView,UserCenterConllection,usercenterPage) {
        var myentrustPage =  $(usercenterPage).filter('#tpl-myEntrust').html();
        var MyEntrustOnRentPage =  $(usercenterPage).filter('#tpl-myEntrustOnRent').html();
        var MyEntrustOnSalePage =  $(usercenterPage).filter('#tpl-myEntrustOnSale').html();
        //主页内容

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
                window.Utils.Log.hideLoadAmin();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", "我的委托", "#" ));
                $("title").html($(".hd-tit").text());
                that.$el.append(myentrustPage);
                if ($(".spinneredtop").length == 0) {
                    that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                }
                that.getPropertiesByOnSale();
                that.getPropertiesByOnRent();
            },
            getPropertiesByOnRent: function() {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var itemsOnRent = [],imgPath = [];
                    if (resp.resultCode ===  'successful') {
                        window.Utils.Log.hideLoadAmin();
                        window.Utils.Log.info(resp, "getPropertiesByEstate resp");
                        var data = userCenterConllection.getAll();
                        _.each(data, function (item) {
                            var thumbnails = item.thumbnails;
                            var defaultThumbnail = "";
                            if(thumbnails!=null && thumbnails.length > 0 ) {
                                defaultThumbnail = thumbnails.split(",")[0];
                            }
                            imgPath = item.images_path || "";
                            imgPath = imgPath.split(',');
                            for (var i = 0; i < imgPath.length; i++) {
                                imgPath[i] = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER;
                                imgPath[i] = imgPath[i].replace(/\s+/g,'');
                            }
                            item = _.extend({}, item, {
                                defaultThumbnail: defaultThumbnail,
                                images_path: imgPath
                            })
                            itemsOnRent.push(item);
                        });

                        //Cache.setItem("Properties_estateId", items);
                        window.Utils.Log.info(itemsOnRent.length, "items.length为;");
                        var template = _.template(MyEntrustOnRentPage, {
                            itemsOnRent: itemsOnRent
                        });
                        $("#fyList_onrent").empty();
                        $("#fyList_onrent").append(template).trigger('create');
                        if(itemsOnRent.length == 0){
                            $("#fyList_onrent").append("<li style='text-align: center;'>暂无数据！</li>");
                        }
                        Zepto('#myWt-tabs').tabulous({
                            effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                        });

                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(MyEntrustOnRentPage, {
                            onRentitems: false
                        });
                    }
                };

                //var url = window.AppConfig.RemoteApiUrl + '/estates/21sijichuandadian';
                var url = window.AppConfig.RemoteApiUrl + '/delegates/'+ window.App.Const.UserID +'/' + window.App.Const.StorID + '/onRent';
                //var url = 'app/data/properties.json';
                var userCenterConllection = new UserCenterConllection(url);
                window.Utils.Http.get({
                    model: userCenterConllection,
                    data: {}
                }, getPropertiesServiceCallBack);
            },
            getPropertiesByOnSale: function() {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var itemsOnSale = [],imgPath = [];
                    if (resp.resultCode ===  'successful') {
                        window.Utils.Log.info(resp, "getPropertiesByEstate resp");
                        var data = userCenterConllection.getAll();
                        var tmp = [];
                        if(!(data instanceof Array)) {
                            tmp.push(data);
                            data = tmp;
                        }
                        _.each(data, function (item) {
                            var thumbnails = item.thumbnails;
                            var defaultThumbnail = "";
                            if(thumbnails!=null && thumbnails.length > 0 ) {
                                defaultThumbnail = thumbnails.split(",")[0];
                            }
                            imgPath = item.images_path || "";
                            imgPath = imgPath.split(',');
                            for (var i = 0; i < imgPath.length; i++) {
                                imgPath[i] = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER;
                            }
                            item = _.extend({}, item, {
                                defaultThumbnail: defaultThumbnail,
                                images_path: imgPath
                            })
                            itemsOnSale.push(item);
                        });

                        //Cache.setItem("Properties_34wd22222", items);
                        window.Utils.Log.info(itemsOnSale.length, "itemsOnSale.length为;");
                        var template = _.template(MyEntrustOnSalePage, {
                            itemsOnSale: itemsOnSale
                        });
                        $("#fyList_onsale").empty();
                        $("#fyList_onsale").append(template).trigger('create');
                        if(itemsOnSale.length == 0){
                            $("#fyList_onsale").append("<li style='text-align: center;'>暂无数据！</li>");
                        }
                        Zepto('#myWt-tabs').tabulous({
                            effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                        });

                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(MyEntrustOnSalePage, {
                            onRentitems: false
                        });
                    }
                };

                //var url = window.AppConfig.RemoteApiUrl + '/estates/21sijichuandadian';
                var url = window.AppConfig.RemoteApiUrl + '/delegates/'+ window.App.Const.UserID +'/' + window.App.Const.StorID + '/onSale';
                //var url = 'app/data/properties.json';
                var userCenterConllection = new UserCenterConllection(url);
                window.Utils.Http.get({
                    model: userCenterConllection,
                    data: {}
                }, getPropertiesServiceCallBack);
            }
        });
        return view;
    });
