/**
 * Created by apple on 3/1/14.
 */

$(function() {

    function updateDjtuDate(){
        if(window.localStorage.getItem("djtuDate")){
            var logFlag = false;

            var djtuDate = JSON.parse(window.localStorage.getItem("djtuDate"));

            var now = new Date();

            var curDate = new Date(now.getFullYear(),now.getMonth(),now.getDate());

            var oldDate = new Date(djtuDate.date.year,djtuDate.date.month-1,djtuDate.date.day);
            //var oldDate = new Date(djtuDate.date.year,djtuDate.date.month-1,djtuDate.date.day);

            if(logFlag){
                console.log("cur:"+curDate);
                console.log("old:"+oldDate);
            }

            var week = parseInt(djtuDate.date.week);
            var weekDay = parseInt(djtuDate.date.weekDay);

            var passedDays = parseInt((curDate.getTime() - oldDate.getTime())/(1000*60*60*24));
            var passedWeeks = parseInt(passedDays/7);
            var moreWeekDay = parseInt(passedDays%7);

            if(logFlag){
                console.log('passed miliseconds:'+(curDate.getTime() - oldDate.getTime()));
                console.log('passed days:'+passedDays);
                console.log('passed weeks:'+passedWeeks);
                console.log('more week day:'+moreWeekDay);
            }


            week+=passedWeeks;
            weekDay+=moreWeekDay;

            console.log("before-week:"+week);
            console.log("before-weekDay:"+weekDay);

            if(weekDay>7){
                week+=parseInt(weekDay/7);
                weekDay=parseInt(weekDay%7);
            }

            console.log("week:"+week);
            console.log("weekDay:"+weekDay);

            djtuDate.date.year = curDate.getFullYear();
            djtuDate.date.month = curDate.getMonth()+1;
            djtuDate.date.day = curDate.getDate();
            djtuDate.date.week = week;
            djtuDate.date.weekDay = weekDay;

            window.localStorage.setItem("djtuDate",JSON.stringify(djtuDate));

            //console.log(djtuDate);
            if(logFlag){
                console.log('updating djtu time...');
                console.log(djtuDate.date);
            }

            //update course table title if dom can be found!
            $("#course-table #course-table-style").contents().find("th").each(function(index, value){
                if($(this).attr('data-order')==djtuDate.date.weekDay){
                    $(this).addClass('inverse');
                }else{
                    $(this).removeClass('inverse');
                }
            });

            $("#course-table .header-week").text(week);

        }

    }

    $( "body>[data-role='panel']" ).panel();

    //bind table head


    //启动时间扫描
    setInterval(updateDjtuDate(),60000);

    updateDjtuDate();
    initCourseTable();

    //left panel function
    $("#leftpanel a[href='#course-table']").click(function(){

    });
    $("#leftpanel a[href='#exam-table']").click(function(){
        ensureRenderExamInfo(false);
    });
    $("#leftpanel a[href='#score-table']").click(function(){
        ensureRenderScoreInfo(false);
    });

    //testNeedLogin();


    //course table
    $("a[href='#course-table-style']").click(function(event){
        event.preventDefault();

        $(this).addClass("ui-btn-active");
        $("a[href='#course-list-style']").removeClass("ui-btn-active");

        $("#course-list-style").fadeOut(50,function(){
            $("#course-table-style").fadeIn(100);
        });

    });
    //course list
    $("a[href='#course-list-style']").click(function(event){
        event.preventDefault();

        var weekDay = 1;

        if(window.localStorage.getItem("djtuDate")){
            weekDay = JSON.parse(window.localStorage.getItem("djtuDate")).date.weekDay;
        }

        showWeekDayList(weekDay);

        $(this).addClass("ui-btn-active");
        $("a[href='#course-table-style']").removeClass("ui-btn-active");

        $("#course-table-style").fadeOut(50,function(){
            $("#course-list-style").fadeIn(100);
        });

    });

    $("table[class*='week-table'] a").click(function(event){
        event.preventDefault();

        showWeekDayList($(this).attr('data-order'));
    });

    $("#exit-button").click(function(event){
        window.localStorage.clear();
    });

    var showWeekDayList = function(weekDay){
        $.each($("#course-list-style table[class*='week-table']").contents().find('th'),function(index, value){
            if(index+1==weekDay){
                $(this).children('a').html('<span class="badge">'+$(this).children('a').text()+'</span>')
            }else{
                $(this).children('a').html($(this).children('a').text())
            }
        });


        $("#course-list-style ul").hide();
        $("#course-list-style ul:eq("+(weekDay-1)+")").show();

    }

    $("#exam-table a[data-role='refresh']").click(function(event){
        event.preventDefault();

        ensureRenderExamInfo(true);
    });

});

