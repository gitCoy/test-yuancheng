window.AppConfig = {
    DEBUG: false, //if show log
    RemoteApiUrl: 'http://192.168.2.100:9000',//218.244.146.198
    SocketApiServer: '218.244.146.198',
    SocketApiPort: '9000',
    SocketApiProtocol: 'socket',
    SEND_SMS: localStorage.getItem("SendSms") || 'true'
};

window.App = {
    View: {},
    Const: {
        RESULT_FUL_SERVER: 'http://192.168.2.100:9000',
        SERVICE_API_SERVER: 'http://120.26.92.182:8888',//http://120.26.92.182:8888
        IMAGE_SERVER:'http://estate-brokers.oss-cn-hangzhou.aliyuncs.com/',
        THUMBNAILS_IMG_SERVER:'http://images.sou130.com/',
        CURRENT_USER: 'current_user',
        loadImageSize: 15,
        StorID:"",
        UserID:""
    },
    Request: {
        MESSAGE: 1001,//普通消息
        REGISTER: 3000,//注册用户
        SESSIONS: 3002,//会话列表
        HISTORICAL_F: 3003,//会话列表页进入请求历史记录
        HISTORICAL: 3001//聊天记录详细信息
    },
    Response: {
        MESSAGE: 1001,//普通消息
        SESSIONS: 4002,//会话列表
        HISTORICAL: 4001,//聊天记录详细信息
        HISTORICAL_F: 4003,//聊天记录详细信息
        SYS_OFF_LINE: 2001,//离线消息
        SYS_ON_LINE: 2002//在线后发送离线消息
    },
    //缩略图常用格式
    Thumbnails: {
        BANNER: '@640w_300h_100Q.jpg',
        LISTIMG: '@110w_100h_90Q.jpg',
        indexEstate: '@240w_150h_90Q.jpg',
        HotProperty: '@180w_100h_90Q.jpg'
    }
};


