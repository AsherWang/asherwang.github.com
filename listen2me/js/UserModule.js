/**
 * Created by Administrator on 2015/5/16.
 */
;(function ($) {
    $.UserModule=function()
    {
        this.saveCookie=function(data){
            if(window.localStorage){
                window.localStorage.setItem("pre_cookie_user",JSON.stringify(data));
            }
        }

        this.getCookie=function(){
            if(window.localStorage){
                var data= window.localStorage.getItem("pre_cookie_user");
                if(!data){return null;}
                return JSON.parse(data);
            }
            return null;
        }
    }
})(jQuery);