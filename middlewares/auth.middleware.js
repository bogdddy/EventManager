// check if user is logged in
exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/auth/login')
}

// check if user is not authenticated
exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/events')
    }
    
    return next()
}

// check if user is admin
exports.isAdmin = (req, res, next) => {

    if (req.isAuthenticated()){
        if(req.user.user_type == 1) return next();
    }
    
    return res.redirect('/events');
}

// check if user is editor
exports.isEditor = (req, res, next) => {

    if (req.isAuthenticated()){
        if(req.user.user_type == 1 || req.user.user_type == 2) return next();
    }
    
    return res.redirect('/events');
}
