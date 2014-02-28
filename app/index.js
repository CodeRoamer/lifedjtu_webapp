

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
});