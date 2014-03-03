

$(function() {
    clearCache();
//    //初始化全部的panel
//    $( "body>[data-role='panel']" ).panel();

    //userExist
    $("#userExist a[href='#nextstep']").click(function(event){
        event.preventDefault();

        //studentId
        var studentId = $("#studentId").val();

        if(!studentId){
            handleError();
            return;
        }

        //show Indicator
        triggerLoad();

        getJSON("webservice/checkUser.action",{
            studentId:studentId
        },function(data,text,xhqr){
            if(data.flag==2){
                $("span[class*=span-studentId]").text(studentId);

                if(data.exist){
                    //$.mobile.navigate("#signin");
                    //window.location.hash="signin";
                    $("a[href='#signin']").trigger('click');
                }else{
                    //$.mobile.navigate("#signup");
                    //window.location.hash="signup";
                    $("a[href='#signup']").trigger('click');
                }
            }else{
                handleExceptionData(data);
            }
        },function(jqXHR, textStatus, errorThrown){
            handleError();
        },function(jqXHR, textStatus){
            stopLoad();
        });
    });

    //signin
    $("#signin a[href='#nextstep']").click(function(event){
        var self = this;

        event.preventDefault();

        //show Indicator
        triggerLoad();

        var studentId = $("#studentId").val();
        var password = $("#signin-password").val();

        getJSON("webservice/signin.action",{
            studentId:studentId,
            password:password
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("studentId",studentId);
                    window.localStorage.setItem("privateKey",data.privateKey);
                    window.location.href='app.html';
                    //$("#signin a[href='app.html']").click();
                }else{
                    alert("do not support local storage! try to save private key in file");
                }
            }else{
                handleExceptionData(data);
            }
        },function(jqXHR, textStatus, errorThrown){
            handleError();
        },function(jqXHR, textStatus){
            stopLoad();
        });
    });

    //signup
    $("#signup a[href='#prepareUser']").click(function(event,direct){
        if(direct){
            return;
        }
        var self = this;

        event.preventDefault();

        //show Indicator
        triggerLoad();

        var studentId = $("#studentId").val();
        var password = $("#signup-password").val();

        getJSON("webservice/signup.action",{
            studentId:studentId,
            password:password
        },function(data,text,xhqr){
            //提前stopLoad() 必须的
            stopLoad();
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("studentId",studentId);
                    window.localStorage.setItem("privateKey",data.privateKey);
                    $(self).trigger('click',true);
                    //$("#signin a[href='app.html']").click();
                    //处理以下的几步必须过程

                    (function(){
                        console.log('in inner package');
                        var itemDoms = $("#prepareUser .list-group-item");

                        if(itemDoms.length==3){
                            getUserInfo(itemDoms,0);
                        }
                    })();
                }else{
                    alert("do not support local storage! try to save private key in file");
                }
            }else{
                handleExceptionData(data);
            }
        },function(jqXHR, textStatus, errorThrown){
            handleError();
        },function(jqXHR, textStatus){
            stopLoad();
        });
    });

    $("#prepareUser a[href='#startUse']").click(function(event){
        event.preventDefault();

        window.location.href='app.html';

    });


    function getUserInfo(itemDoms,index){
        triggerLoad();


        var userInfoItem = itemDoms[index];
        $(userInfoItem).addClass('active');
        $(userInfoItem).children('span').children('span').attr('class','glyphicon glyphicon-refresh');
        $(userInfoItem).children('span').attr('class','');

        getJSON("webservice/secure/getUserInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("userInfo",JSON.stringify(data));

                    $(userInfoItem).removeClass('active');
                    $(userInfoItem).children('span').children('span').attr('class','glyphicon glyphicon-ok');
                    $(userInfoItem).children('span').attr('class','text-success');

                    getCourseInfo(itemDoms,1);
                }else{
                    alert("do not support local storage! try to save private key in file");
                }
            }else{
                handleExceptionData(data);
            }
        },function(jqXHR, textStatus, errorThrown){
            handleError();
        });
    }

    function getCourseInfo(itemDoms,index){

        var courseInfoItem = itemDoms[index];
        $(courseInfoItem).addClass('active');
        $(courseInfoItem).children('span').children('span').attr('class','glyphicon glyphicon-refresh');
        $(courseInfoItem).children('span').attr('class','');

        getJSON("webservice/secure/getCourseInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("courseInfo",JSON.stringify(data));

                    $(courseInfoItem).removeClass('active');
                    $(courseInfoItem).children('span').children('span').attr('class','glyphicon glyphicon-ok');
                    $(courseInfoItem).children('span').attr('class','text-success');

                    getExamInfo(itemDoms, 2);
                }else{
                    alert("do not support local storage! try to save private key in file");
                }
            }else{
                handleExceptionData(data);
            }
        },function(jqXHR, textStatus, errorThrown){
            handleError();
        });
    }

    function getExamInfo(itemDoms,index){

        var examInfoItem = itemDoms[index];
        $(examInfoItem).addClass('active');
        $(examInfoItem).children('span').children('span').attr('class','glyphicon glyphicon-refresh');
        $(examInfoItem).children('span').attr('class','');

        getJSON("webservice/secure/getExamInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("examInfo",JSON.stringify(data));

                    var examInfoItem = itemDoms[index];
                    $(examInfoItem).removeClass('active');
                    $(examInfoItem).children('span').children('span').attr('class','glyphicon glyphicon-ok');
                    $(examInfoItem).children('span').attr('class','text-success');

                    $("#prepareUser a[href='#startUse']").attr("style","");

                }else{
                    alert("do not support local storage! try to save private key in file");
                }
            }else{
                handleExceptionData(data);
            }
        },function(jqXHR, textStatus, errorThrown){
            handleError();
        });
    }
});