
    var config = {
        //baseUrl: baseUrl,
        paths: {
            jquery: '../js/libs/zepto.min',
            underscore: '../js/libs/underscore',
            backbone: '../js/libs/backbone',
            text: '../js/libs/text',
            zepto_extend:'../js/libs/zepto.extend',
            zepto_ui: '../js/libs/zepto.ui',
            zepto_iscroll: '../js/libs/zepto.iscroll',
            navigator: '../js/libs/widget/navigator',
            navigator_iscroll: '../js/libs/widget/navigator.iscroll',
            hhSwipe: '../js/libs/hhSwipe',
            touchslider: "../js/libs/touchslider",
            drowSelect: "../js/libs/drowSelect",
            calculatorLoan: "../js/libs/calculatorLoan",
            tabulous: '../js/libs/tabulous',
            slideout: '../js/libs/slideout.min',
            log: '../js/libs/log',
            http_utils: '../js/libs/http_utils',
            cache: '../js/libs/cache',
            loadUpdate: '../js/libs/zepto.loadUpdate',
            text: '../js/libs/text',
            webSocket: '../js/libs/zepto.websocket',
            moment: '../js/libs/moment.min',
            data: 'data',
            commonview: 'estatebrokers/commonview',
            main: 'estatebrokers/main',
            estates: 'estatebrokers/estates',
            properties: 'estatebrokers/properties',
            usercenter: 'estatebrokers/usercenter',
            delegate:'estatebrokers/delegate'
        },
        shim: {
            'underscore': {
                exports: '_'
            },
            'jquery': {
                exports: '$'
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            'zepto_extend': {
                deps: ['jquery'],
                exports: 'zepto_extend'
            },
            'zepto_ui': {
                deps: ['zepto_extend'],
                exports: 'zepto_ui'
            },
            'zepto_iscroll': {
                deps: ['zepto_extend','zepto_ui'],
                exports: 'zepto_iscroll'
            },
            'navigator': {
                deps: ['zepto_extend','zepto_ui','zepto_iscroll'],
                exports: 'navigator'
            },
            'navigator_iscroll': {
                deps: ['zepto_extend','zepto_ui','zepto_iscroll','navigator'],
                exports: 'navigator_iscroll'
            },
            'hhSwipe': {
                deps: ['jquery'],
                exports: 'hhSwipe'
            },
            'touchslider': {
                deps: ['jquery'],
                exports: 'touchslider'
            },
            'drowSelect': {
                exports: 'drowSelect'
            },
            'calculatorLoan': {
                deps:["jquery"],
                exports: 'calculatorLoan'
            },

            'log': {
                deps: ['underscore'],
                exports: 'Log'
            },
            'http_utils': {
                deps: ['jquery','underscore','backbone', 'log'],
                exports: 'Http'
            },
            'cache': {
                deps: ['underscore'],
                exports: 'Cache'
            },
            'loadUpdate': {
                deps: ['zepto_iscroll'],
                exports: 'loadUpdate'
            },
            'webSocket' : {
                deps: ['jquery'],
                exports: 'webSocket'
            },
            'estates': {
                deps: ['jquery','backbone','zepto_extend','zepto_ui','zepto_iscroll','navigator_iscroll','navigator','hhSwipe','touchslider'],
                exports: 'estates'
            },
            'moment' : {
                exports: 'moment'
            }
        }
    };

    require.config(config);

    require.onError = function (err) {
        console.log('RequireJS loading error!: ', err.requireModules, err.message);
        console.log('RequireJS loading error!: ', err.requireModules, "\n\tsrc= ", err.originalError ? err.originalError.target.src : undefined, "\n\terr=", err);
    }

    window.Utils = {};

    require(['backbone', 'underscore', 'app', 'router', 'log', 'http_utils', 'moment', 'cache' ,'jquery', 'webSocket'], function(Backbone, _, app, router, log, httpUtils, moment, Cache){
        window.Utils.Log = log;
        window.Utils.Http = httpUtils;
        window.Utils.Router = router;
        window.Utils.Log.info("Application is starting......");
        Backbone.history.start();

        var url = window.location.search,urlParam = {},tmpParam;
        if (url) {
            url = url ? url.replace(/\?/g,"") : "";
            url = url ? url.split("&") : [];
            var storId, userId, storeType, storeOrder;
            for (var i = 0; i < url.length; i ++) {
                tmpParam = url[i].split("=");
                if (tmpParam && tmpParam.length === 2) {
                    urlParam[tmpParam[0]] = tmpParam[1];
                }
            }
            storId = urlParam["storeId"];
            userId = urlParam["userId"];
            storeOrder = urlParam["order"];
            storeType = urlParam["storeType"] || 1;

            window.App.Const['UserID'] = userId;

            var myStores = localStorage.myStores;

            if (storeOrder) {
                getStoresIndex(storId, storeType, storeOrder);
            } else {
                if(localStorage.storeID && storId === localStorage.parentID){
                    window.App.Const['StorID'] = localStorage.storeID;
                    Cache.setItem("storeList", '')
                    Cache.setItem("About_Us", "");
                    Cache.setItem("majorEstates", "");
                    Cache.setItem("HotEstate_index", "");
                    Cache.setItem("MyPropertiesId", "");
                    //var storeTmp, tmpid, tmpObj = {};
                    //myStores = eval("("+ myStores +")");
                    //for(var i = 0; i < myStores.length; i ++) {
                    //        storeTmp = myStores[i];
                    //        tmpid = storeTmp['store_id'];
                    //        tmpObj[tmpid] = storeTmp;
                    //}

                    getStores(storId, storeType, localStorage.storeID);
                }else{
                    window.App.Const['StorID'] = storId;
                    getStores(storId, storeType);
                }
            }

        }

        function getStoresIndex(storeId, storeType, index) {
            $.ajax({
                url: window.AppConfig.RemoteApiUrl + "/stores/" + storeId + "/" + storeType,
                dataType: 'json',
                type: 'get',
                headers: {
                    "X-User-Id": window.App.Const.UserID
                },
                "Accept-Encoding": "gzip",
                success: function(data) {
                    var tmpObj = {};
                    if (data && data.result) {
                        if ( data.result.length === 1 && data.result[0]['store_type'] == 3 ) {
                            window.App.Const['StorID'] = data.result[0]['store_id'];
                            Cache.setItem("storeList", tmpObj);
                        } else {
                            var tmpStores = [], storeid, storeTmp, firstid;
                            for(var i = 0; i < data.result.length; i ++) {
                                if (data.result[i]['store_type'] === 1) {
                                } else {
                                    tmpStores.push(data.result[i]);
                                    storeTmp = data.result[i];
                                    storeid = storeTmp['store_id'];
                                    if (data.result[i]['branch_order'] == index) {
                                        firstid = storeid;
                                    }
                                    tmpObj[storeid] = storeTmp;
                                }
                            }
                            window.App.Const['StorID'] = firstid;
                            Cache.setItem("storeList", tmpObj);
                        }
                    }
                }
            })

        }

        function getStores(storeId, storeType, currentID) {
            var stroage = window.localStorage;
            $.ajax({
                url: window.AppConfig.RemoteApiUrl + "/stores/" + storeId + "/" + storeType,
                dataType: 'json',
                type: 'get',
                headers: {
                    "X-User-Id": window.App.Const.UserID
                },
                "Accept-Encoding": "gzip",
                success: function(data) {
                    var tmpObj = {};
                    if (data && data.result) {
                        if ( data.result.length === 1 && data.result[0]['store_type'] == 3 ) {
                            window.App.Const['StorID'] = data.result[0]['store_id'];
                            stroage.storeID = data.result[0]['store_id'];
                            stroage.myStores = JSON.stringify(data.result);
                            stroage.storeType = 3;
                            stroage.parentID = data.result[0]['store_id'];
                            tmpObj[data.result[0]['store_id']] = data.result[0];
                            Cache.setItem("storeList", tmpObj);
                        } else {
                            var tmpStores = [], storeid, storeTmp, firstid;
                            for(var i = 0; i < data.result.length; i ++) {
                                if (data.result[i]['store_type'] === 1) {
                                    stroage.parentID = data.result[i]['store_id'];
                                } else {
                                    tmpStores.push(data.result[i]);
                                    storeTmp = data.result[i];
                                    storeid = storeTmp['store_id'];
                                    firstid = firstid || storeid;
                                    tmpObj[storeid] = storeTmp;
                                }
                            }
                            stroage.myStores = JSON.stringify(tmpStores);
                            stroage.storeID = currentID || firstid;
                            stroage.storeType = 2;
                            window.App.Const['StorID'] = currentID || firstid;
                            Cache.setItem("storeList", tmpObj);
                        }
                    }
                }
            })
        }


        //websoket消息处理
        var mySocket= Zepto.websocket({
            domain: window.AppConfig.SocketApiServer,   //这是与服务器的域名或IP
            port: window.AppConfig.SocketApiPort,                  //这是服务器端口号
            protocol: window.AppConfig.SocketApiProtocol,
            onOpen:function(event){
                log.info("已经与服务端握手");
                //建立链接后注册用户
                registerUser();
            },
            onError:function(event){
                log.info("发生了错误");
            },
            onSend:function(msg){
                log.info("发送数据:"+ msg);
            },
            onMessage:function(msg, nTime){
                msg = msg || "{}";
                try{
                    msg = eval("("+ msg +")");
                }catch(e) {
                    msg = {};
                }

                if (msg && msg.MsgType) {
                    (handle[msg.MsgType])(msg) || log.info("没有找到相对应的msgType");
                }
                log.info("从服务端收到的数据:" + JSON.stringify(msg));
                log.info("最近一次发送数据到现在接收一共使用时间:" + nTime);
            }
        });

        function registerUser () {
            mySocket.send(JSON.stringify({"MsgType": window.App.Request.REGISTER, "FromUserId": window.App.Const.UserID, "ClientId": window.App.Const.StorID, "CreateTime": new Date().getTime()}));
        }

        window.Utils.socket = mySocket;

        var  handle = {}, msgType = window.App.Response;
        handle[msgType.MESSAGE] = _message;
        handle[msgType.HISTORICAL] = _historical;
        handle[msgType.HISTORICAL_F] = _historical;
        handle[msgType.SESSIONS] = _records;
        handle[msgType.SYS_ON_LINE] = _online;
        handle[msgType.SYS_OFF_LINE] = _offline;

        //处理普通聊天
        function _message(msg) {
            //判断是否在当前会话的聊天页面
            if($("#weChat").length > 0 && msg.SessionId === $('#weChat').attr('data-session')) {
                var youicon = $('#weChat').attr('data-you-icon') || 'images/ph-lImg.jpg';
                var cell  = "";
                cell += '<li class="wcw-dialog-history clearfix"><div class="wcw-dialog-img-left"> <a href="#"><img src="'+ youicon +'"></a> </div> <div class="wcw-dialog-arrow-item wcw-dialog-left">';
                cell += '<div class="wcw-dialog-content">'+ msg.Content +'</div> <div class="wcw-dialog-arrow-left">';
                cell += '<svg width="8px" height="12px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 8 12" enable-background="new 0 0 8 12" xml:space="preserve"><path fill="#fff" d="M9,1c0,0-9-0.188-9,0.047s0,1.875,0,1.875L9,11"></path></svg> </div> </div></li>';
                $("#weChat").append(cell);
               // _createMsg(_analysisData([msg.Result]||[]), $("#weChat"));
            } else {
                if ($("#chatHisList").length > 0) {

                } else {
                    $("#microchat").addClass('microchatLabel');
                }
            }
            //chatHisList
        }

        //处理历史聊天记录
        function _historical(msg) {
            if (msg.SelfAvatarUrl) {
                var tmp = msg.SelfAvatarUrl;
                tmp = /^((https|http|ftp|rtsp|mms)?:\/\/)/.test(tmp) ?  tmp :  window.App.Const.THUMBNAILS_IMG_SERVER + tmp;
                $('#weChat').attr('data-me-icon', tmp);
            }

            if (msg.ClientRepAvatarUrl) {
                var tmp = msg.ClientRepAvatarUrl;
                tmp = /^((https|http|ftp|rtsp|mms)?:\/\/)/.test(tmp) ?  tmp :  window.App.Const.THUMBNAILS_IMG_SERVER + tmp;
                $('#weChat').attr('data-you-icon', tmp);
            }
            if (msg.AvatarUrls) {
                var icon11 = msg.AvatarUrls[1]['AvatarUrl'];
                var icon01 = msg.AvatarUrls[0]['AvatarUrl'];
                icon01 = /^((https|http|ftp|rtsp|mms)?:\/\/)/.test(icon01) ?  icon01 :  window.App.Const.THUMBNAILS_IMG_SERVER + icon01;
                icon11 = /^((https|http|ftp|rtsp|mms)?:\/\/)/.test(icon11) ?  icon11 :  window.App.Const.THUMBNAILS_IMG_SERVER + icon11;
                if (msg.AvatarUrls[0].UserId === window.App.Const.UserID) {
                    $('#weChat').attr('data-me-icon', icon01);
                    $('#weChat').attr('data-you-icon', icon11);
                } else {
                    $('#weChat').attr('data-me-icon', icon11);
                    $('#weChat').attr('data-you-icon', icon01);
                }
            }

            if($("#weChat").length > 0) {
                if (msg.SessionId) {
                    $('#weChat').attr('data-session', msg.SessionId);
                }
                _createMsg(_analysisData(msg.Result||[]), $("#weChat"));
            } else {

            }
        }

        //处理聊天列表
        function _records(msg) {
            if($("#chatHisList").length > 0) {
                _createMsg(_analysisData(msg.Result||[], true), $("#chatHisList"));
            } else {
            }
        }

        //处于离线时返回的
        function _offline(msg) {
            if($("#weChat").length > 0) {
                $("#weChat").append('<div class="wcw-dialog-time"><span class="wcw-dialog-time-text">'+ msg['Content'] +'</span></div>');
            }
        }

        //上线之后返回离线消息
        function _online(msg) {
            $("#microchat").addClass('microchatLabel');
            var msgCache = Cache.getItem("his_msg_cache") || [];

            for (var i = 0; i < msgCache.length; i ++) {
                if(msgCache[i] === msg.Result.session_id) {

                } else {
                    msgCache.push(msg.Result.session_id)
                }
            }
            Cache.setItem("his_msg_cache", msgCache);
        }

        function _createMsg(msg, $el) {
            var cell, cellTmp, timeTmp, posIconStr, posIcon = {
                'right' : '<svg width="7px" height="12px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 7 12" enable-background="new 0 0 7 12" xml:space="preserve"><path fill="#B2E281" d="M-1,1c0,0,8-0.188,8,0.047s0,1.875,0,1.875L-1,11"></path></svg>',
                'left' : '<svg width="8px" height="12px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 8 12" enable-background="new 0 0 8 12" xml:space="preserve"><path fill="#fff" d="M9,1c0,0-9-0.188-9,0.047s0,1.875,0,1.875L9,11"></path></svg>'
            };
            //历史会话列表
            if (msg && msg.data) if (msg.method) {
                cellTmp = '';
                for (var i = 0; i < msg.data.length; i ++) {
                    cellTmp += '<li><a href="#microchatInfo/'+ msg.data[i]['sessionId'] +'/' + msg.data[i]['brokerId'] +"/" + msg.data[i]['realName']+ '"><div class="actBox"> <div class="act-img fl"> <img src="'+ window.App.Const.THUMBNAILS_IMG_SERVER + msg.data[i]['imagePath'] +'"> </div>';
                    cellTmp += '<div class="act-txt"> <h3>'+ msg.data[i].title +'</h3> <h2 class="act-date">'+ msg.data[i]['realName'] +'</h2> <p>'+ msg.data[i]['time'] +'</p> <p>查看聊天记录</p> </div> </div> </a> </li>';
                }
                $el.html(cellTmp);
            } else {
                for (var i = 0; i < msg.data.length;i ++) {

                    cellTmp = "", timeTmp = "";
                    posIconStr = posIcon[msg.data[i].pos];
                    cell = $('<li class="wcw-dialog-history clearfix"></li>');

                    if (msg.data[i]['hisTime']) {
                        timeTmp = ' <li class="wcw-dialog-history"><div class="wcw-dialog-time"><span class="wcw-dialog-time-text">'+ msg.data[i].hisTime +'</span></div></li>';
                    }
                    cellTmp += '<div class="wcw-dialog-img-'+ msg.data[i].pos +'"><a href="javascript:void(0);"><img src="'+ msg.data[i].head +'"></a></div>';
                    cellTmp += '<div class="wcw-dialog-arrow-item wcw-dialog-'+ msg.data[i].pos +'"><div class="wcw-dialog-content">'+ msg.data[i].content +'</div><div class="wcw-dialog-arrow-'+ msg.data[i].pos +'">'+ posIconStr +'</div></div>'
                    cell.append(cellTmp);
                    timeTmp && $el.append(timeTmp);
                    $el.append(cell);
                }
            }
        }

        function _analysisData(data, flag) {
            var tmpVar, tmpRs = [], tmpTime;

            for (var index = 0; index < data.length; index ++) {
                var tmpObj = {};
                tmpVar = data[index]["user_id"];
                if (tmpVar) if (tmpVar === window.App.Const.UserID) {
                    tmpObj['pos'] = 'right'
                } else {
                    tmpObj['pos'] = 'left';
                    tmpObj['formUser'] = tmpVar;
                }

                tmpVar = data[index]["from_id"];
                if (tmpVar) if (tmpVar === window.App.Const.UserID) {
                    tmpObj['pos'] = 'right'
                    tmpObj['head'] = $('#weChat').attr('data-me-icon');
                } else {
                    tmpObj['pos'] = 'left';
                    tmpObj['formUser'] = tmpVar;
                    tmpObj['head'] = $('#weChat').attr('data-you-icon');
                }

                tmpVar = data[index]["nick_name"];
                if (tmpVar) tmpObj['nick'] = tmpVar;

                tmpVar = data[index]["avatarurl"];
                if (tmpVar) tmpObj['header'] = tmpVar;

                tmpVar = data[index]["create_time"];
                if (tmpVar) {
                    tmpVar = parseInt(tmpVar);
                    tmpVar && (tmpObj['time'] = moment(new Date(tmpVar)).format('YYYY-MM-DD HH:mm'));
                }
                if (tmpVar && !flag) {
                    //TODO 需要处理时间
                    if (tmpTime) {
                        if (tmpVar - tmpTime > 3*60*1000 ) {
                            tmpObj['hisTime'] = moment(new Date(tmpVar)).format('MM-DD HH:mm');
                        }
                    } else {
                        tmpObj['hisTime'] = moment(new Date(tmpVar)).format('YYYY-MM-DD HH:mm');
                    }
                    tmpTime = tmpVar;
                }

                tmpVar = data[index]["content"];
                if (tmpVar) tmpObj['content'] = tmpVar;

                tmpVar = data[index]["session_id"];
                if (tmpVar) tmpObj['sessionId'] = tmpVar;

                tmpVar = data[index]["resource_info"];
                if (tmpVar) tmpObj['propertyId'] = tmpVar;
                tmpVar = data[index]["resource_info"];
                if (tmpVar) tmpObj['propertyId'] = tmpVar;

                tmpVar = data[index]["client_id"];
                if (tmpVar) tmpObj['storeId'] = tmpVar;

                tmpVar = data[index]["property_title"];
                if (tmpVar) tmpObj['title'] = tmpVar;

                tmpVar = data[index]["images_path"];
                if (tmpVar) tmpObj['imagePath'] = tmpVar.split(",")[0];

                tmpVar = data[index]["client_rep_id"];
                if (tmpVar === window.App.Const.UserID) {
                    tmpObj['brokerId'] = data[index]["user_id"];
                    tmpObj['realName'] = data[index]["nick_name"];
                } else {
                    tmpObj['brokerId'] = data[index]["client_rep_id"];
                    tmpObj['realName'] = data[index]["real_name"];
                }
                
                tmpRs.push(tmpObj);
            }
            return {data:tmpRs, method: flag};
        }

    });
