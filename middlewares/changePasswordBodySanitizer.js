const isEmpty = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
};

module.exports = async (req, res, next) => {
  if (!isEmpty(req.body)) {
    const { current_password, new_password, confirm_password } = req.body;

    req.body = {
      current_password: req.sanitize(current_password),
      new_password: req.sanitize(new_password),
      confirm_password: req.sanitize(confirm_password),
    };
  }

  if (!isEmpty(req.params)) {
    const { user_id } = req.params;

    req.params = {
      user_id: req.sanitize(user_id),
    };
  }

  next();
};
