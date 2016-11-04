/* 
* @Author: Asher  
* @Date:   2014-10-29 10:16:48
* @Last Modified by:   Asher
* @Last Modified time: 2016-10-22 03:34:33
*/
//初始化模块
//载入上次的信息如果有的话 
//
$().ready(function(){

    //播放器
    user =new $.UserModule();  //全局用户模块“类”
    var data=user.getCookie();  //获取缓存
    var musicInfoFetcher;  //歌曲拉取模块
    var audioPlayer;  //音频播放模块
    if(data)
    {
        musicInfoFetcher=new $.MusicInfoFetcher(data.MusicInfoFetcher_cfg);
        audioPlayer=new $.AudioPlayer(data.AudioPlayer_cfg);
    }
    else
    {
        musicInfoFetcher=new $.MusicInfoFetcher();
        audioPlayer=new $.AudioPlayer();
    }

    var player=new $.PlayerUI(audioPlayer,new $.LrcDecoder(),musicInfoFetcher);
    var songListBar=new $.SideBar();
    songListBar.Create(300,$(document.body).height());

    function createDivBlock(className)
    {
        var item=document.createElement("div");
        item.className=className;
        return item;
    }

    var listItemPlayFunction=function(self){
        var item=$(self);
        if(item.attr("isPlaying")=="playing")
        {
            player.pauseSong();
            item.removeClass("fa-pause").addClass("fa-play");
            item.attr("isPlaying","paused");
        }
        else  if(item.attr("isPlaying")=="paused")
        {
            player.pauseSong();
            item.removeClass("fa-play").addClass("fa-pause");
            item.attr("isPlaying","playing");
        }
        else
        {
            $(".SongListContainer .SongListItem .SongListItem_play").removeAttr("isPlaying");
            player.playSong(item.attr("index"));
            $(".SongListContainer .SongListItem .fa-pause").removeClass("fa-pause").addClass("fa-play");
            item.removeClass("fa-play").addClass("fa-pause");
            item.attr("isPlaying","playing");
        }
    };
    function createSongListItem(index,songInfo)
    {
        var item=createDivBlock("SongListItem");
        item.setAttribute("index",index);
        item.setAttribute("title",songInfo.Name+"-"+songInfo.Artist);
        var item_index=createDivBlock("SongListItem_index");
        var item_title=createDivBlock("SongListItem_title");
        var item_artist=createDivBlock("SongListItem_artist");
        var item_play=createDivBlock("SongListItem_play fa fa-play");
        var item_delete=createDivBlock("SongListItem_delete fa fa-remove");
        item_index.innerHTML=index;
        item_play.setAttribute("index",index-1);
        item_title.innerHTML=songInfo.Name;
        item_artist.innerHTML=songInfo.Artist;



        item.appendChild(item_index);
        item.appendChild(item_play);
        item.appendChild(item_title);
     //   item.appendChild(item_artist);

      //  item.appendChild(item_delete);
        return item;
    }

    function changeToSong(index,isPaused)
    {
        var item=$(".SongListContainer .SongListItem .SongListItem_play[index="+index+"]");
        $(".SongListContainer .SongListItem .SongListItem_play").removeAttr("isPlaying");
        $(".SongListContainer .SongListItem .fa-pause").removeClass("fa-pause").addClass("fa-play");
        if(isPaused)
        {
            item.removeClass("fa-play").addClass("fa-pause");
            item.attr("isPlaying","playing");
        }
        else
        {
            item.removeClass("fa-pause").addClass("fa-play");
            item.attr("isPlaying","paused");
        }
    }

     var songlist=null;
    function createSongList(songList)
    {
        songlist=createDivBlock("SongListContainer");
        songlist.appendChild(createDivBlock("SongListContainer_toper"));
        for(var i in songList)
            songlist.appendChild(createSongListItem(parseInt(i)+1,songList[i]));
        return songlist;
    }

    function updateSonglist(songList)
    {
        if(!songlist)return;
        var cur_length=$(songlist).children().length;
        if(songList==undefined||songList.length<=cur_length)return;
        for(i in songList)
            if(i>=cur_length)
            {
                var item=createSongListItem(parseInt(i)+1,songList[i]);
                $(item).children(".SongListItem_play").click(function(){
                    listItemPlayFunction(this);
                });

                songlist.appendChild(item);
            }
    }


    player.addEvent("songlist_btn_click",function(){
        if(!songListBar.getContentStatus())
        songListBar.setContent(createSongList(musicInfoFetcher.getCurrentList()),function(){
            $(".SongListContainer .SongListItem .SongListItem_play").click(function(){listItemPlayFunction(this);});
            $(songlist).mousewheel(function(event){
               var toper= $(this).children(".SongListContainer_toper");
                var cur_margin=parseInt(toper.css("margin-top"));
                if(event.deltaY==1)//上滚
                {
                    if(cur_margin>0){
                        cur_margin=0;
                        toper.css("margin-top","0px");
                    }
                    if(cur_margin==0)return;
                    toper.css("margin-top",(cur_margin+9)+"px");
                }
                else if(event.deltaY==-1)//下滚
                {
                    var tempChildren=$(this).children(":gt(0)");
                    var songitem_sum=tempChildren.length;

                    console.log(($(this).height()-cur_margin)+":"+(tempChildren.eq(0).height()+10)*songitem_sum);
                    if(($(this).height()-cur_margin)>(tempChildren.eq(0).height()+10)*songitem_sum+80)return;
                    toper .css("margin-top",(cur_margin-9)+"px");
                }


            });
            changeToSong(musicInfoFetcher.getCurrentIndex(),audioPlayer.isPaused());
            songListBar.ShowOrHide();
        });
        songListBar.ShowOrHide();
    });
    var cur_img_index=1;
    player.addEvent("changebkg_btn_click",function(){
        var index;
        while((index=Math.floor(Math.random() * 13)+1)==cur_img_index);
        cur_img_index=index;
        var url="http://7xirg3.com1.z0.glb.clouddn.com/"+index+".jpg"
        player.changeBkg(url);
    });

    player.addEvent("playOrPauseCallback",function(){
        changeToSong(musicInfoFetcher.getCurrentIndex(),audioPlayer.isPaused());
        updateSonglist(musicInfoFetcher.getCurrentList());
    });


    player.setSetMusicCallBack(function(data){
        user.saveCookie(data);
        //通知列表改变

    }); //每播放一次下一曲啥的，就存入本地cookie
    player.setResizeCallback(function(){
       var height=$(document.body).height();
        if(height>songListBar.getHeight())songListBar.setHeight(height);
    });  //当窗口大小改变时


    player.initi("MyPlayer");

});