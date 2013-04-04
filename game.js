Game = {
  maxRange: 97,
  commission: 0.02,
  reward: function(bet, range_min, range_max, lucky_number){
    if (lucky_number < range_min || lucky_number > range_max) return 0;
    
    return (1- this.commission) * bet * 100 / (range_max - range_min +1);
  }
}
