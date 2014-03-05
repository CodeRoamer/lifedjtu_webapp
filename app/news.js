
$(function(){
    ensureRenderNews(false);


    $(document).on("click", "#news-list a[data-role='refresh-button']", function(event){
        event.preventDefault();
        ensureRenderNews(true,0);
    });

    $(document).on("click", "#news-list a[href='#more-news']", function(event){
        event.preventDefault();
        var me = this;

        var pageNum = $(this).attr('data-pageNum');

        //console.log(pageNum);

        if(pageNum==0){
            handleWarning("新闻已过时，请刷新");
            return;
        }

        ensureRenderNews(true,pageNum,function(){
            $(me).fadeOut(150,function(){
                $(me).remove();
            });
        });
    });


    $(document).on("click", "#news-list a[href='#news-detail']", function(event){
        $("#news-detail .news-title").text($(this).children("span[class*='title']").text());
        $("#news-detail #note-content").html("<span class='text-center text-info'>正在努力为您抓取数据中...</span>");
        var href = $(this).attr('data-href');
        ensureRenderNewsContent(href);
    });
});