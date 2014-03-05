/**
 * Created by apple on 3/1/14.
 */

$(function() {

    $( "body>[data-role='panel']" ).panel();

    initCourseTable();

    //left panel function
    $("#leftpanel a[href='#course-table']").click(function(){

    });
    $("#leftpanel a[href='#exam-table']").click(function(){
        ensureRenderExamInfo();
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

        $("#course-list-style").fadeOut(200,function(){
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

        $("#course-table-style").fadeOut(200,function(){
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



});

