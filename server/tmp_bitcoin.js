var client = new BITCOIN.Client({
  host: 'localhost',
  port: 18332,
  user: 'bitcoinrpc',
  pass: 'pass'
});


// client.getInfo(function(err, data) {
//   if (err) return console.log(err);
//   console.log('Info:', data);
// });


// client.getnewaddress(err, data) {
// 	if (err) return console.log(err);
// 	console.log('new address= ' + data)
// }