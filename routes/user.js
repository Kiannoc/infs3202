var validator = require('validator');
var bcrypt = require('bcrypt');

//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
    message = '';
    errmessage = '';
    var salt = bcrypt.genSaltSync(10);
    if(req.method == "POST"){
        //Store post fields into variables
       var post  = req.body;
       var email= post.email;
       var pass= post.password;
       var fname= post.first_name;
       var lname= post.last_name;
       var emailUsed;
        
       //trim whitespace from fields (possible for loop here)
       fname = fname.trim();
       lname = lname.trim();
       email = email.trim();
       pass = pass.trim();

       //check if form fields are valid//
       if(validator.isEmail(email) &&
          validator.isLength(email, {min: 1}) &&
          validator.isLength(fname, {min: 1}) &&
          validator.isLength(lname, {min: 1}) &&
          validator.isLength(pass, {min: 1}) &&
          validator.isAlpha(fname) &&
          validator.isAlpha(lname)) {
           
         //If input is valid
           
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
       res.render('signup');
    }
 };
  
 //-----------------------------------------------login page call------------------------------------------------------
 exports.login = function(req, res){
    var errmessage = '';
    var sess = req.session; 
 
    if(req.method == "POST"){
       var post  = req.body;
       var email= post.email;
       var pass= post.password;

       //trim inputs
       email = email.trim();
       pass = pass.trim();


      
       var sql="SELECT id, fname, lname, email, password FROM `users` WHERE `email`='"+email+"'";                           
       db.query(sql, function(err, results){ 
           //if there is a result with input email     
          if(results.length){

              //check password against hash
              if(bcrypt.compareSync(pass, results[0].password)){
                //if they match -> set session variables and redirect to homescreen
                req.session.userId = results[0].id;
                req.session.user = results[0];
                res.redirect('/home/dashboard');
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
       res.render('index.ejs',{errmessage: errmessage});
    }
            
 };
 //-----------------------------------------------dashboard page functionality----------------------------------------------
            
 exports.dashboard = function(req, res, next){
            
    var user =  req.session.user,
    userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
 
    db.query(sql, function(err, results){
       res.render('dashboard.ejs', {user:user});    
    });       
 };
 //------------------------------------logout functionality----------------------------------------------
 exports.logout=function(req,res){
    req.session.destroy(function(err) {
       res.redirect("/login");
    })
 };
 //--------------------------------render user details after login--------------------------------
 exports.profile = function(req, res){
 
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
    db.query(sql, function(err, result){  
       res.render('dashboard2.ejs',{data:result});
    });
 };
 //---------------------------------edit users details after login----------------------------------
 exports.editprofile=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
    db.query(sql, function(err, results){
       res.render('edit_profile.ejs',{data:results});
    });
 };
 