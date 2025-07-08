import UserModel from "../models/UserModel.js";
import jwtToken from "../utils/jwtToken.js";
import bcrypt from "bcrypt";

const signUpController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "Username is Required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is Required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, error: "Password is Required" });
    }

    const exist = await UserModel.findOne({ email: email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credentials" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = UserModel({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    jwtToken(newUser._id, res);
    return res.status(200).json({
      success: true,
      user: {
        ...newUser._doc,
        password: undefined,
        favorites: undefined,
        bio: undefined,
        bookmarks: undefined,
      },
    });
  } catch (err) {
    console.log(`Error in Sign Up Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is Required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, error: "Password is Required" });
    }

    const exist = await UserModel.findOne({ email: email });
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credentials" });
    }

    const verifyPassword = await bcrypt.compare(password, exist.password);
    if (!verifyPassword) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid Credentials" });
    }

    jwtToken(exist._id, res);
    return res.status(200).json({
      success: true,
      user: {
        ...exist._doc,
        password: undefined,
        favorites: undefined,
        bio: undefined,
        bookmarks: undefined,
      },
    });
  } catch (err) {
    console.log(`Error in Login Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("peerHub", {
      sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
      secure: process.env.NODE_ENV !== "development",
    });
    return res.status(200).json({ message: "Logout Success", success: true });
  } catch (err) {
    console.log(`Error in Logout Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const verifyTokenController = async (req, res) => {
  try {
    return res.status(200).json({ success: true, user: { ...req.user?._doc } });
  } catch (err) {
    console.log(`Error in Verify Token Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const googleLoginAndSignUpController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await UserModel.findOne({ email: email });
    if (!user) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = UserModel({
        username: username,
        email: email,
        password: hashedPassword,
      });
      await user.save();
    }

    jwtToken(user._id, res);
    return res.status(200).json({
      success: true,
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    console.log(`Error in Google Login and Signup Controller - ${err.message}`);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export {
  signUpController,
  loginController,
  logoutController,
  verifyTokenController,
  googleLoginAndSignUpController,
};
