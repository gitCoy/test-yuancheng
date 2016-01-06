define(
    ['text!commonview/tpl/common.html'],
    function (commonPage) {
        var commonFooterPage = $(commonPage).filter('#tpl-footer').html();
        var footerView = Backbone.View.extend({
            initialize: function () {

            },
            events: {
                "click a": "onFooterBarClicked"
            },
            onFooterBarClicked: function() {
                //TODO 切换tabPanel重写
            },
            showTemplateByType: function (type) {
                var self = this;
                var elType = {
                    'commonFooterPage': commonFooterPage
                }
                self.el = elType[type];
            },
            render: function (type, opt) {
                var self = this;
                self.showTemplateByType(type);
                var params = {currentBar: opt}
                var template = _.template(self.el, {currentBar: opt});
                self.$el.append(template);

                return self.$el;
            }
        });
        return footerView;
    });
