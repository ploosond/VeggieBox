import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const authCookie = req.cookies["auth-cookie"];

  if (!authCookie) {
    return res.json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecoded = jwt.verify(authCookie, process.env.JWT_SECRET);

    if (tokenDecoded.id) {
      req.userId = tokenDecoded.id;
    } else {
      res.json({ success: false, message: "Not Authorized" });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
