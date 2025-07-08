import jwt from "jsonwebtoken";

const jwtToken = (id, res) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
  res.cookie("peerHub", token, {
    maxAge: 259200000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default jwtToken;
