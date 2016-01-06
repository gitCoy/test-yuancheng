define([
        'commonview/header', 'commonview/footer','text!properties/tpl/properties.html','commonview/search','properties/propertyCollection',
        'cache','loadUpdate','tabulous'],
    function (CommonHeaderView, CommonFooterView,propertiesPage,CommonSearchView,PropertyCollection, Cache) {
        //主页内容

        var propertySearchPage =  $(propertiesPage).filter('#tpl-propertySearch').html();
        var noSearchPage =  $(propertiesPage).filter('#tpl-noSearch').html();
        var propertyContainerPage =  $(propertiesPage).filter('#tpl-propertyContainer').html();
        var PropertySearchList =  $(propertiesPage).filter('#tpl-propertySearchList').html();
        var items_prop = [], items_estate = [];
        var view = Backbone.View.extend({
            el: '#container',
            events: {
                'click button#toggle' : 'toggle'
            },
            initialize: function () {

            },
            render: function() {
                var that = this;
                var cumulative = 1;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", "搜索结果", "#",'0 '));
                $("title").html($(".hd-tit").text());
                that.$el.append(new CommonSearchView().render("commonSearchPage"));
                //that.$el.append(new CommonFooterView().render("commonFooterPage"));
                that.$el.append(propertySearchPage);
                if ($(".spinneredtop").length == 0) {
                    that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                }
                $("#searchButton").click(function(){
                    cumulative = 1;
                    if ($(".spinneredtop").length == 0 || $(".spinnered").length == 0) {
                        that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                    }
                    var searchInputValue = $("#searchInput").val() || "";
                    Cache.setItem("searchResult",searchInputValue);
                    var searchCach = Cache.getItem("searchResult");
                    that.getSearchResult(1,window.App.Const.loadImageSize,2,searchCach,1);
                })
                var searchCach = Cache.getItem("searchResult");
                that.getSearchResult(1,window.App.Const.loadImageSize,2,searchCach,1);
                window.Utils.loadUpdate().down(function(){
                    var searchCachd = Cache.getItem("searchResult");
                    cumulative += 1;
                    that.getSearchResult(cumulative,window.App.Const.loadImageSize,1,searchCachd,2);
                    var items = Cache.getItem("searchAll");
                    if(items != null && items != undefined && items.length != 0){
                        return cumulative;
                    }
                }).up(function(){
                    var searchCachu = Cache.getItem("searchResult");
                    cumulative = 1;
                    that.getSearchResult(cumulative,window.App.Const.loadImageSize,2,searchCachu,1);
                    return cumulative;
                });
            },
            getSearchResult: function(paged,pageSized,laRampties,param,marker) {
                var self = this;
                var getPropertiesServiceCallBack = function (resp) {
                    var items = [],items_ibm = [],imgPathFirst;
                    if (resp.resultCode ===  'successful') {
                        window.Utils.Log.info(resp, "getPropertiesByEstate resp");
                        var data = propertyCollection.getAll();
                        var tmp = [];
                        if(!(data instanceof Array)) {
                            tmp.push(data);
                            data = tmp;
                        }
                            _.each(data, function (item) {
                                items_ibm = item.images_path || "";
                                items_ibm = items_ibm.split(',');
                                imgPathFirst = window.App.Const.THUMBNAILS_IMG_SERVER + items_ibm[0] + window.App.Thumbnails.LISTIMG == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.LISTIMG ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + items_ibm[0] + window.App.Thumbnails.LISTIMG;
                                for(var i=0;i< items_ibm.length;i++){
                                    items_ibm[i] = window.App.Const.THUMBNAILS_IMG_SERVER + items_ibm[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + items_ibm[i] + window.App.Thumbnails.BANNER;
                                    items_ibm[i] = items_ibm[i].replace(/\s+/g,'');
                                }
                                var square = self.get_num_round(item.square,0);
                                if(item.category == "PROP"){
                                    item = _.extend({}, item, {
                                        square:square,
                                        "property_id":item.id,
                                        "property_title": item.title,
                                        "price": item.price,
                                        property_desc:item.desc,
                                        "price_unit": item.price_unit,
                                        "management_fee":item.property_fee,
                                        images_path:items_ibm,
                                        imgPathFirst:imgPathFirst
                                    });
                                    //items_prop = _.extend({},items_prop,item);
                                    items.push(item);
                                }else{
                                    item = _.extend({}, item, {
                                        "estate_id":item.id,
                                        "title": item.title,
                                        "average_price": item.price,
                                        "price_unit": item.price_unit,
                                        images_path:items_ibm,
                                        "estate_type":item.type,
                                        "management_fee":item.property_fee,
                                        "post_address":item.address,
                                        "room_info":item.phones,
                                        imgPathFirst:imgPathFirst
                                    });
                                    //items_estate = _.extend({},items_estate,item);
                                    items.push(item);
                                }

                            });
                        for(var i=0;i<items.length;i++){
                            if(items[i].category == "PROP"){
                                items_prop.push(items[i]);
                            }else{
                                items_estate.push(items[i]);
                            }
                        }
                        window.Utils.Log.info(items.length, "items.length为;");
                        if(marker == 1){
                            if(items.length != 0){
                                Cache.setItem("Properties_estateId", items_prop);
                                Cache.setItem("PropertiesMajorInfo", items_estate);
                                Cache.setItem("searchAll",items);
                                var template = _.template(PropertySearchList, {
                                    items: items
                                });
                            }else{
                                var template = _.template(noSearchPage, {
                                    items: items
                                });
                            }
                        }else{
                            if(items.length != 0){
                                Cache.setItem("Properties_estateId", items_prop);
                                Cache.setItem("PropertiesMajorInfo", items_estate);
                                Cache.setItem("searchAll",items);
                                var template = _.template(PropertySearchList, {
                                    items: items
                                });
                            }else{
                                window.Utils.loadUpdate.prototype.loadUpCompl("亲，没有更多内容了！");
                            }
                        }

                        if(laRampties == 1){
                            $("#fyList").append(template).trigger('create');
                        }else{
                            $("#fyList").empty();
                            $("#fyList").append(template).trigger('create');
                           window.Utils.loadUpdate({wrapper:"fyWrapper",scrollbarClass:"fyScroller"}).loadDownJiazai("上拉加载更多...");
                        }
                        if(param == "" || param == "全部"){
                            $(".searchRemind").html("全部");
                            $("#searchInput").attr("value","全部");
                        }else{
                            $(".searchRemind").html(param);
                            $("#searchInput").attr("value",param);
                        }
                        //window.Utils.loadUpdate({wrapper:"fyWrapper",scrollbarClass:"fyScroller"});
                        Zepto('#fyList').tabulous({
                            effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                        });
                        setTimeout(function(){window.Utils.Log.hideLoadAmin()},1000);
                       // window.Utils.Log.hideLoadAmin();
                    } else {
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(PropertySearchList, {
                            items: false
                        });
                    }
                };
                param = param == "全部" ? "" : param;
                paged = paged || '';
                pageSized = pageSized || '';
                var url =window.AppConfig.RemoteApiUrl + '/search/' + window.App.Const.StorID + '?page=' + paged + "&pageSize=" + pageSized;
                var propertyCollection = new PropertyCollection(url);
                var searchTxt = encodeURIComponent(param);
                window.Utils.Http.get({
                    model: propertyCollection,
                    headers:{
                        "X-User-Id": window.App.Const.UserID,
                        'S-Search-Title':searchTxt,
                        'parent_store_id': localStorage.parentID
                    },
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
