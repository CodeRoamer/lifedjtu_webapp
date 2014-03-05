/**
 * Created by apple on 3/4/14.
 */
$(function(){
//score part
    $("a[href='#search-score']").click(function(event){
        event.preventDefault();

        //反常规执行查询，不调用val()方法，而是使用value方法
        ensureRenderScoreInfo(true,$("#schoolYear-menu").val(), $("#term-menu").val());
    });

    $("a[href='#reset-search']").click(function(event){
        event.preventDefault();

        var schoolYearVal = window.localStorage.getItem('scoreInfo_year')||window.localStorage.getItem('djtuDate').date.schoolYear||new Date().getYear();
        var termVal = window.localStorage.getItem('scoreInfo_term')||window.localStorage.getItem('djtuDate').date.term||1;

        $("#schoolYear-menu").children('option').each(function(){
            if($(this).attr('value')==schoolYearVal){
                $(this.attr('selected','selected'));
            }
        });
        $("#term-menu").children('option').each(function(){
            if($(this).attr('value')==termVal){
                $(this.attr('selected','selected'));
            }
        });


    });
});