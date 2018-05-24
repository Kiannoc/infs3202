var validator = require('validator');
var bcrypt = require('bcrypt');

//---------------------------------------------signup page call----------------
exports.signup = function(req, res){
    message = '';
    errmessage = '';
    var salt = bcrypt.genSaltSync(10);
    //IF REQUEST IS POST
    if(req.method == "POST"){
      //Store post fields into variables
      var post  = req.body;
      var emailUsed;

       var toTrim = [
         email= post.email,
         pass= post.password,
         fname= post.first_name,
         lname= post.last_name,
     ];

       for(i = 0; i < toTrim.length; i++) {
         toTrim[i] = toTrim[i].trim();
       }

       /*trim whitespace from fields (possible for loop here)
       fname = fname.trim();
       lname = lname.trim();
       email = email.trim();
       pass = pass.trim();
       */

       //check if form fields are valid//
       if(validator.isEmail(email) &&
          validator.isLength(email, {min: 1}) &&
          validator.isLength(fname, {min: 1}) &&
          validator.isLength(lname, {min: 1}) &&
          validator.isLength(pass, {min: 1}) &&
          validator.isAlpha(fname) &&
          validator.isAlpha(lname)) {

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
            else {
                errmessage = "Email already in use";
                    res.render('signup.ejs',{errmessage: errmessage});
            }
            });

        }
        else {
            errmessage = "Invalid Form Input";
            res.render('signup.ejs', {errmessage:errmessage});
        }



    } else {
        //IF REQUEST IS ANYTHING BUT POST
        var userID = req.session.userId;
        if(userID != null){
            res.redirect('/dashboard');
        }
       res.render('signup');
    }
 };
//-----------------------------------------------login page call---------------
exports.login = function(req, res){
  var errmessage = '';

  if(req.method == "POST"){
     var post  = req.body;
     var email= post.email;
     var pass= post.password;

     //TRIM INPUTS
     email = email.trim();
     pass = pass.trim();


    //Check if there exists a user with specified email
     var sql="SELECT id, fname, lname, email, password FROM `users` WHERE `email`='"+email+"'";
     db.query(sql, function(err, results){
         //if there is a result with specified email
        if(results.length){

            //check password against hash
            if(bcrypt.compareSync(pass, results[0].password)){
              //if they match -> set session variables and redirect to dashboard
              req.session.userId = results[0].id;
              req.session.user = results[0];

              //REMOVE PASSWORD FROM SESSION VARIABLES
              delete req.session.user.password;

              res.redirect('/dashboard');
            }
            else{
                errmessage = 'Incorrect Password';
                res.render('index.ejs', {errmessage: errmessage});
            }
        }
        else{
           errmessage = 'Email not assigned to an Account';
           res.render('index.ejs',{errmessage: errmessage});
        }

     });
  } else {
      //If request is not POST
      var userID = req.session.userId;
      if(userID != null){
          res.redirect('/dashboard');
      }
     res.render('index.ejs',{errmessage: errmessage});
  }

 };
//-----------------------------------------------dashboard page functionality--
exports.dashboard = function(req, res, next){
   //console.log(req.session.userId);
  var user =  req.session.user
  var userID = req.session.userId;
  if(userID == null){
      res.redirect('/login');
  }

  var sql="SELECT * FROM `users` WHERE `id`='"+userID+"'";


  db.query(sql, function(err, results){
     res.render('dashboard.ejs', {user:results});
  });
};
//-----------------------------------------------logout functionality----------
exports.logout=function(req,res){
  req.session.destroy(function(err) {
     res.redirect("/login");
  })
};

//-----------------------------------------------Helper Functions -------------
 function welcomeEmail() {
    console.log("This is being run");
    var mailOptions = {
        from: "Kian Noctor ✔ <kian.noctor@gmail.com>", // sender address
        to: "kian.noctor@hotmail.com", // list of receivers
        subject: "New Account Created", // Subject line
        text: "Hello world ✔", // plaintext body
        html: "<b>Hello world ✔</b>" // html body
    }

    // send mail with defined transport object
    smtp.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
 }
