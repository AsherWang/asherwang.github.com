/* 
* @Author: Asher
* @Date:   2014-10-31 23:33:45
*/
//用来创建音乐播放器的界面元素
//重构么= = = =  = = =  = =
//依赖于AudioPlayer和LrcDecoder
;(function($){
    $.PlayerUI=function(AudioPlayer,LrcDecoder,MusicInfoFetcher){
        var events={};  //放各种事件吧...真的要重构么
        this.addEvent=function(name,callback)
        {
            events[name]=callback;
        }



        //参数AudioPlayer是一个jquery对象，用来处理音频
        //参数LrcDecoder也是一个jquery对象，用来解析歌词lrc文件
        var playerId;
        var APIUrl="http://localhost:8070/GetSongsList.action";
        var music_player_bkg_holder;
        var isDebug=false;
        var playMode=1;//播放模式，1：正常模式，2：列表循环，3：单曲循环，4：随机播放
        var play;  //播放按钮
        var stop;  //停止按钮
        var lyrics; //当前歌词
        var timeInterval;//控制UI更新的计时器
        var playerContainer; //播放器的容器
        var lrc_panel; //歌词面板1
        var lrc_panel_music_lrc_buttom_marker_id="music_lrc_buttom_marker"; //歌词面板容器最后一行歌词下边的div标记块的id,将调用insertbefore()插入歌词
        var LrcNeedRefresh=false;
        var lrc_panel2; //歌词面板2
        var progressbar; //进度条
        var cachebar; //缓存进度条
        var playbar;  //播放进度
        var playbar_is_change=false;
        var cur_time_block;  //当前时间
        var total_time_block; //总时间  cario
        var BottomContainer;
        var playModeIconArray=[
                "icon-reorder",
                "icon-retweet",
                "icon-repeat",
                "icon-random"]; //用awesome-font图标
        var inner_volumeSlider;
        var SetMusicCallBack=null;
        var ResizeCallback=null;
        this.setResizeCallback=function(callback)
        {
            ResizeCallback=callback;
        }
        function saveCfg()
        {
            if(SetMusicCallBack){
                var data={};
                data.MusicInfoFetcher_cfg=MusicInfoFetcher.getCfg();
                data.AudioPlayer_cfg=AudioPlayer.getCfg();
                SetMusicCallBack(data);
            }
        }

        this.changeBkg=function(url)
        {
            $(music_player_bkg_holder).animate({opacity:0.3},"fast",null,function(){
                $(music_player_bkg_holder).css("background",'url("'+url+'") no-repeat').css("background-size",'cover');
                $(music_player_bkg_holder).animate({opacity:1},"slow");
            })



        }
        //调试模式下的输出
        function Log(content)
        {
            if(isDebug)console.log("PlayerUI:"+content);
        }
        function ChnageControllerWidth(item,width,callback)
        {
            if(item.attr("short"))
            {
                item.animate({width:$(document.body).width()+"px"},"fast",null,function(){
                    item.removeAttr("short");
                    if(callback)callback();
                });
            }
            else
            {
                item.animate({width:($(document.body).width()-width)+"px"},"slow",null,function(){
                    item.attr("short",1);
                    if(callback)callback();
                });
            }

        }
        this.setSetMusicCallBack=function(callback)
        {
            SetMusicCallBack=callback;
        }

        this.playSong=function(index)
        {
            if(index==undefined||index<0||index>=MusicInfoFetcher.getCurrentList().length)return;
            console.log(index);
            var songInfo=MusicInfoFetcher.getMusicByIndex(index);
            if(!songInfo)return;
            setMusic(songInfo);
            $(play).click();
        }

        this.pauseSong=function()
        {
            $(play).click();
        }
        function innerIniti(containerID)
        {
            //添加布局
            playerContainer=document.getElementById(containerID);  //绑定Div元素
            playerContainer.className="music_player_container";
            music_player_bkg_holder=createDivBlock("music_player_bkg_holder");
            playerContainer.appendChild(music_player_bkg_holder);//背景容器
            playerContainer.appendChild(createLyricPanel());//+歌词

            BottomContainer=createDivBlock("BottomContainer");

            BottomContainer.appendChild(createProgressBar());//+进度条
            BottomContainer.appendChild(createControllerBar());//+控制条
            BottomContainer.appendChild(createTitleBar());//+标题
            playerContainer.appendChild( BottomContainer);


            // playerContainer.appendChild(createPlayModeSelector()); //播放模式控制条

           // playerContainer.appendChild(createMusicLrcPanel2());//+歌词板2

           // playerContainer.appendChild(createMusicInfo());

            //一首歌放完之后的处理事件
            AudioPlayer.CallBackWhenEnded(WhenASongEnded);

            //初始化音量
            $(inner_volumeSlider).css('width',AudioPlayer.getVolumeByPercent()*$(inner_volumeSlider).parent().width()+"px");

            //
            ////控制按钮的选中效果
            //$(".controller_button").mouseover(function(event) {
            //    $(this).css("color","#ffffff");
            //});
            //$(".controller_button").mouseout(function(event) {
            //    $(this).css("color","#908E89");
            //});


            $(".other_selector_item").click(function(){
                var _this=$(this);
                var cur_item=$(".cur_selector_item");
                var temp_Text=_this.text();
                cur_item.removeClass(playModeIconArray[playMode-1]);
                inner_setPlayMode(temp_Text);
                cur_item.addClass(playModeIconArray[playMode-1]);
                cur_item.text(temp_Text);
                $(".music_playmode_sub_selector").slideUp('fast');
            });

           $(window).resize(function(){
            resize_lrc();
            LrcNeedRefresh=true;
               if(ResizeCallback)ResizeCallback();
        });

           //界面更新，设置定时器不断刷新显示
            runAndUpdate();
            NextMusic();
        }

        //初始化
        this.initi=function(containerID){
            playerId=containerID;
            MusicInfoFetcher.init(function(){
                Log("初始化");
                innerIniti(containerID);
            });
        }
        //设定获取数据的Url,自己写接口实现
        this.setAPIUrl=function(url)
        {
            APIUrl=url;
        }

        //设定播放模式
        this.setPlayMode=function(ModeText)
        {
            inner_setPlayMode(ModeText);
        }

        function inner_setPlayMode(ModeText)
        {
            if(ModeText=="正常模式")
            {
                playMode=1;
            }else if(ModeText=="列表循环")
            {
                playMode=2;
            }
            else if(ModeText=="单曲循环"){
                playMode=3;
            }
            else{
                playMode=4;//随机
            }
        }



/////////////////////////以下为UI创建部分/////////////////////////////////////
        //创建歌词面板
        function createLyricPanel()
        {
            lrc_panel=createDivBlock("music_lrc_panel");
            var lrc_panel_mask=createDivBlock("lrc_panel_mask");
            var lrc_panel_p=createDivBlock("music_lrc_lrcLocator");
            var lrc_buttom=createDivBlock("music_lrc_block");
            lrc_buttom.id="music_lrc_buttom_marker";
            lrc_panel_p.appendChild(lrc_buttom);
            lrc_panel.appendChild(lrc_panel_p);
            lrc_panel.appendChild(lrc_panel_mask);
            return lrc_panel;
        }

        //标题栏
        function createTitleBar()
        {
            var titlebar=createDivBlock("music_titlebar");
            titlebar.appendChild(createDivBlock("fa fa-music music_titlebar_titleinfo"));
            titleinfo=createDivBlock("music_titlebar_titleinfo");
            titlebar.appendChild(titleinfo);
            return titlebar;
        }

        //创建歌曲信息板（待完成）
        function createMusicInfo()
        {
            var musicInfobar=createDivBlock("music_musicinfo");
            //测试文字
            $(musicInfobar).text("歌曲信息板");
            return musicInfobar;
        }

        //创建歌词板2,单行歌词
        function createMusicLrcPanel2()
        {
            lrc_panel2=createDivBlock("music_Lrcpanel2");
            return lrc_panel2;
        }

        //列表（待完成）
        function createMusicListPanel()
        {
            var p_panel=createDivBlock("music_list_panel");

        }

        function createMusicListItem(data)
        {
            var p_panel=createDivBlock("music_list_item");
        }


        //创建歌词块（工具）
        function createLrcSpan(lyricBlock)
        {
            var m_span=createDivBlock("music_lrc_block_n");
            $(m_span).text(lyricBlock);
            return m_span;
        }

        //创建进度条
        function createProgressBar()
        {
            var container=createDivBlock("music_progressbar_container");
            progressbar=createDivBlock("music_progressbar");
            cachebar=createDivBlock("music_progressbar_cachebar");
            playbar=createDivBlock("music_progressbar_playbar");
            cachebar.appendChild(playbar);

            //处理事件，设定音乐进度
            $(cachebar).click(function(event){
                var mouseX=event.offsetX;
                var mouseY=event.offsetY;
                var time_of_percent=mouseX/$(this).parent().width(); //获得设定的进度的百分值
                //设定音乐的进度
                if(AudioPlayer.setPlayTimeByPercent(time_of_percent))//如果音乐进度设定成功
                {
                    //$(playbar).width(mouseX);
                    playbar_is_change=true;
                     $(playbar).animate({'width':mouseX+"px"},"fast",function(){
                         playbar_is_change=false;
                });
                   //  $(".music_lrc_lrcLocator .music_lrc_block_n").css("font-size","17px");
                }
                event.stopPropagation(); 
            });
            progressbar.appendChild(cachebar);
            container.appendChild(progressbar);

            cur_time_block=createDivBlock("music_progressbar_cur_time");
            total_time_block=createDivBlock("music_progressbar_total_time");

            container.appendChild(cur_time_block);
            container.appendChild(total_time_block);
            return container;
        }

        //创建控制面板
        function createControllerBar()
        {
            var controllerBar=createDivBlock("music_controller");
            //播放按钮
            play=createDivBlock("fa fa-play controller_button");
            $(play).click(function() {
                if(AudioPlayer.isPaused())//检测播放状态
                {
                 //   alert("开");
                    $(this).removeClass("fa-pause").addClass("fa-play");
                }
                else
                { 
                 //   alert("停");
                    $(this).removeClass("fa-play").addClass("fa-pause");
                }
                AudioPlayer.playOrPause();
                if(events["playOrPauseCallback"])events["playOrPauseCallback"]();

            });

            //上/下一曲
            //icon-backward
            var previous=createDivBlock("fa fa-backward controller_button");
            $(previous).click(function(){
                PreviousMusic();
            });
            var next=createDivBlock("fa fa-forward controller_button");
            $(next).click(function(){
                NextMusic();
            });



            //停止按钮
            stop=createDivBlock("fa fa-stop controller_button");
            $(stop).click(function(){
              //  alert("!!");
                $(play).removeClass("fa-pause").addClass("fa-play");
                $(".music_lrc_lrcLocator .music_lrc_block_n").css("font-size","17px");
                AudioPlayer.stop();
            });



            var volumeSlider=createDivBlock("music_volme_slider");
            var volumecontrol=createDivBlock("controller_volme_button");
            var volumecontrolicon=createDivBlock("fa fa-volume-up controller_button");
            $(volumeSlider).hide();
            $(volumecontrolicon).css("float","left");

            $(volumecontrolicon).click(function(event) {
                    if($(volumeSlider).is(":visible"))
                    {
                        $(volumeSlider).animate({'width':0+"px"},"fast",function(){
                                $(volumeSlider).hide();});
                    }
                    else
                    {
                        $(volumeSlider).width(0);
                        $(volumeSlider).show();
                        $(volumeSlider).animate({'width':slider_width+"px"},"fast");
                    }
            });
            inner_volumeSlider=createDivBlock("music_volme_inner_slider");
          //  $(inner_volumeSlider).text("volume");
            $(inner_volumeSlider).width(20);
            $(volumeSlider).click(function(event){
                var mouseX=event.offsetX;
                var mouseY=event.offsetY;

                var volume_of_percent=mouseX/$(this).width(); //
               // Log("音量："+mouseX+"/"+$(this).width());
               // $(inner_volumeSlider).width(mouseX);
                $(inner_volumeSlider).animate({'width':mouseX+"px"},"fast");

                AudioPlayer.setVolumeByPercent(volume_of_percent);
                saveCfg();
                 setTimeout(function(){
                            $(volumeSlider).animate({'width':0+"px"},"normal",function(){
                                $(volumeSlider).hide();
                        });
                 }, 350);

            });

            volumecontrol.appendChild(volumecontrolicon);
            volumecontrol.appendChild(volumeSlider);
            volumeSlider.appendChild(inner_volumeSlider);

            //创建列表按钮
            var songlist=createDivBlock("fa fa-th-list controller_button");
            var changebkg_btn=createDivBlock("fa fa-magic controller_button");
            var comment=createDivBlock("controller_comment");
            comment.innerHTML="<a href='http://www.baidu.com' target='_blank'>想说点什么?</a>"

            previous.setAttribute("title","上一曲");
            play.setAttribute("title","播放|暂停");
            next.setAttribute("title","下一曲");
            stop.setAttribute("title","停止");
            volumecontrol.setAttribute("title","调音量");
            songlist.setAttribute("title","歌曲列表");
            changebkg_btn.setAttribute("title","随机换背景");



            //把按钮放进控制条
            controllerBar.appendChild(previous);
            controllerBar.appendChild(play);
            controllerBar.appendChild(next);
            controllerBar.appendChild(stop);
            controllerBar.appendChild(volumecontrol);
            controllerBar.appendChild(songlist);
            controllerBar.appendChild(changebkg_btn);
            controllerBar.appendChild(comment);

            $(songlist).click(function(){
                events["songlist_btn_click"]();
                //  var item=$(BottomContainer);
                ChnageControllerWidth($(BottomContainer),300,function(){
                    ChnageControllerWidth($(".music_lrc_lrcLocator"),300); //真是不优雅啊
                }); //真是不优雅啊
            });
            $(changebkg_btn).click(function(){
                events["changebkg_btn_click"]();
            });





            return controllerBar;
        }
        var slider_width=100;
        //创建播放模式的选择器
        function createPlayModeSelector()
        {
            var playModeSelector=createDivBlock("music_playmode_selector");
            var sub_selector=createDivBlock("music_playmode_sub_selector");
            var cur_selector_item=createDivBlock("cur_selector_item  icon-reorder");
            $(cur_selector_item).text("正常模式");

            var selector_item1=createDivBlock("other_selector_item icon-reorder");
            $(selector_item1).text("正常模式");
            var selector_item2=createDivBlock("other_selector_item icon-retweet");
            $(selector_item2).text("列表循环");
            var selector_item3=createDivBlock("other_selector_item icon-repeat");
            $(selector_item3).text("单曲循环");
            var selector_item4=createDivBlock("other_selector_item icon-random");
            $(selector_item4).text("随机播放");

            sub_selector.appendChild(selector_item1);
            sub_selector.appendChild(selector_item2);
            sub_selector.appendChild(selector_item3);
            sub_selector.appendChild(selector_item4);
            
            playModeSelector.appendChild(cur_selector_item);
            $(sub_selector).hide();
            // $(playModeSelector).mouseover(function(){
            //     //$(this).addClass('music_playmode_selector_container_over');
            //     $(sub_selector).show();

            // });
            // $(playModeSelector).mouseout(function(){
            //     $(this).removeClass('music_playmode_selector_container_over');
            //     $(sub_selector).hide();
            // });
            // 
            $(cur_selector_item).click(function() {
                if($(sub_selector).is(":hidden"))
                {
                    $(sub_selector).slideDown();
                }
                else
                {
                     $(sub_selector).slideUp('fast');
                }
            });
            playModeSelector.appendChild(sub_selector);
            return playModeSelector;
        }



        //创建并返回一个指定类名的div元素
        function createDivBlock(className)
        {
            var DivItem=document.createElement("div");
            DivItem.className=className;
            return DivItem;
        }
/////////////////////////以下为控制部分//////////////////////////////////////

        function resize_lrc()
        {
         //   Log("resize_lrc start");
            var lrcBlocks=$("#"+playerId+" .music_lrc_lrcLocator .music_lrc_block_n");
            var i=0;
            lrcBlocks.each(function(){
                if(i>0){
                    LrcDecoder.setBlockHeight(i,Number(LrcDecoder.getBlockHeight(i-1))+Number(this.scrollHeight));
                 //   Log(i+":"+LrcDecoder.getBlockHeight(i));
                }
                i++;
            });
          //  Log("resize_lrc end");
          //  Log("行数"+lrcBlocks.length);


        }

        //将当前音乐改为music_data
        //歌曲信息格式
        //{"Name":Name,
        //"Artist":Artist,
        //"Audio": Album,
        //"Lrc":id}  //歌曲id
        function setMusic(music_data)
        {
            Log("要播放的歌曲信息:");
            Log(music_data.Name+" "+music_data.Artist);
            if(titleinfo)$(titleinfo).text(music_data.Artist+"-"+music_data.Name);  //如果有标题就改标题
            if(lrc_panel2)$(lrc_panel2).text(""); //歌词面板2清理
            if(lrc_panel)$(".music_lrc_lrcLocator .music_lrc_block_n").remove();//歌词面板1清理
            LrcDecoder.loadLrc(music_data);

            if(lrc_panel)//如果选择使用歌词面板1，那么LrcDecoder加载歌词完成之后后往歌词面板1装填歌词，并使用回调
             LrcDecoder.setLoadedCallBack(function(){
                sum=LrcDecoder.getTimetagArray().length; //获取所有歌词

                for (i=0;i<sum;i++)//装填歌词
                {

                    var newitem=createLrcSpan(LrcDecoder.getLrcFromLrcstore(i));
                    $(newitem).insertBefore('#'+lrc_panel_music_lrc_buttom_marker_id);
                    if(i>0){
                     //   LrcDecoder.setBlockHeight(i,Number(LrcDecoder.getBlockHeight(i-1))+Number(newitem.scrollHeight));
                    }
                }
                 resize_lrc();
             });

            //音频模块
            AudioPlayer.GoToNextMusic(music_data.Audio);
            saveCfg();
        }

        //下一曲
        function NextMusic()
        {
            Log("准备播放下一曲...");
            var musicData=MusicInfoFetcher.getNextMusic();
            if(!musicData||!musicData.Audio){
                $(stop).click();
                return;
            }
            setMusic(musicData);
            $(play).click();
        }

        //上一曲
        function PreviousMusic()
        {
            Log("准备播放上一曲...");

            var musicData=MusicInfoFetcher.getPreviousMusic();
            if(!musicData||!musicData.Audio){
                $(stop).click();
                return;
            }
            setMusic(musicData);
            $(play).click();
        }

        function WhenASongEnded()
        {
            Log("当前歌曲结束...");
            NextMusic();
        }

        //设定UI的循环更新
        var lastIndex=-1; //上次的歌词索引
        function runAndUpdate()
        {
            timeInterval=setInterval(function(){
                    if(!AudioPlayer.isReady())return;
                    if(!playbar_is_change)$(playbar).width(AudioPlayer.getPlayTimeByPercent()*$(progressbar).width());//播放进度
                    $(cachebar).width(AudioPlayer.getBufferedTimeByPercent()*$(progressbar).width());//缓存进度
                    $(cur_time_block).html(AudioPlayer.getCurrentPlayTimeFormated());
                    $(total_time_block).html(AudioPlayer.getTotalTime());

                var LrcCurrentIndex=LrcDecoder.getCurrentLyricIndex(Math.floor(AudioPlayer.getCurrentPlayTime()*100)+50);

                    if((LrcCurrentIndex!=-1&&lastIndex!=LrcCurrentIndex)||LrcNeedRefresh){
                        if(lrc_panel2)$(lrc_panel2).text(LrcDecoder.getCurrentLyric(Math.floor(AudioPlayer.getCurrentPlayTime()*100)+50));
                        if(lrc_panel) {
                            var tempHeight=$(".music_lrc_panel").height()/2 - LrcDecoder.getBlockHeight(LrcCurrentIndex);

                           // console.log(LrcCurrentIndex+" "+LrcDecoder.getCurrentLyric(Math.floor(AudioPlayer.getCurrentPlayTime()*100)+50));

                            if(LrcNeedRefresh)$(".music_lrc_lrcLocator").css("margin-top",tempHeight + "px");
                            else $(".music_lrc_lrcLocator").animate({'margin-top': tempHeight + "px"}, "slow");

                            var cur_lrc_bar = $(".music_lrc_lrcLocator .music_lrc_block_n:eq(" + (LrcCurrentIndex) + ")");
                            cur_lrc_bar.addClass('music_lrc_block_active')
                                .siblings().removeClass('music_lrc_block_active');
                            cur_lrc_bar.prev().removeClass('music_lrc_block_active');
                        }
                        lastIndex=LrcCurrentIndex;
                        LrcNeedRefresh=false;
                    }
            },80); //时间单位是毫秒
        }
    };

})(jQuery);