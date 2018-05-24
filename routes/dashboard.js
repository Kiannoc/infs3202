var validator = require('validator');
var userID;
exports.dashboard = function(req, res, next){
    //console.log(req.session.userId);
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
};

exports.shout = function(req, res, next){
  /* IF ADDING GET METHOD, UNCOMMENT AND ALTER BELOW:
  if(req.method != "POST"){
      errmessage = "Invalid Form Input";
      res.render('signup.ejs', {errmessage:errmessage});
    }
  */

  var post  = req.body;
  toTrim = [
    receiver = post.receiver,
    amount = post.amount,
    percentage = post.percentage,
    description = post.description
  ];

  for(i = 0; i < toTrim.length; i++) {
    toTrim[i] = toTrim[i].trim();
  }

  //LOGIC: check if field form data is valid
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
                    && validator.isAlpha(description));                      
  var fieldsValid = receiverValid && amountValid && percentageValid
                    && descriptionValid;

  // Check if all entered fields are valid
  if(fieldsValid) {
       // check if receiver is a friend
       // since receiver not friend, return error
       // create shout with form data
       //CHECK if email is already in use
       var sqlcheck = "SELECT id, fname, lname, email FROM `users` WHERE `email`='"+email+"'";
       db.query(sqlcheck, function(err, results){
           //if email is in use
           emailUsed = results.length;

       //if email isn't in use, add user to db
       if(emailUsed == 0) {

           //Hash password
           var hash = bcrypt.hashSync(pass, salt);
           var sqlregister = "INSERT INTO `users`(`fname`,`lname`,`email`, `password`) VALUES ('" + fname + "','" + lname + "','" + email + "','" + hash + "')";
           db.query(sqlregister, function(err, results) {
               if(!err){
                   welcomeEmail();
               message = "Succesfully! Your account has been created.";
               res.render('signup.ejs',{message: message});
               }
           });
       }

     }

  // line below doesn't seem necessary
  //res.redirect('/dashboard');
}

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
