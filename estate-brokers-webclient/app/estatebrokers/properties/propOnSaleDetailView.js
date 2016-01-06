define([
        'commonview/header', 'text!commonview/tpl/common.html','commonview/banner', 'properties/propertyDetailFooter', 'text!properties/tpl/properties.html',
        'properties/propertyCollection', 'cache', 'loadUpdate', 'zepto_iscroll', 'drowSelect',
        'zepto_extend','zepto_ui','navigator_iscroll','navigator','hhSwipe','touchslider'],
function (CommonHeaderView, commonPage, CommonBannerView, PropertyDetailFooterView, propertiesPage,
          PropertyCollection, Cache) {
    var NavigateBarTpl =  $(commonPage).filter('#tpl-navigateBar').html();
    var CommonBannerCont =  $(commonPage).filter('#tpl-bannerCont').html();
    var PropertyDetailInfoTpl =  $(propertiesPage).filter('#tpl-propertyDetailInfo').html();
    var view = Backbone.View.extend({
        el: '#container',
        events: {

        },
        propertyInfo: null,
        initialize: function () {
        },
        render: function(propertyInfo) {
            this.propertyInfo = propertyInfo;
            var storId = propertyInfo.store_id;
            var estateId = propertyInfo.estate_id;
            var propertyId = propertyInfo.property_id;
            var propertyTitle = propertyInfo.property_title;
            var phone = propertyInfo.phones;
            var self = this;
            self.$el.empty();
            self.$el.append(new CommonHeaderView().render("headerWithBackBtn", (propertyTitle || ""), "#", 1, {'phone':phone}));
            $("title").html($(".hd-tit").text());
            self.$el.append(NavigateBarTpl);
            self.$el.append(new CommonBannerView().render("bannerPropertyPage"));
            self.$el.append('<div id="fyContainter"></div>');
            self.$el.append(new PropertyDetailFooterView().render(propertyInfo));

            var mngm_fee = self.get_num_round(propertyInfo.management_fee,2);
            var square = self.get_num_round(propertyInfo.square,0);
            var subwayinfo = propertyInfo.subway_info || "";
            subwayinfo = subwayinfo.split(",");
            var subwaynum = subwayinfo[0];
            var subwaypath_length = subwayinfo[1];
            propertyInfo = _.extend({}, propertyInfo, {
                management_fee:mngm_fee,
                square:square,
                subwaynum:subwaynum || 0,
                subwaypath_length:subwaypath_length || 0,
                max_floor:propertyInfo.max_floor || propertyInfo.max_floor_onrent_count,
                property_desc: propertyInfo.property_desc.replace(/\n/g, '<br />'),
                transport_info: propertyInfo.transport_info.replace(/\n/g, '<br />'),
                infrastructures: propertyInfo.infrastructures.replace(/\n/g, '<br />')
            })
            var template = _.template(PropertyDetailInfoTpl, {
                item: propertyInfo
            });
            $("#fyContainter").empty();
            $("#fyContainter").append(template).trigger('create');
            var cachProperId = Cache.getItem("MyPropertiesId");
            var propIdSeled = '';
            for(var i=0;i<cachProperId.length;i++){
                if(cachProperId[i].property_id == propertyId){
                    propIdSeled = propertyId;
                    break;
                }
            }
            if(propIdSeled != ''){
                $("#collect").addClass("active");
            }else{
                $("#collect").removeClass("active")
            }
            $("#collect").click(function(){
                self.postMyCollect(storId,estateId,propertyId);
            });
            Zepto('#fyInfo-Tabs').tabulous({
                effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
            });
            self.getPropImage(propertyId);

        },
        get_num_round: function (num, p) {
        var t = 1;
        while (p > 0) {
            t *= 10;
            p--;
        }
        return Math.round(num * t) / t;
    },
        getPropImage: function (prop_id) {
        var items_Estate = [];
        var Properties_estateId = Cache.getItem("Properties_estateId");
        _.each(Properties_estateId,function(item){
            if(item.property_id == prop_id){
                items_Estate = item.images_path;
                for(var i=0;i<items_Estate.length;i++){
                    items_Estate[i] = items_Estate[i].replace(/\s+/g,'');
                }
            }
        })
        window.Utils.Log.info(items_Estate.length, "items_Estate.length为;");
        var template = _.template(CommonBannerCont, {
            items: items_Estate
        });
        $("#bannerWpProper").empty();
        $("#bannerWpProper").append(template);
        var bullets = document.getElementById('banAct').getElementsByTagName('li');
        var banner = Swipe(document.getElementById('mySwipe'), {
            auto: 4000,
            continuous: true,
            disableScroll: false,
            callback: function (pos) {
                var i = bullets.length;
                while (i--) {
                    bullets[i].className = ' ';
                }
                bullets[pos].className = 'active';
                var item = $(".swipe-wrap .lazy-loaded").get(pos - 1);
                var imgsrc = $(item).attr('data-imgsrc');
                imgsrc && $(item).attr("src", imgsrc);
            }
        });
    },
        getEstateById: function(estateId) {
            var items = Cache.getItem("majorEstates");
            _.each(items,function(item) {
                if(item.estate_id == estateId) {
                    return item.estate_name;
                }
            });
        },
        getPropertieById: function(propertyId) {
            var getPropertiesServiceCallBack = function (resp) {
                var self = this;
                var items = [];
                if (resp.resultCode ===  'successful') {
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
                        if(thumbnails!=null && thumbnails.length > 0 ) {
                            defaultThumbnail = thumbnails.split(",")[0];
                        }
                        item = _.extend({}, item, {
                            defaultThumbnail: defaultThumbnail || "暂无数据"
                        });
                        items.push(item);
                    });

                    //Cache.setItem("Properties_" + estateId, items);
                    window.Utils.Log.info(items.length, "items.length为;");
                    var template = _.template(PropertyViewTpl, {
                        items: items
                    });

                    $("#fyList").empty();
                    $("#fyList").append(template).trigger('create');

                } else {
                    window.Utils.Log.info("get getPropertiesServiceCallBack error");
                    var template = _.template(PropertyViewTpl, {
                        items: false
                    });
                }
            };

            //var url = window.AppConfig.RemoteApiUrl + '/estates/21sijichuandadian';
            var url = 'app/data/properties.json';
            var propertyCollection = new PropertyCollection(url);
            window.Utils.Http.get({
                model: propertyCollection,
                data: {}
            }, getPropertiesServiceCallBack);
        },
        getMyPropertyId: function(){
            var getMyPropertyIdCallBack = function (resp) {
                var items = [];
                if (resp.resultCode ===  'successful') {
                    window.Utils.Log.info(resp, "getPropertiesByEstate resp");
                    var data = propertyCollection.getAll();
                    var tmp = [];
                    if(!(data instanceof Array)) {
                        tmp.push(data);
                        data = tmp;
                    }
                    _.each(data, function (item) {
                        items.push({
                            property_id: item.property_id
                        });
                    });
                    Cache.setItem("MyPropertiesId", items);

                } else {
                    window.Utils.Log.info("get getPropertiesServiceCallBack error");
                }
            };

            var url = window.AppConfig.RemoteApiUrl + '/favoriteProperties/'+ window.App.Const.UserID + '/' + window.App.Const.StorID ;
            var propertyCollection = new PropertyCollection(url);
            window.Utils.Http.get({
                model: propertyCollection,
                data: {}
            }, getMyPropertyIdCallBack);
        },
        postMyCollect: function(stoId,estId,propId){
            var cachProperId = Cache.getItem("MyPropertiesId");
            var self = this;
            var propIdSele = '';
            for(var i=0;i<cachProperId.length;i++){
                if(cachProperId[i].property_id == propId){
                    propIdSele = propId;
                    break;
                }
            }
            if(propIdSele != ''){
                var postDeleteMyCollectCallBack = function(resp){
                    if (resp.resultCode ===  'successful') {
                        $("#collect").removeClass("active")
                        window.Utils.Log.reminder("已取消收藏!");
                        self.getMyPropertyId();
                    }
                }
                var url = window.AppConfig.RemoteApiUrl + "/favoriteProperies/delete"
                var propertyCollection = new PropertyCollection(url);
                var userId = window.App.Const.UserID;
                window.Utils.Http.post({
                    model: propertyCollection,
                    headers:{
                        'R-Store-Id':stoId,
                        'R-User-Id':userId,
                        'R-Property-Id': propIdSele
                    },
                    data: {}
                },postDeleteMyCollectCallBack);
            }else{
                var postMyCollectCallBack = function(resp){
                    if (resp.resultCode ===  'successful') {
                        $("#collect").addClass("active")
                        window.Utils.Log.reminder("已添加收藏!");
                        self.getMyPropertyId();
                    }
                }
                var url = window.AppConfig.RemoteApiUrl + "/favoriteProperty"
                var propertyCollection = new PropertyCollection(url);
                var userId = window.App.Const.UserID;
                var obj = {
                    userId: userId,
                    storeId: stoId,
                    estateId: estId,
                    propertyId: propId

                };
                window.Utils.Http.post({
                    dataType: "json",
                    contentType: 'application/json',
                    model: propertyCollection,
                    data: JSON.stringify(obj)
                },postMyCollectCallBack);
            }
        },
        toggle: function() {
        }
    });
    return view;
});
