exports.kianajax = function(req, res){
    //console.log(req.session.userId);
   var user =  req.session.user
   var friend = req.query.q;
   userID = req.session.userId;

   //Quuery for shouts between specified friend
   var sqlShoutInfo = "SELECT * FROM shout WHERE (buyer =" + friend + " OR receiver =" +friend +") AND (buyer =" + userID + " OR receiver =" +userID+")";
   db.query(sqlShoutInfo, function(err, results){
       
        res.json(results);
    });
};