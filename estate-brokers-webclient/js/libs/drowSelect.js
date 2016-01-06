function diy_select() {
    this.init.apply(this, arguments)
};
diy_select.prototype = {
    init: function (opt) {
        this.setOpts(opt);
        this.o = this.getByClass(this.opt.TTContainer, document, 'div');//容器
        this.b = this.getByClass(this.opt.TTDiy_select_btn);//按钮
        this.t = this.getByClass(this.opt.TTDiy_select_txt);//显示
        this.l = this.getByClass(this.opt.TTDiv_select_list);//列表容器
        this.ipt = this.getByClass(this.opt.TTDiy_select_input);//列表容器
        this.lengths = this.o.length;
        this.showSelect();
    },
    addClass: function (o, s)//添加class
    {
        o.className = o.className.replace(/[\s\t]+/g, " ");
        if (!o.className.match(s)) {
            o.className = o.className ? o.className + ' ' + s : s;
        }
    },
    removeClass: function (o, st)//删除class
    {
        var reg = new RegExp('\\b' + st + '\\b');
        o.className = o.className ? o.className.replace(reg, '') : '';
    },
    addEvent: function (o, t, fn)//注册事件
    {
        return o.addEventListener ? o.addEventListener(t, fn, false) : o.attachEvent('on' + t, fn);
    },
    showSelect: function ()//显示下拉框列表
    {
        var This = this;
        var iNow = 0;
        var maskDisp = document.getElementById("mask");
        this.addEvent(document, 'click', function () {
            for (var i = 0; i < This.lengths; i++) {
                This.l[i].style.display = 'none';
                This.removeClass(This.o[i], This.opt.TTSelected);
                if (maskDisp != null) {
                    maskDisp.style.display = "none";
                }
            }
        })
        for (var i = 0; i < this.lengths; i++) {
            if (i == 0) {
                this.l[i].index = this.b[i].index = this.t[i].index = i;
                this.t[i].onclick = this.b[i].onclick = function (ev) {
                    var e = window.event || ev;
                    var index = this.index;
                    This.item = This.l[index].getElementsByTagName('li');
                    This.seleced = This.o[index];

                    if (maskDisp != null) {
                        This.l[index].style.display = This.l[index].style.display == 'block' ? (maskDisp.style.display = "none", This.removeClass(This.seleced, This.opt.TTSelected), 'none') : (maskDisp.style.display = "none", This.addClass(This.seleced, This.opt.TTSelected), 'block');
                    } else {
                        This.l[index].style.display = This.l[index].style.display == 'block' ? (This.removeClass(This.seleced, This.opt.TTSelected), 'none') : (This.addClass(This.seleced, This.opt.TTSelected), 'block');
                    }
                    for (var j = 0; j < This.lengths; j++) {
                        if (j != index) {
                            This.l[j].style.display = 'none';
                            This.removeClass(This.o[j], This.opt.TTSelected);
                            This.removeClass(This.o[j], This.opt.TTDiy_select_ed);
                        }
                    }
                    This.addClass(This.seleced, This.opt.TTDiy_select_ed);
                    This.addClick(This.item, This.seleced);
                    e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true); //阻止冒泡
                }
            } else {
                this.l[i].index = this.b[i].index = this.t[i].index = i;
                this.t[i].onclick = this.b[i].onclick = function (ev) {
                    var e = window.event || ev;
                    var index = this.index;
                    This.item = This.l[index].getElementsByTagName('li');
                    This.seleced = This.o[index];
                    if (maskDisp != null) {
                        This.l[index].style.display = This.l[index].style.display == 'block' ? (maskDisp.style.display = "none", This.removeClass(This.seleced, This.opt.TTSelected), 'none') : (maskDisp.style.display = "block", This.addClass(This.seleced, This.opt.TTSelected), 'block');
                    } else {
                        This.l[index].style.display = This.l[index].style.display == 'block' ? (This.removeClass(This.seleced, This.opt.TTSelected), 'none') : (This.addClass(This.seleced, This.opt.TTSelected), 'block');
                    }
                    for (var j = 0; j < This.lengths; j++) {
                        if (j != index) {
                            This.l[j].style.display = 'none';
                            This.removeClass(This.o[j], This.opt.TTSelected);
                            This.removeClass(This.o[j], This.opt.TTDiy_select_ed);
                        }
                    }
                    This.addClass(This.seleced, This.opt.TTDiy_select_ed);
                    This.addClick(This.item, This.seleced);
                    e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true); //阻止冒泡
                }
            }


        }
    },
    addClick: function (o, foucse)//点击回调函数
    {

        if (o.length > 0) {
            var This = this;
            for (var i = 0; i < o.length; i++) {
                o[i].onmouseover = function () {
                    This.addClass(this, This.opt.TTFcous);
                }
                o[i].onmouseout = function () {
                    This.removeClass(this, This.opt.TTFcous);
                }
                o[i].onclick = function () {
                    This.removeClass(foucse, This.opt.TTSelected);
                    var index = this.parentNode.index;//获得列表
                    var countStyleClass = this.classList[0];
                    if (index == 3 || index == 8 && countStyleClass != undefined) {
                        var counthide = this.parentNode.children;
                        var countShow = document.getElementById(countStyleClass + "show");
                        for (var jj = 0; jj < counthide.length - 1; jj++) {
                            var counthided = counthide[jj].classList[0];
                            var counthideHided = document.getElementById(counthided + "show");
                            if (counthideHided != null) {
                                //counthideHided.style.display = "none";
                                This.removeClass(counthideHided, "showscale");
                            }
                        }
                        //countShow.style.display = "block";
                        if (countShow != null) {
                            //counthideHided.style.display = "none";
                            This.addClass(countShow, "showscale");
                        }
                    }
                    var maskClick = document.getElementById("mask");
                    This.t[index].querySelector('a').innerHTML = This.ipt[index].value = this.innerHTML.replace(/^\s+/, '').replace(/\s+&/, '');
                    This.l[index].style.display = 'none';
                    if (maskClick != null) {
                        maskClick.style.display = "none";
                    }
                }
            }
        }
    },
    getByClass: function (s, p, t)//使用class获取元素
    {
        var reg = new RegExp('\\b' + s + '\\b');
        var aResult = [];
        var aElement = (p || document).getElementsByTagName(t || '*');

        for (var i = 0; i < aElement.length; i++) {
            if (reg.test(aElement[i].className)) {
                aResult.push(aElement[i])
            }
        }
        return aResult;
    },

    setOpts: function (opt) //以下参数可以不设置  //设置参数
    {
        this.opt = {
            TTContainer: 'diy_select',//控件的class
            TTDiy_select_input: 'diy_select_input',//用于提交表单的class
            TTDiy_select_txt: 'diy_select_txt',//diy_select用于显示当前选中内容的容器class
            TTDiy_select_ed: "selected",
            TTDiy_select_btn: 'diy_select_btn',//diy_select的打开按钮
            TTDiv_select_list: 'diy_select_list',//要显示的下拉框内容列表class
            TTFcous: 'focus',//得到焦点时的class
            TTSelected: 'focus-show',
            TTMask: "mask"
        }
        for (var a in opt)  //赋值 ,请保持正确,没有准确判断的
        {
            this.opt[a] = opt[a] ? opt[a] : this.opt[a];
        }
    },
    estateSort: function (array, sortStyle, sortWay) {
        function down(x, y) {
            if (sortWay == 1) {
                return (x.onsales_count > y.onsales_count) ? 1 : -1
            } else {
                return (x.onsales_count < y.onsales_count) ? 1 : -1
            }

        }

        function up(x, y) {
            if (sortWay == 1) {
                return (x.onrent_count > y.onrent_count) ? 1 : -1
            } else {
                return (x.onrent_count < y.onrent_count) ? 1 : -1
            }

        }

        if (sortStyle == 1) {
            array.sort(down);
        } else {
            array.sort(up);
        }

        return array;
    }
}


var TTDiy_select = new diy_select({  //参数可选
    TTContainer: 'diy_select',//控件的class
    TTDiy_select_input: 'diy_select_input',//用于提交表单的class
    TTDiy_select_txt: 'diy_select_txt',//diy_select用于显示当前选中内容的容器class
    TTDiy_select_ed: "selected",
    TTDiy_select_btn: 'diy_select_btn',//diy_select的打开按钮
    TTDiv_select_list: 'diy_select_list',//要显示的下拉框内容列表class
    TTFcous: 'focus'//得到焦点时的class
});//如同时使用多个时请保持各class一致.
