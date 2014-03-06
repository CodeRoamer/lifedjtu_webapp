/**
 * Created by apple on 3/5/14.
 */

$(function(){
    //获取area信息
    ensureRenderAreaMenu(false);

    $("#room-page #area-menu").change(function(event){
        if($(this).val()==-1){
            $("#room-page #building-menu").empty();
            $("#room-page #building-menu-button").children('span').html('&nbsp;');
            return;
        }

        ensureRenderBuildingMenu(false, $(this).val());
    });

    $("#room-page #query-room-list").click(function(event){
        event.preventDefault();
        //var areaId = $("#room-page #area-menu").val();
        var buildingId = $("#room-page #building-menu").val();
        var buildingName = $("#room-page #building-menu-button").children('span').text();

        var startIndex = $("#room-page input[name='segment-start']").val()||1;
        var endIndex = $("#room-page input[name='segment-end']").val()||10;
        if(buildingId){
            $("#room-page a[href='#room-list']").click();
            $("#room-list .building-title").text(buildingName);
            $("#room-list .story-list").empty();

            $("#room-list .slider-container").empty();
            $("#room-list .slider-container").append($("#room-page .slider-container").children('div'));


            $("#room-list input[name='segment-start']").attr('value',startIndex);
            $("#room-list input[name='segment-end']").attr('value',endIndex);
            ensureRenderRoomTakenList(true,buildingId,buildingName,startIndex,endIndex);
        }else{
            handleWarning("请选择有效的教学楼");
        }
    });

    $(document).on("click", "#room-list .toggle-button", function(event){
        event.preventDefault();
        event.stopPropagation();

        var liParent = $(this).parent('h2').parent('li');


        liParent.toggleClass("ui-collapsible-collapsed");

        liParent.children('h2').toggleClass('ui-collapsible-heading-collapsed');

        $(this).toggleClass('ui-icon-minus');
        $(this).toggleClass('ui-icon-plus');

        var divDom = liParent.children('div');
        divDom.toggleClass('ui-collapsible-content-collapsed');
        if(divDom.attr("aria-hidden")=='true'){
            divDom.attr("aria-hidden",'false')
        }else{
            divDom.attr("aria-hidden",'true')
        }
    });

    $("#room-list a[data-rel='back']").click(function(event){
        $("#room-page .slider-container").append($("#room-list .slider-container").children('div'));
    });

    $("#room-list a[data-role='refresh-button']").click(function(event){
        var startIndex = $("#room-list input[data-type='range']:eq(0)").val();
        var endIndex = $("#room-list input[data-type='range']:eq(1)").val();

        renderRoomTakenList(JSON.parse(window.localStorage.getItem('roomTakenItems_temp')),null,startIndex, endIndex);
    });

});