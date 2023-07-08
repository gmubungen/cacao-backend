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
    const { user_id, username, blog_data } = req.body;

    req.body = {
      user_id: req.sanitize(user_id),
      username: req.sanitize(username),
      blog_data: req.sanitize(blog_data),
    };
  }

  if (!isEmpty(req.params)) {
    const { blog_post_id, user_id } = req.params;

    req.params = {
      blog_post_id: req.sanitize(blog_post_id),
      user_id: req.sanitize(user_id),
    };
  }

  next();
};
