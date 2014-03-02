/**
 * Created by apple on 3/1/14.
 */

//global host
var globalHost = "http://localhost:9119/lifedjtu/";

var triggerLoad = function(){
    $.mobile.loading( "show", {
        text: "loading...",
        textVisible: true,
        theme: 'b',
        textonly: false,
        html: ""
    });
}

var stopLoad = function(){
    $.mobile.loading( "hide" );
}

//encapsulate $.ajax for jsonp
var getJSON = function(relativeUrl, data, success, error, complete){
    var absoluteUrl;
    if(relativeUrl.indexOf('//')!=-1){
        absoluteUrl = relativeUrl;
    }else{
        if(relativeUrl[0]=='/') relativeUrl = relativeUrl.substring(1);
        absoluteUrl = globalHost + relativeUrl;
    }

    if(absoluteUrl.indexOf('callback=?')==-1){
        if(absoluteUrl.indexOf('?')==-1){
            absoluteUrl += '?callback=?';
        }else{
            absoluteUrl += 'callback=?';
        }
    }

    $.ajax(absoluteUrl, {
        data:data,
        crossDomain:true,
        dataType: "jsonp",
        timeout: 30000,
        success:success,
        error: error,
        complete: complete
    });
};

var handleExceptionData = function(data){
    if(data.flag){
        if(data.flag==1){
            handleNeedLogin();
        }else{
            handleError();
        }
    }else{
        handleError();
    }
};

var handleError = function(message){
    if(message){
        alert(message);
    }else{
        alert("出现错误！");
    }
};

var initCourseTable = function(){
    getJSON("webservice/secure/getDjtuDate.action",{
        studentId:window.localStorage.getItem("studentId"),
        dynamicPass:window.localStorage.getItem("privateKey")
    },function(data,text,xhqr){
        if(data.flag==2){
            if(window.localStorage){
                window.localStorage.setItem("djtuDate",data);
                alert("i am here");
                ensureRenderCourseInfo();
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

var ensureRenderCourseInfo = function(){
    if(!window.localStorage.getItem('courseInfo')){
        getJSON("webservice/secure/getCourseInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("courseInfo",data);

                    renderCourseTable(data);

                }else{
                    alert("do not support local storage! try to save private key in file");
                }
            }else{
                handleExceptionData(data);
            }
        },function(jqXHR, textStatus, errorThrown){
            handleError();
        });
    }else{
        renderCourseTable(window.localStorage.getItem('courseInfo'));
    }


};

//render course table
var renderCourseTable = function(courseInfo){

    var djtuDate = window.localStorage.getItem('djtuDate');

    if(courseInfo){
        $.each(courseInfo.courseDtos, function(index, course){
            var times = course.courseTakenInfo.split(';');
            $.each(times, function(index, time){
                var items = time.split('&');
                $.each(items, function(index, item){

                });
            });
        });
    }else{
        handleError("courseInfo is null!!!");
    }
};

var handleNeedLogin = function(){
    alert("出现登录！");
};