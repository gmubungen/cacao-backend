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
    const {
      email_address,
      username,
      first_name,
      middle_name,
      last_name,
      birth_date,
      sex,
      address,
      password,
    } = req.body;

    req.body = {
      email_address: req.sanitize(email_address),
      username: req.sanitize(username),
      password: req.sanitize(password),
      first_name: req.sanitize(first_name),
      middle_name: req.sanitize(middle_name),
      last_name: req.sanitize(last_name),
      birth_date: req.sanitize(birth_date),
      sex: req.sanitize(sex),
      address: req.sanitize(address),
    };
  }

  if (!isEmpty(req.query)) {
    const { email_address, username } = req.query;

    req.query = {
      email_address: req.sanitize(email_address),
      username: req.sanitize(username),
    };
  }

  next();
};
