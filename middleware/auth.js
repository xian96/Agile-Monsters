const authUser = async (req, res, next) => {
   console.log('----- authUser -------')
   console.log(req.session);
   if (!req.session.userId && !req.session.auth) {
      console.log('-----not log in redirect to logout -------')
      return res.redirect('/users/logout');
      // return res.redirect('/logout');
   }
   next();
}

module.exports = authUser;