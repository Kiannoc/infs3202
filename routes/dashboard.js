var userID;
exports.dashboard = function(req, res, next){
    //console.log(req.session.userId);

    if(req.method == "GET") {
   var user =  req.session.user
   userID = req.session.userId;
   if(userID == null){
       res.redirect('/login');
   }

   //Quuery for friends data
    var sqlFriendInfo="SELECT users.id AS id, users.fname as fname, users.lname AS lname FROM users JOIN friends ON users.id = friends.userB WHERE friends.userA=" +userID;
    db.query(sqlFriendInfo, function(err, results){
        var friends = results;

        //Query for shouts data
        var sqlShoutInfo = "SELECT * FROM shout JOIN receiveshout ON shout.shoutID = receiveshout.shoutID WHERE buyer =" + userID + " OR receiveshout.receiver =" +userID;
        db.query(sqlShoutInfo, function(err, results){
        var shouts = results;
        console.log(shouts);

            //Query for users info
            var sql="SELECT * FROM `users` WHERE `id`='"+userID+"'";
            db.query(sql, function(err, results){
                res.render('dashboard.ejs', {user:results, friends:friends, shouts:shouts});    
            }); 
        });
    });
}
};


//----IGNORE FOR NOW ---///
//--------HELPER FUNCTIONS --------//
function friendList(userID, res) {
    var userA = userID;

    //Query for for friends userId's of specified User
    var sqlFriendId="SELECT userB FROM `friends` WHERE `userA`='"+userA+"'";
    db.query(sqlFriendId, function(err, results){
        results1 = results;
    });

    // //For each friend found, retrieve their information
    // for(i = 0; i < results.length; i++){
    //     console.log("This is for loop log: " + results[i].userB);
        // var sqlFriendInfo="SELECT id, fname, lname FROM `users` WHERE `id`='"+results[i].userB+"'";
        // db.query(sqlFriendInfo, function(err, results){
        //     friends.push(results);
        //     console.log("CHECK: " + friends);
        // });
    // }
    // console.log(friends);
    // }

    //console.log(result1);
}
