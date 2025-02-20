import jwt from "jsonwebtoken";
import cookie from "cookie";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // If no Authorization header is provided
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header not found, authorization required.",
    });
  }

  // Extract the token (bearer token should have the format "Bearer <token>")
  const token = authHeader.split(" ")[1];
  //   const parsedCookies = cookie.parse(cookies);
  //   const token = parsedCookies["accessToken"];
  if (!token) {
    return res.status(401).json({ message: "Token not found in cookies." });
  }

  try {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Token has expired, please log in again." });
        }
        return res.status(403).json({ message: "Invalid or expired token." });
      }

      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res
      .status(500)
      .json({ message: "Internal server error during token verification." });
  }
};

export const checkAdminRole = (req, res, next) => {
  if (req.user.memberRole === "ProjectManager") {
    next();
  } else {
    res.status(403).send({ error: "Access denied" });
  }
};

export const checkMemberRole = (req, res, next) => {
  if (req.user.memberRole === "Member") {
    next();
  } else {
    res.status(403).send({ error: "Access denied" });
  }
};
