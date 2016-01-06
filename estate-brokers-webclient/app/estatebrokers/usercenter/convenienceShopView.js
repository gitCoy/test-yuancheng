define([
        'commonview/header','commonview/footer','text!commonview/tpl/common.html',
        'text!usercenter/tpl/usercenter.html', 'slideout'],
    function (CommonHeaderView,CommonFooterView,commonPage, usercenterPage,Slideout) {
        var mainSlideTpl =  $(commonPage).filter('#tpl-mainSlide').html();
        var convenienceShopPage =  $(usercenterPage).filter('#tpl-convenienceShop').html();
        //页面布局
        var color = ['rgb(134,94,155)', 'rgb(78,205,53)', 'rgb(16,120,140)', 'rgb(252,173,20)', 'rgb(39,163,61)', 'rgb(252,209,9)', 'rgb(252,209,9)', 'rgb(252,209,9)'];

        var view = Backbone.View.extend({
            el: '#container',
            events: {},
            initialize: function () {

            },
            render: function () {
                var that = this;
                that.$el.empty();
                that.$el.append(mainSlideTpl);
                $("#mainSlide").append(new CommonHeaderView().render("headerWithMenuBtn", "便民服务", "#", "0"));
                $("title").html($(".hd-tit").text());
                $("#mainSlide").append(new CommonFooterView().render("commonFooterPage","convenienceShop"));
                var template = _.template(convenienceShopPage, {});
                $("#mainSlide").append(template);
                window.Utils.Log.hideLoadAmin();
                that.getShop();
                that.slideout();

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
                        setTimeout(function(){$(".header").removeClass("headerMemu");},300);
                        $(".slideMask").css("display","none");
                    }
                });
                $('.menu').bind('click', function(eve) {
                    if (eve.target.nodeName === 'A') {
                        slideout.close();
                        $(".slideMask").css("display","none");
                        setTimeout(function(){$(".header").removeClass("headerMemu");},300);
                    }
                });
                $('.slideMask').click(function() {
                    slideout.close();
                    $(".slideMask").css("display","none");
                    setTimeout(function(){$(".header").removeClass("headerMemu");},300);
                })

            },
            getShop: function () {
                var that = this;
                $.ajax({
                    type: "get",
                    async: false,
                    url: window.App.Const.SERVICE_API_SERVER + "/jsonp/around/Shop/getData?estateinfo_storeID=" + window.localStorage.storeID,
                    dataType: "jsonp",
                    jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                        success: function (result) {
                        if (result && result.data) {
                            var rs = that.analysisData(result.data);
                            var seleCookie = that.getCookie("selected");
                            if (seleCookie != "") {
                               var  param = {}, estate = {}
                                param[seleCookie] = rs[0][seleCookie];
                                estate[seleCookie] = rs[1][seleCookie];
                                that.createDom(param, estate);
                            } else {
                                that.createDom(rs[0], rs[1]);
                            }
                            that.createSelect(rs[1]);
                            $("#estateList").change(function () {
                                var selected = $(this).val(), param = {}, estate = {};
                                if (selected) {
                                    param[selected] = rs[0][selected];
                                    estate[selected] = rs[1][selected];
                                    that.createDom(param, estate);
                                    document.cookie = "selected = " + selected;
                                } else {
                                    that.createDom(rs[0], rs[1]);
                                    document.cookie = "selected = " + selected;
                                }
                            })
                        }
                        if (result && result.result) {
                            that.createAllDome(that.allanlysisData(result.result))
                        }
                    },
                    error: function () {

                    }
                });
            },
            allanlysisData : function (data) {
                var tmp = [], estateTmp = {};
                _.each(data, function (item, i) {
                    estateTmp =  _.extend(item, {
                        icon: i + 1
                    })
                    tmp.push(estateTmp)
                });
                return tmp;
            },
            analysisData: function (data) {
                var tmp = {}, estateTmp = {};
                _.each(data, function (item, i) {
                    tmp[item.estateID] = tmp[item.estateID] || [];
                    tmp[item.estateID].push({
                        shopName: item.shopName,
                        shopDesc: item.address,
                        phone: item.phone,
                        icon: item.shopName.substring(0, 1)
                    });

                    if (!estateTmp[item.estateID]) {
                        estateTmp[item.estateID] = item.estateName
                    }
                });

                return [tmp, estateTmp];
            },
            createAllDome: function (data) {
                var cell, li;
                $("#allServerList").empty();

                for (var i = 0; i < data.length; i++) {
                    li = '<div class="shop-cell">';
                    li += '<div class="shop-info"><div class="shop-icon" style="background-color:' + color[parseInt(Math.random() * 8)] + '"><span>' + data[i].icon + '</span></div><div class="shop-body"><div class="shop-title">' + data[i].shopName + '</div><div class="shop-desc">' + data[i].address + '</div></div><a href="tel:' + data[i].phone + '" class="shop-phone"><i class="iconfont"></i> </a></div><div class="shop-info-desc">'+ data[i].shopDesc +'</div>';
                    li += "</div>";
                    $("#allServerList").append(li);
                }
                $("#allServer .shop-cell").bind("click",function(){
                    $(".shop-info-desc").hide();
                    $(this).find(".shop-info-desc").show();
                })
            },
            createDom: function (data, navs) {
                var cell, li;
                $("#estateServer").empty();
                for (var key in navs) {
                    cell = $('<div class="shop-cell"></div>');
                    cell.append("<span>" + navs[key] + "</span>");
                    li = "";
                    for (var i = 0; i < data[key].length; i++) {
                        li += '<div><div class="shop-icon" style="background-color:' + color[parseInt(Math.random() * 8)] + '"><span>' + data[key][i].icon + '</span></div><div class="shop-body"><div class="shop-title">' + data[key][i].shopName + '</div><div class="shop-desc">' + data[key][i].shopDesc + '</div></div><a href="tel:' + data[key][i].phone + '" class="shop-phone"><i class="iconfont">&#xe614;</i> </a></div>'
                    }
                    cell.append(li);
                    $("#estateServer").append(cell);
                }
            },
            createSelect: function (estateTmp) {
                var seleCookie = this.getCookie("selected");
                var options = "<option value=''>输入您所在的小区</option>";
                for (var key in estateTmp) {
                    if(key == seleCookie && seleCookie != ""){
                        options += "<option value='" + key + "' selected>" + estateTmp[key] + "</option>";
                    }else{
                        options += "<option value='" + key + "'>" + estateTmp[key] + "</option>";
                    }
                }
                $('#estateList').html(options);
            },
            getCookie: function (cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i].trim();
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return "";
            }
        });
        return view;
    })
;
