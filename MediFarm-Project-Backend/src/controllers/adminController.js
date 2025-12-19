const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");



exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: "Invalid username" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    
    req.session.user = {
      id: admin._id.toString(),
      username: admin.username,
      role: "admin"
    };

    
    res.json({ message: "Login successful", user: { username: admin.username, role: "admin" } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }

  
};