import Message from "../models/message.js";
import User from "../models/user.js";
import { Op } from "sequelize";

const indexPage = async (req, res) => {
  const u = await User.findOne({
    where: {
      access_token: req.cookies["access_token"],
    },
  });

  const users = await User.findAll({
    where: {
      id: { [Op.not]: u.id },
    },
  });
  const messages = await Message.findAll({
    where: {
      recipient_id: u.id,
    },
    include: [{ model: User, as: "sender" }],
  });

  res.render("index", {
    title: "Home",
    users: users,
    messages: messages,
  });
};

const sendMessage = async (req, res) => {
  const u = await User.findOne({
    where: {
      access_token: req.cookies["access_token"],
    },
  });

  const message = await Message.create({
    sender_id: u.id,
    recipient_id: req.body.recipient_id,
    timestamp: new Date(),
    content: req.body.pesan,
  });

  res.redirect("/");
};

export { indexPage, sendMessage };
