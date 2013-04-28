
// returns an int in the range of 1-100
// THIS BLOCKS ON IO 

if (Meteor.isServer) {

  Meteor.methods({

    getRandInt: function () {
      var crypto = Npm.require("crypto");
      var found_int = false;
      while (!found_int) {
        var random_byte = crypto.randomBytes(1);
        var random_hex = random_byte.toString('hex');
        var random_int = parseInt(random_hex, 16);
        if (random_int >= 0 && random_int <= 100) { 
          found_int = true; 
        };
      }
      return random_int
    }

  });

}