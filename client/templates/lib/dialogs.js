_.extend(TemplateHelpers, {
  removeDialog: function(opts, callback){
    var node = opts.tmpl.firstNode;
  
    var fadeOut = (typeof opts.fadeOut === 'undefined') ? true : opts.fadeOut;

    if (fadeOut) $(node).addClass("fade-out");

    setTimeout(function(){
      Spark.finalize(node);
      $(node).remove();

      callback && callback();
    }, 300); // fade out is 0.3s
  },
});
