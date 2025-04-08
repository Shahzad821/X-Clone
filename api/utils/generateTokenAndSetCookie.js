import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  const options = {
    maxAge: process.env.EXPIRE_TIME * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("token", token, { options });
};

export default generateTokenAndSetCookie;
