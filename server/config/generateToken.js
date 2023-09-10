const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "Cat123", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
