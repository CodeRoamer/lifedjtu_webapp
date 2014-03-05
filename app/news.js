
$(function(){
    $("a[href='news.html']").click(function(event){
        ensureRenderNews(false);
    });

    $(document).on("click", "#news-list a[data-role='refresh-button']", function(event){
        ensureRenderNews(true,0);
    });
});