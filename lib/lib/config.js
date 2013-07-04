if(Meteor.isServer){

  var btcdEnv = process.env.BTCD_ENV || 'testnet';
  process.env.TRX_FEE = 10000;

  switch (process.env.NODE_ENV) {
  case 'development':
    process.env.PROTO = 'http';
    process.env.MAIL_URL = ''; // leave blank so meteor dumps the mail to console
    if (btcdEnv == 'testnet') {
      process.env.BTCD_PORT = '18332';
      process.env.BTCD_USER = 'bitcoinrpc';
      process.env.BTCD_PASS = 'pass';
    } else {
      process.env.BTCD_PORT = '8332';
      process.env.BTCD_USER = 'bitcoinrpc';
      process.env.BTCD_PASS = '3441KQjAyahZueZAP44KNHPNbFDfXLumJiaxeFXCZU1D';
    }
    break;
  case 'production':
    process.env.PROTO = 'https';
    process.env.MAIL_URL = 'smtp://johan.daugh%40gmail.com:nueFnRWLFIRZxwx30WxljA@smtp.mandrillapp.com:587';
    if (btcdEnv == 'testnet') {
      process.env.BTCD_PORT = '18332';
      process.env.BTCD_USER = 'bto_bitcoin_RPC';
      process.env.BTCD_PASS = '9mxP79uTEgzctr4ZYVESK3499pAXGrLibqHZud7BdwFU';
    } else {
      process.env.BTCD_PORT = '8332';
      process.env.BTCD_USER = 'bto_bitcoin_RPC';
      process.env.BTCD_PASS = '9mxP79uTEgzctr4ZYVESK3499pAXGrLibqHZud7BdwFU';
    }
    break;
  }
  
}