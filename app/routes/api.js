var User = require('../models/user');
var jwt = require('jsonwebtoken');
var tokenSecret = "harrypotter";

module.exports = function(router) {

    // USER Registeration Route

    router.post('/users', function(require, response) {

        // http://localhost:8080/api/uers
        var user = new User();

        user.username = require.body.username;
        user.password = require.body.password;
        user.email = require.body.email;
        user.name = require.body.name;
        user.permission = require.body.permission;

        if (require.body.username == null || require.body.username == '' || require.body.password == null || require.body.password == '' || require.body.email == null || require.body.email == '' || require.body.name == null || require.body.name == '') {
            response.json({
                success: false,
                message: 'Ensure username, email, and password were provided'
            });

        } else {
            user.save(function(err) {
                if (err) {

                    if (err.errors != null) {
                        if (err.errors.name) {
                            response.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else if (err.errors.email) {
                            response.json({
                                success: false,
                                message: err.errors.email.message
                            });
                        } else if (err.errors.username) {
                            response.json({
                                success: false,
                                message: err.errors.username.message
                            });
                        } else if (err.errors.password) {
                            response.json({
                                success: false,
                                message: err.errors.password.message
                            });
                        } else {
                            response.json({
                                success: false,
                                message: err
                            });
                        }
                    } else if (err) {
                        if (err.code == 11000) {

                            if (err.errmsg[61] == "u") {
                                response.json({
                                    success: false,
                                    message: 'The Username already taken'
                                });
                            } else if (err.errmsg[61] == "e") {
                                response.json({
                                    success: false,
                                    message: 'The email already taken'
                                });
                            }

                        } else {
                            response.json({
                                success: false,
                                message: err
                            });
                        }
                    }

                } else {

                    response.json({
                        success: true,
                        message: 'User created'
                    });

                }
            });
        }

    });

    // USER Registeration Route end


    // USER Login Route
    // http://locathost:port/api/authentlcate
    router.post('/authenticate', function(req, res) {

        if (!req.body.username) {
            res.json({
                success: false,
                message: 'Neend user name'
            });
            return
        }

        User.findOne({
            username: req.body.username
        }).select('email username password').exec(function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'Could Not authenticate this user'
                });

                return

            } else if (user) {

                var validPassword = null
                if (req.body.password) {

                    validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({
                        success: false,
                        message: 'No password provided'
                    });

                    return
                }


                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Could Not authenticate password'
                    });

                    return

                } else {

                    var token = jwt.sign({
                            username: user.username,
                            email: user.email
                        },
                        tokenSecret, {
                            expiresIn: '300s'
                        });
                    console.log("token:", token);
                    res.json({
                        success: true,
                        message: 'User authenticated!',
                        token: token
                    });

                    return

                }

            }
        });
    });

    // middleware

    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {

            jwt.verify(token, tokenSecret, function(err, decoded) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })

        } else {
            res.json({
                success: false,
                message: 'No token provided',
            });
        }
    });

    // middleware end

    router.post('/me', function(req, res) {

        res.send(req.decoded);

    })

    router.get('/renewToken/:username', function(req, res) {

        User.findOne({
            username: req.params.username
        }).select().exec(function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'No user was found'
                });
            } else {

                var newToken = jwt.sign({
                        username: user.username,
                        email: user.email
                    },

                    tokenSecret, {
                        expiresIn: '500m'
                    });

                console.log("newToken:", newToken);

                res.json({
                    success: true,
                    message: 'User authenticated!',
                    token: newToken
                });

                return
            }

        });

    })

    router.get('/permission', function(req, res) {

        User.findOne({
            username: req.decoded.username
        }, function(err, user) {

            if (err) throw err;
            if (!user) {

                res.json({
                    success: false,
                    message: 'No user was found',
                });
            } else {

                res.json({
                    success: true,
                    permission: user.permission
                });
            }
        })

    })

    router.get('/management', function(req, res) {

        User.find({}, function(err, users) {

            if (err) throw err;

            User.findOne({
                username: req.decoded.username
            }, function(err, mainUser) {

                if (err) throw err;
                if (!mainUser) {
                    res.json({
                        success: false,
                        message: "No User found",
                    });
                } else {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {

                        if (!users) {
                            res.json({
                                success: false,
                                message: "No User found",
                            });
                        } else {
                            res.json({
                                success: true,
                                users: users,
                                permission: mainUser.permission
                            });
                        }

                    } else {
                        res.json({
                            success: false,
                            message: "Insufficient Permissions",
                        });
                    }
                }
            })

        });
    })

    router.delete('/management/:username', function(req, res) {

        var deletedUser = req.params.username;
        User.findOne({
            username: req.decoded.username
        }, function(err, mainUser) {

            if (err) throw err;

            if (!mainUser) {
                res.json({
                    success: false,
                    message: "No user found ",
                });
            } else {
                if (mainUser.permission !== "admin") {
                    res.json({
                        success: false,
                        message: "Insufficient Permissions ",
                    });
                } else {
                    User.findOneAndRemove({
                        username: deletedUser
                    }, function(err, user) {
                        if (err) throw err;
                        res.json({
                            success: true
                        });
                    });
                }
            }

        })

    })


    router.get('/edit/:id', function(req, res) {

        var editUser = req.params.id;
        User.findOne({
            username: req.decoded.username
        }, function(err, mainUser) {

            if (err) throw err;

            if (!mainUser) {
                res.json({
                    success: false,
                    message: 'No user found'
                });
            } else {
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {

                    User.findOne({
                        _id: editUser
                    }, function(err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({
                                success: false,
                                message: 'No user found'
                            });
                        } else {
                            res.json({
                                success: true,
                                user: user
                            });
                        }
                    })


                } else {
                    res.json({
                        success: false,
                        message: 'Insufficient Permission'
                    });
                }
            }

        })

    })


    router.put('/edit', function(req, res) {
        var editUser = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.name) var newName = req.body.name; // Check if a change to name was requested
        if (req.body.username) var newUsername = req.body.username; // Check if a change to username was requested
        if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
        if (req.body.permission) var newPermission = req.body.permission; // Check if a change to permission was requested
        // Look for logged in user in database to check if have appropriate access
        User.findOne({
            username: req.decoded.username
        }, function(err, mainUser) {
            if (err) throw err; // Throw err if cannot connnect
            // Check if logged in user is found in database
            if (!mainUser) {
                res.json({
                    success: false,
                    message: "no user found"
                }); // Return erro
            } else {
                // Check if a change to name was requested
                if (newName) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user in database
                        User.findOne({
                            _id: editUser
                        }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is in database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'No user found'
                                }); // Return error
                            } else {
                                user.name = newName; // Assign new name to user in database
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        res.json({
                                            success: false,
                                            message: err.message,
                                        }); // Return error
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'Name has been updated!'
                                        }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Insufficient Permissions'
                        }); // Return error
                    }
                }

                // Check if a change to username was requested
                if (newUsername) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user in database
                        User.findOne({
                            _id: editUser
                        }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is in database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'No user found'
                                }); // Return error
                            } else {
                                user.username = newUsername; // Save new username to user in database
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'Username has been updated'
                                        }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Insufficient Permissions'
                        }); // Return error
                    }
                }

                // Check if change to e-mail was requested
                if (newEmail) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user that needs to be editted
                        User.findOne({
                            _id: editUser
                        }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if logged in user is in database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'No user found'
                                }); // Return error
                            } else {
                                user.email = newEmail; // Assign new e-mail to user in databse
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'E-mail has been updated'
                                        }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Insufficient Permissions'
                        }); // Return error
                    }
                }

                // Check if a change to permission was requested
                if (newPermission) {
                    // Check if user making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user to edit in database
                        User.findOne({
                            _id: editUser
                        }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is found in database
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'No user found'
                                }); // Return error
                            } else {
                                // Check if attempting to set the 'user' permission
                                if (newPermission === 'user') {
                                    // Check the current permission is an admin
                                    if (user.permission === 'admin') {
                                        // Check if user making changes has access
                                        if (mainUser.permission !== 'admin') {
                                            res.json({
                                                success: false,
                                                message: 'Insufficient Permissions. You must be an admin to downgrade an admin.'
                                            }); // Return error
                                        } else {
                                            user.permission = newPermission; // Assign new permission to user
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Long error to console
                                                } else {
                                                    res.json({
                                                        success: true,
                                                        message: 'Permissions have been updated!'
                                                    }); // Return success
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission; // Assign new permission to user
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({
                                                    success: true,
                                                    message: 'Permissions have been updated!'
                                                }); // Return success
                                            }
                                        });
                                    }
                                }
                                // Check if attempting to set the 'moderator' permission
                                if (newPermission === 'moderator') {
                                    // Check if the current permission is 'admin'
                                    if (user.permission === 'admin') {
                                        // Check if user making changes has access
                                        if (mainUser.permission !== 'admin') {
                                            res.json({
                                                success: false,
                                                message: 'Insufficient Permissions. You must be an admin to downgrade another admin'
                                            }); // Return error
                                        } else {
                                            user.permission = newPermission; // Assign new permission
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Log error to console
                                                } else {
                                                    res.json({
                                                        success: true,
                                                        message: 'Permissions have been updated!'
                                                    }); // Return success
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission; // Assign new permssion
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({
                                                    success: true,
                                                    message: 'Permissions have been updated!'
                                                }); // Return success
                                            }
                                        });
                                    }
                                }

                                // Check if assigning the 'admin' permission
                                if (newPermission === 'admin') {
                                    // Check if logged in user has access
                                    if (mainUser.permission === 'admin') {
                                        user.permission = newPermission; // Assign new permission
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({
                                                    success: true,
                                                    message: 'Permissions have been updated!'
                                                }); // Return success
                                            }
                                        });
                                    } else {
                                        res.json({
                                            success: false,
                                            message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level'
                                        }); // Return error
                                    }
                                }
                            }
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Insufficient Permissions'
                        }); // Return error

                    }
                }
            }
        });
    });

    // router.put('/edit/', function(req, res) {

    //     var editUser = req.body._id;

    //     if (req.body.name) {
    //         var newName = req.body.name;
    //     }
    //     if (req.body.username) {
    //         var newUsername = req.body.username;
    //     }
    //     if (req.body.email) {
    //         var newEmail = req.body.email;
    //     }
    //     if (req.body.permission) {
    //         var newPermission = req.body.permission;
    //     }

    //     User.findOne({
    //         username: req.decoded.username
    //     }, function(err, mainUser) {

    //         if (err) throw err;

    //         if (!mainUser) {
    //             res.json({
    //                 success: false,
    //                 message: 'No user found'
    //             });
    //         } else {

    //             // For update Name
    //             if (newName) {
    //                 if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {

    //                     User.findOne({
    //                         _id: editUser
    //                     }, function(err, user) {
    //                         if (err) throw err;

    //                         if (!user) {
    //                             res.json({
    //                                 success: false,
    //                                 message: 'No user found'
    //                             });
    //                         } else {

    //                             user.name = newName;
    //                             user.save(function(err) {

    //                                 if (err) {
    //                                     console.log(err);
    //                                 } else {
    //                                     res.json({
    //                                         success: true,
    //                                         message: 'Name has been updated!'
    //                                     });
    //                                 }

    //                             })

    //                             // res.json({
    //                             //     success: true,
    //                             //     user: user
    //                             // });
    //                         }
    //                     })

    //                 } else {
    //                     res.json({
    //                         success: false,
    //                         message: 'Insufficient Permissions'
    //                     });
    //                 }
    //             }
    //             // For update Name end

    //             // For update user Name
    //             if (newUsername) {
    //                 if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {

    //                     User.findOne({
    //                         _id: editUser
    //                     }, function(err, user) {
    //                         if (err) throw err;

    //                         if (!user) {
    //                             res.json({
    //                                 success: false,
    //                                 message: 'No user found'
    //                             });
    //                         } else {

    //                             user.Username = newUsername;
    //                             user.save(function(err) {

    //                                 if (err) {
    //                                     console.log(err);
    //                                 } else {
    //                                     res.json({
    //                                         success: true,
    //                                         message: 'Email has been updated!'
    //                                     });
    //                                 }
    //                             })

    //                             // res.json({
    //                             //     success: true,
    //                             //     user: user
    //                             // });
    //                         }
    //                     })
    //                 } else {
    //                     res.json({
    //                         success: false,
    //                         message: 'Insufficient Permissions'
    //                     });
    //                 }
    //             }
    //             // For update user Name end

    //             // For update email 
    //             if (newEmail) {
    //                 if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {

    //                     User.findOne({
    //                         _id: editUser
    //                     }, function(err, user) {
    //                         if (err) throw err;

    //                         if (!user) {
    //                             res.json({
    //                                 success: false,
    //                                 message: 'No user found'
    //                             });
    //                         } else {

    //                             user.email = newEmail;
    //                             user.save(function(err) {

    //                                 if (err) {
    //                                     console.log(err);
    //                                 } else {
    //                                     res.json({
    //                                         success: true,
    //                                         message: 'Username has been updated!'
    //                                     });
    //                                 }
    //                             })

    //                             // res.json({
    //                             //     success: true,
    //                             //     user: user
    //                             // });
    //                         }
    //                     })
    //                 } else {
    //                     res.json({
    //                         success: false,
    //                         message: 'Insufficient Permissions'
    //                     });
    //                 }
    //             }
    //             // For update email  end


    //             // For update permission 
    //             if (newPermission) {
    //                 if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {

    //                     User.findOne({
    //                         _id: editUser
    //                     }, function(err, user) {
    //                         if (err) throw err;

    //                         if (!user) {
    //                             res.json({
    //                                 success: false,
    //                                 message: 'No user found'
    //                             });
    //                         } else {

    //                             // new permission = user
    //                             if (newPermission === 'user') {
    //                                 if (user.permission === 'admin') {
    //                                     if (mainUser.permision !== 'admin') {
    //                                         res.json({
    //                                             success: false,
    //                                             message: 'Insufficient Permissions. You must be an admin to downgrade anther admin'
    //                                         });
    //                                     } else {
    //                                         user.permission = newPermission;
    //                                         user.save(function(err) {
    //                                             if (err) {
    //                                                 console.log(err);
    //                                             } else {
    //                                                 res.json({
    //                                                     success: true,
    //                                                     message: "Permissions have been updated!"
    //                                                 });
    //                                             }
    //                                         });
    //                                     }
    //                                 }
    //                             } else {

    //                                 user.permission = newPermission;
    //                                 user.save(function(err) {

    //                                     if (err) {
    //                                         console.log(err);
    //                                     } else {
    //                                         res.json({
    //                                             success: true,
    //                                             message: "Permissions have been updated!"
    //                                         });
    //                                     }

    //                                 })

    //                             }
    //                             // new permission = user end


    //                             // new permission = moderator
    //                             if (newPermission === 'moderator') {
    //                                 if (user.permission === 'admin') {
    //                                     if (mainUser.permision !== 'admin') {
    //                                         res.json({
    //                                             success: false,
    //                                             message: 'Insufficient Permissions. You must be an admin to downgrade anther admin'
    //                                         });
    //                                     } else {
    //                                         user.permission = newPermission;
    //                                         user.save(function(err) {
    //                                             if (err) {
    //                                                 console.log(err);
    //                                             } else {
    //                                                 res.json({
    //                                                     success: true,
    //                                                     message: "Permissions have been updated!"
    //                                                 });
    //                                             }
    //                                         });
    //                                     }
    //                                 }
    //                             } else {

    //                                 user.permission = newPermission;
    //                                 user.save(function(err) {

    //                                     if (err) {
    //                                         console.log(err);
    //                                     } else {
    //                                         res.json({
    //                                             success: true,
    //                                             message: "Permissions have been updated!"
    //                                         });
    //                                     }

    //                                 })

    //                             }
    //                             // new permission = moderator end

    //                             // new permission = admin
    //                             if (newPermission === 'admin') {
    //                                 if (user.permission === 'admin') {

    //                                     user.permission = newPermission;
    //                                     user.save(function(err) {
    //                                         if (err) {
    //                                             console.log(err);
    //                                         } else {
    //                                             res.json({
    //                                                 success: true,
    //                                                 message: "Permissions have been updated!"
    //                                             });
    //                                         }
    //                                     });
    //                                 }

    //                             } else {

    //                                 res.json({
    //                                     success: false,
    //                                     message: "Insufficient Permissions. You must be an admin to upgrade someone to the admin level"
    //                                 });

    //                             }

    //                         }
    //                         // new permission = admin end


    //                     })
    //                 }
    //             } else {
    //                 res.json({
    //                     success: false,
    //                     message: 'Insufficient Permissions'
    //                 });
    //             }
    //         }
    //         // For update permission  end
    //     });

    // })



    return router;
}

// var decoded = jwt.verify(token, 'shhhhh');
// console.log(decoded.foo)