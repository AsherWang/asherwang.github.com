/**
 * Created by Administrator on 2015/5/26.
 */
;(function ($) {
    $.SideBar=function(SideBarCfg){
        var container=null;
        var content=null;
        var content_setted=false;
        var status=0;  //0 not created  ; 1 hidden   ;   2  shown
        var defaultCfg={
            position:6,  //  8 2 4 6  上下左右
            showSpeed:"slow",
            hideSpeed:"fast"
        };
        function initCfg(cfg)
        {
            for(item in cfg)
                defaultCfg[item]=cfg[item];
        }

        this.getCfg=function()
        {
            return defaultCfg;
        }
        initCfg(SideBarCfg);


        this.getStatus=function()
        {
            return status;
        }

        this.Create=function(width,height,callback)
        {
            container=createDivBlock("SideBar_container");
            $(container).appendTo(document.body);
            if(width!=undefined)$(container).css("width",parseInt(width)+"px");
            if(height!=undefined)$(container).css("height",parseInt(height)+"px");
            switch(defaultCfg.position)
            {
                case 2:
                    $(container).css("top",$(document.body).height()+"px");
                    break;
                case 4:
                    $(container).css("left",-$(container).width()+"px");
                    break;
                case 6:
                    $(container).css("left",$(document.body).width()+"px");
                    break;
                case 8:
                    $(container).css("top",-$(container).height()+"px");
                    break;
            }
            content=createDivBlock("SideBar_content");
            container.appendChild(content);
            $(container).show();
            status=1;
            if(callback)callback();
        }

        this.setContent=function(h_content,callback)
        {
            $(content).html(h_content);
            content_setted=true;
            if(callback)callback();
        }

        this.getContentStatus=function()
        {
            return content_setted;
        }
        this.Show=function(callback)
        {
            if(status==2)return;
            var tempfunction=function(){
                status=2;
                if(callback)callback();
            };
            switch(defaultCfg.position)
            {
                case 2:
                    $(container).animate({top:($(document.body).height()-$(container).height())+"px"},defaultCfg.showSpeed,null,tempfunction);
                    break;
                case 4:
                    $(container).animate({left:"0px"},defaultCfg.showSpeed,null,tempfunction);
                    break;
                case 6:
                    $(container).animate({left:($(document.body).width()-$(container).width())+"px"},defaultCfg.showSpeed,null,tempfunction);
                    break;
                case 8:
                    $(container).animate({top:"0px"},defaultCfg.showSpeed,null,tempfunction);
                    break;
            }
        }

        this.Hide=function(callback)
        {
        if(status==1)return;
            var tempfunction=function(){
                status=1;
                if(callback)callback();
            };
            switch(defaultCfg.position)
            {
                case 2:
                    $(container).animate({top:$(document.body).height()+"px"},defaultCfg.hideSpeed,null,tempfunction);
                    break;
                case 4:
                    $(container).animate({left:-$(container).width()+"px"},defaultCfg.hideSpeed,null,tempfunction);
                    break;
                case 6:
                    $(container).animate({left:$(document.body).width()+"px"},defaultCfg.hideSpeed,null,tempfunction);
                    break;
                case 8:
                    $(container).animate({top:-$(container).height()+"px"},defaultCfg.hideSpeed,null,tempfunction);
                    break;
            }
        }

        this.ShowOrHide=function(callback)
        {
            if(status==1)this.Show(callback);
            else if(status==2)this.Hide(callback);

        }
        //创建并返回一个指定类名的div元素
        function createDivBlock(className)
        {
            var DivItem=document.createElement("div");
            DivItem.className=className;
            return DivItem;
        }
        this.getHeight=function()
        {
            return  $(container).height();
        }

        this.setHeight=function(height)
        {

            $(container).height(height);
        }

    }
})(jQuery);