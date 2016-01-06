(function($){
    var myScroll = {}, loadUpdate = {},
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0;
    var options = {
        pullDown: 'pullDown',
        pullUp: 'pullUp',
        wrapper: 'fyWrapper',
        scrollbarClass: "myScrollbar",
        dataSize: 14,
        dataContainer: '#fyList',
        upAction: undefined,
        downAction: undefined
    };

    loadUpdate = function(param, upCallback, downCallback) {
        return loadUpdate.prototype._init(param, upCallback, downCallback);
    }

    loadUpdate.prototype = {
        _state: 0,//-1：无加载数据，0：有加载数据

        _init: function(param, upCallback, downCallback) {
            var that = this;
            param = param || {};
            options = $.extend({}, options, param);
            pullDownEl = $("#"+ options.pullDown);
            pullDownOffset = pullDownEl.offset().height;
            pullUpEl = $("#"+ options.pullUp);
            pullUpOffset = pullUpEl.offset().height;
            $(options.dataContainer).find("li").length > options.dataSize ? pullUpEl.show() : pullUpEl.hide();
            myScroll = new iScroll(options.wrapper, {
                scrollbarClass: options.scrollbarClass,
                useTransition: true,
                topOffset: pullDownOffset,
                tap: true,
                checkDOMChanges: true,
                fadeScrollbar: true,
                hScroll: false,
                probeType: 1, //probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。
                scrollbars: true, //有滚动条
                mouseWheel: true, //允许滑轮滚动
                fadeScrollbars: true, //滚动时显示滚动条，默认影藏，并且是淡出淡入效果
                //bounce:false,
                onRefresh: function () {
                    if (pullDownEl.hasClass('loading')) {
                        pullDownEl.attr('class','').find('.pullDownLabel').html('下拉刷新...');
                    } else if (pullUpEl.hasClass('loading')) {
                        pullUpEl.attr('class','').find('.pullUpLabel').html('上拉加载更多...');
                    }
                },
                onScrollMove: function () {
                    var scrollData = $(options.dataContainer).find("li"), dataLen = scrollData.length;
                    if (this.y > 5 && !pullDownEl.hasClass('flip')) {
                        pullDownEl.attr('class','flip').find('.pullDownLabel').html( '松手开始更新...');
                        //alert(1);
                        this.minScrollY = 0;
                    } else if (this.y < 5 && pullDownEl.hasClass('flip')) {
                        pullDownEl.attr('class','').find('.pullDownLabel').html('下拉刷新...');
                        this.minScrollY = -pullDownOffset;
                    } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
                        //alert(this.y + "" + this.maxScrollY);
                        if (that._state >= 0 && dataLen > options.dataSize) {
                            //alert(2);
                            pullUpEl.show();
                            pullUpEl.attr('class','flip').find('.pullUpLabel').html( '松手开始加载...');
                            upCallback = options.upAction || upCallback;
                            downCallback = options.downAction || downCallback;
                            this.maxScrollY = this.maxScrollY;
                        }
                    } else if (this.y > (this.maxScrollY - 5) && pullUpEl.hasClass('flip')) {
                        //alert(this.y + "" + this.maxScrollY);
                        if (that._state >= 0 && dataLen > options.dataSize) {
                            pullUpEl.attr('class','').find('.pullUpLabel').html( '上拉加载更多...');
                            this.maxScrollY = pullUpOffset;
                        }
                    }
                },
                onScrollEnd: function () {
                    if (pullDownEl.hasClass('flip')) {
                        pullDownEl.attr('class', 'loading').find('.pullDownLabel').html('加载中...');
                        upCallback && (typeof upCallback === 'function') && upCallback.call(this);
                    } else if (pullUpEl.hasClass('flip')) {
                        pullUpEl.attr('class', 'loading').find('.pullUpLabel').html('加载中...');
                        downCallback && (typeof downCallback === 'function') && downCallback.call(this);
                    }
                    return this;
                }

            });
            return that;
        },
        _initNoLoad: function() {
            var that = this;
            myScroll = new iScroll(options.wrapper, {
                scrollbarClass: options.scrollbarClass,
                useTransition: true,
                tap: true,
                checkDOMChanges: true,
                fadeScrollbar: true,
                hScroll: true,
                probeType: 1, //probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。
                scrollbars: true, //有滚动条
                mouseWheel: true, //允许滑轮滚动
                fadeScrollbars: true, //滚动时显示滚动条，默认影藏，并且是淡出淡入效果
                //bounce:false,
                onRefresh: function () {
                    this.maxScrollY = this.maxScrollY;
                    this.scrollTo(0,this.maxScrollY);
                },
                /*onTouchEnd: function(){
                    this.maxScrollY = this.maxScrollY;
                    this.scrollTo(0,0);
                }*/

            });
            return that;
        },
        refresh: function() {
            //加载完成时
            myScroll.refresh();
        },
        up: function(callback) {
            callback && (options.upAction = callback);
            return this;
        },
        down: function(callback) {
            callback && (options.downAction = callback);
            return this;
        },
        loadUpCompl: function(strMesg) {
            pullUpEl = $("#"+ options.pullUp);
            this._state = -1;
            pullUpEl.attr('class','').find('.pullUpLabel').html(strMesg ||  '暂无数据');
            pullUpEl.find(".pullUpIcon").hide();

        },
        loadDownJiazai: function(strMesg){
            pullUpEl = $("#"+ options.pullUp);
            this._state = 0;
            pullUpEl.attr('class','').find('.pullUpLabel').html(strMesg ||  '暂无数据');
            pullUpEl.find(".pullUpIcon").show();
        },
        iScroll: function(){
            return myScroll;
        }
    }
    //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    window.Utils.loadUpdate = loadUpdate;

})(window.Zepto, undefined);
