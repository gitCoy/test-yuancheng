define([
        'commonview/header','usercenter/userCenterConllection','text!usercenter/tpl/usercenter.html','cache','loadUpdate'],
    function (CommonHeaderView,UserCenterConllection,usercenterPage,Cache) {
        var navigateBarPage =  $(usercenterPage).filter('#tpl-navigateBar').html();
        var myHousePage =  $(usercenterPage).filter('#tpl-myHouse').html();
        var titleLabels = {
            onSecond: '我的二手房',
            onRent: '我的租房',
            onNew: '我的新房'
        };
        var view = Backbone.View.extend({
            el: '#container',
            events: {
                'click button#toggle' : 'toggle'
            },
            initialize: function () {

            },
            render: function(mypropertyType) {
                this.getPropertiesByEstate(mypropertyType);
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", titleLabels[mypropertyType], "#" ,"0"));
                $("title").html($(".hd-tit").text());
                var navigateBar = _.template(navigateBarPage, {
                    dtitle: titleLabels[mypropertyType]
                });
                that.$el.append(navigateBar);
            },
            getPropertiesByEstate: function(mypropertyType) {
                var self = this;
                var getPropertiesServiceCallBack = function (resp) {
                    var items = [],imgPath = [],imgPathFirst;
                    if (resp.resultCode ===  'successful') {
                        window.Utils.Log.hideLoadAmin();
                        window.Utils.Log.info(resp, "getPropertiesByEstate resp");
                        var data = userCenterConllection.getAll();
                        var tmp = [];
                        if(!(data instanceof Array)) {
                            tmp.push(data);
                            data = tmp;
                        }
                        _.each(data, function (item) {
                            imgPath = item.images_path || "";
                            imgPath = imgPath.split(',');
                            imgPathFirst = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[0] + window.App.Thumbnails.LISTIMG == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.LISTIMG ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[0] + window.App.Thumbnails.LISTIMG;
                            for (var i = 0; i < imgPath.length; i++) {
                                imgPath[i] = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER;
                                imgPath[i] = imgPath[i].replace(/\s+/g,'');
                            }
                            var square = self.get_num_round(item.square,0);
                            item = _.extend({}, item, {
                                square:square,
                                images_path: imgPath,
                                imgPathFirst:imgPathFirst
                            })
                            items.push(item);
                        });

                        Cache.setItem("Properties_estateId", items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        var template = _.template(myHousePage, {
                            items: items
                        });
                        $("#container").append(template).trigger('create');
                        window.Utils.loadUpdate.prototype._initNoLoad();
                        if(items.length == 0){
                            $("#fyList").append("<li style='text-align: center;height: 40px;line-height:40px;'>暂无数据！</li>");
                        }

                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(myHousePage, {
                            items: false
                        });
                    }
                };

                var url = window.AppConfig.RemoteApiUrl + '/favoriteProperties/'+ window.App.Const.UserID +'/'+ window.App.Const.StorID + '/' + mypropertyType;
                var userCenterConllection = new UserCenterConllection(url);
                window.Utils.Http.get({
                    model: userCenterConllection,
                    data: {}
                }, getPropertiesServiceCallBack);
            },
            get_num_round: function (num, p) {
                var t = 1;
                while (p > 0) {
                    t *= 10;
                    p--;
                }
                return Math.round(num * t) / t;
            }
        });
        return view;
    });
