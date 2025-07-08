import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.peerHub;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      try {
        if (err) {
          return res.status(401).json({
            message: "Token not Valid",
            success: false,
            error: "Invalid Credentials",
          });
        } else {
          const user = await UserModel.findById({ _id: decoded.id })
            .select("-password")
            .select("-bio")
            .select("-bookmarks")
            .select("-favorites");
          req.user = user;
          next();
        }
      } catch (err) {
        console.log(`Error in Verify Token - ${err.message}`);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
    });
  } else {
    return res.status(401).json({
      message: "Token Timed Out",
      success: false,
      error: "Invalid Credentials",
    });
  }
};

export default verifyToken;
