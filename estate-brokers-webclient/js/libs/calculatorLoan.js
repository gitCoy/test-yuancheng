function init_sydk() {
    var arg = {};
    arg.yhk = [];
    var syorgjj = get_oneliNum(".tabulous_active");
    if(syorgjj == 0){
        var tabsL = "#tabsList-1 ";
        var data_5down_sydk = ["0.0475","0.03325","0.040375","0.05225","0.05","0.035","0.0425","0.055"];
        var data_5top_sydk = ["0.049","0.0343","0.04165","0.0539","0.0515","0.03605","0.043775","0.05665"];
    }else if(syorgjj == 1) {
        var tabsL = "#tabsList-2 ";
        var data_5down_sydk = ["0.0275", "0.01925", "0.023375", "0.03025", "0.0275", "0.01925", "0.023375", "0.03025"];
        var data_5top_sydk = ["0.0325", "0.02275", "0.027625", "0.03575", "0.0325", "0.02275", "0.027625", "0.03575"];
    }else{
        var tabsL = "#tabsList-3 ";
    }
    var hkfs = get_liNum(tabsL + ".hkfs");
    var ajns = get_liNum(tabsL + ".ajns");
    var jsfs = get_liNum(tabsL + ".jsfs");
    var ajys = ajns * 12;
    var ajll = get_liNum(tabsL + ".ajll");
    var ajcs = get_liNum(tabsL + ".ajcs")/10;
    var dj = get_class_value(tabsL + ".sy_gjj_price");
    var area = get_class_value(tabsL + ".sy_gjj_area");
    var hkze = 0;
    if(jsfs == 0){
        var dkze = ajcs * dj * area;
        arg.fwzj = dj*area;
        arg.sqfk = dj*area - dkze;
    }else{
        var dkze = get_class_value(tabsL + ".sy_gjj_dkze");
        arg.fwzj = 0;
        arg.sqfk = 0;
    }
    if(ajns <= 5) {
        var ajll_num = data_5down_sydk[ajll];
    }
    if(ajns > 5){
        var ajll_num = data_5top_sydk[ajll];
    }
    var ajll_num_mouth = ajll_num/12;
    if(hkfs == 0){
        var yhk = dkze*ajll_num_mouth*Math.pow((1+ajll_num_mouth),ajys)/(Math.pow((1+ajll_num_mouth),ajys)-1);
        hkze = yhk * ajys;
        arg.yhk[0] = yhk;
    }else if(hkfs == 1){
        for(var i=1;i<=ajys;i++){
            var yhk = (dkze/ajys)+(dkze-(i-1)*dkze/ajys)*ajll_num_mouth;
            hkze += yhk;
            arg.yhk[i] = yhk;
        }
    }
    arg.dkze = dkze;
    arg.dkys = ajys;
    arg.hkze = hkze;
    arg.zflx = hkze - dkze;
    show_debxhk(arg);
}
function init_zh() {
    var arg = {};
    arg.yhk = [];
    var tabsL = "#tabsList-3 ";
    var data_5down_sydk = ["0.0475","0.03325","0.040375","0.05225","0.05","0.035","0.0425","0.055"];
    var data_5top_sydk = ["0.049","0.0343","0.04165","0.0539","0.0515","0.03605","0.043775","0.05665"];
    var data_5down_gjj = ["0.0275", "0.01925", "0.023375", "0.03025", "0.0275", "0.01925", "0.023375", "0.03025"];
    var data_5top_gjj = ["0.0325", "0.02275", "0.027625", "0.03575", "0.0325", "0.02275", "0.027625", "0.03575"];
    var hkfs = get_liNum(tabsL + ".hkfs");
    var ajns = get_liNum(tabsL + ".ajns");
    var ajys = ajns * 12;
    var ajll = get_liNum(tabsL + ".ajll");
    var sy_dked = get_class_value(tabsL + ".zhdk_sy");
    var gjj_dked = get_class_value(tabsL + ".zhdk_gjj");
    if(sy_dked == undefined && gjj_dked == undefined){

    }
    var dkze =Number(gjj_dked) + Number(sy_dked);
    var hkze = 0;
    if(ajns <= 5) {
        var ajll_num_sy = data_5down_sydk[ajll];
        var ajll_num_gjj = data_5down_gjj[ajll];
    }
    if(ajns > 5){
        var ajll_num_sy = data_5top_sydk[ajll];
        var ajll_num_gjj = data_5top_gjj[ajll];
    }
    var ajll_num_sy_mouth = ajll_num_sy/12;
    var ajll_num_gjj_mouth = ajll_num_gjj/12;
    if(hkfs == 0){
        var yhk_sy = sy_dked*ajll_num_sy_mouth*Math.pow((1+ajll_num_sy_mouth),ajys)/(Math.pow((1+ajll_num_sy_mouth),ajys)-1);
        var yhk_gjj = gjj_dked*ajll_num_gjj_mouth*Math.pow((1+ajll_num_gjj_mouth),ajys)/(Math.pow((1+ajll_num_gjj_mouth),ajys)-1);
        var yhk = yhk_gjj + yhk_sy;
        hkze = yhk * ajys;
        arg.yhk[0] = yhk;
    }else if(hkfs == 1){
        for(var i=1;i<=ajys;i++){
            var yhk_sy = (sy_dked/ajys)+(sy_dked-(i-1)*sy_dked/ajys)*ajll_num_sy_mouth;
            var yhk_gjj = (gjj_dked/ajys)+(gjj_dked-(i-1)*gjj_dked/ajys)*ajll_num_gjj_mouth;
            var yhk = yhk_gjj + yhk_sy;
            hkze += yhk;
            arg.yhk[i] = yhk;
        }
    }
    arg.fwzj = 0;
    arg.sqfk = 0;
    arg.dkze = dkze;
    arg.dkys = ajys;
    arg.hkze = hkze;
    arg.zflx = hkze - dkze;
    show_debxhk(arg);
}
function init_gfnlpg() {
    var arg = {};
    var tabsL = "#tabsList-4 ";
    var data_5down_gjj = ["0.0275"];
    var data_5top_gjj = ["0.0325"];
    var dkns = get_liNum(tabsL + ".dkns");
    var dkys = dkns * 12;
    var gfzj = get_class_value(tabsL + ".gfzj");
    var jtysr = get_class_value(tabsL + ".jtysr");
    var gfzc = get_class_value(tabsL + ".gfzc");
    var fwmj = get_class_value(tabsL + ".fwmj");
    if(dkns <= 5) {
        var ajll_num_gjj = data_5down_gjj[0];
    }
    if(dkns > 5){
        var ajll_num_gjj = data_5top_gjj[0];
    }
    var ajll_num_gjj_mouth = ajll_num_gjj/12;
    arg.fwzj = Number((gfzc*(Math.pow(1 + ajll_num_gjj_mouth, dkys) - 1))/(ajll_num_gjj_mouth*Math.pow(1 + ajll_num_gjj_mouth, dkys)))+Number(gfzj);
    arg.fwdj = arg.fwzj/fwmj || 0;
    arg.qs = _cal_qs(arg.fwzj,fwmj);
    show_gfnlpg(arg);
}
function init_wtcz_cs(czzc) {
    var arg = {};
    var str = [];
    if(czzc == 1){
        var tabsL = ".wtcs ";
        arg.delegateType = 1;
    }else if(czzc == 2){
        var tabsL = ".wtcz ";
        arg.delegateType = 2;
    }
    var estateId = get_liNum(tabsL + ".estateName");
    var estateName = get_class_text(tabsL + ".estateName");
    var roomInfo = get_liNum(tabsL + ".roomInfo");
    var buzzMode = get_liNum(tabsL + ".buzzMode");
    var price = get_class_value(tabsL + ".price");
    var telphone = get_class_value(tabsL + ".telphone");
    var square = get_class_value(tabsL + ".square");
    arg.estateId = estateId;
    arg.roomInfo = roomInfo;
    arg.delegateTitle = estateName + roomInfo + square + "平米";
    arg.buzzMode = Number(buzzMode) || 2;
    arg.square = Number(square);
    arg.price = Number(price);
    arg.phones = String(telphone);
    arg.comments = "暂未输入";
    return arg;
}
function show_result_sy_gjj(){
    $(".toolBoxShade").prepend("<div id='mask'></div><ul class='toolBoxUl'></ul>");
    $(".toolBoxUl").prepend("" +
        "<li><b>房屋总价：</b><span id='ret_fwzj'></span></li>"+
        "<li><b>贷款总额：</b><span id='ret_dkze'></span></li>"+
        "<li><b>还款总额：</b><span id='ret_hkze'></span></li>"+
        "<li><b>首期付款：</b><span id='ret_sqfk'></span></li>"+
        "<li><b>支付利息：</b><span id='ret_zflx'></span></li>"+
        "<li><b>贷款月数：</b><span id='ret_dkys'></span></li>"+
        "<li id='ret_yhk'></li>"+
        "<li><div class='backCount' onclick='hide_result();'>返回计算</div></li>"
    );
}
function show_debxhk(arg) {
    show_result_sy_gjj();
    Fid('ret_fwzj').innerHTML = arg.fwzj ==0 ? "略": format_num(get_num_round(arg.fwzj, 2));
    Fid('ret_dkze').innerHTML = format_num(get_num_round(arg.dkze, 2));
    Fid('ret_hkze').innerHTML = format_num(get_num_round(arg.hkze, 2));
    Fid('ret_sqfk').innerHTML = arg.sqfk ==0 ? "略": format_num(get_num_round(arg.sqfk, 2));
    Fid('ret_zflx').innerHTML = format_num(get_num_round(arg.zflx, 2));
    Fid('ret_dkys').innerHTML = get_num_round(arg.dkys, 2);
    if(arg.yhk.length==1){
        Fid('ret_yhk').innerHTML = "<b>每月还款：</b><span>"+format_num(get_num_round(arg.yhk, 2))+"</span>";
    }else{
        for (var i = 1; i < arg.yhk.length; i++) {
            arg.yhk[i] = i + '月:' + format_num(get_num_round(arg.yhk[i], 2)) + '元';
        }
        Fid('ret_yhk').innerHTML = '<b>每月还款：</b><textarea rows="4" style="font-size:12px;line-height:18px;">' + arg.yhk.join('\n') + '</textarea>';
    }
}
function show_result_gfnlpg(){
    $(".toolBoxShade").prepend("<div id='mask'></div><ul class='toolBoxUl'></ul>");
    $(".toolBoxUl").prepend("" +
        "<li><b>房屋总价：</b><span id='ret_fwzj'></span></li>"+
        "<li><b>房屋单价：</b><span id='ret_fwdj'></span></li>"+
        "<li><b>契税：</b><span id='ret_qs'></span></li>"+
        "<li><div class='backCount' onclick='hide_result();'>返回计算</div></li>"
    );
}
function show_gfnlpg(arg) {
    show_result_gfnlpg();
    Fid('ret_fwzj').innerHTML = arg.fwzj ==0 ? "略": format_num(get_num_round(arg.fwzj, 2));
    Fid('ret_fwdj').innerHTML = format_num(get_num_round(arg.fwdj, 2));
    Fid('ret_qs').innerHTML = format_num(get_num_round(arg.qs, 2));
}

function hide_result(){
    $("#mask").remove();
    $(".toolBoxUl").remove();
}
function get_id_value(id){
    return Fid(id).value;
}
function _cal_qs(zj, mj) {
    if (mj <= 140) {
        return zj * 0.015;
    } else {
        return zj * 0.03
    }
}
function get_class_value(classname){
    return $(classname).val();
}
function get_class_text(classname){
    return $(classname + " span").text();
}
function Fid(id){
    return document.getElementById(id);
}
function $class(classname){
    return document.getElementsByClassName(classname)[0];
}
function get_liNum(name) {
    var classcelec = $(name + " span").attr("data-val");
    if(classcelec != undefined){
        return classcelec.valueOf();
    }
    return "";
}
function get_oneliNum(name) {
    var classcelec = $(name).attr("data-val");
    if(classcelec != undefined){
        return classcelec.valueOf();
    }
    return -1;
}
function get_num_round(num, p) {
    var t = 1;
    while (p > 0) {
        t *= 10;
        p--;
    }
    return Math.round(num * t) / t;
}
function format_num(num) {
    var num = new Number(num).toString();
    var p = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
    return num.replace(p, "$1,");
}