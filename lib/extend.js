var extend =  function(props,static_props){
  var parent = this;
  var child;

  child = function(){
    parent.apply(this,arguments);
  };

  $.extend(child,parent,static_props)

  // using surrogate object to set child's prototype chain to inherit from parent
  var F = function(){ this.constructor = child; };
  F.prototype = parent.prototype;
  child.prototype = new F;
  $.extend(child.prototype,props)

  child.__super__ = parent.prototype;

  return child;
}


