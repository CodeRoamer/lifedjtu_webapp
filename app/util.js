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

var handleNeedLogin = function(){
    alert("出现登录！");
};

var clearCache = function(){
    window.localStorage.clear();
};


//处理课程表
var initCourseTable = function(){
    triggerLoad();

    getJSON("webservice/secure/getDjtuDate.action",{
        studentId:window.localStorage.getItem("studentId"),
        dynamicPass:window.localStorage.getItem("privateKey")
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
};

//make sure the existence of courseInfo
var ensureRenderCourseInfo = function(){
    triggerLoad();

    if(!window.localStorage.getItem('courseInfo')){
        getJSON("webservice/secure/getCourseInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("courseInfo",JSON.stringify(data));

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
        //alert('here two');

        renderCourseTable(JSON.parse(window.localStorage.getItem('courseInfo')));
    }


};

//render course table
var renderCourseTable = function(courseInfo){
    stopLoad();


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
};



//处理考试
var ensureRenderExamInfo = function(){
    triggerLoad();

    if(!window.localStorage.getItem('examInfo')){
        getJSON("webservice/secure/getExamInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("examInfo",JSON.stringify(data));

                    renderExamTable(data);

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
        //alert('here two');

        renderExamTable(JSON.parse(window.localStorage.getItem('examInfo')));
    }
};

var renderExamTable = function(examInfo){
    stopLoad();

    if(examInfo){

        var tableDom = $("#exam-table table[class*='table']");

        if(examInfo&&examInfo.length>0){
            $.each(examInfo.examDtos, function(index, exam){

            });
        }else{
            tableDom.append('\
                <tr>\
                    <td colspan="6" class="text-center lead">暂时没有考试信息</td>\
                </tr>\
            ');
        }


        //console.log(examInfo);
    }else{
        handleError("exam info is null!!!");
    }
}

