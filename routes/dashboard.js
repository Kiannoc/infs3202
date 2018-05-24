var validator = require('validator');
var userID;

exports.dashboard = function(req, res, next){
    //console.log(req.session.userId);

    if(req.method == "GET") {
      var user =  req.session.user
      userID = req.session.userId;
      if(userID == null){
        res.redirect('/login');
      }
    }
   //Query for friends data
    var sqlFriendInfo="SELECT users.id AS id, users.fname as fname, users.lname AS lname FROM users JOIN friends ON users.id = friends.userB WHERE friends.userA=" +userID;
    db.query(sqlFriendInfo, function(err, results) {
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
};


//-----------SHOUT FORM PROCESSING -----------//
exports.shout = function(req, res, next){
  userID = req.session.userId;
  errmessage = '';

  // Collect field form data
  var post  = req.body;
  toProcess = [
    receiver = post.receiver,
    amount = post.amount,
    percentage = post.percentage,
    description = post.description
  ];

  // trim field form data
  for(i = 0; i < toProcess.length; i++) {
    toProcess[i] = toProcess[i].trim();
    //toProcess[i] = toProcess[i].toLowerCase();
  }

  //LOGIC: booleans - field form data is valid
  var receiverValid = validator.isLength(receiver, {min: 1})
                  && validator.isAlpha(receiver);
  var amountValid = validator.isLength(amount, {min: 1})
                && validator.isNumeric(amount)
                && (validator.isFloat(amount, {min: 0.01})
                    || validator.isInt(amount, {min: 0}));
  var percentageValid = validator.isLength(percentage, {min: 1})
                    && validator.isNumeric(percentage)
                    && (validator.isFloat(percentage, {min: 0.01, max: 100.00})
                        || validator.isInt(percentage, {min: 1, max: 100}));
  var descriptionValid = validator.isLength(description, {min: 3})
                    && validator.isAlpha(description);
  //all fields
  var fieldsValid = receiverValid && amountValid && percentageValid
                    && descriptionValid;

  // Check if all entered fields are valid
  if(fieldsValid) {
    // check if receiver is a friend
    // Query: Match user and Receiver as Friends by ID
    var sqlConfirmedReceiever = "SELECT userB FROM `friends` WHERE `userA` =  '" + userID +"' AND `userB` = (SELECT id FROM users WHERE `fname`='" + receiver + "')";
    db.query(sqlConfirmedReceiever, function(err, receiverID){
      //check if the receiever is confirmed to have a friend with receiverID
      if(!err && receiverID) {
        //Insert new shout from data
        var sqlInsertShout = "INSERT INTO `shout`(`buyer`,`description`,`price`,`date`) VALUES ('" + userID + "','" + description + "','" + amount + "', CURDATE())";
        db.query(sqlInsertShout, function(err, results) {
          if(!err) {
            //Get shout ID
            var sqlGetShoutId = "SELECT shoutID FROM `shout` WHERE `buyer`= '" + userID + "' AND `description` = '" + description + "' AND `price` = '" + amount + "' AND `date`= CURDATE()";
            db.query(sqlGetShoutId, function(err, shoutID) {
              if(!err) {
                //Insert shout receivement
                var sqlInsertReceivesShout = "INSERT INTO `receiveshout`(`shoutID`, `receiver`, `percentage`) VALUES ('" + shoutID + "','" + receiverID + "','" + percentage + "')";
                db.query(sqlInsertReceivesShout, function(err, results) {
                  if(!err) {
                    //res.redirect('/logout')
                    res.redirect('/dashboard');
                  } else {
                    //Error inserting shout receievment
                    //res.redirect('/dashboard');
                    res.redirect('/logout')
                  }
                });
              } else {
                //Error getting shout ID
                res.redirect('/logout')
              }
            });
          } else {
            //Error inserting shout from data
            res.redirect('/logout')
          }
          });
      } else {
        //Error checking if reciever is friend
        res.redirect('/logout')
      }
    });
  }
};





//----IGNORE FOR NOW ---///
//--------HELPER FUNCTIONS --------//
function friendList(userID, res) {
    var userA = userID;

    //Query for for friends userID's of specified User
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
