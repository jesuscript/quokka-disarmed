Meteor.call('getRandInt', function(err, data) {
    if (err)  console.log(err);
    console.log(data);
}); 

