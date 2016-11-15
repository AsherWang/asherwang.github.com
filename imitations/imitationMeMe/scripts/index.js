$().ready(function(){
    $(".room")
    .mouseenter(function(){
        $(this).find(".icon-play").show().addClass("animated bounceIn");
    })
    .mouseleave(function(){
        $(this).find(".icon-play").removeClass("animated bounceIn").hide();
    });


    $(".panel .panel-right-button").click(function(){
        var items=$(this).parent().parent().find("li.room:gt(3)");
        var state=$(this).attr("state");
        let caption={
            "off":"收起栏目",
            "on":"展开全部"
        }
        if(state=="off"){
            items.show();
            $(this).attr("state","on");
        }else{
            items.hide();
            $(this).attr("state","off");
        }
        $(this).text(caption[state]);
        $(".content").css("height",$(".content-left").height()+"px");
    });


    $(".panel .panel-content-tab-control").click(function(){
        $(this).addClass("active").siblings(".active").removeClass("active");
        var items=$(this).parent().prev();
        items.find("[tab="+$(this).attr("tab")+"]").addClass("active").siblings().removeClass("active");
    });

    $('.uptotop').click(function(){
        $('html, body').animate({scrollTop:0}, 'slow');
    });


    $(".content").css("height",$(".content-left").height()+"px");


    var fixedScrollTop=$(".uptotop").offset().top+$(".uptotop").height()-window.innerHeight+30;
    var fixedScrollBottom=$(".footer").offset().top-window.innerHeight;
    $(window).scroll(function(){
        if(fixedScrollTop && document.body.scrollTop>fixedScrollTop){
            $(".content-right-content").css("position","fixed").css("bottom","30px");
            if(fixedScrollBottom && document.body.scrollTop>fixedScrollBottom){
                $(".content-right-content").css("bottom",(document.body.scrollTop-fixedScrollBottom+30)+"px");
            }else{
                $(".content-right-content").css("bottom","30px");
            }
        }else{
            $(".content-right-content").css("position","inherit");
        }

    });


});
