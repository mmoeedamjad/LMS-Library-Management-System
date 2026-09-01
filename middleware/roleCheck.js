const checkAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).render('error', {
      pageTitle: 'Access Denied',
      errorTitle: "Acess Denied",
      errorMessage: 'Admin privileges required'
    });
  }
  next();
};

module.exports = checkAdmin;