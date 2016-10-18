var duoshuoQuery, duoshuoQueryRun;

duoshuoQuery = {
  short_name: "writeyoursmile"
};

duoshuoQueryRun = function() {
  var ds, ref;
  ds = document.createElement('script');
  ds.type = 'text/javascript';
  ds.async = true;
  ds.src = ((ref = document.location.protocol === 'https:') != null ? ref : {
    'https:': 'http:'
  }) + '//static.duoshuo.com/embed.js';
  ds.charset = 'UTF-8';
  return (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
};

duoshuoQueryRun();
