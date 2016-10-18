var duoshuoQuery, duoshuoQueryRun;

duoshuoQuery = {
    short_name: "writeyoursmile"
};

duoshuoQueryRun = function () {
    var ds, protocol;
    ds = document.createElement('script');
    ds.type = 'text/javascript';
    ds.async = true;
    protocol = 'http:';
    if (document.location.protocol === 'https:') {
        protocol = 'https:';
    }
    ds.src = protocol + '//static.duoshuo.com/embed.js';
    ds.charset = 'UTF-8';
    return (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
};

duoshuoQueryRun();
