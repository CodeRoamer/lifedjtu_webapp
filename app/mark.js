$(function(){
    $("#mark-page a[href='#compute-mark']").click(function(){
        var schoolYear = $("#mark-page #schoolYear-menu").val();
        var term = $("#mark-page #term-menu").val();

        triggerLoad("正在远程计算中");
        getJSON("webservice/secure/getAverageMark.action",{
            schoolYear:schoolYear||0,
            term : term||0,
            studentId:window.localStorage.getItem("studentId"),
            dynamicPass:window.localStorage.getItem("privateKey")
        },function(data,text,xhqr){
            if(data.flag==2){
                if(window.localStorage){
                    $("#mark-page #schoolYear-td").text(schoolYear);
                    $("#mark-page #term-td").text(term);

                    $("#mark-page #mark-td").text(data.avgMark);

                }else{
                    handleError("do not support local storage! try to save private key in file");
                }
            }else{
                handleExceptionData(data);
            }
        },function(jqXHR, textStatus, errorThrown){
            handleError(errorThrown);
        },function(){
            stopLoad();
        });
    });
});