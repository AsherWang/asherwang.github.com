/* 
* @Author: Asher
* @Date:   2014-10-30 19:34:06
* @Last Modified by:   Asher
* @Last Modified time: 2016-10-22 02:50:00
*/
//本模块负责通过ajxa获取歌曲信息，比如歌曲名字以及url等等


(function ($) {
    $.MusicInfoFetcher = function (cfg) {
		var resUrl="http://localhost:8070/GetSongsList.action";
		var musicList=[];  //歌曲信息列表
		var cur_index=-1;   //当前歌曲索引
		var initialed=false;
        var lastFetchFalied=false;
        var DEBUG=false;
        initCfg(cfg);
        this.getCfg=function()
        {
            var ret={};
            ret.list=musicList;
            ret.index=cur_index;
            return ret;
        }

        function initCfg(cfg)
        {
            if(!cfg)return;
            if(cfg.list)musicList=cfg.list;
            if(cfg.index)cur_index=cfg.index-1;

        }

        function Log(info)
        {
            if(DEBUG)console.log("MusicInfoFetcher:"+info);
        }

		this.init=function(callback)
		{
            Log("初始化");
            musicList=[
                           {
                    Name:"Rage Your Dream",
                    Artist:"Initial.D",
                    Audio:"http://qiniu.writeyoursmile.com/musicRage Your Dream.mp3",
                    Lrc:"http://qiniu.writeyoursmile.com/lrcRage Your Dream.lrc"
                },    
                           {
                    Name:"Endless Tears",
                    Artist:"feat.中村舞子",
                    Audio:"http://qiniu.writeyoursmile.com/musicEndless Tears.mp3",
                    Lrc:"http://qiniu.writeyoursmile.com/lrcEndless Tears.lrc"
                },   
                {
                    Name:"解夏",
                    Artist:"华少昱",
                    Audio:"http://qiniu.writeyoursmile.com/music解夏.mp3",
                    Lrc:"http://qiniu.writeyoursmile.com/lrc解夏.lrc"
                },
                    {
                    Name:"上邪",
                    Artist:"小曲儿",
                    Audio:"http://qiniu.writeyoursmile.com/music上邪.mp3",
                    Lrc:"http://qiniu.writeyoursmile.com/lrc上邪.lrc"
                },
                
                                             {
                    Name:"盲眼画师",
                    Artist:"河图",
                    Audio:"http://qiniu.writeyoursmile.com/music盲眼画师.mp3",
                    Lrc:"http://qiniu.writeyoursmile.com/lrc盲眼画师.lrc"
                }
                 
            
            ];
            initialed=true;
			if(callback)callback();
		}

        this.getCurrentList=function()
        {
            return musicList;
        }
        this.getCurrentIndex=function()
        {
            return cur_index;
        }

		function FetchMore(offset,limit,callback)
		{
			// 拉取更歌曲信息以充实musicList
            Log("拉取链接:"+resUrl+"?offset="+offset+"&limit="+limit);
			   $.ajax(
              {
                url:resUrl+"?offset="+offset+"&limit="+limit,
                type:'POST',
                dataType:'jsonp',
                jsonp: "callback",
                jsonpCallback:"MusicInfoFetcher",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                success:function(data)
                {
                    Log(data.info);
					if(data.error==0)
					{
						//musicList=musicList.concat(data.result);
                        for(var i in data.result)
                            if(!isContain(data.result[i].id))musicList.push(data.result[i]);
                        if(data.result.length==0)
                        {
                            console.log("服务器上没歌儿了？");
                        }
					}
					initialed=true;
                    lastFetchFalied=false;
                    if(callback)callback();
                },
                error:function()
                {
                    lastFetchFalied=true;
                    console.log("载入失败");
                    if(callback)callback();
                }
            });
             
        }
   
		function isContain(songid)
        {
            for(var i in musicList)
                if(musicList[i].id==songid)return true;
            return false;
        }
		
		
        this.getNextMusic=function()
        {
		//	if(!initialed)return null;
			if(cur_index==musicList.length-1)return null;
            ++cur_index;
			if(cur_index>=musicList.length-5) //提前5首歌拉取信息
			{ 
				//FetchMore(musicList.length,5);
			}
            Log("Cur:"+musicList[cur_index]);
			return musicList[cur_index];
        }

        this.getRandomMusic=function()
        {
            if(!initialed)return null;
            cur_index=Math.floor(Math.random() * ( musicList.length));
            return musicList[cur_index];
        }

        this.getCurrentMusic=function()
        {
            if(!initialed)return null;
            return musicList[cur_index];
        }

        this.getMusicByIndex=function(index)
        {
            if(index<0||index>=musicList.length)return null;
            cur_index=index;
            if(cur_index>=musicList.length-5) //提前5首歌拉取信息
            {
               // FetchMore(musicList.length,5);
            }
            return musicList[index];
        }

        this.getPreviousMusic=function()
        {
            if(!initialed)return null;
            if(cur_index==0)return null;
            --cur_index;
            return musicList[cur_index];
        }


        this.getListLoopPreviousMusic=function()
        {
            if(!initialed)return null;
            cur_index--;
            if(cur_index==-1)cur_index=musicList.length-1;
            return musicList[cur_index];
        }
        this.getListLoopNextMusic =function()
        {
            if(!initialed)return null;
            cur_index=(cur_index+1)%musicList.length;
            return musicList[cur_index];
        }
    };
})(jQuery);
