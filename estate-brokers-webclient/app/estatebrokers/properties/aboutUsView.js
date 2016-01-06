define([
        'commonview/header', 'commonview/footer', 'text!properties/tpl/properties.html','properties/propertyCollection', 'properties/aboutUsTopView', 'cache'],
    function (CommonHeaderView, CommonFooterView, propertiesPage, PropertyCollection, AboutUsTopView, Cache) {
        //主页内容

        var aboutUsPage =  $(propertiesPage).filter('#tpl-aboutUs').html();
        var aboutusConttPage =  $(propertiesPage).filter('#tpl-aboutusContt').html();
        var view = Backbone.View.extend({
            el: '#container',
            aboutUs: null,
            events: {
                'click button#toggle': 'toggle'
            },
            initialize: function () {

            },
            render: function (aboutUs) {
                this.aboutUs = aboutUs;
                window.Utils.Log.hideLoadAmin();
                var aboutUsTitle = aboutUs.store_name;
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", (aboutUsTitle || ""), "#"));
                $("title").html($(".hd-tit").text());
                that.$el.append(new AboutUsTopView().render(aboutUs));
                that.$el.append(aboutusConttPage);
                that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                that.getStorList();
                new diy_select();
            },
            getStorList: function () {
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
                                images_path : imagePath
                            })
                            items.push(item);
                        });
                        Cache.setItem("aboutUsActive", items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        var template = _.template(aboutUsPage, {
                            items: items
                        });
                        $("#actList").append(template);
                        if(items.length == 0){
                            $("#actList").append("<li style='text-align: center'>暂无数据！</li>");
                        }
                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                    }
                }
                var url = window.AppConfig.RemoteApiUrl + "/storeActivities/" + window.App.Const.StorID + "/activity";
                var propertyCollection = new PropertyCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
                    data: {}
                }, getStoreListCallBack);
            }
        });
        return view;
    });
