define([
        'text!properties/tpl/properties.html', 'properties/propertyCollection', 'cache', 'zepto_iscroll', 'loadUpdate'],
    function (propertiesPage, PropertyCollection, Cache) {
        //主页内容

        var aboutusTopPage =  $(propertiesPage).filter('#tpl-aboutusTop').html();
        var GladMassegePage =  $(propertiesPage).filter('#tpl-gladMessage').html();
        var aboutUsTopView = Backbone.View.extend({
            el: '#container',
            events: {
                'click button#toggle': 'toggle'
            },
            initialize: function () {

            },
            render: function (aboutUs) {
                var that = this;
                var aboutusBImg = aboutUs.about_banner_image || "";
                aboutusBImg = aboutusBImg.split(',');
                aboutusBImg = window.App.Const.THUMBNAILS_IMG_SERVER + aboutusBImg[0] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + aboutusBImg[0] + window.App.Thumbnails.BANNER;
                aboutUs = _.extend({}, aboutUs, {
                    about_banner_image: aboutusBImg || ""
                });
                var template = _.template(aboutusTopPage, {
                    items: aboutUs
                });
                $("#container").append(template);
                that.getGladMessage();
            },
            getGladMessage: function () {
                var getStoreListCallBack = function (resp) {
                    var items = [];
                    if (resp.resultCode === 'successful') {
                        var data = propertyCollection.getAll();
                        var tmp = [];
                        if (!(data instanceof Array)) {
                            tmp.push(data);
                            data = tmp;
                        }
                        _.each(data, function (item) {
                            var  imagePath = item.images_path;
                            imagePath = imagePath.split(",");
                            imagePath = window.App.Const.THUMBNAILS_IMG_SERVER + imagePath[0] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imagePath[0] + window.App.Thumbnails.BANNER;
                            item = _.extend({}, item, {
                                activity_id: item.public_id,
                                activity_title: item.public_title,
                                activity_comments: item.public_comments,
                                activity_desc: item.public_desc,
                                images_path: imagePath

                            })
                            items.push(item);
                        });
                        Cache.setItem("aboutUsPublicInfo", items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        var template = _.template(GladMassegePage, {
                            items: items
                        });
                        $("#gladMessage").append(template);
                        if (items.length == 0) {
                            $("#gladMessage").append("<p style='text-align: center'>暂无数据！</p>")
                        }
                        window.Utils.Log.hideLoadAmin();
                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(GladMassegePage, {
                            items: false
                        });
                    }
                }
                var url = window.AppConfig.RemoteApiUrl + "/storeActivities/" + window.App.Const.StorID + "/publicInfo";
                var propertyCollection = new PropertyCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
                    data: {}
                }, getStoreListCallBack);
            }
        });
        return aboutUsTopView;
    });
