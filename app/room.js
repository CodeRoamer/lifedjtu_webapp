/**
 * Created by apple on 3/5/14.
 */

$(function(){
    //获取area信息
    ensureRenderAreaMenu(true);

    $("#room-page #area-menu").change(function(event){
        ensureRenderBuildingMenu(true, $(this).val());
    });

});