define([
    'estates/estateModel', 'log'
], function (estateModel, log) {

    var estateCollection = Backbone.Collection.extend({
        model: estateModel,
        url: window.AppConfig.RemoteApiUrl + '/estates',
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
    return estateCollection;

});
