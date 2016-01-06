define(['main/mainView','cache'], function (mainView,Cache) {

    var controller = function () {
        var view = new mainView();
        view.render();
    };
    return controller;
});