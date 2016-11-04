/* 
* @Author: Asher
* @Date:   2014-10-25 20:26:57
*/
//音频控制部分，不包括UI
;(function ($) {
    //
    $.AudioPlayer = function (cfg) {

        var m_audio=document.createElement("audio"); //audio元素
        m_audio.setAttribute("type","audio/mp3");
        var DEBUG=false;
        initiCfg(cfg);
        function Log(info)
        {
            if(DEBUG)console.log("AudioPlayer:"+info);
        }

        this.getCfg=function()
        {
            var ret={};
            ret.volume= m_audio.volume;
            return ret;
        }

        function initiCfg(cfg)
        {
            if(!cfg)return;
            if(cfg.volume) m_audio.volume=parseFloat(cfg.volume);
            Log("音量："+m_audio.volume);
        }


        //版本= =
        this.version=function()
        {
            return "AudioPlayer1.0";
        }

        //播放/暂停
        this.playOrPause=function()
        {
            if(!this.isReady())return;
            if(m_audio.paused)
            {
                m_audio.play();
            }
            else
            {
                m_audio.pause();
            }
        }

        //重新从头播放
        this.Restart=function()
        {
            this.stop();
            this.playOrPause();
        }

        //是否是可操作状态
        this.isReady=function()
        {
            return m_audio.currentTime!=null;
        }

        //是否暂停了
        this.isPaused=function()
        {
            return !m_audio.paused;
        }

        //是否结束了
        this.isEnded=function()
        {
            return m_audio.ended;
        }

        //停止
        this.stop=function()
        {
            if(!this.isReady())return;
            m_audio.pause();
            if(m_audio.currentTime)
               m_audio.currentTime = 0;
        }

        //获取当前播放进度的格式化时间
        this.getCurrentPlayTimeFormated=function()
        {
            if(!this.isReady())return "0:00";
            return timeFormat(m_audio.currentTime);
        }

        //获取当前播放时间
        this.getCurrentPlayTime=function()
        {
            if(!this.isReady())return 0;
            return m_audio.currentTime;
        }   

        //设置一首歌曲播放完毕的回调
        this.CallBackWhenEnded=function(callbackFunc)
        {
            m_audio.addEventListener('ended',callbackFunc, false);
        }


        //获得歌曲时间
        this.getTotalTime=function()
        {
            return timeFormat(m_audio.duration);
        }

        //播放指定Url的歌曲
        this.GoToNextMusic=function(songurl)//播放下一曲，当然需要参数
        {
            Log("拉取链接:"+songurl);
            this.stop();
            m_audio.src=songurl;
        }

        //按照百分比设定播放进度
        this.setPlayTimeByPercent=function(time_of_percent)
        {
            if(!this.isReady())return false;
            m_audio.currentTime =time_of_percent*m_audio.duration;
            return true;
        }

        //按百分比获取播放进度
        this.getPlayTimeByPercent=function()
        {
            if(!this.isReady())return false;
            return m_audio.currentTime/m_audio.duration;
        }

        //按照百分比设定音量
        this.setVolumeByPercent=function(vol_percent)
        {
            m_audio.volume=vol_percent;
        }

        //按照百分比获取音量
        this.getVolumeByPercent=function(vol_percent)
        {
             return  m_audio.volume;
        }


        //按照百分比获取缓冲进度
        this.getBufferedTimeByPercent=function()
        {
            if(this.isReady())
            {
                var timeRanges = m_audio.buffered;
                var timeBuffered=0;
                if(timeRanges.length>0)
                    timeBuffered = timeRanges.end(0);
                var bufferPercent = timeBuffered / m_audio.duration; 
                return bufferPercent;
            }
            return 0;
        }

        //私有函数
        function timeFormat(s_time)
        {
            var minute = parseInt(s_time / 60);
            var second = parseInt(s_time % 60);
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;
            return minute + ":" + second;
        }
    };
})(jQuery);