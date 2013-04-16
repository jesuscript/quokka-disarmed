Game = {
  maxRange: 99,
  commission: 0.02, // %
  claim: function(bet, range_min, range_max, lucky_number){
    if(lucky_number !== undefined && (lucky_number < range_min || lucky_number > range_max)){
      return 0;
    }
    return bet * 100 / (range_max - range_min + 1);
  },
  rewardable: function(bank, total_claim){
    if (bank < total_claim){
      return bank;
    }

    return total_claim;
  },
  leftover: function(bank, rewardable){
    return bank - rewardable;
  },
  reward: function(claim, rewardable, bank){
    return claim * rewardable / bank;
  },
  compensation: function(stake, sum_lost_stakes, leftover){
    return leftover * stake / sum_lost_stakes;
  }
}
