const User = require("../app/user/user.model");

const authorized = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get user from database using the email from authenticateToken
      const user = await User.findOne({ where: { email: req.userEmail } });

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      // Check if user's role is included in allowedRoles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          status: false,
          message: `Access denied! You do not have permission to access this resource.`,
        });
      }

      // Attach user object to request for use in controllers
      req.user = user;
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ status: false, message: "Authorization failed!" });
    }
  };
};

module.exports = authorized;
