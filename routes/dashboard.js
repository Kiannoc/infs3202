var validator = require('validator');

exports.dashboard = function(req, res, next){
    //console.log(req.session.userId);

    if(req.method == "GET") {
      var user =  req.session.user
      userID = req.session.userId;
      if(userID == null){
        res.redirect('/login');
      }
    }
    if(userID != null){
      console.log(userID);
   //Query for friends data
    var sqlFriendInfo="SELECT users.id AS id, users.fname as fname, users.lname AS lname FROM users JOIN friends ON users.id = friends.userB WHERE friends.userA=" +userID;
    db.query(sqlFriendInfo, function(err, results) {
        var friends = results;

        /* SHOUTS DATA WITH NAMES
        //Query for shouts data
        var sqlShoutsTable="SELECT `shout`.`date`, buys.`buyer`, `shout`.`description`, `shout`.`percentage`, receives.`receiver`, `shout`.`price` "
           +"FROM (SELECT `shout`.`shoutID` as buyerShoutID, `users`.`fname` AS buyer FROM `users`, `shout` WHERE `shout`.`buyer`=`users`.`id`)as buys,"
           +"(SELECT `shout`.`shoutID` as receivesShoutID, `users`.`fname` AS receiver FROM `users`, `shout` WHERE `shout`.`receiver`=`users`.`id`)  as receives,"
           +"`shout`"
           +"WHERE receives.receivesShoutID = buys.buyerShoutID";
        db.query(sqlShoutsTable, function(err, results) {
          var date = results;
          var shouts = {date:date};
          */

        //Query for shouts data
        var sqlShoutInfo = "SELECT * FROM shout WHERE buyer =" + userID + " OR receiver =" +userID;
        db.query(sqlShoutInfo, function(err, results){
        var shouts = results;
        console.log(shouts);

          //Query for amount owed
          var sqlOwed = "SELECT SUM(price) AS totalOwed FROM shout WHERE buyer =" + userID + " AND paid = 0";
          db.query(sqlOwed, function(err, results){
            var owed = results;

              //Query for amount owing
            var sqlOwing = "SELECT SUM(price) AS totalOwing FROM shout WHERE receiver =" + userID;
            db.query(sqlOwing, function(err, results){
              var owing = results;
              var balance = (owed[0].totalOwed - owing[0].totalOwing).toFixed(2);

                //Query for users info
                var sql="SELECT * FROM `users` WHERE `id`='"+userID+"'";
                db.query(sql, function(err, results){
                    res.render('dashboard.ejs', {user:results, friends:friends, shouts:shouts, owed, owing, balance});
                });
              });
            });
        });
    });
  }
};


//-----------SHOUT FORM PROCESSING -----------//
exports.shout = function(req, res){
  userID = req.session.userId;
  if(req.method != "POST"){
    //errmessage = '';

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
      toProcess[i] = toProcess[i].toLowerCase();
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
                      && validator.isAlphanumeric(description);
    //all fields
    var fieldsValid = receiverValid && amountValid && percentageValid
                      && descriptionValid;

    // Check if all entered fields are valid
    if(fieldsValid) {
      errmessage = '';
      // check if receiver is a friend
      // Query: Match user and Receiver as Friends by ID
      var sqlConfirmedReceiever = "SELECT userB FROM `friends` WHERE `userA` =  '" + userID +"' AND `userB` = (SELECT id FROM users WHERE `fname`='" + receiver + "')";
      db.query(sqlConfirmedReceiever, function(err, receiverID){
        //check if the receiever is confirmed to have a friend with receiverID
        if(!err && receiverID) {
          //Insert new shout from data
          var sqlInsertShout = "INSERT INTO `shout`(`buyer`, `receiver`,`description`,`price`, `percentage`,`date`) VALUES ('" + userID + "', '" + receiverID + "','" + description + "','" + amount + "', '" + percentage + "', CURDATE())";
          db.query(sqlInsertShout, function(err, results) {
            if(!err) {
              res.redirect('/dashboard');
            } else {
              res.render('dashboard.ejs',{errmessage: "ERROR"});
            }
          });
        }
      });
    } else {
      res.render('dashboard.ejs',{errmessage: "ERROR"});
      /*Field data not valid, Return message on which form field caused error
      errorMessages = [
        recInv = "Receiver is not a valid selection.";
        amtInv = "Amount is not a valid selection.";
        percInv = "Percentage is not a valid selection.";
        descInv = "Description is not a valid selection (Minimum 3 characters).";
      ];
      var msgErrorCheckPair = {
        recInv: receiverValid,
        amtInv: amountValid,
        percInv: percentageValid,
        descInv: descriptionValid
      };
      for (i = 0; i < errorMessages.length; i++) {
        msg = errorMessages[i];
        if(msgErrorCheckPair.msg) {
          res.render('dashboard.ejs',{errmessage: msg});
          //exit loop
          i = errorMessages.length;

        }
      }
      */
    }
  } else {
    //If request is not POST
   res.render('dashboard.ejs',{errmessage: errmessage});
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
