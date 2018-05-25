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

//----- ATTEMPT AT FRIEND SUGGESTION -----//
// exports.friendSuggest = function(req, res){
//     var userID = req.session.userId
//     var input = req.query.q;
//     var suggestion = '';

//     //Query to generate list of friends
//     var sqlFriends = "SELECT users.fname as fname FROM users JOIN friends ON users.id = friends.userB WHERE friends.userA=" +userID;
//     db.query(sqlFriends, function(err, results){
//         if (input !== "") {
//             input = input.toLowerCase();
//             length= input.length;
//             results.forEach(function(element) {
//                 if(substr(element.fname, 0, length);
               
//             });
                
                
//             }
//         });
    
//     }