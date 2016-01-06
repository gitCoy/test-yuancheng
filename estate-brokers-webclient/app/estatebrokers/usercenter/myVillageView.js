define([
        'commonview/header','properties/propertyCollection','text!usercenter/tpl/usercenter.html', 'cache','loadUpdate'],
    function (CommonHeaderView,PropertyCollection,usercenterPage, Cache) {
        var myVillagePage =  $(usercenterPage).filter('#tpl-myVillage').html();
        var view = Backbone.View.extend({
            el: '#container',
            events: {
                'click button#toggle' : 'toggle'
            },
            initialize: function () {

            },
            render: function() {
                this.getPropertiesByEstate();
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", "我的小区", "#" ,"0"));
                $("title").html($(".hd-tit").text());
                if ($(".spinneredtop").length == 0) {
                    that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                }
            },

            getPropertiesByEstate: function() {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var items = [],imgPath = [],imgPathFirst;
                    if (resp.resultCode ===  'successful') {
                        window.Utils.Log.hideLoadAmin();
                        window.Utils.Log.info(resp, "getPropertiesByEstate resp");
                        var data = propertyCollection.getAll();
                        var tmp = [];
                        if(!(data instanceof Array)) {
                            tmp.push(data);
                            data = tmp;
                        }
                        _.each(data, function (item) {
                            var thumbnails = item.thumbnails;
                            var defaultThumbnail = "";
                            if (thumbnails != null && thumbnails.length > 0) {
                                defaultThumbnail = thumbnails.split(",")[0];
                            }
                            imgPath = item.images_path || "";
                            imgPath = imgPath.split(',');
                            imgPathFirst = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[0] + window.App.Thumbnails.LISTIMG == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.LISTIMG ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[0] + window.App.Thumbnails.LISTIMG;
                            for (var i = 0; i < imgPath.length; i++) {
                                imgPath[i] = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER;
                                 imgPath[i] = imgPath[i].replace(/\s+/g,'');
                            }
                            item = _.extend({}, item, {
                                defaultThumbnail: defaultThumbnail,
                                images_path: imgPath,
                                imgPathFirst:imgPathFirst
                            })
                            items.push(item);
                        });

                        Cache.setItem("PropertiesMajorInfo", items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        var template = _.template(myVillagePage, {
                            items: items
                        });

                        $("#container").append(template).trigger('create');
                        if(items.length == 0){
                            $("#fyList").append("<li style='text-align: center;height: 40px;line-height:40px;'>暂无数据！</li>");
                        }
                        window.Utils.loadUpdate.prototype._initNoLoad();

                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(myVillagePage, {
                            items: false
                        });
                    }
                };

                var url = window.AppConfig.RemoteApiUrl + '/favoriteEstates/'+ window.App.Const.UserID +'/'+ window.App.Const.StorID;
                //var url = window.AppConfig.RemoteApiUrl + '/data/major_estates.json';
                //var url = 'app/data/major_store.json';
                var propertyCollection = new PropertyCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
                    data: {}
                }, getPropertiesServiceCallBack);
            }
        });
        return view;
    });
