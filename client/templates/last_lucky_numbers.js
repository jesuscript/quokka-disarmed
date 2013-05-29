Template.lastLuckyNumbers.helpers({
  luckyNumbers: function(){
    var numbers = [];

    for(var i=0; i<100; i++){
      numbers.push(_.random(1,100));
    }
    
    return numbers;
  } 
});
