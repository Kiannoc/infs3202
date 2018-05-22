/*
* GET home page.
*/
 
exports.index = function(req, res){
    var errmessage = '';
  res.render('index',{errmessage: errmessage});
 
};