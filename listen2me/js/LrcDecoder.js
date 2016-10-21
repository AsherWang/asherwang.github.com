/* 
* @Author: Asher
* @Date:   2014-10-31 01:37:10
* @Last Modified by:   Asher
* @Last Modified time: 2016-10-21 18:16:31
*/
//解析lrc歌词的模块
//

;(function ($) {
    //内部用结构体
    function _TimeTag(tt)
    {
        this.timeTag =tt; //以十毫秒为单位计算
        this.timeLrcIndex=0;
        this.height=0; //为了记录方便，即距离第一行歌词的高度
    }
    var TimeTagArrayIndex=0;
    var LrcArrayIndex=0;
    var TimeTagArray=new Array();
    var LrcArray=new Array();
    function ParseLrc(data)
    {
        TimeTagArrayIndex=0;
        LrcArrayIndex=0;
        TimeTagArray.length=0;
        LrcArray.length=0;

        //构建
        var cont=new String(data);
        var left=cont.indexOf("[",left);
        while(cont[left]=='[')
        {
            left = parseALine(left,cont);
        }
        //排序
        for(i=0;i<TimeTagArrayIndex-1;++i)
        {
            for(j=i+1;j<TimeTagArrayIndex;++j)
            {
                if(TimeTagArray[i].timeTag>TimeTagArray[j].timeTag)
                {
                    temp=TimeTagArray[i];
                    TimeTagArray[i]=TimeTagArray[j];
                    TimeTagArray[j]=temp;
                }
            }
        }
    }
    function parseALine(left,str)
    {
        var right;
        var temp_sub;
        var p_index=TimeTagArrayIndex;
        while(str[left]=='['){
            right=str.indexOf("]",left);
            temp_sub=str.substr(left+1,right-left-1);
            left=right+1;
            var newTimeTag=TimeTagParse(temp_sub);
            if(isNaN(newTimeTag))continue;
            TimeTagArray[TimeTagArrayIndex]=new _TimeTag(newTimeTag);
            ++TimeTagArrayIndex;
        }
        var nextLeft=str.indexOf("[",left);
        if(nextLeft==-1)nextLeft=str.length;
        var tempcont=str.substr(left,nextLeft-left);
        LrcArray[LrcArrayIndex]=tempcont;
        for(i=p_index;i<TimeTagArrayIndex;++i)
        {
            TimeTagArray[i].timeLrcIndex=LrcArrayIndex;
        }
        ++LrcArrayIndex;
        return nextLeft;
    }

    function TimeTagParse(timeTag)
    {
        var t1=timeTag.indexOf(":");
        var t2=timeTag.indexOf(".");
        var t3=timeTag.length;
        var r1,r2,r3;
        r1=parseInt(timeTag.substr(0,t1));
        if(t2==-1)
        {
            r2=parseInt(timeTag.substr(t1+1,t3-t1));
            r3=0;
        }
        else
        {
            r2=parseInt(timeTag.substr(t1+1,t2-t1-1));
            r3=parseInt(timeTag.substr(t2+1,t3-t2));
        }
        return (r1*60+r2)*100+r3;
    }



    function show()
    {
        var str="";
        for(i=0;i<TimeTagArrayIndex;++i)
        {
            str+=(i+"-"+TimeTagArray[i].timeTag+"-"+TimeTagArray[i].timeLrcIndex+"-"
                +LrcArray[TimeTagArray[i].timeLrcIndex]+"\n");
        }
        for(i=0;i<LrcArrayIndex;++i)
        {
             str+=(i+":"+LrcArray[i]+"\n");
        }
        return str;
    }

    //
    $.LrcDecoder=function(){
        var LrcContent;
        var lrc_callBack;
        var baseUrl="http://localhost:8070/GetLrc.action?Song_id=";
        var DEBUG=false;
        function Log(info)
        {
            if(DEBUG)console.log("LrcDecoder:"+info);
        }
        this.setBlockHeight=function(index,h)
        {
            if(TimeTagArray[index])TimeTagArray[index].height=h;
        }

        this.getBlockHeight=function(index)
        {
            if(TimeTagArray[index]==undefined)return 0;
            return TimeTagArray[index].height;
        }
        this.loadLrc=function(music_data)
        {
            
            $.ajax(
            {
                url:music_data.Lrc,
                type:'GET',
             //   dataType:'jsonp',
               // jsonp: "callback",
              //  jsonpCallback:"jsonPLrccallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                success:function(data)
                {
                    LrcContent=data;
                    ParseLrc(data);
                    Log(show());
                    if(lrc_callBack)lrc_callBack();
                },
                error:function()
                {
                    Log("歌词载入失败");
                    //载入失败
                    LrcContent=-1;
                }
            });
        }

        this.isLoadedOK=function()
        {
            return LrcContent==-1;
        }

        this.getLrcFromLrcstore=function(index)
        {
            return LrcArray[TimeTagArray[index].timeLrcIndex];
        }
        this.setLoadedCallBack=function(callBack)
        {
            lrc_callBack=callBack;
        }
        //返回所有标签
        this.showLyrics=function()
        {
            var text="";
             for(i=0;i<TimeTagArrayIndex;++i)
            {
                text+=TimeTagArray[i].timeTag+":"+LrcArray[TimeTagArray[i].timeLrcIndex]+"<br />";
            }
            return text;
        }

        //返回一个当前时间的最后一个标签,嗯，好点了,timeD的单位是10毫秒
        this.getCurrentLyric=function(time)
        {
            for (var i = 0; i <TimeTagArrayIndex; i++)
            {
                if(TimeTagArray[i].timeTag>time)
                {
                  if(i==0)return LrcArray[TimeTagArray[i].timeLrcIndex];
                    return LrcArray[TimeTagArray[i-1].timeLrcIndex];
                }
            }
        }   

        //返回一个当前时间的最后一个标签的歌词索引,嗯，好点了,待完善
        this.getCurrentLyricIndex=function(time)
        {
            for (var i=0; i <TimeTagArrayIndex; i++)
            {
                if(TimeTagArray[i].timeTag>time)
                {
                  if(i==0)
                    return i;
                  return i-1;
                }
            }
            return TimeTagArrayIndex-1;
        }   
        
        //返回存放歌词的词组
        this.getFormatedLyrics=function()
        {
            return LrcArray;
        }
        //返回存放歌词的词组
        this.getTimetagArray=function()
        {
            return TimeTagArray;
        }


    };
})(jQuery);