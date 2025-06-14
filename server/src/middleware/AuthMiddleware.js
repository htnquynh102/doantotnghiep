const authService = require("../services/AccountService");

// exports.authMiddleware = (requiredRole) => {
//   return (req, res, next) => {
//     const token = req.cookies.access_token;

//     if (!token) {
//       return res.status(401).json({ error: "Bạn chưa đăng nhập!" });
//     }

//     const userData = authService.verifyToken(token);
//     if (!userData) {
//       return res.status(403).json({ error: "Token không hợp lệ!" });
//     }

//     if (requiredRole && userData.role !== requiredRole) {
//       return res.status(403).json({ error: "Bạn không có quyền truy cập!" });
//     }

//     req.user = userData;
//     next();
//   };
// };

exports.authMiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    const token = req.cookies.access_token;
    console.log("Received Token from Client:", req.cookies.access_token);

    if (!token) {
      return res.status(401).json({ error: "Bạn chưa đăng nhập!" });
    }

    const userData = authService.verifyToken(token);
    if (!userData) {
      return res.status(403).json({ error: "Token không hợp lệ!" });
    }
    console.log("User Authenticated:", userData);

    if (requiredRoles.length > 0 && !requiredRoles.includes(userData.role)) {
      return res.status(403).json({ error: "Bạn không có quyền truy cập!" });
    }

    req.user = userData;
    next();
  };
};
