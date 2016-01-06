define([
    'properties/propertyModel', 'log'
], function (propertyModel, log) {

    var propertyCollection = Backbone.Collection.extend({
        model: propertyModel,
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
