import crypto from "crypto";
import User from "../models/user.js";

const loginPage = (req, res) => {
  res.render("login", { title: "Login" });
};

const performLogin = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) {
        const token = crypto.randomBytes(16).toString("hex");

        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);

        user.access_token = token;
        user.access_token_expiry = expiry;
        user.save();

        const resValue = {
          access_token: token,
          access_token_expiry: expiry,
        };

        const encrypted = crypto.publicEncrypt(
          {
            key: user.public_key,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(JSON.stringify(resValue))
        );

        res.status(200).send(encrypted.toString("base64"));
      } else {
        res.status(401).send({
          message: "Cannot authenticate, invalid email!",
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "Some error occurred while logging in.",
      });
    });
};

const registerPage = (req, res) => {
  res.render("register", {
    title: "Register",
  });
};

const performRegister = (req, res, next) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    public_key: req.body.public_key,
  })
    .then((user) => {
      res.status(200).send({
        message: "User was registered successfully!",
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "Some error occurred while registering.",
      });
    });
};

const performLogout = (req, res, next) => {
  const accessToken = req.cookies["access_token"];

  User.findOne({
    where: {
      access_token: accessToken,
    },
  })
    .then((user) => {
      if (user) {
        user.access_token = null;
        user.access_token_expiry = null;
        user.save();
      }
      res.clearCookie("access_token");
      res.redirect("/login");
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "Some error occurred while logging out.",
      });
    });
};

const APICheckDuplicateEmail = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.query.email,
    },
  });

  if (user) {
    res.status(400).send({
      message: "Failed! Email is already in use!",
    });
  } else {
    res.status(200).send({
      message: "Email is available",
    });
  }
};

export {
  loginPage,
  performLogin,
  registerPage,
  performRegister,
  performLogout,
  APICheckDuplicateEmail,
};
