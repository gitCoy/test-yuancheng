define([
        'commonview/header', 'text!properties/tpl/properties.html','properties/propertyCollection','cache','zepto_iscroll', 'loadUpdate'],
    function (CommonHeaderView,propertiesPage, PropertyCollection, Cache) {
        var aboutUsPage =  $(propertiesPage).filter('#tpl-aboutUs').html();
        var aboutUsPublicontPage =  $(propertiesPage).filter('#tpl-aboutUsPublicont').html();

        var view = Backbone.View.extend({
            el: '#container',
            events: {
                'click button#toggle': 'toggle'
            },
            initialize: function () {

            },
            render: function () {
                window.Utils.Log.hideLoadAmin();
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", "成交喜报", "#"));
                $("title").html($(".hd-tit").text());
                that.$el.append(aboutUsPublicontPage);
                that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                that.getPublicList();
                new diy_select();
            },
            getPublicList: function () {
                var getStoreListCallBack = function (resp) {
                    var items = [];
                    if (resp.resultCode === 'successful') {
                        window.Utils.Log.hideLoadAmin();
                        var data = propertyCollection.getAll();
                        var tmp = [];
                        if(!(data instanceof Array)) {
                            tmp.push(data);
                            data = tmp;
                        }
                        _.each(data, function (item) {
                           var  imagePath = item.images_path;
                            imagePath = imagePath.split(",");
                            imagePath = window.App.Const.THUMBNAILS_IMG_SERVER + imagePath[0] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imagePath[0] + window.App.Thumbnails.BANNER;
                             item = _.extend({},item,{
                                images_path : imagePath,
                                activity_title:item.public_title,
                                activity_comments:item.public_comments,
                                activity_subtitle:item.public_subtitle,
                                 activity_id:item.public_id
                            })
                            items.push(item);
                        });
                        Cache.setItem("aboutUsActive", items);
                        window.Utils.Log.info(items.length, "items.lengthΪ;");
                        var template = _.template(aboutUsPage, {
                            items: items
                        });
                        $("#actList").append(template);
                        if(items.length == 0){
                            $("#actList").append("<li style='text-align: center'>暂无数据</li>");
                        }
                        window.Utils.loadUpdate({wrapper: "fyWrapper", scrollbarClass: "fyScroller"});

                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(aboutUsPage, {
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
        return view;
    });
