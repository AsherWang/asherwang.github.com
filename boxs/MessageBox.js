/**
 * Created by Administrator on 2015/5/12.
 */
;(function ($) {
    var messageBoxId=0;
    var max_z_index=1000;
    var DEBUG=false;
    function Log(content)
    {
        if(DEBUG)console.log("MessageBox:"+content);
    }
    $.MessageBox=function()
    {
        var bkgs={
            "white":"./blocks/white.png",
            "black":"./blocks/black.png",
            "blue":"./blocks/blue.png",
            "red":"./blocks/red.png",
            "orange":"./blocks/orange.png",
            "green":"./blocks/green.png",
            "purple":"./blocks/purple.png"
        };
        var messageBoxIdPrefix="AsherMessageBoxK";
        var msg_window;
        var msg_titlebar;
        var titlename;
        var msg_content;
        var id=null;
        var status=2;   //0:hided,1 show,2 removed

        var documentMouseUpEvent;
        this.Show=function()
        {
            var z=$(msg_window).css("z-index");
            if(z<=max_z_index)
                max_z_index++;
            $(msg_window).css("z-index",max_z_index);
            $(msg_window).show();
            status=1;
        }

        this.Hide=function()
        {
            $(msg_window).hide();
            var z=$(msg_window).css("z-index");
            if(z==max_z_index)
                max_z_index--;
            $(msg_window).css("z-index",0);
            status=0;
        }

        this.Remove=function()
        {
            var z=$(msg_window).css("z-index");
            if(z==max_z_index)
                max_z_index--;
            $(msg_window).remove();
            status=2;
        }
        this.Id=function()
        {
            return id;
        }
        this.Create=function(content,x,y,width,height,callback)
        {
            if(!id)id=messageBoxIdPrefix+messageBoxId;
            messageBoxId++;
            createWindow(content,id,x,y,width,height);
            status=0;
            if(callback)callback();
        }

        this.isShow=function()
        {
            return status==1;
        }
        this.getStatus=function()
        {
            return status;
        }

        this.setTitle=function(title,callback)
        {
            titlename.innerHTML=title;
            if(callback)callback();
        }

        this.setContent=function(content,callback)
        {
            msg_content.innerHTML=content;
            if(callback)callback();
        }
        function setBackground(item,color)
        {
            if(color=="transparent")
            {
                item.css("background","transparent");
                return;
            }
            item.css("background","url("+bkgs[color]+")  repeat");
        }

        this.setBoxBackground=function(color)
        {
            setBackground($(msg_window),color);
        }
        this.setTitleBackground=function(color)
        {
            setBackground($(msg_titlebar),color);
        }
        this.setContentBackground=function(color)
        {
            setBackground($(msg_content),color);
        }
        function createWindow(content,id,x,y,width,height)
        {
            msg_window=createDivWithClass("msg_window");
            msg_titlebar=createDivWithClass("msg_titlebar");
            msg_content=createDivWithClass("msg_content");
            msg_content.innerHTML=content;
            $(msg_window).appendTo(document.body);
            $(msg_window).attr("id", id);
            msg_window.appendChild(msg_titlebar);
            msg_window.appendChild(msg_content);
            titlename=createDivWithClass("titlename");
            titlename.innerHTML="对话框";
            msg_titlebar.appendChild(titlename);
            var closebtn=createDivWithClass("closebtn icon-remove");
            $(closebtn).attr("messagebox_id",$(msg_window).attr("id"));
            msg_titlebar.appendChild(closebtn);

            if(x!=undefined)$(msg_window).css("left",parseInt(x)+"px");
            if(y!=undefined)$(msg_window).css("top",parseInt(y)+"px");
            if(width!=undefined)$(msg_window).css("width",parseInt(width)+"px");
            if(height!=undefined)$(msg_window).css("height",parseInt(height)+"px");

            //拖动事件
            $(msg_titlebar).mousedown(function(e){
                if((e.button == 0) || ( e.button == 1))
                {
                    $(msg_window).attr("Draging",true);
                    $(msg_window).attr("preX",e.pageX);
                    $(msg_window).attr("PreY",e.pageY);
                    $(msg_window).attr("preLeft", $(msg_window).css("left"));
                    $(msg_window).attr("PreTop",$(msg_window).css("top"));
                   // Log("鼠标原始坐标 ("+ $(msg_window).attr("preX")+","+$(msg_window).attr("preY")+")");
                  //  Log("Box原始坐标 ("+ $(msg_window).css("left")+","+$(msg_window).css("top")+")");
                }
            });
            //Log("按下绑定完毕");
            $(document).mousemove(function(e){
                if($(msg_window).attr("Draging"))
                {
                    var offsetX= e.pageX-$(msg_window).attr("preX");
                    var offsetY= e.pageY-$(msg_window).attr("preY");
                   $(msg_window).css("left", (parseInt($(msg_window).attr("preLeft"))+offsetX)+"px");
                   $(msg_window).css("top", (parseInt($(msg_window).attr("PreTop"))+offsetY)+"px");
                    if( parseInt($(msg_window).css("top"))<0)$(msg_window).css("top","0px");
                    if( parseInt($(msg_window).css("left"))<0)$(msg_window).css("left","0px");

                    var max_left=$(document.body).width()-$(msg_window).width();
                    if(parseInt($(msg_window).css("left"))>max_left)$(msg_window).css("left",max_left+"px");

                 //   var max_top=$(document.body).height()-$(msg_window).height();
                 //   if(parseInt($(msg_window).css("top"))>max_top)$(msg_window).css("top",max_top+"px");

                }
            });

            documentMouseUpEvent=function(e){
                if( e.button == 0|| e.button == 1)
                    $(msg_window).removeAttr("Draging");
            };
            $(document).mouseup(documentMouseUpEvent);
            $(closebtn)
                .click(function(){
                    $(document).unbind("mouseup",documentMouseUpEvent);
                    $(msg_window).remove();
                    status=2;
                })
                .mouseenter(function(){
                    $(this).addClass("closebtn_hover");
                })
                .mouseleave(function(){
                    $(this).removeClass("closebtn_hover");
                });
            $(msg_window).mousedown(function(){
                if($(msg_window).css("z-index")<=max_z_index)
                {
                    max_z_index++;
                    $(msg_window).css("z-index",max_z_index);
                }

            });

        }

        function createDivWithClass(className)
        {
            var item=document.createElement("div");
            if(className)
                item.className=className;
            return item;
        }
    }
})(jQuery);