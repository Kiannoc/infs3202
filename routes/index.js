/*
* GET home page.
*/
 
exports.index = function(req, res){
  var userID = req.session.userId;
  if(userID != null){
    res.redirect('/dashboard');
  }
    var errmessage = '';
  res.render('index',{errmessage: errmessage});
 
};