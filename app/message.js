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
            }else{
                $(this).hide();
            }
        });
    }
    //获取group的全部信息
    var ensureRenderGroups = function(updateFlag){
        if(updateFlag){
            //triggerLoad("正在更新您的群组");

            getJSON("webservice/secure/getAllGroups.action",{
                studentId:window.localStorage.getItem("studentId"),
                dynamicPass:window.localStorage.getItem("privateKey")
            },function(data,text,xhqr){
                if(data.flag==2){
                    if(window.localStorage){
                        renderGroups(directUpdateGroup(data.groupList));

                    }else{
                        handleError("do not support local storage! try to save private key in file");
                    }
                }else{
                    handleExceptionData(data);
                }
            },function(jqXHR, textStatus, errorThrown){
                handleError(errorThrown);
            });
        }else{
            var groups_cache = getItemFromStorage("groups_cache");
            if(!groups_cache){
                getJSON("webservice/secure/getAllGroups.action",{
                    studentId:window.localStorage.getItem("studentId"),
                    dynamicPass:window.localStorage.getItem("privateKey")
                },function(data,text,xhqr){
                    if(data.flag==2){
                        if(window.localStorage){
                            renderGroups(directUpdateGroup(data.groupList));

                        }else{
                            handleError("do not support local storage! try to save private key in file");
                        }
                    }else{
                        handleExceptionData(data);
                    }
                },function(jqXHR, textStatus, errorThrown){
                    handleError(errorThrown);
                });
            }else{
                renderGroups(groups_cache);
            }
        }
    };
    //render groups
    var renderGroups = function(groupList){
        //console.log(groupList);
        var ulDom = $("#instant-message #group-panel").children('ul');
        ulDom.empty();
        if(groupList||groupList.length>0){
            $.each(groupList, function(index, group){
                //console.log(group);
                ulDom.append('\
                <li class="ui-li-has-alt ui-li-has-thumb">\
                    <a href="#chat-page" data-transition="slide" class="ui-btn" data-flag="1" data-id="'+group.id+'">\
                        <img src="./res/icon/default.jpg">\
                        <h2><span class="title text-info">'+group.groupName+'</span></h2>\
                        <p><span class="member-number badge">'+group.groupMembers.length+'</span></p>\
                    </a>\
                    <a data-transition="pop" data-id="'+group.id+'" data-bind="-1" href="#classMateList" class="ui-btn ui-btn-icon-notext ui-icon-grid ui-btn-a" title="查看成员"></a>\
                </li>\
                ');
            });
        }else{
            ulDom.append('\
            <br>\
            <h4 class="text-muted text-center"><span class="glyphicon glyphicon-refresh"></span>没有群组</h4>\
            <br>\
            ');
        }
    }

    //直接覆盖更新groups
    var directUpdateGroup = function(groupList){
        if(!groupList||groupList.length==0){
            return;
        }
        var groups_cache = JSON.parse(window.localStorage.getItem("groups_cache")||'{}');

        if(Array.isArray(groupList)){
            for(var index in groupList){
                groups_cache[groupList[index].id] = {
                    id:groupList[index].id,
                    groupName: groupList[index].groupName,
                    groupMembers:groupList[index].groupMembers
                }
            }
        }

        window.localStorage.setItem('groups_cache',JSON.stringify(groups_cache));
        return groups_cache;
    };

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


        updateChatPanelState();

    });

    $("#chat-page a[data-rel='back']").click(function(event){
        window.localStorage.removeItem('global_chat_panel_flag');

        $("#chat-page #chat-panel").empty();
    });

    $("#chat-page #content").click(function(event){
        event.stopPropagation();
    });

    //发消息
    $("#chat-page #say").click(function(event){

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

        addMessageToChatPanel(message);
        addMessageToChatCache(message,true);
        updateMessageCenterViewByBindId((groupFlag=='1'?groupId:source));
        say(message);

        $("#chat-page #input_content").html('');
    });


    //在页面启动之初就尝试获取group群组信息
    ensureRenderGroups(false);
    initMessageCenterView();

});