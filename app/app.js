/**
 * Created by apple on 3/1/14.
 */

$(function() {

    $( "body>[data-role='panel']" ).panel();

    initCourseTable();

    testNeedLogin();

    ensureRenderExamInfo();
});

