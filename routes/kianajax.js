exports.kianajax = function(req, res){
    //console.log(req.session.userId);
   var user =  req.session.user
   var friend = req.query.q;
   userID = req.session.userId;
   console.log(friend);

   //Quuery for friends data
    var sqlFriendInfo="SELECT users.id AS id, users.fname as fname, users.lname AS lname FROM users JOIN friends ON users.id = friends.userB WHERE friends.userA=" +userID;
    db.query(sqlFriendInfo, function(err, results){
        var friends = results;
        console.log(friends);
        res.json(friends);
    });
};