/**
 * Created by apple on 3/1/14.
 */

//global host
var globalHost = "http://localhost:9119/lifedjtu/";

var triggerLoad = function(){
    $.mobile.loading( "show", {
        text: "loading...",
        textVisible: true,
        theme: 'b',
        textonly: false,
        html: ""
    });
}

var stopLoad = function(){
    $.mobile.loading( "hide" );
}

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
        timeout: 10000,
        success:success,
        error: error,
        complete: complete
    });
};


