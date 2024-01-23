import User from "../models/user.js";

const protectedRoute = (req, res, next) => {
  const accessToken = req.cookies["access_token"];

  if (!accessToken) {
    return res.redirect("/login");
  }

  User.findOne({
    where: {
      access_token: accessToken,
    },
  })
    .then((user) => {
      if (user) {
        const now = new Date();
        if (now > user.access_token_expiry) {
          return res.redirect("/login");
        } else {
          next();
        }
      } else {
        return res.redirect("/login");
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "Some error occurred while logging in.",
      });
    });
};

export default protectedRoute;
