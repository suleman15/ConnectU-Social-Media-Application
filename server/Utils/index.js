import bcrypt from "bcryptjs";
import multer from "multer";
import JWT from "jsonwebtoken";

export const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(useValue, salt);
  return hashedPassword;
};
export const compareString = async (userPassword, password) => {
  console.log(userPassword, password);
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

//JSON WEBTOKEN
export function createJWT(id) {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY);
}

//multer setup

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define the file name
  },
});

export const upload = multer({ storage: storage });
