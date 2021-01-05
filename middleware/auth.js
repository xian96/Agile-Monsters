const authUser = async (req, res, next) => {
   console.log('----- authUser -------')
   if (!req.session.userId && !req.session.auth) {
      console.log('-----not log in redirect to logout -------')
      console.log(req.session);
      return res.redirect('/users/logout');
      // return res.redirect('/logout');
   }
   next();
}

module.exports = authUser;