// Importing CryptoJS
const CryptoJS = require("crypto-js");

// Importing MomentJS
const moment = require("moment");

// importing dotenv
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(403).json({
      message: "You are not authorised to access this API!",
      status: 0,
    });
  }

  // Decrypt Hidden Message
  const bytes = CryptoJS.AES.decrypt(authHeader, process.env.SUPER_SECRET);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  try {
    // Get Current Timestamp
    const currentDateTimestamp = moment().format("YYYYMMDDHHmm");

    // Split originalText, Get the timestamp
    const authTimestamp = await originalText.split(" ")[1];

    if (currentDateTimestamp === authTimestamp) {
      if ((await originalText.split(" ")[0]) === process.env.SERVER_NAME) {
        req.current_ip = await originalText.split(" ")[2];

        next();
      } else {
        return res.status(403).json({
          message: "You are not authorised to access this API!",
          status: 0,
        });
      }
    } else {
      return res.status(403).json({
        message: "You are not authorised to access this API!",
        status: 0,
      });
    }
  } catch (err) {
    return res.status(403).json({
      message: "You are not authorised to access this API!",
      status: 0,
    });
  }
};
