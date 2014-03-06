/**
 * Created by apple on 3/1/14.
 */



//处理全局时间


//global host
//var globalHost = "http://localhost:9119/lifedjtu/";
var globalHost = "http://lifedjtu.duapp.com/";


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
            handleWarning("没有缓存数据，尝试刷新页面！")
        }
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

var startWithLetterOrDigit = function(str){
    var reg = /^[a-zA-Z0-9\-]+/;

    return reg.test(str);
};

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
