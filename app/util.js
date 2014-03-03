/**
 * Created by apple on 3/1/14.
 */

//global host
var globalHost = "http://localhost:9119/lifedjtu/";

var triggerLoad = function(message){
    if(!message){
        message = "努力加载中...";
    }
    $.mobile.loading( "show", {
        text: message+"...",
        textVisible: true,
        theme: 'b',
        textonly: false,
        html: ""
    });
};

var stopLoad = function(){
    $.mobile.loading( "hide" );
};

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
            handleError("抓取数据时出错了...");
        }
    }else{
        handleError("服务器错误...");
    }
};

var handleWarning = function(message){
    if(!message){
        message = "小警告，提醒下您哦~";
    }

    var dateId = new Date().getTime();
    console.log(dateId);
    $("body").prepend('\
    <div id="'+dateId+'" style="position: absolute;left:10%;right:10%;top: 5%;z-index: 100000" class="alert alert-warning alert-dismissable">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
        <strong>警告</strong> '+message+'\
    </div>\
    ');

    $("#"+dateId).fadeOut(3000,function(){
        $(this).remove();
    });
}

var handleError = function(message){

    if(!message){
        message = "抱歉哦,出现了未知错误！";
    }

    var dateId = new Date().getTime();
    console.log(dateId);
    $("body").prepend('\
    <div id="'+dateId+'" style="position: absolute;left:10%;right:10%;top: 5%;z-index: 100000" class="alert alert-danger alert-dismissable">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
        <strong>错误</strong> '+message+'\
    </div>\
    ');

    $("#"+dateId).fadeOut(3000,function(){
        $(this).remove();
    });
};

var handleNeedLogin = function(){
    //$.mobile.navigate('./');
    window.location.href='temp-signin.html';

};

var clearCache = function(){
    window.localStorage.clear();
};

var getDjtuDate = function(){
    getJSON("webservice/getDjtuDate.action",{

    },function(data,text,xhqr){
        if(data.flag==2){
            if(window.localStorage){
                window.localStorage.setItem("djtuDate",JSON.stringify(data));
            }else{
                handleError("do not support local storage! try to save private key in file");
            }
        }else{
            handleExceptionData(data);
        }
    },function(jqXHR, textStatus, errorThrown){
        handleError(errorThrown);
    });
}

//处理课程表
var initCourseTable = function(){

    if(window.localStorage.getItem('djtuDate')){
        ensureRenderCourseInfo();
    }else{
        triggerLoad("需要同步校园当前周数");

        getJSON("webservice/getDjtuDate.action",{

        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("djtuDate",JSON.stringify(data));

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


};

//make sure the existence of courseInfo
var ensureRenderCourseInfo = function(){

    if(!window.localStorage.getItem('courseInfo')){
        triggerLoad("需要获取学生课程信息");

        getJSON("webservice/secure/getCourseInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("courseInfo",JSON.stringify(data));

                    renderCourseTable(data);

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
        //alert('here two');

        renderCourseTable(JSON.parse(window.localStorage.getItem('courseInfo')));
    }


};

//render course table
var renderCourseTable = function(courseInfo){

    var djtuDate = JSON.parse(window.localStorage.getItem('djtuDate'));
    var currentWeek = djtuDate.date.week;

    if(courseInfo){

        $.each(courseInfo.courseDtos, function(index, course){
            //console.log(course);
            var times = course.courseTakenInfo.split(';');
            $.each(times, function(index, time){
                var items = time.split('&');
                if(items.length==5){


                    var startWeek = items[0].substr(items[0].indexOf('=')+1);
                    var endWeek = items[1].substr(items[1].indexOf('=')+1);
                    var weekDay =  items[2].substr(items[2].indexOf('=')+1);
                    var roomName = items[3].substr(items[3].indexOf('=')+1);
                    var segment = items[4].substr(items[4].indexOf('=')+1);
                    //handle multi-segments
                    var segments = segment.split('\|');
                    var segmentNum = segments.length;
                    segment = segments[0];

                    //handle multi-weekPair
                    var startWeeks = startWeek.split('\|');
                    var endWeeks = endWeek.split('\|');

                    var enabledClass = false;

                    for(var i = 0; i < startWeeks.length; i++){
                        if(startWeeks[i]==endWeeks[i]){
                            if(startWeeks[i]==currentWeek){
                                enabledClass = true;
                            }
                        }else{
                            if(startWeeks[i] <= currentWeek && currentWeek <= endWeeks[i]){
                                enabledClass = true;
                            }
                        }
                    }

                    var tdDom = $('#'+segment+'-segment>td:eq('+weekDay+')');

                    if(tdDom.html()==''||enabledClass){
                        if(!enabledClass){
                            tdDom.attr('class', 'active');
                        }else{
                            tdDom.attr("class",["success","info","warning","danger"][parseInt(Math.random()*4)]);
                        }
                        tdDom.attr("rowspan",segmentNum);
                        for(var i = 1; i < segmentNum; i++){
                            $('#'+(++segment)+'-segment>td:eq('+weekDay+')').attr("style","display:none");
                        }
                        tdDom.html('\
                        <div class="text-center lead" style="font-size: 12px">\
                            '+(enabledClass?'':'<span><strong>[非本周]</strong></span>')+'\
                            <span><strong>'+course.courseName+'</strong></span><br>\
                            <span>'+course.teacherName+'</span><br>\
                            <span>'+roomName+'</span>\
                        </div>\
                        ');
                    }


                }

            });
        });
    }else{
        handleError("courseInfo is null!!!");
    }

    stopLoad();
};

var testNeedLogin = function(){
    getJSON("webservice/secure/getExamInfo.action",{
        studentId:window.localStorage.getItem("studentId"),
        dynamicPass:window.localStorage.getItem("privateKey")
    },function(data,text,xhqr){
        if(data.flag==2){
            if(window.localStorage){
                window.localStorage.setItem("examInfo",JSON.stringify(data));
            }else{
                handleError("do not support local storage! try to save private key in file");
            }
        }else{
            handleExceptionData(data);
        }
    },function(jqXHR, textStatus, errorThrown){
        handleError();
    });
}

//处理考试
var ensureRenderExamInfo = function(){

    if(!window.localStorage.getItem('examInfo')){
        triggerLoad("正在获取考试信息");

        getJSON("webservice/secure/getExamInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("examInfo",JSON.stringify(data));

                    renderExamTable(data);

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
        //alert('here two');

        renderExamTable(JSON.parse(window.localStorage.getItem('examInfo')));
    }
};

var renderExamTable = function(examInfo){

    if(examInfo){

        var tableDom = $("#exam-table table[class*='table']");

        if(examInfo&&examInfo.length>0){
            $.each(examInfo.examDtos, function(index, exam){

            });
        }else{
            tableDom.append('\
                <tr>\
                    <td colspan="6" class="text-center lead text-muted" style="font-size:20px;padding-top: 60px;padding-bottom: 60px"><strong>暂时没有考试信息</strong></td>\
                </tr>\
            ');
        }


        //console.log(examInfo);
    }else{
        handleError("exam info is null!!!");
    }

    stopLoad();

}

