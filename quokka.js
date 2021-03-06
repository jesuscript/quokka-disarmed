/*global Quokka, Class, _ */

Quokka = Class.extend({
  init: function(bets, commissionRate){
    this.bets(bets || []);
    this.commissionRate = commissionRate || 0;
  },

  bets: function(bets){
    if(bets){
      // a bit duped based on the server check found in betting.js, but can't hurt
      _.each(bets, function(bet){
        if(bet.amount <= 0 || (!isValidInt(bet.amount))){
          throw new Error("Bet amount is not an int or is less or equal to 0: " + bet.amount);
        }
        if((bet.rangeMin <= 0) || (bet.rangeMin > bet.rangeMax) || (bet.rangeMax > 100) ||
           (!isValidInt(bet.rangeMin)) || (!isValidInt(bet.rangeMax))){
          throw new Error("Bet range values are incorrect: " + bet.rangeMin + " " + bet.rangeMax);
        }
      });
      this._bets = bets;
      this._betsPerNum = this._getBetsPerNum();
      this._stakeSumsPerNum = this._getStakeSumsPerNum();
      return this;
    }else{
      return this._bets;
    }
  },


  computeResults: function(luckyNum){
    var bank = this.getBank() - this._computeCommissionTotal();
    var rewards = this._computeRewards(luckyNum, bank);
    var leftover = this._getLeftover(bank, rewards);
    var compensations = this._computeCompensations(leftover, bank);
    
    return this.mergePayouts(rewards, compensations);
  },


  getBank: function(){
    return Math.round(
      _.reduce(this._bets, function(memo, bet){
        return memo + bet.amount;
      }, 0)
    );
  },


  mergePayouts: function(payout1, payout2){
    var payouts = {};
    var keys = _.union(_.keys(payout1), _.keys(payout2));
    
    _.each(keys, function(key){
      payouts[key] = (payout1[key] || 0) + (payout2[key] || 0);
    },this);

    return payouts;
  },


  getBetStats: function(playerId){
    var stake = _.find(this._bets, function(bet){ return bet.playerId === playerId; }).amount;
    var payout, toWin;
    var stats = {
      maxToWin: 0,
      maxToLose: 0,
      chanceToWin: 0
    };
    for(var i=1; i<=100; i++){
      payout = this.computeResults(i)[playerId] || 0;
      if((toWin = payout - stake) > stats.maxToWin) stats.maxToWin = toWin;
      if(stake - payout > stats.maxToLose) stats.maxToLose = stake - payout;
      if(payout > stake) stats.chanceToWin++;
    }

    return stats;
  },

  _getBetsPerNum: function(){
    var betsPerNum = [];
    for(var i=1; i<=100; i++){
      betsPerNum[i] = _.filter(this._bets, function(bet){
        return (bet.rangeMin <= i && bet.rangeMax >= i);
      });
    }

    return betsPerNum;
  },

  _getStakeSumsPerNum: function(){
    return _.map(this._betsPerNum, function(bets, i){
      if(i === 0) return undefined;
      
      return _.reduce(bets, function(memo, bet){
        return memo + bet.amount / (bet.rangeMax - bet.rangeMin + 1);
      }, 0);
    });
  },

  _getLeftover: function(bank, rewards){
    return bank - _.reduce(rewards, function(memo, reward){return memo + reward; },0);
  },

  _computeRewards: function(luckyNum, bank){
    var rewards = {};
    var stakeSumForLuckyNum = this._stakeSumsPerNum[luckyNum];
    var maxStakeSumPerNum = Math.max.apply(null, this._stakeSumsPerNum.slice(1));

    var totalReward = bank * stakeSumForLuckyNum / maxStakeSumPerNum;

    if(stakeSumForLuckyNum > 0){
      _.each(this._bets, function(bet){
        if(bet.rangeMin <= luckyNum && bet.rangeMax >= luckyNum) {
          var k = bet.amount / ((bet.rangeMax - bet.rangeMin + 1) * stakeSumForLuckyNum);

          rewards[bet.playerId] = Math.floor((rewards[bet.playerId] || 0) + k * totalReward);
        }
        
      },this);
    }

    return rewards;
  },

  _computeCompensations: function(leftover, bank){
    var compensations = {};

    if(leftover > 0){
      if(leftover > bank) throw new Error("Leftover " + leftover + " is greater than bank " + bank);
      
      _.each(this._bets, function(bet){
        var cmpn = Math.floor(leftover * bet.amount * (1-this.commissionRate) / bank);

        //always round down. remaining satoshis go to Quokka Freedom Foundation
        if(cmpn > 0){
          compensations[bet.playerId] = (compensations[bet.playerId] || 0 ) + cmpn;
        }
      },this);
    }

    return compensations;
  },

  _computeCommissionTotal: function(){
    return _.reduce(this._bets, function(memo,bet){
      return memo + Math.floor(bet.amount * this.commissionRate);
    }, 0, this);
  }
});
