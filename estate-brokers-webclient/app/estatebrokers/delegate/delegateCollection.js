define([
    'delegate/delegateModel', 'log'
], function (DelegateModel, log) {

    var delegeteCollection = Backbone.Collection.extend({
        model: DelegateModel,
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
    return delegeteCollection;
});
