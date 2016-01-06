define(['underscore','jquery'], function (_) {
    function info(msg, prefix) {
        var _prefix = prefix ? prefix + " : " : "";
        if(!window.AppConfig.DEBUG) {
            return;
        }
        if (_.isObject(msg)) {
            console.log(_prefix + JSON.stringify(msg))
        }
        else {
            console.log(_prefix + msg)
        }
    }
    function reminder(msg) {
        $("body").append("<div class='reminder'>" + msg + "</div>");
        setTimeout("$('.reminder').remove()",1000);
    }
    function reminderCommon(msg,remSty) {
        $("body").append("<div class='reminderShade'></div>")
        $(".reminderShade").prepend("<div id='mask'></div><ul class='reminderUl make_transist'></ul>");
        if(remSty == 1){
            $(".reminderUl").prepend("" +
            "<li class='title'><b>提示</b></li>"+
            "<li class='cont'>" + msg + "</li>"+
           "<li><div class='tableCall' onclick='window.Utils.Log.hide_reminder();'>确认</div></li>"
            );
        }else{
            $(".reminderUl").prepend("" +
                "<li class='title'><b>提示</b></li>"+
                "<li class='cont'>" + msg + "</li>"+
                "<li><div class='tableCall reminderVerify'>确认</div><div class='tableCall clickback'onclick='window.Utils.Log.hide_reminder();'>取消</div></li>"
            );
        }

        $(".reminderUl").css("top","50%");
    }
    function hide_reminder(){
        $(".reminderUl").css("top","100%");
        setTimeout("$('.reminderShade').remove()",200);
    }
    function loadAmin(spinnered){
        var loadAmin = "<div class='" + spinnered + "'><div class='posonCent'><div class='spinner'><div class='dot1'></div><div class='dot2'></div></div><div class='butLoud' onclick='location.reload();'>点击刷新</div></div></div>";
        return loadAmin;
    }
    function loadAminFailing(){
        var loadAmin = "<div class='spinnered'><div class='posonCent'><div class='butLoud' onclick='location.reload();'>加载失败，点击重新加载</div></div></div>";
        return loadAmin;
    }
    function hideLoadAmin(){
        $(".spinnered").remove();
        $(".spinneredtop").remove();
    }
    function debug(msg, prefix) {
        var _prefix = prefix ? prefix + " : " : "";
        if (_.isObject(msg)) {
            console.debug(_prefix + JSON.stringify(msg))
        }
        else {
            console.debug(_prefix + msg)
        }
    }

    function error(msg, prefix) {
        var _prefix = prefix ? prefix + " : " : "";
        if (_.isObject(msg)) {
            console.error(_prefix + JSON.stringify(msg))
        }
        else {
            console.error(_prefix + msg)
        }
    }

    return {
        info: info,
        debug: debug,
        reminder: reminder,
        reminderCommon: reminderCommon,
        hide_reminder: hide_reminder,
        loadAmin:loadAmin,
        hideLoadAmin:hideLoadAmin,
        loadAminFailing:loadAminFailing
    };
});