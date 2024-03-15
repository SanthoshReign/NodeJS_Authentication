const User = require('../models/user')
const passport = require('passport')
const loggedIn = require('../middleware/guest');

function authController() {
    return {
        // ************************************  SIGN IN SETUP  *********************************//
        signin(req, res) {
            res.render('auth/signin');
        },

        postSignin(req, res, next) {
            const { username, password } = req.body
            // Validate request 
            if (!username || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/signin')

            }

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/signin')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    
                    return res.redirect('/home');
                })
            })(req, res, next)       
              
        },

        home(req, res) {
            res.render('auth/home')
        },
// ******************************************   SIGNUP SETUP  ********************************//
        signup(req, res) {
            res.render('auth/signup')
        },
        postSignup(req, res) {
            const { name, username, password } = req.body
            console.log(req.body);
            if (!name || !username || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('username', username)
                return res.redirect('/');
            }
            // Check if email exists 
            User.exists({ username: username }, (err, result) => {
                if (result) {
                    req.flash('error', 'User with the email already exist')
                    req.flash('name', name)
                    req.flash('username', username)
                    return res.redirect('/');
                }
            })
            User.register({
                name: name,
                username: username
            }, password, function (err) {
                
                 if(err){
                    return req.flash('error', 'Something went wrong');
                 }
                 req.flash('success', 'User Registered Successfully');
                return res.redirect('/signin');
            });

        },

        // *****************************************   RESET PASSWORD SETUP  *************************//
        reset(req, res) {
            res.render('auth/reset')
        },

        resetPassword(req, res) {
            const {username, oldpassword, newpassword} = req.body;
            User.findByUsername(username, (err, user) => {
                if (err) {
                    req.flash('error', 'Invalid Credentials')
                } else {
                    user.changePassword(oldpassword,
                        newpassword, function (err) {
                            if (err) {
                                return res.redirect('/reset');
                            } else {
                                req.flash('success', 'Password Updated Successfully');
                                return res.redirect('/signin')
                            }
                        });
                }
            });
        },
        // ************************************   LOGOUT   ********************************//
        logout(req, res, next) {
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'User Logged out Successfully')
                return res.redirect('/')
            });

        }


    }
}
module.exports = authController