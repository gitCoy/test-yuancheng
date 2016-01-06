define(
    ['text!commonview/tpl/common.html'],
    function (commonPage) {

        var indexBannerPage =  $(commonPage).filter('#tpl-indexBanner').html();
        var bannerPropertyPage =  $(commonPage).filter('#tpl-bannerProperty').html();
        var commonBannerPage =  $(commonPage).filter('#tpl-banner').html();
        var commonBannerView = Backbone.View.extend({
            initialize: function () {
            },
            showTemplateByType: function (type) {
                var self = this;
                var elType = {
                    'commonBannerPage': commonBannerPage,
                    'bannerPropertyPage':bannerPropertyPage,
                    'indexBannerPage':indexBannerPage
                }
                self.el = elType[type];
            },
            render: function (type, metaData) {
                var self = this;
                self.showTemplateByType(type);
                return this.el;
            }
        });
        return commonBannerView;
    });