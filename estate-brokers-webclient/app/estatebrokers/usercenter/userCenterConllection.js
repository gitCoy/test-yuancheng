define([
    'usercenter/userCenterModel', 'log'
], function (userCenterModel, log) {

    var propertyCollection = Backbone.Collection.extend({
        model: userCenterModel,
        url: "",
        initialize: function (url) {
            this.url = url;
        },
        getAll: function () {
            if (this.models[0]) {
                return this.models[0].get('result')
            }
            return [];
        },
        size: function () {
            return this.getAll().length;
        }
    });
    return propertyCollection;

});
