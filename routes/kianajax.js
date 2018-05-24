exports.kianajax = function(req, res, next){
    //console.log(req.session.userId);
   var user =  req.session.user
   userID = req.session.userId;

   //Quuery for friends data
    var sqlFriendInfo="SELECT users.id AS id, users.fname as fname, users.lname AS lname FROM users JOIN friends ON users.id = friends.userB WHERE friends.userA=" +userID;
    db.query(sqlFriendInfo, function(err, results){
        var friends = results;
        console.log(friends);
        res.send({friends:friends});
    });
};