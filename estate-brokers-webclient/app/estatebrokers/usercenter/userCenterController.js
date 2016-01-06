define(['usercenter/majorUserCenterView','usercenter/myEntrustView','usercenter/myToolboxView','usercenter/microChatView','usercenter/microChatInfoView',
    'usercenter/myVillageView','usercenter/myHouseView','properties/propOnSaleDetailView','usercenter/convenienceShopView','cache'
        ], function (usercenterView,myEntrustView,toolboxView,microChatView,microChatInfoView,myVillageView,myHouseView,PropOnSaleDetailView,ConvenienceShopView,Cache) {

    var controller = function (controllerId,propertyId,brokerId,userName, phone) {
        if(controllerId == "SHOW_CENTER_CONT") {
            var view = new usercenterView();
            var items = Cache.getItem("About_Us");
            _.each(items,function(item){
                items = item;
            })
            view.render(items);
        }
        if(controllerId == "SHOW_CENTER_MYENTRUST") {
            var view = new PropOnSaleDetailView();
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

        if(controllerId == "SHOW_CENTER_ENTRUST") {
            var view = new myEntrustView();
            view.render();
        }

        if(controllerId == "SHOW_CENTER_TOOLBOX"){
            var view = new toolboxView();
            view.render();
        }

        if(controllerId == "SHOW_CENTER_VILLAGE"){
            var view = new myVillageView();
            view.render();
        }

        if(controllerId == "SHOW_CENTER_NEWHOUSE"){
            var view = new myHouseView();
            view.render("onNew");
        }

        if(controllerId == "SHOW_CENTER_RENTAL"){
            var view = new myHouseView();
            view.render("onRent");
        }

        if(controllerId == "SHOW_CENTER_HOUSEOLD"){
            var view = new myHouseView();
            view.render("onSecond");
        }
        if(controllerId == "SHOW_CENTER_CONSHOP"){
            var view = new ConvenienceShopView();
            view.render();
        }
        if(controllerId == 'SHOW_MICO_CHATVIEW'){
            var view = new microChatView();
            view.render();
        }
        if(controllerId == 'SHOW_MICO_CHATINFOVIEW'){
            var view = new microChatInfoView();
            view.render(brokerId, propertyId, userName, phone);
        }
        if(controllerId == 'SHOW_MICO_CHATLISTVIEW'){
            var view = new microChatInfoView();
            view.render(brokerId, propertyId, userName);
        }
    };
         return controller;

});
