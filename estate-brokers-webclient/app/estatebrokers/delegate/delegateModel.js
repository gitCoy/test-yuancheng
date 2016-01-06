define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var delegateModel = Backbone.Model.extend({
        initialize: function (storeId) {
            this.url = window.AppConfig.RemoteApiUrl + "/estates/" + storeId;
            _.bindAll(this,'getEstateDetail');
        },

        getEstateDetail: function(serviceName,fulfillmentsId,data, callback)
        {
            var serviceItem = null;
            var svcCollection = JSON.parse(localStorage.getItem("serviceAPICollection"));
            var svcAPIListArray = svcCollection['services'];
            _.each(svcAPIListArray, function (item) {
                if (serviceName === item.svcName) {
                    var url = "http://"+svcCollection.serverHost+":"+svcCollection.port+"/"+ item.svcURI+fulfillmentsId;
                    serviceItem={
                        url: url,
                        method: item.method
                    };
                    return;
                }
            });
            window.Utils.Log.info(serviceItem,"29 hang _________ getRequirementDetail -> serviceItem");
            this.url = serviceItem.url;
            window.Utils.Http[serviceItem.method]({
                model: this,
                data: data
            }, callback)
        }
    });
    return delegateModel;
});