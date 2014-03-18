/**
 * Created by lihe9_000 on 14-3-16.
 */

$(function(){

    //tab切换message窗口
    $("#instant-message #footer-list").contents().find("a").click(function(event){
        event.preventDefault();
        var me = this;
        $("#instant-message #footer-list").contents().find("a").each(function(index,value){
            if($(this).attr('href')==$(me).attr('href')){
                $(this).addClass("ui-btn-active");
                showTab($(this).attr('href').substring(1));
            }else{
                $(this).removeClass("ui-btn-active");
            }
        });
    });
    //便捷方法，找出正确的tab
    function showTab(id){
        $("#instant-message div[role='main']").each(function(index, value){
            if($(this).attr('id')==id){
                $(this).show();
                var title;
                if(id=='message-panel'){
                    title = "消息";
                }else if(id=="friend-panel"){
                    title = "好友";
                }else{
                    title = "群组";
                }
                $("#instant-message .page-title").text(title);
            }else{
                $(this).hide();
            }
        });
    }

    //加载同学列表，此事件触发属于classDetail页面
    $(document).on("click", "#group-panel a[href='#classMateList']", function(event){
        console.log("here in list!");

        var bindId = $(this).attr('data-id');
        var groupFlag = $(this).attr("data-bind");
        var courseName = $(this).prev('a').contents().find(".title").text();

        //刷新按钮需要这两个参数！！！
        $("#classMateList a[href='#refresh-mate-list']").attr("data-bind",groupFlag);
        $("#classMateList a[href='#refresh-mate-list']").attr("data-id",bindId);


        $("#classMateList .course-name").text(courseName);

        ensureRenderClassMatesList(false,parseInt(groupFlag),bindId,courseName);
    });

    //进入聊天界面前的准备工作
    $(document).on("click", "#instant-message a[href='#chat-page']", function(event){
        var bindId = $(this).attr('data-id');  //studentId or groupId
        setItemToStorage('global_chat_panel_flag',bindId);

        var isGroup = $(this).attr("data-flag");
        var title = $(this).contents().find('.title').text();
        $(this).next('.ui-li-count').text(0);

        $("#chat-page .title").text(title);
        $("#chat-page input[name='messageSource']").attr('value',getItemFromStorage('studentId'));
        $("#chat-page input[name='imGroupFlag']").attr('value',isGroup);

        if(isGroup=='1'){
            $("#chat-page input[name='messageDes']").attr('value','');
            $("#chat-page input[name='imGroupId']").attr('value',bindId);
        }else{
            $("#chat-page input[name='messageDes']").attr('value',bindId);
            $("#chat-page input[name='imGroupId']").attr('value','');
        }

        var chatItem = getChatCacheByBindId(bindId);

        if(chatItem&&chatItem.messages){
            $.each(chatItem.messages,function(index ,item){
                addMessageToChatPanel(item);
            });
            //清除unread信息，因为已经在读了~~~
            chatItem.unreadNum = 0;
            updateChatCacheByItem(chatItem);
        }


        setTimeout(updateChatPanelState,50);

    });

    $("#chat-page a[data-rel='back']").click(function(event){
        window.localStorage.removeItem('global_chat_panel_flag');

        $("#chat-page #chat-panel").empty();
    });

    $("#chat-page #content").click(function(event){
        event.stopPropagation();
    });

    $("#chat-page #input_content").click(function(event){
        event.stopPropagation();

        setTimeout(function(){
            updateChatPanelState();
        },200);
    });

    //发消息
    $("#chat-page #say").click(function(event){
        event.stopPropagation();

        var content = $("#chat-page #input_content").html();
        if(content.trim()==''){
            handleWarning("您至少输点东西吧...");
            return;
        }
        var messageDate = new Date().getTime(); //long number
        var source = $("#chat-page input[name='messageSource']").val();
        var groupFlag = $("#chat-page input[name='imGroupFlag']").val();
        var destination = $("#chat-page input[name='messageDes']").val();
        var groupId = $("#chat-page input[name='imGroupId']").val();
        //更新存储对象  messageSource,imGroupFlag,imGroupId,messageContent,messageDate
        var message = {
            messageSource: source,
            messageDes:destination,
            imGroupFlag:groupFlag,
            imGroupId:groupId,
            messageContent:content,
            messageDate:messageDate
        }

        if(say(message)){
            addMessageToChatPanel(message);
            addMessageToChatCache(message,true);
            updateMessageCenterViewByBindId((groupFlag=='1'?groupId:source));
            $("#chat-page #input_content").html('');
        }

    });

    $("#instant-message a[href='#reconnect']").click(function(event){
        event.preventDefault();
        if($(this).attr("disabled")){
            return;
        }

        $(this).attr("disabled","true");

        reconnect();
        //$(this).removeClass('ui-btn-active');
    });

    initMessageCenterView();

});