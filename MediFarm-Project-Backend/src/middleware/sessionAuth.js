module.exports = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized: No active session" });
  }
  
  req.user = req.session.user;
  next();
};