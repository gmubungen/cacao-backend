const Joi = require("joi");

module.exports = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(16).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,16}$"))
      .required(),
  });

  const { error } = schema.validate(req.body);

  const valid = error ? false : true;

  try {
    if (valid) {
      next();
    } else {
      return res.status(403).json({
        message: "Sent data not valid!",
        status: 0,
      });
    }
  } catch (err) {
    return res.status(403).json({
      message: "Sent data not valid!",
      status: 0,
    });
  }
};
