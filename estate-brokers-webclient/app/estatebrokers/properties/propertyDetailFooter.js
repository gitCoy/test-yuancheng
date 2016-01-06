define(
    ['text!properties/tpl/properties.html'],
    function (propertiesPage) {
        var propertyDetailFooterPage =  $(propertiesPage).filter('#tpl-propertyDetailFooter').html();
        var propertyFooterView = Backbone.View.extend({
            el: '#container',
            initialize: function () {
            },
            showTemplateByType: function (type) {
                var self = this;
                var elType = {
                    'propertyDetailFooterPage': propertyDetailFooterPage
                }
                self.el = elType[type];
            },
            render: function (propInfoFooter) {
                var self = this;
                var avatarurled = propInfoFooter.avatarurl || "";
                avatarurled = avatarurled.split(',');
                avatarurled = window.App.Const.THUMBNAILS_IMG_SERVER + avatarurled[0] + window.App.Thumbnails.BANNER;
                propInfoFooter = _.extend({}, propInfoFooter, {
                    avatarurl: avatarurled || ""
                });
                var template = _.template(propertyDetailFooterPage, {
                    item: propInfoFooter
                });
                self.$el.append(template);
                //self.showTemplateByType(type);
               // return this.el;
            }
        });
        return propertyFooterView;
    });
