define(['estates/estateMajorView','estates/estateMajorInfoView','cache'], function (estateMajorView,estateMajorInfoView,Cache) {

    var controller = function (controllerId, estateId) {
        if(controllerId ==  'LIST_ESTATES_MAJOR' ) {
            var view = new estateMajorView();
            // Id is the estate id
            view.render();
        }
        if(controllerId ==  'LIST_ESTATES_MAJORINFO' ) {
            var view = new estateMajorInfoView();
            // Id is the property id
            // get property detail information by property id
            var items = Cache.getItem("PropertiesMajorInfo");
            var item = null;
            for (var i=0; i < items.length; i++) {
                var _item = items[i];
                if(_item.estate_id == estateId) {
                    item = _item;
                    break;
                }
            }
            view.render(item);
        }

    };
    return controller;
});
