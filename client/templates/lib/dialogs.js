_.extend(TemplateHelpers, {
  removeDialog: function(tmpl, callback){
    var node = tmpl.firstNode;

    $(node).addClass("fade-out");
    
    setTimeout(function(){
      Spark.finalize(node);
      $(node).remove();

      callback && callback();
    }, 500);
  },
});
