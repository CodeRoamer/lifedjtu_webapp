/**
 * Created by apple on 3/1/14.
 */



//处理全局时间


//global host
var globalHost = "http://115.28.83.115:9090/";
//var globalHost = "http://lifedjtu.duapp.com/";

var getItemFromStorage = function(item){
    var cache = window.localStorage.getItem(item);
    if(!cache){
        return undefined;
    }
    try{
        var temp = JSON.parse(cache);
        return temp;
    }catch(err){
        return cache;
    }

};

var setItemToStorage = function(item,obj,isPlainStr){
    if(isPlainStr){
        window.localStorage.setItem(item,obj);
    }else{
        window.localStorage.setItem(item,JSON.stringify(obj));
    }
};

/**
 * 格式化日期，用于显示在消息面板中
 * @param time(Number)
 * @param isDetail(Bool)
 */
var formatMessageTime = function(time,isDetail){
    //console.log(time);

    var date = new Date();
    if($.isNumeric(time)){
        date.setTime(parseInt(time));
    }else{
        var regex = /([0-9]+)-([0-9]+)-([0-9]+)[^0-9]+([0-9]+):([0-9]+):([0-9]+)/;
        var m = time.match(regex);
        //console.log(m);
        try{
            date.setFullYear(parseInt(m[1]));
            date.setMonth(parseInt(m[2])-1);
            date.setDate(parseInt(m[3]));
            date.setHours(parseInt(m[4]));
            date.setMinutes(parseInt(m[5]));
            date.setSeconds(parseInt(m[6]));
        }catch (err){
            console.log("date format error!!! date:"+time);

        }
    }

    //console.log(date);

    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    var timeStr = (date.getHours()<10?'0'+date.getHours():date.getHours())+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());

    if(date.getTime()-now.getTime()<0){
        if(date.getTime()+(1000*60*60*24)-now.getTime()<0){
            var result;
            switch (date.getDay()){
                case 1:result = '星期一';break;
                case 2:result = '星期二';break;
                case 3:result = '星期三';break;
                case 4:result = '星期四';break;
                case 5:result = '星期五';break;
                case 6:result = '星期六';break;
                case 7:result = '星期日';break;
            }
            if(isDetail){
                result+=' '+timeStr;
            }
            return result;
        }else{
            return (isDetail?'昨天 '+timeStr:'昨天');
        }
    }else{
        return timeStr;
    }

};

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
        handleError("哎呦，出错了，请检查是否输入有错？");
    }
};

var handleWarning = function(message){
    if(!message){
        message = "小警告，提醒下您哦~";
    }

    var dateId = new Date().getTime();
    //console.log(dateId);
    $("body").prepend('\
    <div id="'+dateId+'" style="position: fixed;left:10%;right:10%;top: 5%;z-index: 100000" class="alert alert-warning alert-dismissable">\
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
    //console.log(dateId);
    $("body").prepend('\
    <div id="'+dateId+'" style="position: fixed;left:10%;right:10%;top: 5%;z-index: 100000" class="alert alert-success alert-dismissable">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
        <strong>信息</strong> '+message+'\
    </div>\
    ');

    $("#"+dateId).fadeOut(3000,function(){
        $(this).remove();
    });
}

var handleError = function(message){

    stopLoad();

    if(!message){
        message = "抱歉哦,出现了未知错误！";
    }

    var dateId = new Date().getTime();
    //console.log(dateId);
    $("body").prepend('\
    <div id="'+dateId+'" style="position: fixed;left:10%;right:10%;top: 5%;z-index: 100000" class="alert alert-danger alert-dismissable">\
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
    //window.location.href='temp-signin.html';

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

//处理个人信息
var getMySelfInfo = function(callback){

    if(!getItemFromStorage('userInfo')){
        getJSON("webservice/secure/local/getMySelfInfo.action",{
            studentId:getItemFromStorage('studentId'),
            dynamicPass:getItemFromStorage('privateKey')
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    setItemToStorage('userInfo',data.user);
                    if(callback){
                        callback(data.user);
                    }
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
}

//处理课程表
var initCourseTable = function(callback){

    if(window.localStorage.getItem('djtuDate')){
        //console.log('存在djtuDate缓存');
        callback();
        ensureRenderCourseInfo();
    }else{
        triggerLoad("需要同步校园当前周数");

        getJSON("webservice/getDjtuDate.action",{

        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem("djtuDate",JSON.stringify(data));
                    callback();
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
        //console.log('存在course info缓存');

        renderCourseTable(JSON.parse(window.localStorage.getItem('courseInfo')));
        renderCourseList(JSON.parse(window.localStorage.getItem('courseInfo')));

    }


};

//render course table
var renderCourseTable = function(courseInfo){

    var djtuDate = JSON.parse(window.localStorage.getItem('djtuDate'));
    var currentWeek = djtuDate.date.week;



    if(courseInfo){
        var theme = ["success","info","danger","warning"];
        var themeIndex = 0;

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
                            tdDom.attr("class",theme[themeIndex++%4]);
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
                        <span class="text-info class-name" style="font-size: 20px">'+course.courseName+'</span><br>&nbsp;&nbsp;<span style="display: none" class="course-alias">'+course.courseAlias+'</span><span style="display: none" class="remote-id">'+course.courseRemoteId+'</span>\
                            <span class="lead"><span class="glyphicon glyphicon-user"></span>老师: <span class="teacher-name">'+course.teacherName+'</span></span><br>&nbsp;&nbsp;\
                            <span class="lead"><span class="glyphicon glyphicon-map-marker"></span>地点: <span class="room-name">'+roomName+'</span></span><br>&nbsp;&nbsp;\
                                <span class="lead"><span class="glyphicon glyphicon-calendar"></span>周数: <span class="week-span">'+weekStr.substr(1)+'</span>周</span>\
                        ');
                        while(--segmentNum>0){
                            (liDom=liDom.next()).hide();
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
var ensureRenderExamInfo = function(updateFlag){
    if(updateFlag){
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
        if(window.localStorage.getItem('examInfo')){
            renderExamTable(JSON.parse(window.localStorage.getItem('examInfo')));
        }else{
            //handleWarning("没有缓存数据，尝试刷新页面！")
        }
    }

};

var renderExamTable = function(examInfo){

    if(examInfo){

        var tableDom = $("#exam-table table[class*='table']");
        tableDom.empty();
        tableDom.append('\
        <thead>\
            <tr>\
            <th></th>\
            <th>课程号</th>\
            <th>课程名称</th>\
            <th>考试时间</th>\
            <th>考试地点</th>\
            <th>考试性质</th>\
            </tr>\
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
        if(window.localStorage.getItem('scoreInfo')){
            renderScoreTable(JSON.parse(window.localStorage.getItem('scoreInfo')));
        }
    }


};

var renderScoreTable = function(scoreInfo){
    triggerLoad("分析数据");
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
            <th>平时</th>\
            <th>期末</th>\
            <th>总评</th>\
            <th>选课属性</th>\
            <th>课组</th>\
            <th>学分</th>\
            <th>是否缓考</th>\
            <th>考试性质</th>\
            <th>备注</th>\
            <th>主讲教师</th>\
            <th>课程类别</th>\
            </tr>\
        </thead>\
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
                    <td>'+(score.courseName.length>10?score.courseName.substr(0,10)+'...':score.courseName)+'</td>\
                    <td>'+score.normalScore+'</td>\
                    <td>'+score.finalScore+'</td>\
                    <td>'+score.totalScore+'</td>\
                    <td>'+score.courseAttr+'</td>\
                    <td>'+score.courseGroup+'</td>\
                    <td>'+score.courseMarks+'</td>\
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
        //handleSuccess("成绩获取了考试成绩！");
    }else{
        handleError("score info is null!!!");
    }

    stopLoad();

};


var ensureRenderNews = function(updateFlag,pageNum,callback){
    if(updateFlag){
//        if(window.localStorage.getItem("djtuNotes_page")==-1&&pageNum>0){
//            handleWarning("新闻已过时，请刷新");
//            return;
//        }

        triggerLoad("正在获取资讯");

        pageNum = pageNum||1;
        if(pageNum<=1){
            pageNum=1;
            clearNewsList();
        }

        getJSON("webservice/getDjtuNotes.action",{
            pageNum:pageNum
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    if(callback)
                        callback();

                    window.localStorage.setItem("djtuNotes",JSON.stringify(data));
                    window.localStorage.setItem("djtuNotes_page",pageNum);

                    renderNewsList(data);

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
        if(window.localStorage.getItem("djtuNotes")){
            window.localStorage.setItem("djtuNotes_page",-1);
            clearNewsList();
            renderNewsList(JSON.parse(window.localStorage.getItem("djtuNotes")));
        }
    }


};

var renderNewsList = function(djtuNotes){
    triggerLoad("分析数据")

    if(djtuNotes){
        var listDom = $("#news-list ul");

        $.each(djtuNotes.notes, function(index, note){

            listDom.append('\
            <li>\
                <a href="#news-detail" data-transition="slide" data-href="'+note.href+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r">\
                    '+(note.important?'<span class="glyphicon glyphicon-fire text-danger"></span>':'')+'\
                    <span class="lead title '+(note.important?'text-danger':'')+'">'+note.title+'</span><br>\
                    <span class="lead text-muted">'+note.releaseDate+'</span>\
                </a>\
            </li>\
            ');
        });

        listDom.append('\
            <li>\
                <a href="#more-news" data-pageNum="'+(parseInt(window.localStorage.getItem('djtuNotes_page'))+1)+'" class="ui-btn ui-btn-icon-right ui-icon-carat-d">\
                    <span class="text-center">更多新闻</span>\
                </a>\
            </li>\
            ');
    }else{
        handleError("courseInfo is null!!!");
    }

    stopLoad();
};

var clearNewsList = function(){
    $("#news-list ul").empty();
}


var ensureRenderNewsContent = function(noteHref){
    triggerLoad("正在获取资讯");

    getJSON("webservice/getDjtuNote.action",{
        noteHref:noteHref
    },function(data,text,xhqr){
        if(data.flag==2){

            if(window.localStorage){

                renderNewsContent(data.note);

            }else{
                handleError("do not support local storage! try to save private key in file");
            }
        }else{
            handleExceptionData(data);
        }
    },function(jqXHR, textStatus, errorThrown){
        handleError(errorThrown);
    });
};

var renderNewsContent = function(newsContent){
    if(newsContent){
        $("#news-detail #note-content").html(newsContent);
    }else{
        handleError("note content is null");
    }

    stopLoad();
}


var ensureRenderAreaMenu = function(updateFlag){
    if(updateFlag){
        triggerLoad("正在获取校区列表");

        getJSON("webservice/getAreas.action",{
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem('areas', JSON.stringify(data));
                    renderAreaMenu(data);

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
        if(!window.localStorage.getItem('areas')){
            triggerLoad("正在获取校区列表");

            getJSON("webservice/getAreas.action",{
            },function(data,text,xhqr){
                if(data.flag==2){
                    if(window.localStorage){
                        window.localStorage.setItem('areas', JSON.stringify(data));
                        renderAreaMenu(data);

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
            renderAreaMenu(JSON.parse(window.localStorage.getItem('areas')));
        }
    }
};

var renderAreaMenu = function(areaInfo){
    if(areaInfo){
        var roomMenuDom = $("#room-page #area-menu");
        roomMenuDom.empty();
        roomMenuDom.append('\
            <option value="-1">选个校区</option>\
        ');
        $.each(areaInfo.areaList, function(index, area){
            roomMenuDom.append('\
                <option value="'+area.id+'">'+area.areaName+'</option>\
            ');
        });

        $("#area-menu-button").children('span').text($("#room-page #area-menu").children('option:first').text());
    }else{
        handleError("area info is null");
    }

    stopLoad();
}


var ensureRenderBuildingMenu = function(updateFlag, areaId){
    if(updateFlag){
        triggerLoad("正在获取校区楼列表");

        getJSON("webservice/getBuildings.action",{
            areaId:areaId
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem('buildings_'+areaId, JSON.stringify(data));
                    renderBuildingMenu(data);

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
        if(!window.localStorage.getItem('buildings_'+areaId)){
            triggerLoad("正在获取校区楼列表");

            getJSON("webservice/getBuildings.action",{
                areaId:areaId
            },function(data,text,xhqr){
                if(data.flag==2){
                    if(window.localStorage){
                        window.localStorage.setItem('buildings_'+areaId, JSON.stringify(data));
                        renderBuildingMenu(data);

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
            renderBuildingMenu(JSON.parse(window.localStorage.getItem('buildings_'+areaId)));
        }
    }
};

var renderBuildingMenu = function(buildingInfo){
    if(buildingInfo){
        var buildingMenuDom = $("#room-page #building-menu");
        buildingMenuDom.empty();
        //console.log(buildingInfo);
        $.each(buildingInfo.biuldingList, function(index, building){
            buildingMenuDom.append('\
                <option value="'+building.id+'">'+building.buildingName+'</option>\
            ');
        });
        $("#building-menu-button").children('span').text($("#room-page #building-menu").children('option:first').text());

    }else{
        handleError("building info is null");
    }
    stopLoad();
}

var ensureRenderRoomTakenList = function(updateFlag, buildingId,buildingName,startSegment, endSegment){
    if(updateFlag){
        triggerLoad("正在获取教室占用信息");

        getJSON("webservice/getRoomTakenItems.action",{
            buildingId:buildingId
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem('roomTakenItems_temp', JSON.stringify(data));
                    window.localStorage.removeItem('roomTakenItems_map');
                    renderRoomTakenList(data,buildingName,startSegment, endSegment);

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
        if(!window.localStorage.getItem('roomTakenItems_'+buildingId)){
            triggerLoad("正在获取教室占用信息");

            getJSON("webservice/getRoomTakenItems.action",{
                buildingId:buildingId
            },function(data,text,xhqr){
                if(data.flag==2){
                    if(window.localStorage){
                        window.localStorage.setItem('roomTakenItems_temp', JSON.stringify(data));
                        window.localStorage.removeItem('roomTakenItems_map');
                        renderRoomTakenList(data,buildingName,startSegment, endSegment);

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
            //console.log("I think here will be executed!");
            renderRoomTakenList(JSON.parse(window.localStorage.getItem('roomTakenItems_temp')),null,startSegment, endSegment);
        }
    }
};


var renderRoomTakenList = function(roomTakenInfo,buildingName, startSegment, endSegment){
    if(roomTakenInfo){

        triggerLoad("正在分析数据");
        //room-list page的title
        if(buildingName&&buildingName!=''){
            $("#room-list .building-title").text(buildingName);
        }

        var storyMap;

        //或者从storage中取出map或者重新获取，因为map会在roomTakenItem重新抓取时被重置为空
        if(!window.localStorage.getItem('roomTakenItems_map')){
            storyMap = createStoryMap(roomTakenInfo);
        }else{
            storyMap = JSON.parse(window.localStorage.getItem('roomTakenItems_map'));
        }

        //找到story list
        var storyListDom = $("#room-list .story-list");
        //清空内容
        storyListDom.empty();
        //遍历storyMap render the list
        for(var story in storyMap){
            var storyItemStr = '<li data-inset="false" data-iconpos="right" data-role="collapsible" class="story-item ui-collapsible ui-collapsible-themed-content ui-collapsible-collapsed ui-li-static ui-body-inherit">\
            <h2 class="ui-collapsible-heading ui-collapsible-heading-collapsed">\
                <a class="toggle-button ui-collapsible-heading-toggle ui-btn ui-icon-plus ui-btn-icon-right ui-btn-inherit" href="#">\
                    '+story+'\
                    <span class="ui-collapsible-heading-status"> click to collapse contents</span>\
                </a>\
            </h2>\
            </li>';
            var storyItemDom = $(storyItemStr);

            var divPlusStr = '<div class="ui-collapsible-content ui-body-inherit ui-collapsible-content-collapsed" aria-hidden="true"></div>';
            var divPlusDom = $(divPlusStr);
            var roomListStr = '<ul data-role="listview" data-theme="b" class="room-list ui-listview ui-group-theme-b"></ul>';
            var roomListDom = $(roomListStr);

            var roomCount = 0;

            $.each(storyMap[story], function(index, roomTakenItem){

                //逻辑判断room taken item是否符合用户的查询要求
                var roomTaken = roomTakenItem.todayTakenCondition;

                //有必要判断segment合法吗
                if(strAllZero(roomTaken.substring(startSegment-1,endSegment))){
                    var roomItemStr = '\
                <li data-inset="false" data-iconpos="right" data-role="collapsible" class="room-item ui-collapsible ui-collapsible-themed-content ui-collapsible-collapsed ui-li-static ui-body-inherit">\
                    <h2 class="ui-collapsible-heading ui-collapsible-heading-collapsed">\
                        <a class="toggle-button ui-collapsible-heading-toggle ui-btn ui-icon-plus ui-btn-icon-right ui-btn-inherit" href="#">\
                            '+roomTakenItem.roomName+'\
                            <span class="ui-collapsible-heading-status"> click to expand contents</span>\
                        </a>\
                    </h2>\
                    <div class="ui-collapsible-content ui-body-inherit ui-collapsible-content-collapsed" aria-hidden="true">\
                    <table class="table">\
                        <tbody>\
                            <td>1</td>\
                            <td>2</td>\
                            <td>3</td>\
                            <td>4</td>\
                            <td>5</td>\
                            <td>6</td>\
                            <td>7</td>\
                            <td>8</td>\
                            <td>9</td>\
                            <td>10</td>\
                        </tbody>\
                        <tbody>\
                            <td><span class="'+(roomTaken[0]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[1]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[2]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[3]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[4]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[5]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[6]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[7]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[8]=='0'?'text-success':'text-danger')+'">*</span></td>\
                            <td><span class="'+(roomTaken[9]=='0'?'text-success':'text-danger')+'">*</span></td>\
                        </tbody>\
                        <tbody>\
                            <td colspan="5">教室类型</td>\
                            <td colspan="5">'+roomTakenItem.room.roomType+'</td>\
                        </tbody>\
                        <tbody>\
                            <td colspan="5">座位类型</td>\
                            <td colspan="5">'+roomTakenItem.room.roomSeatType+'</td>\
                        </tbody>\
                        <tbody>\
                            <td colspan="5">座位数目</td>\
                            <td colspan="5">'+roomTakenItem.room.roomSeatNum+'</td>\
                        </tbody>\
                        <tbody>\
                            <td colspan="5">考试容量</td>\
                            <td colspan="5">'+roomTakenItem.room.examCapacity+'</td>\
                        </tbody>\
                        <tbody>\
                            <td colspan="5">课程容量</td>\
                            <td colspan="5">'+roomTakenItem.room.courseCapacity+'</td>\
                        </tbody>\
                    </table>\
                    </div>\
                </li>\
                ';
                    roomListDom.append(roomItemStr);

                    ++roomCount;
                }


            });

            if(roomCount!=0){
                divPlusDom.append(roomListDom);
                storyItemDom.append(divPlusDom);
                storyListDom.append(storyItemDom);
            }

        }

        handleSuccess("数据已分析完毕");
    }else{
        handleError("room taken info is null");
    }
    stopLoad();
};

var createStoryMap = function(roomTakenInfo){
    if(roomTakenInfo){

        var commonPart = roomTakenInfo.roomTakenItemList[0].roomName;

        for(var i = 1; i < roomTakenInfo.roomTakenItemList.length; ++i){
            //get roomName
            var roomName = roomTakenInfo.roomTakenItemList[i].roomName;
            //console.log("roomName: "+roomName);
            //console.log("commonPart: "+commonPart);

            if(!startWithLetterOrDigit(roomName)){
                //console.log("roomName:"+roomName+" is not a valid start!");
                continue;
            }

            if(!startWithLetterOrDigit(commonPart)){
                //console.log("roomName:"+roomName+" is not a valid start!");
                commonPart = roomName;
            }


            if(commonPart==roomName){
                //console.log("common part is equal to roomName!!!");
                continue;
            }else{
                var foundFlag = false;
                for(var j = commonPart.length; j > 0; j--){
                    if(prefixFullfill(roomName,commonPart.substring(0, j))){
                        commonPart = commonPart.substring(0, j)
                        //console.log("find a good sub! : "+commonPart);
                        foundFlag = true;
                        break;
                    }
                }
                if(!foundFlag){
                    commonPart = '';
                    //console.log('no common part event within 1 character!');
                    break;
                }
            }
        }

        //console.log("Common Part is:"+commonPart);


        //更新教室页面title
        var storyMap = {};


        $.each(roomTakenInfo.roomTakenItemList, function(index, roomTakenItem){
            //console.log(roomTakenItem.roomName);

            var roomName = roomTakenItem.roomName;
            var roomTaken = roomTakenItem.todayTakenCondition;
            var roomTakenTom = roomTakenItem.tomorrowTakenCondition;

            var roomDetail = roomTakenItem.room;

            if(prefixFullfill(roomName,commonPart)){
                (storyMap[roomName.substr(0,commonPart.length+1)]=storyMap[roomName.substr(0,commonPart.length+1)]||[]).push(roomTakenItem);
            }else{
                (storyMap['未知分组']=storyMap['未知分组']||[]).push(roomTakenItem);
            }
        });

        window.localStorage.setItem('roomTakenItems_map', JSON.stringify(storyMap));

        return storyMap;

    }else{
        return undefined;
    }
};

//判断字符串上是否以数字或字母开始
var startWithLetterOrDigit = function(str){
    var reg = /^[a-zA-Z0-9\-]+/;

    return reg.test(str);
};

//str全是0吗
var strAllZero = function(str){
    for(var i = 0; i < str.length; ++i){
        if(str[i]=='1'){
            return false;
        }
    }

    return true;
};

var prefixFullfill = function(str, prefix){
    for(var i = 0; i < prefix.length; ++i){
        if(str[i]!=prefix[i]){
            return false;
        }
    }
    return true;
};


//单个课程实例的抓取
var ensureRenderCourseInstance = function(updateFlag, courseAlias, courseRemoteId){
    if(updateFlag){
        triggerLoad("正在获取课程信息");

        getJSON("webservice/secure/local/getCourseInstance.action",{
            courseAlias:courseAlias,
            courseRemoteId:courseRemoteId,
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    window.localStorage.setItem('courseInstance_'+courseRemoteId, JSON.stringify(data));
                    renderCourseInstance(data,courseAlias, courseRemoteId);

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
        if(!window.localStorage.getItem('courseInstance_'+courseRemoteId)){
            triggerLoad("正在获取课程信息");

            getJSON("webservice/secure/local/getCourseInstance.action",{
                courseAlias:courseAlias,
                courseRemoteId:courseRemoteId,
                studentId:window.localStorage.getItem("studentId"),
                dynamicPass:window.localStorage.getItem("privateKey")
            },function(data,text,xhqr){
                if(data.flag==2){
                    if(window.localStorage){
                        window.localStorage.setItem('courseInstance_'+courseRemoteId, JSON.stringify(data));
                        renderCourseInstance(data,courseAlias, courseRemoteId);

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
            renderCourseInstance(JSON.parse(window.localStorage.getItem('courseInstance_'+courseRemoteId)),courseAlias, courseRemoteId);
        }
    }
};

var renderCourseInstance = function(courseInstanceInfo,courseAlias, courseRemoteId){

    if(courseInstanceInfo){
        triggerLoad("正在分析数据");

        //console.log(courseInstanceInfo['classes'].join('|'));


        //有哪些班合并上此课？
        $("#classDetail span[class*='all-class']").text(courseInstanceInfo['classes'].join('|'));
        $("#classDetail span[class*='member-number']").text(courseInstanceInfo.courseMemberNum);
        $("#classDetail span[class='courseGroupId']").text(courseInstanceInfo.courseGroupId);
        $("#classDetail span[class='courseInstanceGroupId']").text(courseInstanceInfo.courseInstanceGroupId);

        $("#classDetail span[class='remote-id']").text(courseRemoteId);
        $("#classDetail span[class='course-alias']").text(courseAlias);
        //是sameClass还是sameCourse，赋值上对应的id
        $("#classDetail a[data-bind='0']").attr('data-id',courseInstanceInfo.courseInstanceGroupId);
        $("#classDetail a[data-bind='1']").attr('data-id',courseInstanceInfo.courseGroupId);

        $("#classDetail .goodEval").text(courseInstanceInfo.goodEval);
        $("#classDetail .badEval").text(courseInstanceInfo.badEval);

        $("#classDetail #sameClassList").contents().find(".member-number").text(courseInstanceInfo.sameClassMemberNum);
        $("#classDetail #sameCourseList").contents().find(".member-number").text(courseInstanceInfo.sameCourseMemberNum);



        //console.log(courseInstanceInfo);
    }else{
        handleError("没有课程数据可供分析");
    }


    stopLoad();
};

var resetCourseInstance = function(){
    //有哪些班合并上此课？
    //合班上课信息
    $("#classDetail span[class*='all-class']").text('');
    //共有多少人
    $("#classDetail span[class*='member-number']").text('');

    $("#classDetail span[class='courseId']").text('');
    $("#classDetail span[class='courseInstanceId']").text('');

    $("#classDetail span[class='remote-id']").text('');
    $("#classDetail span[class='course-alias']").text('');
    //是sameClass还是sameCourse
    $("#classDetail a[data-bind='0']").attr('data-id','');
    $("#classDetail a[data-bind='1']").attr('data-id','');

    $("#classDetail .goodEval").text(0);
    $("#classDetail .badEval").text(0);

    $("#classDetail #sameClassList").contents().find(".member-number").text(0);
    $("#classDetail #sameCourseList").contents().find(".member-number").text(0);
}

/**
 * bindId可以CourseId，也可以为CourseInstanceId
 * @param updateFlag
 * @param groupFlag
 * @param bindId
 * @param pageNum
 * @param callback
 */
var ensureRenderClassMatesList = function(updateFlag,groupFlag,bindId,courseName,pageNum,callback){
    //console.log(window.localStorage);

    /*
    var url;
    var storeKey;
    if(groupFlag==0){
        url = 'webservice/secure/getSameClassMembers.action';
        storeKey = 'sameClassMembers';
    }else if(groupFlag==1){
        url = 'webservice/secure/getSameCourseMembers.action';
        storeKey = 'sameCourseMembers'
    }else{
        console.log("not expected to be here!");
        url = 'webservice/secure/getSameCourseMembers.action';
        storeKey = 'sameCourseMembers'
    }
    */
    //console.log("page number: "+pageNum);

    var cachePageNum = parseInt(window.localStorage.getItem('group_'+bindId+'_pageNum'));

    /**
     * updateFlag为true的几种情况：刷新||扩展列表
     * updateFlag为false的几种情况：默认列表  || pageNum应为-1
     *
     */
    if(updateFlag&&cachePageNum<0&&pageNum==undefined){
        handleError("好友列表已过期，请刷新！");
        return;
    }


    //第一页从0开始
    /**
     * 刷新时无需传页面号，所以采用默认值
     */
    if(pageNum==undefined){
        pageNum = cachePageNum+1||0;
    }



    if(updateFlag){
        triggerLoad("正在获取同学列表");

        getJSON('webservice/secure/local/getGroupMembers.action',{
            bindId:bindId,
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey"),
            pageNum:pageNum
        },function(data,text,xhqr){

            if(data.flag==2){
                if(callback){
                    callback();
                }
                if(window.localStorage){
                    //console.log("here!!!!!!!!!!!!");
                    window.localStorage.setItem('group_'+bindId+'_pageNum', pageNum);

                    //只抽取学生学号
                    var studentIdArray = [];
                    $.each(data.memberList, function(index, member){
                        studentIdArray.push(member.studentId);
                    });

                    //更新用户信息缓存，群组中只存储学号，这样避免冗余存储用户
                    updateUserCache(data.memberList);
                    updateGroupCache(bindId,groupFlag,courseName,data.memberList);
//                    if(pageNum>0&&window.localStorage.getItem('group_'+bindId)){
//                        var cache = JSON.parse(window.localStorage.getItem('group_'+bindId));
//                        $.each(data.memberList, function(index, member){
//                            cache.push(member.studentId);
//                        });
//                        window.localStorage.setItem('group_'+bindId, JSON.stringify(cache));
//                    }else if(pageNum==0){
//                        window.localStorage.setItem('group_'+bindId, JSON.stringify(studentIdArray));
//                    }
                    renderClassMatesList(studentIdArray,groupFlag,bindId,pageNum);

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
        if(getGroupCache(bindId)){
            window.localStorage.setItem('group_'+bindId+'_pageNum', -1);
            renderClassMatesList(getGroupCache(bindId).groupMembers,groupFlag,bindId,parseInt(window.localStorage.getItem('group_'+bindId+'_pageNum')));
        }else{
            renderClassMatesList(null);
        }
    }

}

//memberInfo本来就已经是一个数组了，而且仅是studentId构成的字符串数组
var renderClassMatesList = function(memberInfo,groupFlag,bindId,pageNum){
    triggerLoad("正在分析数据");

    var ulDom = $("#classMateList ul[data-role='listview']");
    if(pageNum<=0||pageNum==undefined){
        ulDom.empty();
    }
    if(memberInfo){
        //console.log(memberInfo);

        var users_cache = getUserCache();
        var shouldDisplay = true;
        //I should verify the integrity of cache!!
        $.each(memberInfo,function(index,studentId){
            var member = users_cache[studentId];
            if(!member){
                shouldDisplay = false;
            }
        });
        //缓存是完整的，可以显示缓存列表
        if(shouldDisplay){
            $.each(memberInfo,function(index, studentId){
                //console.log(member);
                var member = users_cache[studentId];
                ulDom.append('\
            <li class="ui-li-has-thumb">\
                <a href="user.html" data-transition="slide" class="ui-btn ui-btn-icon-right ui-icon-carat-r">\
                    <img src="./res/icon/default.jpg">\
                    '+(member.gender=='女'?'<h2 class="text-danger">'+member.username+'<img src="./res/icon/glyphicons/png/glyphicons_004_girl.png" width="15px" height="15px">':'<h2 class="text-info">'+member.username+'<img src="./res/icon/glyphicons/png/glyphicons_003_user.png" width="16px" height="16px">')+'</h2>\
                    <p>'+member.major+'('+member.academy+')</p>\
                </a>\
            </li>\
            ');
            });

            if(memberInfo.length!=0){
                ulDom.append('\
            <li>\
                <a href="#more-class-mates" data-id="'+bindId+'" data-bind="'+groupFlag+'" class="ui-btn ui-btn-icon-right ui-icon-carat-d">\
                    <span class="text-center">查看更多好友</span>\
                </a>\
            </li>\
            ');
            }else{
                handleSuccess("没有更多同学了");
            }
        }else{
            ulDom.append('\
            <br>\
            <h4 class="text-muted text-center"><span class="glyphicon glyphicon-refresh"></span>刷新以获取同学信息</h4>\
            <br>\
            ');
        }
    }else{
        ulDom.append('\
            <br>\
            <h4 class="text-muted text-center"><span class="glyphicon glyphicon-refresh"></span>刷新以获取同学信息</h4>\
            <br>\
            ');
    }

    stopLoad();
};

//负责更新user_cache，全局只有一个user_cache，负责存储用户信息
var updateUserCache = function(memberList){
    if(!memberList||memberList.length==0){
        return;
    }

    var users_cache = JSON.parse(window.localStorage.getItem("users_cache")||'{}');
    if(Array.isArray(memberList)){
        for(var index in memberList){
            //console.log("caching user!!!! here!!!");
            users_cache[memberList[index].studentId] = memberList[index];
        }
    }
    window.localStorage.setItem('users_cache',JSON.stringify(users_cache));
};

var updateGroupCache = function(groupId,groupFlag,className,memberList){
    if(groupFlag=='-1'){
        //groupFlag为-1只有一种可能，就是在消息中心查看列表，这种情况下没有必要抓取group信息了，因为此时此刻，group信息应当已经全部抓取完毕
        return;
    }

    if(!memberList||memberList.length==0){
        return;
    }
    var groups_cache = JSON.parse(window.localStorage.getItem("groups_cache")||'{}');

    if(Array.isArray(memberList)){
        var groupObj = groups_cache[groupId];
        if(!groupObj){
            groupObj = {
                id:groupId,
                groupName:className+'('+(groupFlag==0?'同课同班':'同课')+')',
                groupMembers:[]
            };
        }
        for(var index in memberList){
            groupObj.groupMembers.push(memberList[index].studentId);
        }
        groupObj.groupMembers = unique(groupObj.groupMembers);
        groups_cache[groupId] = groupObj;
    }

    window.localStorage.setItem('groups_cache',JSON.stringify(groups_cache));
};

var getGroupCache = function(groupId){
    var groups_cache = JSON.parse(window.localStorage.getItem("groups_cache")||'{}');
    if(groups_cache[groupId]){
        return groups_cache[groupId];
    }
}

var getUserCache = function(){
    return JSON.parse(window.localStorage.getItem('users_cache')||'{}');
};

var unique = function (arr) {
    var a = [],
        o = {},
        i,
        v,
        len = arr.length;
    if (len < 2) {
        return arr;
    }
    for (i = 0; i < len; i++) {
        v = arr[i];
        if (o[v] !== 1) {
            a.push(v);
            o[v] = 1;
        }
    }
    return a;
};

/**
 * add message to chat panel
 * @param message obj
 */
var addMessageToChatPanel = function(message){
    if(message.messageSource==getItemFromStorage('studentId')){
        $("#chat-page #chat-panel").append('\
            <div class="row me-chat"><!-- 一个聊天记录 -->\
                <div class="col-xs-8 col-xs-offset-2 right chat-content">\
                <span class="text-muted lead name">我('+formatMessageTime(message.messageDate,true)+')</span><br>\
                <div class="well well-sm">\
                    <span class="lead text-info content">'+message.messageContent+'</span>\
                </div>\
                </div>\
            <div class="col-xs-1 chat-header">\
                <br>\
                    <img class="avatar" src="res/icon/avatar.jpg">\
                    </div>\
                </div>\
            ');
    }else{
        var student = getUserCache()[message.messageSource];
        var studentName;
        if(student){
            studentName = student.username;
        }
        $("#chat-page #chat-panel").append('\
            <div class="row other-chat"><!-- 一个聊天记录 -->\
                <div class="col-xs-1 chat-header">\
                <br>\
                    <img class="avatar" src="res/icon/default.jpg">\
                    </div>\
                    <div class="col-xs-9 chat-content">\
                        <span class="text-muted lead name">'+(studentName?studentName:message.messageSource)+'('+formatMessageTime(message.messageDate,true)+')</span><br>\
                        <div class="well well-sm">\
                            <span class="lead content">'+message.messageContent+'</span>\
                        </div>\
                    </div>\
                    </div>\
            ');
    }
    updateChatPanelState();
};

/**
 * add message to chat cache
 * @param message
 * @param immediateAdd
 */
var addMessageToChatCache = function(message, immediateAdd){
    //对象存储结构应为？？imGroupFlag bindId(studentId|imGroupId) unreadNum timestamp messages(array)--(messageSource messageContent messageDate) messages的length一直维持在200
    //更新视图，增加item，并且重排列item
    //localStorage中一个key专门存储消息数组，收到消息后，更改位置，标记未读消息数量
    var chat_cache = getItemFromStorage("chat_cache");

    if(!chat_cache||!Array.isArray(chat_cache)){
        chat_cache = [];
    }

    var bindId = (message.imGroupFlag=='1')?message.imGroupId:message.messageSource;

    var updateFlag = false;

    $.each(chat_cache, function(index, item){
        if(item.imGroupFlag==message.imGroupFlag){
            if(item.bindId==bindId){
                item.timestamp = message.messageDate;
                if(!immediateAdd){
                    ++item.unreadNum;
                }
                (item.messages=item.messages||[]).push({
                    messageSource:message.messageSource,
                    messageContent:message.messageContent,
                    messageDate:message.messageDate
                });
                updateFlag = true;
            }
        }
    });

    if(!updateFlag){
        var item = {
            imGroupFlag:message.imGroupFlag,
            bindId:bindId,
            unreadNum:0,
            timestamp:0,
            messages:[]
        };
        if(!immediateAdd){
            ++item.unreadNum;
        }
        item.timestamp = message.messageDate;
        (item.messages=item.messages||[]).push({
            messageSource:message.messageSource,
            messageContent:message.messageContent,
            messageDate:message.messageDate
        });
        chat_cache.push(item);
    }

    setItemToStorage('chat_cache',chat_cache);
};

var getChatCacheByBindId = function(bindId){
    var chat_cache = getItemFromStorage("chat_cache");

    if(!Array.isArray(chat_cache)){
        return undefined;
    }else{
        var chatItem = undefined;
        $.each(chat_cache, function(index, item){
            if(item.bindId==bindId){
                chatItem = item;
                return;
            }
        });
        return chatItem;
    }
};

//更新chat缓存，以一个item的形式
var updateChatCacheByItem = function(chatItem){
    var chat_cache = getItemFromStorage("chat_cache");

    if(!Array.isArray(chat_cache)){
        return;
    }else{
        $.each(chat_cache, function(index, item){
            if(item.bindId==chatItem.bindId){
                chat_cache[index] = chatItem;
                setItemToStorage("chat_cache",chat_cache);
                return;
            }
        });
    }
};

//让聊天面板滑到最底端
var updateChatPanelState = function(){
    $("#chat-page #contents").scrollTo("#chat-panel-bottom",80);
};

//初始化消息界面，抓取缓存信息
var initMessageCenterView = function(){
    var chat_cache = getItemFromStorage("chat_cache");
    if(!chat_cache){
        return;
    }
    var ulDom = $("#instant-message #message-panel").children('ul');
    $.each(chat_cache, function(index, chatItem){
        var user_cache = getUserCache();
        var receiverUsername;
        if(user_cache&&user_cache[chatItem.messages[chatItem.messages.length-1].messageSource]){
            receiverUsername = user_cache[chatItem.messages[chatItem.messages.length-1].messageSource].username;
        }
        var title = (chatItem.imGroupFlag=='1')?getItemFromStorage('groups_cache')[chatItem.bindId].groupName:(user_cache[chatItem.bindId].username||chatItem.bindId);
        ulDom.prepend('\
        <li class="ui-li-has-count ui-li-has-thumb">\
                    <a href="#chat-page" data-transition="slide" class="ui-btn" data-flag="'+chatItem.imGroupFlag+'" data-id="'+chatItem.bindId+'">\
                        <img src="./res/icon/default.jpg">\
                        <h2><span class="title text-info" style="font-size: 13px">'+title+'</span></h2>\
                        <p class="text-muted recentContent">'+(receiverUsername||chatItem.messages[chatItem.messages.length-1].messageSource)+':'+chatItem.messages[chatItem.messages.length-1].messageContent+'</p>\
                        <p class="ui-li-aside time"><strong>'+formatMessageTime(chatItem.timestamp)+'</strong></p>\
                    </a>\
                    <span class="ui-li-count ui-body-b">'+(chatItem.unreadNum||0)+'</span>\
                </li>\
        ');
    });
}

//消息来时调用的第三个方法
var updateMessageCenterViewByBindId = function(bindId){
    var ulDom = $("#instant-message #message-panel").children('ul');
    var liDomList = ulDom.children('li');

    var insertFlag = true;
    var chatItem = getChatCacheByBindId(bindId);
    if(!chatItem){
        console.log("do not expect to be here!");
        return;
    }

    var user_cache = getUserCache();
    var receiverUsername;
    if(user_cache&&user_cache[chatItem.messages[chatItem.messages.length-1].messageSource]){
        receiverUsername = user_cache[chatItem.messages[chatItem.messages.length-1].messageSource].username;
    }

    if(liDomList&&liDomList.length>0){
        //查询，不在再插
        $.each(liDomList, function(index, item){
            var aDom = $(item).children('a');
            if(aDom.attr('data-id')==bindId){
                aDom.next('.ui-li-count').text(chatItem.unreadNum||0);
                aDom.children('.time').html('<strong>'+(formatMessageTime(chatItem.timestamp))+'</strong>');
                aDom.children('.recentContent').text((receiverUsername||chatItem.messages[chatItem.messages.length-1].messageSource)+':'+chatItem.messages[chatItem.messages.length-1].messageContent);
                insertFlag = false;
                ulDom.prepend($(item));
                return;
            }
        });
    }

    if(insertFlag){

        //获取title，经常更新
        var title = (chatItem.imGroupFlag=='1')?getItemFromStorage('groups_cache')[chatItem.bindId].groupName:(user_cache[chatItem.bindId].username||chatItem.bindId);
        ulDom.prepend('\
        <li class="ui-li-has-count ui-li-has-thumb">\
                    <a href="#chat-page" data-transition="slide" class="ui-btn" data-flag="'+chatItem.imGroupFlag+'" data-id="'+chatItem.bindId+'">\
                        <img src="./res/icon/default.jpg">\
                        <h2><span class="title text-info" style="font-size: 13px">'+title+'</span></h2>\
                        <p class="text-muted recentContent">'+(receiverUsername||chatItem.messages[chatItem.messages.length-1].messageSource)+':'+chatItem.messages[chatItem.messages.length-1].messageContent+'</p>\
                        <p class="ui-li-aside time"><strong>'+formatMessageTime(chatItem.timestamp)+'</strong></p>\
                    </a>\
                    <span class="ui-li-count ui-body-b">'+(chatItem.unreadNum||0)+'</span>\
                </li>\
        ');
    }

};

//获取group的全部信息
var ensureRenderGroups = function(updateFlag, callback){
    if(updateFlag){
        //triggerLoad("正在更新您的群组");

        getJSON("webservice/secure/local/getAllGroups.action",{
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    renderGroups(directUpdateGroup(data.groupList));
                    if(callback){
                        callback();
                    }
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
            getJSON("webservice/secure/local/getAllGroups.action",{
                studentId:window.localStorage.getItem("studentId"),
                dynamicPass:window.localStorage.getItem("privateKey")
            },function(data,text,xhqr){
                if(data.flag==2){
                    if(window.localStorage){
                        renderGroups(directUpdateGroup(data.groupList));
                        if(callback){
                            callback();
                        }
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
            if(callback){
                callback();
            }
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


var preworkBeforeConnect = function(callback){
    //在页面启动之初就尝试获取group群组信息
    //今后还有好友信息，需要获取。。。
    ensureRenderGroups(false,function(){
        //can do something else!

        if(callback){
            callback();
        }
    });

}

var onReceiveMessage = function(message){
    //更新存储对象  messageSource,imGroupFlag,imGroupId,messageContent,messageDate
    //对象存储结构应为？？imGroupFlag studentId|imGroupId unreadNum timestamp messages(array)--(messageSource messageContent messageDate) messages的length一直维持在200
    //更新视图，增加item，并且重排列item
    //localStorage中一个key专门存储消息数组，收到消息后，更改位置，标记未读消息数量
};