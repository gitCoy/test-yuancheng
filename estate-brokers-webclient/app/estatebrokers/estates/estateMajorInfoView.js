define([
        'commonview/header', 'text!commonview/tpl/common.html', 'commonview/banner','properties/propertyDetailFooter', 'text!estates/tpl/estates.html',
          'properties/propertyCollection',  'cache','loadUpdate','tabulous','hhSwipe'],
    function (CommonHeaderView, commonPage, CommonBannerView, PropertyDetailFooterView, estatesPage,PropertyCollection, Cache) {

        var NavigateBarTpl =  $(commonPage).filter('#tpl-navigateBar').html();
        var CommonBannerCont =  $(commonPage).filter('#tpl-bannerCont').html();
        var EstateMajorInfoTpl =  $(estatesPage).filter('#tpl-estateMajorInfo').html();
        var estateInfoHouseContPage =  $(estatesPage).filter('#tpl-estateInfoHouseCont').html();
        var estateInfoHouseList =  $(estatesPage).filter('#tpl-estateInfoHouseList').html();
        var estatesMajorPage =  $(estatesPage).filter('#tpl-estatesMajor').html();
            propOnSale = [],
            propOnRent = []
        var view = Backbone.View.extend({
            el: '#container',
            events: {},
            propertyInfo: null,
            count: 1,
            /*events: {
                'click a#around_estate': 'toggle'
            },*/
            initialize: function () {
            },
            render: function (propertyInfo) {
                var roomInfoed = [];
                this.propertyInfo = propertyInfo;
                var property_all = propertyInfo.onsales_count + propertyInfo.onrent_count;
                var propertyTitle = propertyInfo.estate_name;
                var PropEstateId = propertyInfo.estate_id;
                var phone = propertyInfo.phones;
                var self = this;
                self.$el.empty();
                self.$el.append(new CommonHeaderView().render("headerWithBackBtn", (propertyTitle || ""), "#", 0, {'phone': phone}));
                $("title").html($(".hd-tit").text());
                self.$el.append(NavigateBarTpl);
                self.$el.append(new CommonBannerView().render("bannerPropertyPage"));
                self.$el.append('<div id="fyContainter"></div>');
                var around = propertyInfo.aroundings;
                if (around) {
                    around = around.split(",");
                    var around_count = around.length;
                } else {
                    around_count = 0
                }
                var estateTypt = propertyInfo.estate_type;
                switch (estateTypt) {
                    case 1:
                        estateTypt = "住宅";
                        break;
                    case 2:
                        estateTypt = "写字楼";
                        break;
                    case 4:
                        estateTypt = "商铺";
                        break;
                    case 8:
                        estateTypt = "别墅";
                        break;
                }
                var mngm_fee = self.get_num_round(propertyInfo.management_fee,2);
                var subwayinfo = propertyInfo.subway_info || "";
                subwayinfo = subwayinfo.split(",");
                var subwaynum = subwayinfo[0];
                var subwaypath_length = subwayinfo[1];
                var roomInfo = propertyInfo.room_info || "";
                roomInfo = roomInfo.split(";");
                for(var rnum=0;rnum<roomInfo.length;rnum++){
                    roomInfo[rnum] = roomInfo[rnum];
                    roomInfoed[rnum] = roomInfo[rnum].split(",");
                    if(roomInfoed[rnum][0]<= "4"){
                        if(roomInfoed[rnum][2] == undefined){
                            roomInfoed[rnum][2] = "";
                        }else{
                            roomInfoed[rnum][2] = "-"+ roomInfoed[rnum][2];
                        }
                        switch(roomInfoed[rnum][0]){
                            case "1" : roomInfoed[rnum][0] = "套一";roomInfoed[rnum][1] = "(" + roomInfoed[rnum][1] + roomInfoed[rnum][2] + "㎡)";var room_info_1 = roomInfoed[rnum];break;
                            case "2" : roomInfoed[rnum][0] = "套二";roomInfoed[rnum][1] = "(" + roomInfoed[rnum][1] + roomInfoed[rnum][2] + "㎡)";var room_info_2 = roomInfoed[rnum];break;
                            case "3" : roomInfoed[rnum][0] = "套三";roomInfoed[rnum][1] = "(" + roomInfoed[rnum][1] + roomInfoed[rnum][2] + "㎡)";var room_info_3 = roomInfoed[rnum];break;
                            case "4" : roomInfoed[rnum][0] = "套四";roomInfoed[rnum][1] = "(" + roomInfoed[rnum][1] + roomInfoed[rnum][2] + "㎡)";var room_info_4 = roomInfoed[rnum];break;
                        }
                    }else{break;}
                }

                propertyInfo = _.extend({}, propertyInfo, {
                    property_all: property_all,
                    onsales_count: propertyInfo.onsales_count || 0,
                    onrent_count: propertyInfo.onrent_count || 0,
                    around_count: around_count || 0,
                    max_floor: propertyInfo.max_floor || propertyInfo.max_floor_onrent_count,
                    estate_type: estateTypt,
                    management_fee:mngm_fee,
                    subwaynum:subwaynum || "",
                    subwaypath_length:subwaypath_length || "",
                    room_info_1:room_info_1 || "",
                    room_info_2:room_info_2 || "",
                    room_info_3:room_info_3 || "",
                    room_info_4:room_info_4 || ""
                })
                var template_estCon = _.template(estateInfoHouseContPage, {
                    item: propertyInfo
                });
                self.$el.append(template_estCon);
                //self.$el.append(new PropertyDetailFooterView().render("propertyDetailFooterPage"));

                var template = _.template(EstateMajorInfoTpl, {
                    item: propertyInfo
                });
                //self.$el.append(new EstateInfoHouseListView().render(PropEstateId));

                $("#fyContainter").empty();
                $("#fyContainter").append(template).trigger('create');
                self.getEstateImage(PropEstateId);
                self.getPropertiesRelation(PropEstateId);
                var estateAround = propertyInfo.aroundings;
                self.getPropertiesAround(PropEstateId, 'onAmbitus',estateAround);
                //创建底部房源列表
                self.getPropertiesByEstate();
            },
            get_num_round: function (num, p) {
                var t = 1;
                while (p > 0) {
                    t *= 10;
                    p--;
                }
                return Math.round(num * t) / t;
            },
            getEstateById: function (estateId) {
                var items = Cache.getItem("majorEstates");
                _.each(items, function (item) {
                    if (item.estate_id == estateId) {
                        return item.estate_name;
                    }
                });
            },
            getEstateImage: function (estate_id) {
                var items_Estate = [];
                var Properties_estateId = Cache.getItem("PropertiesMajorInfo");
                _.each(Properties_estateId, function (item) {
                    if (item.estate_id == estate_id) {
                        items_Estate = item.images_path
                        for (var i = 0; i < items_Estate.length; i++) {
                            items_Estate[i] = items_Estate[i].replace(/\s+/g, '');
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
            getPropertiesRelation: function (estateId) {
                var that = this;
                //加载插件
                Zepto('#xql-tabs').tabulous({
                    effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                });
                //依次加载，减少阻塞
                that.getEstateProperties(estateId, 'onSale', function () {
                    that.getEstateProperties(estateId, 'onRent', function () {
                        that.getPropertiesAll("onProp");
                    });
                });
            },
            getEstateProperties: function (estateId, modeKey, callback) {
                var that = this;
                estateId = estateId || '';
                var mode = {'onRent': 'onRent', 'onSale': 'onSale'}[modeKey];
                var url = mode ? window.AppConfig.RemoteApiUrl + '/properties/' + window.App.Const.StorID + '/' + estateId + "/"
                + mode + "" : 'app/data/properties.json';
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var items = [], imgPath = [],imgPathFirst;
                    if (resp.resultCode === 'successful') {
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
                                imgPath[i] = imgPath[i].replace(/\s+/g, '');
                            }
                            var square = that.get_num_round(item.square,0);
                            item = _.extend({}, item, {
                                square:square,
                                property_addr: item.property_addr || '暂无数据',
                                defaultThumbnail: defaultThumbnail,
                                images_path: imgPath,
                                imgPathFirst:imgPathFirst
                            })
                            items.push(item);
                        });
                        if (that.count == 1) {
                            propOnSale = items;
                            $("#onsales_count").text(items.length);
                            that.count += 1;
                        } else {
                            propOnRent = items;
                            $("#onrent_count").text(items.length);
                            that.count = 1;
                        }
                        //Cache.setItem("Properties_estateId", items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        var template = _.template(estateInfoHouseList, {
                            items: items
                        });
                        if(items.length == 0){
                            $("#tabsContainer_" + modeKey).empty();
                            $("#tabsContainer_" + modeKey).append("<li>暂无数据！</li>");
                        }else{
                            $("#tabsContainer_" + modeKey).append(template);
                        }

                        Zepto('#xql-tabs').tabulous({
                            effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                        });
                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(estateInfoHouseList, {
                            items: false
                        });
                        $("#tabsContainer_" + modeKey).append(template);
                    }
                    callback && callback.call();
                };

                //var url = window.AppConfig.RemoteApiUrl + '/estates/1234';
                //var url = window.AppConfig.RemoteApiUrl + '/data/major_estates.json';
                url = url || 'app/data/properties.json';
                var propertyCollection = new PropertyCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
                    data: {}
                }, getPropertiesServiceCallBack);
            },
            getPropertiesAll: function (modeKey) {
                var self = this;
                var items = [];
                items = propOnRent.concat(propOnSale);
                //Cache.setItem("Properties_estateId", items);
                window.Utils.Log.info(items.length, "items.length为;");
                var template = _.template(estateInfoHouseList, {
                    items: items
                });
                Cache.setItem("Properties_estateId", items);
                $("#property_all").text(items.length);
                if(items.length == 0){
                    $("#tabsContainer_" + modeKey).empty();
                    $("#tabsContainer_" + modeKey).append("<li>暂无数据！</li>");
                }else{
                    $("#tabsContainer_" + modeKey).append(template);
                }
                Zepto('#xql-tabs').tabulous({
                    effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                });
                window.Utils.Log.hideLoadAmin();
            },
            getPropertiesAround: function (estateId, modeKey,estateAround) {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var items = [], imgPath = [],imgPathFirst;
                    if (resp.resultCode === 'successful') {
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
                                imgPath[i] = imgPath[i].replace(/\s+/g, ' ');
                            }
                            item = _.extend({}, item, {
                                property_addr: item.property_addr || '暂无数据',
                                defaultThumbnail: defaultThumbnail,
                                images_path: imgPath,
                                imgPathFirst:imgPathFirst
                            })
                            items.push(item);
                        });
                        //Cache.setItem("PropertiesMajorInfo", items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        var template = _.template(estatesMajorPage, {
                            items: items
                        });
                        if(items.length == 0){
                            $("#tabsContainer_" + modeKey).empty();
                            $("#tabsContainer_" + modeKey).append("<li>暂无数据！</li>");
                        }else{
                            $("#tabsContainer_" + modeKey).empty();
                            $("#tabsContainer_" + modeKey).append(template);
                        }
                        Zepto('#xql-tabs').tabulous({
                            effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                        });
                        $("#around_count").text(items.length);
                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(estatesMajorPage, {
                            items: false
                        });
                        $("#tabsContainer_" + modeKey).append(template);
                    }
                };
                estateAround = estateAround || "";
                estateId = estateId || '';
                var url = window.AppConfig.RemoteApiUrl + '/estates/' + window.App.Const.StorID + '/' + estateId + "/onAround";
                var propertyCollection = new PropertyCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
                    headers: {
                        "R-Estates-ID": estateAround,
                        "X-User-Id": window.App.Const.UserID
                    },
                    data: {}
                }, getPropertiesServiceCallBack);
            },
            getPropertiesByEstate: function () {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var items = [], imgPath = [];
                    if (resp.resultCode === 'successful') {
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
                            for (var i = 0; i < imgPath.length; i++) {
                                imgPath[i] = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER;
                                imgPath[i] = imgPath[i].replace(/\s+/g, '');
                            }
                            item = _.extend({}, item, {
                                defaultThumbnail: defaultThumbnail,
                                images_path: imgPath
                            })
                            items.push(item);
                        });
                        window.Utils.Log.info(items.length, "items.length为;");
                        Cache.setItem("PropertiesMajorInfo", items);


                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                    }
                };
                var url = window.AppConfig.RemoteApiUrl + '/estates/' + window.App.Const.StorID;
                var propertyCollection = new PropertyCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
                    data: {}
                }, getPropertiesServiceCallBack);
            },
            toggle: function () {
            }
        });
        return view;
    });
