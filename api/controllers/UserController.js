/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var validator = require('validator');
var nodemailer = require('nodemailer');
var crypto = require("crypto");
var transporter = nodemailer.createTransport({
  service: sails.config.common.supportEmailIdService,
  auth: {
    user: sails.config.common.supportEmailId,
    pass: sails.config.common.supportEmailIdpass
  }
});
var projectURL = sails.config.common.projectURL;

module.exports = {
	createNewUser: function(req, res) {
		console.log("Enter into createNewUser :: " + req.body.email);
		var useremailaddress = req.body.email;
		var userpassword = req.body.password;
		var userconfirmPassword = req.body.confirmPassword;
		if (!validator.isEmail(useremailaddress)) {
			return res.json({
				"message": "Please Enter valid email id",
				statusCode: 400
			});
		}
		if (!useremailaddress || !userpassword || !userconfirmPassword) {
			console.log("User Entered invalid parameter ");
			return res.json({
				"message": "Can't be empty!!!",
				statusCode: 400
			});
		}
		if (userpassword !== userconfirmPassword) {
			console.log("Password and confirmPassword doesn\'t match!");
			return res.json({
				"message": 'Password and confirmPassword doesn\'t match!',
				statusCode: 400
			});
		}
		User.findOne({
			email: useremailaddress
		}, function(err, user) {
			if (err) {
				console.log("Error to find user from database");
				return res.json({
					"message": "Error to find User",
					statusCode: 400
				});
			}
			if (user && !user.verifyEmail) {
				console.log("Use email exit But but not verified ");
				return res.json({
					"message": 'Email already exit but not varifed please login and verify',
					statusCode: 400
				});
			}
			if (user) {
				console.log("Use email exit and return ");
				return res.json({
					"message": 'email already exist',
					statusCode: 400
				});
			}
			if (!user) {

				var userObj = {
					email: useremailaddress,
					password: userpassword
				}
				User.create(userObj).exec(function(err, userAddDetails) {
					if (err) {
						console.log("Error to Create New user !!!");
						console.log(err);
						return res.json({
							"message": "Error to create New User",
							statusCode: 400
						});
					}
					console.log("User Create Succesfully...........");

					 var otpForEmail = crypto.randomBytes(20).toString('hex');
           var verificationURL = projectURL + "/user/verifyEmailAddress?email=" + useremailaddress + "&otp=" + otpForEmail;
					var mailOptions = {
						from: sails.config.common.supportEmailId,
						to: useremailaddress,
						subject: 'Please verify email !!!',
						html: `
						<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
						<html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
						<head>
							<meta name="viewport" content="width=device-width" />
							<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
							<title>Actionable emails e.g. reset password</title>


							<style type="text/css">
								img {
									max-width: 100%;
								}

								body {
									-webkit-font-smoothing: antialiased;
									-webkit-text-size-adjust: none;
									width: 100% !important;
									height: 100%;
									line-height: 1.6em;
								}

								body {
									background-color: #f6f6f6;
								}

								@media only screen and (max-width: 640px) {
									body {
										padding: 0 !important;
									}
									h1 {
										font-weight: 800 !important;
										margin: 20px 0 5px !important;
									}
									h2 {
										font-weight: 800 !important;
										margin: 20px 0 5px !important;
									}
									h3 {
										font-weight: 800 !important;
										margin: 20px 0 5px !important;
									}
									h4 {
										font-weight: 800 !important;
										margin: 20px 0 5px !important;
									}
									h1 {
										font-size: 22px !important;
									}
									h2 {
										font-size: 18px !important;
									}
									h3 {
										font-size: 16px !important;
									}
									.container {
										padding: 0 !important;
										width: 100% !important;
									}
									.content {
										padding: 0 !important;
									}
									.content-wrap {
										padding: 10px !important;
									}
									.invoice {
										width: 100% !important;
									}
								}
							</style>
						</head>

						<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
							bgcolor="#f6f6f6">

							<table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
								<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
									<td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
									<td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
										valign="top">
										<div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
											<table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
												bgcolor="#fff">
												<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
													<td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
														<meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
														<table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
															<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">

																</td>
															</tr>
															<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																	Dear user,
																</td>
															</tr>
															<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																	Thank you for signing up with us. Please follow this link to verify your Email.
																</td>
															</tr>
															<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																	Verify Email address
																</td>
															</tr>


															<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"
																	valign="top">
																	<a href=${verificationURL} class="btn-primary" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Confirm email address</a>
																</td>
															</tr>
															<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																	Kind Regards,
																</td>
															</tr>
															<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																	The ICO Team
																</td>
															</tr>

														</table>
													</td>
												</tr>
											</table>
											<div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
												<table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
													<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
														<td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center"
															valign="top">Follow <a href="http://twitter.com/ico" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@Mail_Gun</a> on Twitter.</td>
													</tr>
												</table>
											</div>
										</div>
									</td>
									<td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
								</tr>
							</table>
						</body>

						</html>`
					};
					transporter.sendMail(mailOptions, function(error, info) {
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
							return res.json(200, {
								"message": "We sent link on your email address please verify link!!!",
								"userMailId": useremailaddress,
								statusCode: 200
							});
						}
					});
				});
			}
		});
	},
  authentcate: function(req, res) {
    console.log("Enter into authentcate!!!" + req.body.email);
    var useremail = req.param('email');
    var password = req.param('password');
    //var ip = req.param('ip');
    var ip = "192.168.0.1";
    if (!useremail || !password || !ip) {
      console.log("email and password required");
      return res.json({
        "message": "Can't be empty!!!",
        statusCode: 401
      });
    }
    console.log("Finding user....");
    User.findOne({
        email: useremail
      })
      .populateAll()
      .exec(function(err, user) {
        if (err) {
          return res.json({
            "message": "Error to find user",
            statusCode: 401
          });
        }
        if (!user) {
          return res.json({
            "message": "Please enter registered email!",
            statusCode: 401
          });
        }
        if (!user.verifyEmail) {
          return res.json({
            "message": "We already sent email verification link please verify your email !!",
            statusCode: 401
          });
        }
        console.log("Compare passs");
        User.comparePassword(password, user, function(err, valid) {
          if (err) {
            console.log("Error to compare password");
            return res.json({
              "message": "Error to compare password",
              statusCode: 401
            });
          }
          if (!valid) {
            return res.json({
              "message": "Please enter correct password",
              statusCode: 401
            });
          } else {
            console.log("User is valid return user details !!!");
            res.json({
              user: user,
              statusCode: 200,
              token: jwToken.issue({
                id: user.id
              })
            });
          }
        });
      });
  },
  verifyEmailAddress: function(req, res, next) {
    console.log("Enter into verifyEmailAddress");
    var userMailId = req.param('email');
    var otp = req.param('otp');
    if (!userMailId || !otp) {
      console.log("Can't be empty!!! by user.....");
      return res.json({
        "message": "Can't be empty!!!",
        statusCode: 400
      });
    }
    User.findOne({
      email: userMailId
    }).exec(function(err, user) {
      if (err) {
        return res.json({
          "message": "Error to find user",
          statusCode: 401
        });
      }
      if (!user) {
        return res.json({
          "message": "Invalid email!",
          statusCode: 401
        });
      }
      if (user.verifyEmail) {
        return res.redirect('http://ico.com/loginnew.php');
        // return res.json({
        //   "message": "Email already verified !!",
        //   statusCode: 401
        // });
      }
      User.compareEmailVerificationOTP(otp, user, function(err, valid) {
        if (err) {
          console.log("Error to compare otp");
          return res.json({
            "message": "Error to compare otp",
            statusCode: 401
          });
        }
        if (!valid) {
          return res.json({
            "message": "OTP is incorrect!!",
            statusCode: 401
          });
        } else {
          console.log("OTP is verified successfully");
          User.update({
              email: userMailId
            }, {
              verifyEmail: true
            })
            .exec(function(err, updatedUser) {
              if (err) {
                return res.json({
                  "message": "Error to update passoword!",
                  statusCode: 401
                });
              }
              console.log("Update passoword successfully!!!");
              return res.redirect('http://ico.com/loginnew.php');
              // res.json(200, {
              //   "message": "Email verified successfully",
              //   "userMailId": userMailId,
              //   statusCode: 200
              // });
            });
        }
      });
    });
  }
};
