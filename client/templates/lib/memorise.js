TemplateHelpers.memorise = function(funcs){
  var wrapped = {};

  _.each(funcs, function(val, key){
    var last_value;
    
    wrapped[key] = function(){
      last_value = val.apply(this, [last_value].concat(Array.prototype.slice.call(arguments)));
      return last_value;
    }
  });

  return wrapped;
}

/*
var foo = templateHelpers.memorise({
  a: function(last_value){
    if(last_value)  return ++last_value;
    return 1;
  }
});


console.log(foo.a());
console.log(foo.a());
console.log(foo.a());
console.log(foo.a())
*/
