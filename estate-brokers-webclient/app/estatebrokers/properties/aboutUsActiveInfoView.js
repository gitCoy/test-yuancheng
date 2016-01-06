define([
        'commonview/header', 'text!properties/tpl/properties.html',  'zepto_iscroll', 'loadUpdate', 'drowSelect'],
    function (CommonHeaderView, propertiesPage) {

        var AboutUsActiveInfo =  $(propertiesPage).filter('#tpl-aboutUsActiveInfo').html();
        //主页内容

        var view = Backbone.View.extend({
            el: '#container',
            aboutusActiveInfo:null,
            events: {
                'click button#toggle': 'toggle'
            },
            initialize: function () {

            },
            render: function (aboutusActiveInfo) {
                this.aboutusActiveInfo = aboutusActiveInfo;
                var aboutUsActiveTitle = aboutusActiveInfo.activity_title;
                var that = this;
                that.$el.empty();
                that.$el.append(new CommonHeaderView().render("headerWithBackBtn", (aboutUsActiveTitle || "门店简介"), "#"));
                var template = _.template(AboutUsActiveInfo,{
                    items:aboutusActiveInfo
                })
                that.$el.append(template);
                new diy_select();
            }
        });
        return view;
    });
