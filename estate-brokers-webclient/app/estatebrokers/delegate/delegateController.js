define(['delegate/delegateView','cache'], function (entrustGiftView,Cache) {

    var controller = function () {
        var view = new entrustGiftView();
        var items = Cache.getItem("About_Us");
        _.each(items,function(item){
            items = item;
        })
        view.render(items);
    };
    return controller;
});