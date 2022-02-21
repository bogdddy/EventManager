const LocalStrategy = require('passport-local').Strategy
const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const sql = require("../models/db");


async function initialize (passport) {

    const authenticateUser = async (mail, password, done) => {
        
        //find user
        const user = await User.findByMail(mail);

        //user not found
        if(user == null){
            return done(null, false, {message: "credencials incorrectes"})
        }

        try {

            // check password
            if (! await bcrypt.compare(password, user.password)) {
                return done(null, false, {message: "credencials incorrectes"})
            } else {
                return done(null, user)
            }

        }catch(e){
            return done(e)
        }

    }

    // serialize and deserialize user
    passport.use(new LocalStrategy({ usernameField: 'mail'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res)=> {
        done(err, res[0])
    })} )
}

module.exports = initialize