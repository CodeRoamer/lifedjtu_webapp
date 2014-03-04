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
};

var handleSuccess = function(message){
    if(!message){
        message = "成功啦~~~呼呼";
    }

    var dateId = new Date().getTime();
    console.log(dateId);
    $("body").prepend('\
    <div id="'+dateId+'" style="position: absolute;left:10%;right:10%;top: 5%;z-index: 100000" class="alert alert-warning alert-dismissable">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
        <strong>信息</strong> '+message+'\
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
                    renderCourseList(data);
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
        renderCourseList(JSON.parse(window.localStorage.getItem('courseInfo')));

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

var renderCourseList = function(courseInfo){
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

                    var weekStr = '';

                    for(var i = 0; i < startWeeks.length; i++){
                        if(startWeeks[i]==endWeeks[i]){
                            weekStr += ','+startWeeks[i];

                            if(startWeeks[i]==currentWeek){
                                enabledClass = true;
                            }
                        }else{
                            weekStr += ','+startWeeks[i]+'-'+endWeeks[i];

                            if(startWeeks[i] <= currentWeek && currentWeek <= endWeeks[i]){
                                enabledClass = true;
                            }
                        }
                    }

                    if(enabledClass){
                        var liDom = $('#course-list-'+weekDay+'>li:eq('+(segment-1)+')');
                        var aDom = liDom.children('a');

                        aDom.children('.segment').text(segment+'-'+(parseInt(segment)+segmentNum-1));
                        aDom.append('\
                        <span class="text-info class-name" style="font-size: 20px">'+course.courseName+'</span><br>&nbsp;&nbsp;\
                            <span class="lead"><span class="glyphicon glyphicon-user"></span>老师: <span class="teacher-name">'+course.teacherName+'</span></span><br>&nbsp;&nbsp;\
                            <span class="lead"><span class="glyphicon glyphicon-map-marker"></span>地点: <span class="room-name">'+roomName+'</span></span><br>&nbsp;&nbsp;\
                                <span class="lead"><span class="glyphicon glyphicon-calendar"></span>周数: <span class="week-span">'+weekStr.substr(1)+'</span>周</span>\
                        ');
                        while(--segmentNum>0){
                            liDom.next().fadeOut();
                        }
                    }

                }

            });
        });
    }else{
        handleError("courseInfo is null!!!");
    }

    stopLoad();
}

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
        tableDom.empty();
        tableDom.append('\
        <thead>\
            <th></th>\
            <th>课程号</th>\
            <th>课程名称</th>\
            <th>考试时间</th>\
            <th>考试地点</th>\
            <th>考试性质</th>\
        </thead>\
        ');
        if(examInfo&&examInfo.examDtoslength>0){
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

};

//score一定要每次都是新获取！！！
var ensureRenderScoreInfo = function(updateFlag, schoolYear, term){
    if(updateFlag){
        triggerLoad("正在获取考试成绩");

        getJSON("webservice/secure/getScoreInfo.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey"),
            schoolYear:schoolYear||0,
            term:term||0
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("scoreInfo",JSON.stringify(data));
                    window.localStorage.setItem("scoreInfo_year",JSON.stringify(schoolYear||0));
                    window.localStorage.setItem("scoreInfo_term",JSON.stringify(term||0));

                    renderScoreTable(data);

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
        if(!window.localStorage.getItem('scoreInfo')){
            triggerLoad("正在获取考试成绩");

            getJSON("webservice/secure/getScoreInfo.action",{
                studentId:window.localStorage.getItem("studentId"),
                dynamicPass:window.localStorage.getItem("privateKey"),
                schoolYear:schoolYear||0,
                term:term||0
            },function(data,text,xhqr){
                if(data.flag==2){
                    if(window.localStorage){
                        window.localStorage.setItem("scoreInfo",JSON.stringify(data));
                        window.localStorage.setItem("scoreInfo_year",JSON.stringify(schoolYear||0));
                        window.localStorage.setItem("scoreInfo_term",JSON.stringify(term||0));

                        renderScoreTable(data);

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

            renderScoreTable(JSON.parse(window.localStorage.getItem('examInfo')));
        }
    }


};

var renderScoreTable = function(scoreInfo){
    if(scoreInfo){

        var tableDom = $("#score-table table[class*='table']");
        tableDom.empty();
        tableDom.append('\
        <thead>\
            <tr class="info">\
            <th></th>\
            <th>学年</th>\
            <th>学期</th>\
            <th>课程号</th>\
            <th>课序号</th>\
            <th>课程名</th>\
            <th>选课属性</th>\
            <th>课组</th>\
            <th>学分</th>\
            <th>平时</th>\
            <th>期末</th>\
            <th>总评</th>\
            <th>是否缓考</th>\
            <th>考试性质</th>\
            <th>备注</th>\
            <th>主讲教师</th>\
            <th>课程类别</th>\
            </tr>\
        </tr>\
        ');
        if(scoreInfo&&scoreInfo.scoreDtos.length>0){
            $.each(scoreInfo.scoreDtos, function(index, score){
                var rowFlag = 'info';
                var totalScore;
                if($.isNumeric(score.totalScore)){
                    totalScore = parseFloat(score.totalScore);
                    if(totalScore<60){
                        rowFlag = 'danger';
                    }else if(totalScore<80){
                        rowFlag = 'warning';
                    }else {
                        rowFlag = 'success';
                    }
                }

                tableDom.append('\
                <tbody>\
                    <tr class="'+rowFlag+'">\
                    <td>'+(index+1)+'</td>\
                    <td>'+score.year+'</td>\
                    <td>'+score.term+'</td>\
                    <td>'+score.courseAliasName+'</td>\
                    <td>'+score.courseSequence+'</td>\
                    <td>'+score.courseName+'</td>\
                    <td>'+score.courseAttr+'</td>\
                    <td>'+score.courseGroup+'</td>\
                    <td>'+score.courseMarks+'</td>\
                    <td>'+score.normalScore+'</td>\
                    <td>'+score.finalScore+'</td>\
                    <td>'+score.totalScore+'</td>\
                    <td>'+score.isPostponed+'</td>\
                    <td>'+score.courseProperty+'</td>\
                    <td>'+score.memo+'</td>\
                    <td>'+score.teacherName+'</td>\
                    <td>'+score.courseCategory+'</td>\
                    </tr>\
                </tbody>\
                ');
            });
        }else{
            tableDom.append('\
                <tbody>\
                    <td colspan="18" class="text-center lead text-muted" style="font-size:20px;padding-top: 60px;padding-bottom: 60px"><strong>暂时没有考试成绩</strong></td>\
                </tbody>\
            ');
        }


        //console.log(examInfo);
        handleSuccess("成绩获取了考试成绩！");
    }else{
        handleError("score info is null!!!");
    }

    stopLoad();

};
