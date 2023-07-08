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
    const { username, email_address } = req.body;

    req.body = {
      username: req.sanitize(username),
      email_address: req.sanitize(email_address),
    };
  }

  next();
};
