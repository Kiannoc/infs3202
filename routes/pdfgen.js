var pdf = require('pdfkit');
var fs = require('fs');

exports.pdfgen = function(req, res, next){
name = req.session.user.fname;
var doc = new pdf;

doc.pipe(fs.createWriteStream('public/pdf/' + name + '.pdf'));

doc.font('Times-Roman').fontSize(48).text(name + 'PDF Example', 100, 100);

doc.end();
res.redirect('/dashboard');  
}