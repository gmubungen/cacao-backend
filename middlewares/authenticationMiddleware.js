// Importing JSON Web Token
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(404).json({
      message: "No Authorisation Header Found",
      status: 0,
    });
  }

  const token = await authHeader.split(" ")[1];

  if (!token || token === "") {
    return res.status(404).json({
      message: "No Token Found",
      status: 0,
    });
  }

  let decodedToken;

  try {
    decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(404).json({
      message: "Bearer Token Not Found",
      status: 0,
    });
  }

  req.isAuth = true;
  req.id = decodedToken.user_id;

  next();
};
