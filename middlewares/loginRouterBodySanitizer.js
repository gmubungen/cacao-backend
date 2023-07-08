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
    const { username, password } = req.body;

    req.body = {
      username: req.sanitize(username),
      password: req.sanitize(password),
    };
  }

  next();
};
