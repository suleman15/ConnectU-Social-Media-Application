import JWT from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Authentication == failed");
  }
  const token = authHeader?.split(" ")[1];
  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
    console.log(userToken.userId);
    req.body.user = {
      userId: userToken.userId,
    };
    next();
  } catch (err) {
    console.log(err);
    next("Authentication Failed");
  }
};
