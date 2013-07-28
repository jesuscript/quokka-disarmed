// creates btcd connection object
// TODO: currently pointing at testnet connection details
btcdClient = new BITCOIN.Client({ //none of this is accessible from outside the local machine
  host: 'localhost',
  port: process.env.BTCD_PORT, 
  user: process.env.BTCD_USER,
  pass: process.env.BTCD_PASS
});

Meteor.startup(function(){
  //   Collections.Connections.remove({});

  if(! DB.currentGame()){ 
    Collections.Games.insert({
      completed: false,
      createdAt: (new Date()).getTime()
    });
  }
});
