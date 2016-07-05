/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new':function(req,res){
		res.view();
	},

	'create':function(req,res,next){
		User.create(req.params.all(), function userCreate(err,user){
			if (err){
				console.log(err);
				req.session.flash ={
					err:err
				}
				return res.redirect('/user/new');	
			} 

			req.session.authenticated = true;
			req.session.User = user;

			res.redirect('/user/show/'+user.id);
		});
	},
	'show':function(req,res,next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if (err) return next(err);
			if (!user) return next();
			console.log(user);
			res.view({
				user:user
			});
		});
	},
	'index':function(req,res, next){
		User.find(function foundUsers(err,users){
			if (err) return next(err);
			res.view({
				users:users
			});
		});
	},
	'destroy':function(req,res,next){
		User.destroy(req.param('id'), function(err){
			if (err) return next(err);
			res.redirect('/user/');
		});
	},
	'edit':function(req,res,next){
		User.findOne(req.param('id'), function findUser (err,user){
			if (err) return next(err);
			if (!user) return next();

			res.view({
				user:user
			});
		});
	},
	'update':function(req,res,next){

		User.update(req.param('id'), req.params.all(), function updateUser(err){
			if (err) {
				req.session.flash ={
					err:err
				};
				return res.redirect('/user/edit/'+req.param('id'));
			}
			res.redirect('user/show/'+req.param('id'));
		});
	}
};

