exports.kianajax = function(req, res){
    //console.log(req.session.userId);
   var user =  req.session.user
   var friend = req.query.q;
   userID = req.session.userId;
   console.log(friend);

   //Quuery for friends data
   var sqlShoutInfo = "SELECT * FROM shout JOIN receiveshout ON shout.shoutID = receiveshout.shoutID WHERE (buyer =" + friend + " OR receiveshout.receiver =" +friend +") AND (buyer =" + userID + " OR receiveshout.receiver =" +userID+")";
   db.query(sqlShoutInfo, function(err, results){
       console.log(results);
       console.log(userID);
        res.json(results);
    });
};