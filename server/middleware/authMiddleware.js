import JWT from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  console.log(authHeader)
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Authentication == failed");
  }
  const token = authHeader?.split(" ")[1];
  console.log(token)
  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };
    console.log(req.body);
    next();
  } catch (err) {
    console.log(err);
    next("Authentication Failed");
  }
};
