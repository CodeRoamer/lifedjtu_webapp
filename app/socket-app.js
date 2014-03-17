/**
 * Created by lihe9_000 on 14-3-16.
 */

var socket = io.connect('http://127.0.0.1:1222');
//make me online
socket.on('ready',function(){
    socket.emit('online',{
        studentId:window.localStorage.getItem("studentId"),
        dynamicPass:window.localStorage.getItem("privateKey")
    });
});

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
    if(data.errorCode==1){
        handleNeedLogin();
    }else{
        handleError(data.errorCode+":"+data.message);
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

function say(message){
    ///console.log("here");
    socket.emit('say',message);
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