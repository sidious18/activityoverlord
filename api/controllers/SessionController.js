/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

module.exports = {
	'new' :function(req, res, next){
		res.view('session/new');
	},
	'create' :function(req,res,next){
		if(!req.param('email') || !req.param('password')){
			var userNamePasswordRequiredError = [{name: 'userNamePasswordRequired', message: 'You must enter both a username and password.'}];
			req.session.flash = {
				err:userNamePasswordRequiredError
			}
			res.redirect('/session/new');
			return;
		}
		
		
		User.findOneByEmail(req.param('email'), function foundUser(err, user){
			if (err) return next(err);
			if(!user){
				var noAccountError = [{name:"noAccount", message: 'The email address' + req.param('email')+' not found.'}];
				req.session.flash ={
					err: noAccountError
				}
				res.redirect('/session/new');
				return
			}
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err,valid){
				if(!valid){
					var userPasswordMismatch = [{name:"userPasswordMismatch", message: 'Invalid username and password confirmation'}];
					req.session.flash = {
						err:userPasswordMismatch
					}
					res.redirect('/session/new');
					return;
				}
				req.session.authenticated = true;
				req.session.User = user;

				res.redirect('/user/show/'+user.id);
			});
		});
	},
	'destroy': function(req,res,next){
		req.session.destroy();

		res.redirect('/session/new');
	}
};

