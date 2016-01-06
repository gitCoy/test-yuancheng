define([
        'commonview/header', 'commonview/footer','text!properties/tpl/properties.html','properties/propertyCollection',
        'cache','zepto_iscroll','loadUpdate','drowSelect'],
    function (CommonHeaderView, CommonFooterView, propertiesPage, PropertyCollection,  Cache) {

        var propertySelectPage =  $(propertiesPage).filter('#tpl-propertySelectMajor').html();
        var houseUrgentPage =  $(propertiesPage).filter('#tpl-houseUrgent').html();
        var PropertyViewTpl =  $(propertiesPage).filter('#tpl-propertyOnSaleList').html();
        var PropertyContainer =  $(propertiesPage).filter('#tpl-propertyContainer').html();
        //小区房源列表筛选条件
        var filterData = {
            anxious: [
                {
                    label:"总价",
                    name: "price",
                    values:[{key:'-40',val:'40万以下'},{key:'%2b40,-80',val: '40-80万'}, {key:'%2b80,-120',val: '80-120万'}, {key:'%2b120',val:'120万以上'}],

                },{
                    label:"面积",
                    name: "square",
                    values:[{key:'-50',val:'50m²以下'}, {key:'%2b50,-90',val:'50-90m²'},{key:'%2b90,-140',val:'90-140m²'},{key:'%2b140',val: '140m²以上'}]
                },{
                    label:"户型",
                    name: 'bedroom',
                    values:[{key:'1',val:'一室'}, {key:'2',val:'二室'}, {key:'3',val:'三室'}, {key:'%2b3',val:'三室以上'}],
                }
            ],
            online: [
                {
                    label:"总价",
                    name: "price",
                    values:[{key:'-40',val:'40万以下'},{key:'%2b40,-80',val: '40-80万'}, {key:'%2b80,-120',val: '80-120万'}, {key:'%2b120',val:'120万以上'}],

                },{
                    label:"面积",
                    name: "square",
                    values:[{key:'-50',val:'50m²以下'}, {key:'%2b50,-90',val:'50-90m²'},{key:'%2b90,-140',val:'90-140m²'},{key:'%2b140',val: '140m²以上'}]
                },{
                    label:"户型",
                    name: 'bedroom',
                    values:[{key:'1',val:'一室'}, {key:'2',val:'二室'}, {key:'3',val:'三室'}, {key:'%2b3',val:'三室以上'}],
                }
            ],
            urgent: [
                {
                    label:"租金",
                    name: "price",
                    values:[{key:'-500',val:'500以下'},{key:'%2b500,-1500',val: '500-1500'}, {key:'%2b1500,-3000',val: '1500-3000'}, {key:'%2b3000',val:'3000以上'}],

                },{
                    label:"户型",
                    name: 'bedroom',
                    values:[{key:'1',val:'一室'}, {key:'2',val:'二室'}, {key:'3',val:'三室'}, {key:'%2b3',val:'三室以上'}],
                },{
                    label:"合租/整租",
                    name: 'buzz_mode',
                    values:[{key:'1',val:'整租'},{key:'2',val:'合租'} , {key:'4',val:'单间'}],
                }
            ]
        };
        var titleLabels = {
            anxious: '急售房源',
            online: '在售房源',
            urgent: '出租房源'
        };
        var itemsAll = [];
        var view = Backbone.View.extend({
            el: '#container',
            events: {
                //"click .diy_select_list>li.urgent":"onFilterChange"
            },
            initialize: function () {

            },
            onFilterChange: function(pages,pageSizes,that,pageKey,usual){
                if(usual != 1){
                    var targetLi = this.$(that).parent().parent(), otherLis = targetLi.siblings();
                }else{
                    var targetLi = this.$(that).parent(), otherLis = targetLi.siblings();
                }
                var name = targetLi.find(".diy_select_input").attr("name"), value = targetLi.find(".diy_select_input").val();
                var key = this.$(that).attr("data-val");
                otherLis.each(function(key, val){
                    $(val).find(".diy_select_input").removeAttr("val");
                    $(val).find(".diy_select_txt a").html($(val).find(".diy_select_txt").attr("data-default"));
                    $(val).find(".diy_select_usual a").html("默认");
                })
                if(key == undefined){
                    Cache.setItem("param","");
                }else{
                    Cache.setItem("param",name + '=' + key);
                }
                this.getPropertiesByEstate(pages,pageSizes,pageKey);
            },
            onPaging: function(pages,pageSizes,pageKey,laRampty){
                this.getPropertiesByEstate(pages,pageSizes,pageKey,laRampty);
            },
            render: function(pageKey) {
                var that = this;
                Cache.setItem("param","");
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", titleLabels[pageKey], "#"));
                $("title").html($(".hd-tit").text());
                //that.$el.append(new CommonFooterView().render("commonFooterPage"));
                var temp = _.template(propertySelectPage,{items:filterData[pageKey]})
                that.$el.append(temp);
                that.$el.append(PropertyContainer);
                if ($(".spinneredtop").length == 0) {
                    that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                }
                that.getPropertiesByEstate(1,window.App.Const.loadImageSize,pageKey);
                //that.estateId = estateId;
                //var estateName = that.getEstateById(estateId);

                new diy_select();
                var cumulative = 1;
                that.$('.diy_select_list>li').click(function(){
                    if ($(".spinneredtop").length == 0 || $(".spinnered").length == 0) {
                        that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                    }
                    that.onFilterChange(1,window.App.Const.loadImageSize,this,pageKey);
                    cumulative = 1;
                });
                that.$('.diy_select_usual').click(function(){
                    if ($(".spinneredtop").length == 0 || $(".spinnered").length == 0) {
                        that.$el.append(window.Utils.Log.loadAmin("spinnered"));
                    }
                    that.onFilterChange(1,window.App.Const.loadImageSize,this,pageKey,1);
                    cumulative = 1;
                });
                window.Utils.loadUpdate().down(function(){
                    cumulative += 1;
                    that.onPaging(cumulative,window.App.Const.loadImageSize,pageKey,1);
                    var items = Cache.getItem("Properties_estateId");
                    if(items != null && items != undefined && items.length != 0){
                        return cumulative;
                    }
                }).up(function(){
                    cumulative = 1;
                    that.onPaging(cumulative,window.App.Const.loadImageSize,pageKey,2);
                    return cumulative;
                });
            },
            getEstateById: function(estateId) {
                var items = Cache.getItem("majorEstates");
                for (var i=0; i < items.length; i++) {
                    var item =   items[i];
                    if(item.estate_id == estateId) {
                        return item.estate_name;
                    }
                }
            },
            getPropertiesByEstate: function(paged,pageSized,pageKey,laRampties,param) {
                var self = this;
                var getPropertiesServiceCallBack = function (resp) {
                    var items = [];
                    var imgPath = [],imgPathFirst;
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
                            imgPath = item.images_path;
                            imgPath = imgPath.split(',');
                            imgPathFirst = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[0] + window.App.Thumbnails.LISTIMG == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.LISTIMG ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[0] + window.App.Thumbnails.LISTIMG;
                            for(var i=0;i< imgPath.length;i++){
                                imgPath[i] = window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER == window.App.Const.THUMBNAILS_IMG_SERVER + window.App.Thumbnails.BANNER ? "images/default.png" : window.App.Const.THUMBNAILS_IMG_SERVER + imgPath[i] + window.App.Thumbnails.BANNER;
                                imgPath[i] = imgPath[i].replace(/\s+/g, '');
                            }
                            var square = self.get_num_round(item.square,0);
                            item = _.extend({},item,{
                                square:square,
                                defaultThumbnail: defaultThumbnail,
                                images_path:imgPath,
                                imgPathFirst:imgPathFirst
                            })
                            items.push(item);
                            itemsAll.push(item);
                        });
                       // Cache.setItem("Properties_" + estateId, items);
                        window.Utils.Log.info(items.length, "items.length为;");
                        if(items.length != 0){
                            Cache.setItem("Properties_estateId", itemsAll);
                            var template = _.template(PropertyViewTpl, {
                                items: items
                            });
                        }else{
                            window.Utils.loadUpdate.prototype.loadUpCompl("亲，没有更多内容了！");
                        }

                        if(laRampties == 1){
                            $("#fyList").append(template).trigger('create');
                        }else{
                            $("#fyList").empty();
                            $("#fyList").append(template).trigger('create');
                            if(items.length == 0){
                                $("#fyList").append("<li style='text-align: center;margin-top: 40px;'>暂无数据！</li>");
                            }
                            window.Utils.loadUpdate({wrapper:"fyWrapper",scrollbarClass:"fyScroller"}).loadDownJiazai("上拉加载更多...");
                        }
                        //setTimeout(function(){window.Utils.Log.hideLoadAmin()},1000);
                    } else {
                        window.Utils.Log.hideLoadAmin();
                        $("#container").append(window.Utils.Log.loadAminFailing());
                        window.Utils.Log.info("get getPropertiesServiceCallBack error");
                        var template = _.template(PropertyViewTpl, {
                            items: false
                        });
                    }
                };
                var param = Cache.getItem("param") || "";
                paged = paged || '';
                pageSized = pageSized || '';
                var Pagekey = pageKey;
                if(Pagekey == 'online'){
                    var url = window.AppConfig.RemoteApiUrl + '/properties/' + window.App.Const.StorID + '/*/onLatest?page=' + paged + "&pageSize=" + pageSized + "&" + param;
                }else if(Pagekey == 'urgent'){
                    var url = window.AppConfig.RemoteApiUrl + '/properties/' + window.App.Const.StorID + '/*/onRent?page=' + paged + "&pageSize=" + pageSized + "&" + param;
                }else if(Pagekey == 'anxious'){
                    var url = window.AppConfig.RemoteApiUrl + '/properties/' + window.App.Const.StorID + '/*/onSale?page=' + paged + "&pageSize=" + pageSized + "&" + param;
                }else{
                    window.Utils.Log.info("erro");
                }
                var propertyCollection = new PropertyCollection(url);
                window.Utils.Http.get({
                    model: propertyCollection,
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
