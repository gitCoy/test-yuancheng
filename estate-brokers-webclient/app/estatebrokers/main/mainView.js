define([
        'commonview/header', 'commonview/search', 'commonview/banner', 'text!commonview/tpl/common.html', 'commonview/footer', 'text!estates/tpl/estates.html', 'text!properties/tpl/properties.html',
         'estates/estateCollection', 'properties/propertyCollection','slideout', 'cache',
        'zepto_extend', 'zepto_ui', 'zepto_iscroll', 'navigator_iscroll', 'navigator','hhSwipe', 'touchslider'],
    function (CommonHeaderView, CommonSearchView, CommonBannerView, commonPageTpl, CommonFooterView, estatesTpl, propertiesTpl,
              EstateCollection, PropertiesCollection,Slideout,Cache) {

        var IndexBannerTpl =  $(commonPageTpl).filter('#tpl-indexBanner').html();
        var mainSlideTpl =  $(commonPageTpl).filter('#tpl-mainSlide').html();
        var MajorEstateTpl =  $(estatesTpl).filter('#tpl-majorEstate').html();
        var HotPropertiesTpl =  $(propertiesTpl).filter('#tpl-hotProperties').html();
        var MajorEstateContainerTpl =  $(estatesTpl).filter('#tpl-majorEstateContainer').html();
        var EstateCategoryTpl =  $(estatesTpl).filter('#tpl-estateCategory').html();
        var ldEstate, ldProperty, ldStore = true;
        var view = Backbone.View.extend({
            el: '#container',
            storeDisN: null,
            events: {
                'click button#toggle': 'toggle'
            },
            initialize: function () {

            },
            render: function () {
                var self = this;
                self.$el.empty();
                self.$el.append(mainSlideTpl);
                var stype = window.localStorage.storeType == 2 ? 1 : 0;
                $("#mainSlide").append(new CommonHeaderView().render("headerWithMenuBtn", "首页", "#","","",stype));
                $("#mainSlide").append(new CommonSearchView().render("commonSearchPage"));
                if ($(".spinneredtop").length == 0) {
                    $("#mainSlide").append(window.Utils.Log.loadAmin("spinnered"));
                }
                $("#mainSlide").append(new CommonBannerView().render("commonBannerPage"));
                $("#mainSlide").append(MajorEstateContainerTpl);
                $("#mainSlide").append(EstateCategoryTpl);
                $("#mainSlide").append(new CommonFooterView().render("commonFooterPage", 'index'));
                $("#searchButton").click(function () {
                    var searchInputValue = $("#searchInput").val();
                    Cache.setItem("searchResult", searchInputValue);
                });

                self.getMajorEstates();
                self.getHotProperty();
                self.getMyPropertyId();
                self.getLocalStore();
                //self.getStorContent();
                Cache.setItem("aboutUsActive", "");
                $("#storeName li").bind('touchstart', function(e){
                    $("#mask").remove();
                    $(".header").css("box-shadow","none");
                    var storId = $(this).attr("storIdVal");
                    window.App.Const['StorID'] = storId;
                    if(typeof(Storage)!=="undefined"){
                        localStorage.storeID = storId;
                        Cache.setItem("About_Us", "");
                        Cache.setItem("majorEstates", "");
                        Cache.setItem("HotEstate_index", "");
                        Cache.setItem("MyPropertiesId", "");
                    }
                    //location.reload();
                    self.render();
                    return false;
                });
                self.slideout();
            },
            slideout:function(){
                var menuP = $("#container").width() * 0.8;
                var slideout = new Slideout({
                    'panel': document.getElementById('mainSlide'),
                    'menu': document.getElementById('menu'),
                    'padding': menuP,
                    'tolerance': 70
                });
                $('#menuBtnA').bind('click', function() {
                    slideout.toggle();
                    if($(".slideMask").css("display") == "none"){
                        $(".header").addClass("headerMemu");
                        $(".slideMask").css("display","block");
                    }else{
                        setTimeout(function(){$(".header").removeClass("headerMemu");},600)
                        $(".slideMask").css("display","none");
                    }
                });
                $('.menu').bind('click', function(eve) {
                    if (eve.target.nodeName === 'A') { slideout.close();$(".slideMask").css("display","none");}
                });
                $('.slideMask').click(function() {
                    slideout.close();
                    $(".slideMask").css("display","none");
                    setTimeout(function(){$(".header").removeClass("headerMemu");},600)
                })

            },
            _lazyLoad: function() {
                if (ldProperty) {
                    //所有加载完成之后开始加载图片
                    self.$("img.lazy-load").each(function(index, item) {
                        var imgsrc = $(item).attr('data-imgsrc');
                        imgsrc && $(item).attr("src", imgsrc);
                    })
                }
            },
            get_num_round: function (num, p) {
                var t = 1;
                while (p > 0) {
                    t *= 10;
                    p--;
                }
                return Math.round(num * t) / t;
            },
            getLocalStore: function () {
                var myStores = Cache.getItem("storeList"), storeID = window.App.Const.StorID, that = this;
                if(myStores && myStores[storeID]) {
                    that.createStroeDom([myStores[storeID]]);
                    Cache.setItem("About_Us", [myStores[storeID]]);
                } else {
                    setTimeout(function() {
                        that.getLocalStore();
                    }, 111);

                }
            },
            getStorContent: function (serverUrl) {
                var that = this;
                var url = window.AppConfig.RemoteApiUrl + "/stores/" + window.App.Const.StorID;
                //var url = serverUrl || ("/data/" + window.App.Const.StorID + "/major_store.json");
                //如果有缓存则不请求服务器
                var data = Cache.getItem("About_Us");
                if(data && data.length != 0){
                    that.createStroeDom(data, 1);//1 表示从缓存里面获取的
                }else{
                    var propertyCollection = new PropertiesCollection(url);
                    window.Utils.Http.get({
                        model: propertyCollection,
                        data: {}
                    }, function (resp) {
                        var tmp = [];
                       if(!(resp.result instanceof Array)) {
                           tmp.push(resp.result);
                            resp['result'] = tmp;
                       }
                        if (resp.resultCode === 'successful') {
                            window.Utils.Log.info(resp, "getHostEstate resp");
                            that.createStroeDom(resp.result);
                            Cache.setItem("About_Us", resp.result);
                        }else {
                            window.Utils.Log.info("get getPropertiesServiceCallBack error");
                            window.Utils.Log.loadAminFailing();
                            window.Utils.Log.hideLoadAmin();
                            var template = _.template(IndexBannerTpl, {
                                items: false
                            });
                        }
                    }, function(data) {
                        serverUrl || that.getStorContent(window.AppConfig.RemoteApiUrl + "/stores/" + window.App.Const.StorID);
                    });
                }
            },
            createStroeDom:function(data){
                var items_ibm = [];
                var items = [];
                _.each(data, function (item) {
                    var displayName = item.display_name || "";
                    var name = item.real_name || item.nick_name;
                    $(".hd-tit span").text(displayName);
                    $("title").html("欢迎你！");
                        items_ibm = item.index_banner_images || "";
                        items_ibm = items_ibm.split(',');
                        for (var i = 0; i < items_ibm.length && i < 3; i++) {
                            items_ibm[i] = window.App.Const.THUMBNAILS_IMG_SERVER + items_ibm[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + items_ibm[i] + window.App.Thumbnails.BANNER;
                            items_ibm[i] = items_ibm[i].replace(/\s+/g, '');
                        }
                        item = _.extend({}, item, {
                            images_path: items_ibm
                        })
                        items.push(item);
                });
                //alert(items[0].index_banner_images);
                window.Utils.Log.info(items_ibm.length, "items_ibm.length为;");
                var template = _.template(IndexBannerTpl, {
                    items: items_ibm
                });
                $("#bannerWp").empty();
                $("#bannerWp").append(template);
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
            getHotProperty: function (serverUrl) {
                var that = this;
                var url = window.AppConfig.RemoteApiUrl + '/majorProperties/' + window.App.Const.StorID;
                //var url = serverUrl || ('/data/' + window.App.Const.StorID + '/major_property.json');
                //如果有缓存则不请求服务器
                var data = Cache.getItem("HotEstate_index");
                if (data && data.length != 0) {
                    that.createHotPropertyDom(data, 1)//1 表示从缓存里面获取的
                } else {
                    var propertyCollection = new PropertiesCollection(url);
                    window.Utils.Http.get({
                        model: propertyCollection,
                        data: {}
                    }, function (resp) {
                        var tmp = [];
                        if(!(resp.result instanceof Array)) {
                            tmp.push(resp.result);
                            resp['result'] = tmp;
                        }
                        if (resp.resultCode === 'successful') {
                            window.Utils.Log.info(resp, "getHostEstate resp");
                            that.createHotPropertyDom(resp.result);
                        } else {
                            window.Utils.Log.loadAminFailing();
                            window.Utils.Log.hideLoadAmin();
                            window.Utils.Log.info("get getPropertiesServiceCallBack error");
                            var template = _.template(HotPropertiesTpl, {
                                items: false
                            });
                        }
                    }, function(data) {
                        serverUrl || that.getHotProperty(window.AppConfig.RemoteApiUrl + '/majorProperties/' + window.App.Const.StorID);
                    });
                }
            },
            createHotPropertyDom: function (data, CaNum) {
                var that = this;
                var items = [], tmpEstateId = "", imgPath = [],imgPathFirst;

                _.each(data, function (item) {
                    if (CaNum != 1) {
                        var thumbnails = item.thumbnails;
                        var defaultThumbnail = "";
                        if (thumbnails != null && thumbnails.length > 0) {
                            defaultThumbnail = thumbnails.split(",")[0];
                        }
                        imgPath = item.images_path;
                        imgPath = imgPath.split(',');
                        imgPathFirst = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[0] + window.App.Thumbnails.HotProperty == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.HotProperty ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[0] + window.App.Thumbnails.HotProperty;
                        for (var i = 0; i < imgPath.length; i++) {
                            imgPath[i] = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER;
                            imgPath[i] = imgPath[i].replace(/\s+/g, '');
                        }
                        if(item.price_unit == "万元"){
                            var propType = "急售房源";
                        }else{
                            var propType = "急租房源";
                        }
                        var square = that.get_num_round(item.square,0);
                        item = _.extend({}, item, {
                            square:square,
                            estate_desc: item.estate_desc || "暂无数据",
                            defaultThumbnail: defaultThumbnail,
                            images_path: imgPath,
                            propType:propType,
                            imgPathFirst:imgPathFirst
                        });
                    }
                    items.push(item);
                    tmpEstateId = item.estate_id || ''
                });
                var tmpItems = [], itemLen = items.length;
                if (itemLen % 2 !== 0 && itemLen > 4) {
                    itemLen = itemLen - 1;
                }
                for (var i = 0; i < itemLen; i ++) {
                    tmpItems[i] = items[i];
                }
                Cache.setItem("Properties_estateId", tmpItems);
                Cache.setItem("HotEstate_index", tmpItems);

                window.Utils.Log.info(data.length, "HotEstate-item.length为;");
                var template = _.template(HotPropertiesTpl, {
                    items: tmpItems
                });

                $("#hotTabs").empty();
                $("#hotTabs").append(template).trigger('create');
                ldProperty = true;
                window.Utils.Log.hideLoadAmin();
                this._lazyLoad();
            },
            getMajorEstates: function (serverUrl) {
                var self = this;

                var url = window.AppConfig.RemoteApiUrl + '/estates/major/' + window.App.Const.StorID;
                //var url = serverUrl || ('/data/' + window.App.Const.StorID + '/major_estates.json');
                var data = Cache.getItem("majorEstates");
                //如果有缓存则不请求服务器
                if (data && data.length != 0) {
                    self.createMajorEstatesDom(data);
                    Cache.setItem("PropertiesMajorInfo", data);
                } else {
                    var estateCollection = new EstateCollection(url);
                    window.Utils.Http.get({
                        model: estateCollection,
                        data: {}
                    }, function (resp) {
                        var itemsInd = [],itemsM = [],imgPathFirst;
                        if (resp.resultCode === 'successful') {
                            window.Utils.Log.info(resp, "getEstatesServiceCallBack resp");
                            var data = estateCollection.getAll();
                            var tmp = [];
                            if(!(data instanceof Array)) {
                                tmp.push(data);
                                data = tmp;
                            }
                            _.each(data,function (item) {
                                itemsM = item.images_path || "";
                                itemsM = itemsM.split(',');
                                imgPathFirst = window.App.Const.THUMBNAILS_IMG_SERVER + itemsM[0] + window.App.Thumbnails.indexEstate == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.indexEstate ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + itemsM[0] + window.App.Thumbnails.indexEstate;
                                for(var i=0;i< itemsM.length;i++){
                                    itemsM[i] = window.App.Const.THUMBNAILS_IMG_SERVER + itemsM[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + itemsM[i] + window.App.Thumbnails.BANNER;
                                    itemsM[i] = itemsM[i].replace(/\s+/g, '');
                                }
                                item = _.extend({},item,{
                                    images_path:itemsM,
                                    imgPathFirst:imgPathFirst
                                })
                                itemsInd.push(item)
                            })
                            Cache.setItem("majorEstates", itemsInd);
                            Cache.setItem("PropertiesMajorInfo",itemsInd);
                            self.createMajorEstatesDom(itemsInd);
                        } else {
                            window.Utils.Log.loadAminFailing();
                            window.Utils.Log.hideLoadAmin();
                            window.Utils.Log.info("get getEstatesServiceCallBack error");
                            var template = _.template(MajorEstateTpl, {
                                items: false
                            });
                        }
                    }, function(data) {
                        serverUrl || self.getMajorEstates(window.AppConfig.RemoteApiUrl + '/estates/major/' + window.App.Const.StorID);
                    });
                }
            },
            createMajorEstatesDom: function (data) {
                var items = [], imgPath = "";
                _.each(data, function (item) {
                    var subwayinfo = item.subway_info || "";
                    subwayinfo = subwayinfo.split(",");
                    var subwaynum = subwayinfo[0] != "" ? subwayinfo[0] + "号线" : "";
                    var subwaypath_length = subwayinfo[1] != "" ? subwayinfo[1] + "米" : "";
                    item = _.extend({}, item, {
                        estate_desc: item.estate_desc || "暂无数据",
                        schools: item.schools.length > 8 ? item.schools.substring(0, 6) + "..." : item.schools,
                        subwaynum: subwaynum,
                        subwaypath_length: subwaypath_length
                    });
                    imgPath = "";
                    items.push(item);
                });
                window.Utils.Log.info(items.length, "items.length为;");
                var template = _.template(MajorEstateTpl, {
                    items: items
                });

                $("#homeTab").empty();
                $("#homeTab").append(template).trigger('create');
                window.majorEstateSwipe = Swipe(document.getElementById('majorEstate'), {
                    auto: false,
                    continuous: false,
                    disableScroll: false,
                    callback: function (pos) {
                        Zepto('#nav-smartSetup').navigator("switchTo",pos);
                        var item = $(".swipe-wrap .lazy-loaded").get(pos + 1);
                        var imgsrc = $(item).attr('data-imgsrc');
                        imgsrc && $(item).attr("src", imgsrc);
                    }
                });
            },
            getMyPropertyId: function (serverUrl) {
                var that = this;
                var getMyPropertyIdCallBack = function (resp) {
                    var items = [];
                    if (resp.resultCode === 'successful') {
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

                var url = window.AppConfig.RemoteApiUrl + '/favoriteProperties/' + window.App.Const.UserID + '/' + window.App.Const.StorID;
                //var url = serverUrl || ('data/' + window.App.Const.StorID + '/major_favorite.json');
                var propertyCollection = new PropertiesCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
                    data: {}
                }, getMyPropertyIdCallBack);
            },
            toggle: function () {
                this.$("#hello").toggle();
                return this;
            }
        });
        return view;
    });
