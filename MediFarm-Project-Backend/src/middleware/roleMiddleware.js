exports.isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admins only" });
  next();
};

// exports.isUser = (req, res, next) => {
//   if (!req.user) return res.status(401).json({ error: "Unauthorized" });
//   if (req.user.role !== "user") return res.status(403).json({ error: "Users only" });
//   next();
// };