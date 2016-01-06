define(['cache','properties/propOnSaleDetailView','properties/houseUrgentView','properties/aboutUsActiveInfoView',
        'properties/propertySearchView','properties/aboutUsView','properties/publicInfoListView'],
    function (Cache, PropertyOnSaleDetailView,HoseUrgentView,AboutUsActiveInfoView,propertySearchView,AboutUsView,PublicInfoListView) {

    var controller = function (controllerId, estateId, propertyId) {
        if(controllerId ==  'LIST_PROPERTIES_BY_ACTIVE' ) {
            var view = new AboutUsActiveInfoView();
            var items = Cache.getItem("aboutUsActive");
            var item = null;
            for (var i=0; i < items.length; i++) {
                var _item = items[i];
                if(_item.activity_id == estateId) {
                    item = _item;
                    break;
                }
            }
            // Id is the estate id
            view.render(item);
        }

        if(controllerId ==  'LIST_PROPERTIES_BY_PUBLICINFO' ) {
            var view = new AboutUsActiveInfoView();
            var items = Cache.getItem("aboutUsPublicInfo");
            var item = null;
            for (var i=0; i < items.length; i++) {
                var _item = items[i];
                if(_item.activity_id == estateId) {
                    item = _item;
                    break;
                }
            }
            // Id is the estate id
            view.render(item);
        }
        if(controllerId ==  'LIST_PROPERTIES_BY_ABOUTUS' ) {
            var view = new AboutUsView();
            var items = Cache.getItem("About_Us");
            _.each(items,function(item){
                items = item;
            })
            // Id is the estate id
            view.render(items);
        }
        if(controllerId ==  'LIST_PROPERTIES_STOREABOUTUS' ) {
            var view = new AboutUsActiveInfoView();
            var items = Cache.getItem("About_Us");
            _.each(items,function(item){
                items = item;
            });
            items = _.extend({}, items, {
                stroeAbout: true
            });
            // Id is the estate id
            view.render(items);
        }

        if(controllerId ==  'SHOW_PROPERTY_DETAIL' ) {
            var view = new PropertyOnSaleDetailView();
            var items = Cache.getItem("Properties_estateId");
            var item = null;
            for (var i=0; i < items.length; i++) {
                var _item = items[i];
                if(_item.property_id == propertyId) {
                    item = _item;
                    break;
                }
            }
            view.render(item);
        }

        if(controllerId ==  'SHOW_ANXIOUS_DETAIL' ) {
            var view = new PropertyOnSaleDetailView();
            var items = Cache.getItem("HotEstate_index");
            var item = null;
            for (var i=0; i < items.length; i++) {
                var _item = items[i];
                if(_item.property_id == propertyId) {
                    item = _item;
                    break;
                }
            }
            view.render(item);
        }
        if(controllerId ==  'LIST_PROTERTY_HOUSEONLINE' ) {
            var view = new HoseUrgentView();
            // Id is the estate id
            view.render('online');
        }
        if(controllerId ==  'LIST_PROTERTY_HOUSEURGENT' ) {
            var view = new HoseUrgentView();
            // Id is the estate id
            view.render('urgent');
        }
        if(controllerId ==  'LIST_PROTERTY_HOUSEANXIOUS' ) {
            var view = new HoseUrgentView();
            // Id is the estate id
            view.render('anxious');
        }
        if(controllerId ==  'LIST_PROTERTY_SEARCH' ) {
            var view = new propertySearchView();
            // Id is the estate id
            view.render();
        }
        if(controllerId ==  'LIST_PROTERTY_ABOUTPUBLIC' ) {
            var view = new PublicInfoListView();
            // Id is the estate id
            view.render();
        }
    };
    return controller;
});
