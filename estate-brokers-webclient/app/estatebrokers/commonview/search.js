define(
    ['text!commonview/tpl/common.html'],
    function (commonPage) {

        var commonSearchPage =  $(commonPage).filter('#tpl-search').html();
        var footerView = Backbone.View.extend({
            initialize: function () {
            },
            showTemplateByType: function (type) {
                var self = this;
                var elType = {
                    'commonSearchPage': commonSearchPage
                }
                self.el = elType[type];
            },
            render: function (type) {
                var self = this;
                self.showTemplateByType(type);
                return this.el;
            },

        });
        return footerView;
    });