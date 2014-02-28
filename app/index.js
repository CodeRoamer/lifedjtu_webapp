

$(function() {

//    //初始化全部的panel
//    $( "body>[data-role='panel']" ).panel();

    //userExist
    $("#userExist a[href='#nextstep']").click(function(event){
        event.preventDefault();

        //show Indicator
        triggerLoad();

        //studentId
        var studentId = $("#studentId").val();

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
            }
        },function(jqXHR, textStatus, errorThrown){
            alert(errorThrown);
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
                alert("密码错误");
            }
        },function(jqXHR, textStatus, errorThrown){
            alert(errorThrown);
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
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("studentId",studentId);
                    window.localStorage.setItem("privateKey",data.privateKey);
                    $(self).trigger('click',true);
                    //$("#signin a[href='app.html']").click();
                    //处理以下的几步必须过程
                    getUserInfo();
                }else{
                    alert("do not support local storage! try to save private key in file");
                }
            }else{
                alert("密码错误");
            }
        },function(jqXHR, textStatus, errorThrown){
            alert(errorThrown);
        },function(jqXHR, textStatus){
            stopLoad();
        });
    });

    function getUserInfo(){
        getJSON("webservice/secure/getUserInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            privateKey:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){

                }else{
                    alert("do not support local storage! try to save private key in file");
                }
            }else{
                alert("密码错误");
            }
        },function(jqXHR, textStatus, errorThrown){
            alert(errorThrown);
        });
    }

});