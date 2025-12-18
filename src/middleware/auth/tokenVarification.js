const tokenVarification = async (req, res, next) => {
  // Get token from headers
  const token = req.headers["x-auth-token"] || req.body.token;
  console.log(token);
  if (!token) {
    return res.status(401).json({
      message: "Token required",
      status: false,
    });
  }

  // Example: simple token check
  if (token !== "12345") {
    return res.status(403).json({
      message: "Invalid Token",
      status: false,
    });
  }

  // Token is valid, proceed to next middleware / route
  next();
};

export default tokenVarification;
