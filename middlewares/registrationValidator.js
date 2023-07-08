const Joi = require("joi");

module.exports = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(16).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,16}$"))
      .required(),
    email_address: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "gov", "ph"] },
      })
      .required(),
    first_name: Joi.string().required(),
    middle_name: Joi.string(),
    last_name: Joi.string().required(),
    birth_date: Joi.date().required(),
    sex: Joi.string().required(),
    address: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

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
