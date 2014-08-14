/**
 * Created by lihe9_000 on 14-3-16.
 */

var socket;

var onlineFlag = false;
var initialFailure = false;

var incaseInitialError = setInterval(function(){
    if(initialFailure){
        mm("socket-io-src","http://115.28.83.115:1313/socket.io/socket.io.js");
        //mm("socket-io-src","http://127.0.0.1:1222/socket.io/socket.io.js");

        //console.log("here!!!for get script");
    }else{
        //console.log("here!!!for clean");
        clearInterval(incaseInitialError);
    }
},5000);

/**
 * 公共方法，暴露出来，让大家调用
 * @param message
 */
function say(message){
    ///console.log("here");
    if(socket&&onlineFlag){
        socket.emit('say',message);
        return true;
    }else{
        handleWarning("离线状态下不可以发消息的~");
        return false;
    }
};

/**
 * 更新用户状态，在线or离线
 * @param status(Number)
 */
function updateUserStatus(studentId, status){
    var users_cache = getUserCache();
    if(users_cache[studentId]){
        users_cache[studentId].online=status;
    }
    setItemToStorage('users_cache',users_cache);
}
/**
 * 重新连接
 */
function reconnect(){
    if(socket){
        socket.disconnect();
    }
    triggerLoad("正在连接");
    setTimeout(connect,2000);

}

function showMeOffline(showNote){
    console.log("连接丢失");

    if(showNote)
        handleWarning("您已经断开连接");
    var header = $("#instant-message");
    header.find(".user-status").removeClass("text-success");
    header.find(".user-status").removeClass("text-warning");
    header.find(".user-status").addClass("text-danger");
    header.find(".user-status").text("离线");
    stopLoad();
    onlineFlag = false;

    setTimeout(function(){
        if(!onlineFlag){
            $("#instant-message a[href='#reconnect']").removeAttr("disabled");
            $("#instant-message a[href='#reconnect']").show();
        }
    },1500);
}

function showMeConnecting(){
    console.log("正在建立连接");

    triggerLoad("正在连接服务器");
    $("#instant-message .user-status").removeClass("text-success");
    $("#instant-message .user-status").removeClass("text-danger");
    $("#instant-message .user-status").addClass("text-warning");
    $("#instant-message .user-status").text("正在连接");
}

function showMeOnline(){
    console.log("建立连接成功");

    $("#instant-message .user-status").removeClass("text-warning");
    $("#instant-message .user-status").removeClass("text-danger");
    $("#instant-message .user-status").addClass("text-success");
    $("#instant-message .user-status").text("在线");
    stopLoad();

    onlineFlag = true;
    initialFailure = false;
    $("#instant-message a[href='#reconnect']").hide();
}

function mm(id,path)
{
    var e;
    if(e=document.getElementById(id))
        e.parentNode.removeChild(e);
    var script= document.createElement("SCRIPT"); script.defer = true;
    script.type="text/javascript"; script.src=path; script.id=id;
    document.getElementsByTagName("HEAD")[0].appendChild(script);
}

/**
 * 连接远程消息服务器
 */
function connect(){
    try{
        showMeOffline(false);

        var connectionAttempts = 0;
        //stopLoad();
        //triggerLoad('正在连接通信服务器');

//        socket = io.connect('http://127.0.0.1:1222',{
//            "max reconnection attempts":connectionAttempts,
//            "sync disconnect on unload":true,
//            "force new connection":true
//
//        });

        socket = io.connect('http://115.28.83.115:1313',{
            "max reconnection attempts":connectionAttempts,
            "sync disconnect on unload":true,
            "force new connection":true

        });

        //make me online
        socket.on('ready',function(){
            socket.emit('online',{
                studentId:window.localStorage.getItem("studentId"),
                dynamicPass:window.localStorage.getItem("privateKey")
            });
        });

        socket.on('connecting', function () {
            showMeConnecting();
        });

        socket.on("connect",function(){
            showMeOnline();
        });

        socket.on("disconnect",function(){
            showMeOffline();
        });

//    socket.on("reconnecting",function(){
//        console.log("尝试重新建立连接...:"+(connectionAttempts--));
//
//    });

        socket.on('connect_failed', function () {
            console.log("连接失败...");
        });
//    socket.on('reconnect_failed', function () {
//        console.log("尝试重新连接失败...");
//    });


        socket.on('say',function(data){
            //messageDes,messageSource,imGroupFlag,imGroupId,messageContent,messageDate
            var currentChat = getItemFromStorage('global_chat_panel_flag');
            var bindId = (data.imGroupFlag=='1')?data.imGroupId:data.messageSource;
            if(currentChat){
                if(currentChat==bindId){
                    addMessageToChatPanel(data);
                    addMessageToChatCache(data,true);
                }
            }else{
                addMessageToChatCache(data,false);
            }

            updateMessageCenterViewByBindId(bindId);

        });

        socket.on('error',function(data){
            if(!data.errorCode){
                handleError("连接发生了错误，您没有接入互联网吗？");
                return;
            }else{
                if(data.errorCode==1){
                    handleNeedLogin();
                }else{
                    handleError(data.errorCode+":"+data.message);
                    console.log(data.detail);
                }
            }
        });

        socket.on('system',function(data){
            if(data.type=='online'){
                updateUserStatus(data.data.studentId,1);
            }else if(data.type=='offline'){
                updateUserStatus(data.data.studentId,0);
            }else {
                handleError('unknow system event!!!');
            }
        });
    }catch(err){
        handleError("连接发生了错误，您没有接入互联网吗？");
        //handleError(err);
        if(!initialFailure){
            initialFailure = true;
            //console.log("error in here! only once! and in the initial!");
        }
    }

}

$(function(){

    preworkBeforeConnect(connect);

});

