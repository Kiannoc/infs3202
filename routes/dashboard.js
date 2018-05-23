var userID;
var results1;
var results2 = ["this isn't working"];
exports.dashboard = function(req, res, next){
    //console.log(req.session.userId);
   var user =  req.session.user
   userID = req.session.userId;
   if(userID == null){
       res.redirect('/login');
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userID+"'";
   
//    //Quuery for friends id's
//    var sqlFriendId="SELECT userB FROM `friends` WHERE `userA`='"+userID+"'";
//     db.query(sqlFriendId, function(err, results){
//         results1 = results;
//         console.log(results1);
//     });

//     //For Each id retrieve friend info
//     for(i=0; i < results1.length; i++){
//         var sqlFriendInfo="SELECT id, fname, lname FROM `users` WHERE `id`='"+results1[i].userB+"'";
//         db.query(sqlFriendInfo, function(err, results){
//             results2.push(results);
//         });
//     }
//     console.log(results2);

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:results});    
   });       
};

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