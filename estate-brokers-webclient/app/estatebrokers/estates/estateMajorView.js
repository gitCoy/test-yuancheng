define([
        'commonview/header', 'commonview/footer', 'text!estates/tpl/estates.html', 'text!properties/tpl/properties.html',
        'properties/propertyCollection', 'cache', 'zepto_iscroll', 'loadUpdate', 'drowSelect'],
    function (CommonHeaderView, CommonFooterView, estatesPage, propertiesPage,PropertyCollection, Cache) {

        var EstateMajorPage =  $(estatesPage).filter('#tpl-estatesMajor').html();
        var propertySelectPage =  $(propertiesPage).filter('#tpl-propertySelectMajor').html();
        var estateContainerPage =  $(estatesPage).filter('#tpl-estateContainer').html();
        //主页内容
        //小区房源列表筛选条件
        var filterData = {
            estate: [
                {
                    label: "单价",
                    name: "average_price",
                    values: [{key: '-5000', val: '5000以下'}, {
                        key: '%2b5000,-10000',
                        val: '5千-1万'
                    }, {key: '%2b10000,-15000', val: '1万-1万5'}, {key: '%2b15000', val: '1万5以上'}],
                }, {
                    label: "出售量",
                    name: "onsales_count",
                    values: [{key: '%2b1', val: '从多到少'}, {key: '1', val: '从少到多'}]
                }, {
                    label: "出租量",
                    name: 'onrent_count',
                    values: [{key: '%2b1', val: '从多到少'}, {key: '1', val: '从少到多'}]
                }, {
                    label: "类型",
                    name: "estate_type",
                    values: [{key: '1', val: '住宅'}, {key: '8', val: '别墅'}, {
                        key: '2',
                        val: '写字楼'
                    }, {key: '4', val: '商铺'}]
                }
            ]
        };

        var view = Backbone.View.extend({
            el: '#container',
            events: {
                // "click .diy_select_list>li.estate":"onFilterChange"
            },
            initialize: function () {

            },
            onFilterChange: function (that) {
                var targetLi = this.$(that).parent().parent(), otherLis = targetLi.siblings();
                var name = targetLi.find(".diy_select_input").attr("name"), value = targetLi.find(".diy_select_input").val();
                var key = this.$(that).attr("data-val");
                otherLis.each(function(key, val){
                    $(val).find(".diy_select_input").removeAttr("val");
                    $(val).find(".diy_select_txt a").html($(val).find(".diy_select_txt").attr("data-default"));
                    $(val).find(".diy_select_usual a").html("默认");
                })
                var param = name + '=' + key;

                this.getPropertiesByEstate(2,param);

            },
            onPaging: function(that,first,param,sort,items_list, cs){
                if(cs){
                    var targetLi = this.$(that).parent().parent(), otherLis = targetLi.siblings();
                }else{
                    var targetLi = this.$(that).parent(), otherLis = targetLi.siblings();
                }
                otherLis.each(function(key, val){
                    $(val).find(".diy_select_input").removeAttr("val");
                    $(val).find(".diy_select_txt a").html($(val).find(".diy_select_txt").attr("data-default"));
                    $(val).find(".diy_select_usual a").html("默认");
                })
                this.getPropertiesByEstate(first,param,sort,items_list);
            },
            render: function () {
                this.getPropertiesByEstate(1,"");
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", "主营小区", "#"));
                $("title").html($(".hd-tit").text());
                //that.$el.append(propertySelectMajorPage);
                var temp = _.template(propertySelectPage, {items: filterData['estate']})
                that.$el.append(temp);
                that.$el.append(estateContainerPage);
                if ($(".spinneredtop").length == 0) {
                    that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                }
                new diy_select();
                that.$('.diy_select_list>li').click(function () {
                    if ($(".spinneredtop").length == 0 || $(".spinnered").length == 0) {
                        that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                    }
                    if (this.parentNode.index == 1 || this.parentNode.index == 4) {
                        that.onFilterChange(this);
                    } else {
                        var itemsed = Cache.getItem("PropertiesMajorListFirst") || "";
                        if(this.parentNode.index == 2){ //判断点击的是出租还是出售量，
                            if($(this).index() == 0){//从多到少
                                itemsed = new diy_select().estateSort(itemsed,1,2);//1 出售，2从多到少
                            }else{//从少到多
                                itemsed = new diy_select().estateSort(itemsed,1,1);
                            }
                        }else if(this.parentNode.index == 3){
                            if($(this).index() == 1){
                                itemsed = new diy_select().estateSort(itemsed,2,1);//2出租
                            }else{
                                itemsed = new diy_select().estateSort(itemsed,2,2);
                            }
                        }
                        that.onPaging(this,2,"",1,itemsed, true);
                    }
                });
                that.$('.diy_select_usual').click(function () {
                    if ($(".spinneredtop").length == 0 || $(".spinnered").length == 0) {
                        that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                    }
                    that.onPaging(this,2,"");
                });

            },
            getPropertiesByEstate: function (first,param,sort,items_list) {
                var getPropertiesServiceCallBack = function (resp) {
                    var self = this;
                    var items = [], imgPath = [],imgPathFirst;
                    if (resp.resultCode === 'successful') {
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
                                imgPath[i] = imgPath[i].replace(/\s+/g, '');
                            }
                            item = _.extend({}, item, {
                                defaultThumbnail: defaultThumbnail,
                                images_path: imgPath,
                                imgPathFirst: imgPathFirst,
                            })
                            if(sort == 1){
                                items = items_list;
                            }else{
                                items.push(item);
                            }
                        });
                        window.Utils.Log.info(items.length, "items.length为;");
                        Cache.setItem("PropertiesMajorInfo", items);
                        if (first == 1) {
                            Cache.setItem("PropertiesMajorListFirst", items);
                        }
                        var template = _.template(EstateMajorPage, {
                            items: items
                        });
                        $("#fyList").empty();
                        $("#fyList").append(template).trigger('create');
                        if(items.length == 0){
                            $("#fyList").append("<li style='text-align: center;margin-top: 40px;'>暂无数据！</li>");
                        }
                        window.Utils.loadUpdate.prototype._initNoLoad();

                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(EstateMajorPage, {
                            items: false
                        });
                    }
                };
                var param = param || "";
                var url = window.AppConfig.RemoteApiUrl + '/estates/' + window.App.Const.StorID + '?' + param;
                //var url = window.AppConfig.RemoteApiUrl + '/estates/' + window.App.Const.StorID + '?' + param;
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
