const Joi = require("joi");

module.exports = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(16).required(),
    email_address: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "gov", "ph"] },
      })
      .required(),
  });

  const { error } = schema.validate(req.query);

  const valid = error ? false : true;

  try {
    if (valid) {
      next();
    }
  } catch (err) {
    return res.status(403).json({
      message: "Sent data not valid!",
      status: 0,
    });
  }
};
