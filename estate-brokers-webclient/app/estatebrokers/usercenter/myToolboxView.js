
define([
        'commonview/header', 'text!usercenter/tpl/usercenter.html', 'cache', 'tabulous','drowSelect','calculatorLoan'],
    function (CommonHeaderView,usercenterPage) {
        var toolboxPage =  $(usercenterPage).filter('#tpl-myToolbox').html();

        var view = Backbone.View.extend({
            el: '#container',
            events: {
                'click button#toggle' : 'toggle'
            },
            initialize: function () {

            },
            render: function() {
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", "工具箱", "#" ,"0"));
                $("title").html($(".hd-tit").text());
                var template = _.template(toolboxPage, {});
                that.$el.append(template);
                new diy_select();
                Zepto('#comTabs').tabulous({
                    effect: 'scale'    //滑动方式  scale  slideLeft   scaleUp   flip
                });
            }
        });
        return view;
    });