import cors from "cors";
import express from "express";
import functions from "firebase-functions";
import jwt from "jsonwebtoken";
import mySecretKey from "./secret.js";

const users = [
  // fake database
  {
    id: 1,
    email: "mara@bocacode.com",
    password: "$2b$10$WwhgVbFf9AJm5WWwpKVMYuUK0jVjOe0zb.Xv43oGbEfpBQ9ZXZp6a",
  },
  {
    id: 2,
    email: "chole@bocacode.com",
    password: "$2b$10$WwhgVbFf9AJm5WWwpKVMYu0TL7APRFPuLos3bWhGajj8cI044uZnG",
  },
  {
    id: 3,
    email: "rodrigo@bocacode.com",
    password: "$2b$10$WwhgVbFf9AJm5WWwpKVMYuHlJ1vM/oVfHBCwopiUiXp4TeUoXzS3O",
  },
];

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // check to see if that email and password exist in our db
  // if they do, create and send back a token
  // if they don't, send back an error message.
  let user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    res.status(401).send({ error: "Invalid email or password" });
    return;
  }
  user.password = undefined; // this removed password from the user object
  // now we want to sign/create a token...
  const token = jwt.sign(user, mySecretKey, { expiresIn: "1h" });
  res.send({ token }); // now it will send back something like: rgSgniseg09NOF2sinv
});
app.get("/public", (req, res) => {
  res.send({ message: "welcome!" });
});
app.get("/private", (req, res) => {
  // lets require a valid token to see this
  const token = req.headers.authorization || "";
  if (!token) {
    res.status(401).send({ error: "you must be logged in to see this" });
    return;
  }
  jwt.verify(token, mySecretKey, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: "you must be logged in to see this" });
      return;
    }
    // here we know that the token is valid...
    res.send({ message: `Welcome ${decoded.email}` });
  });
});

export const api = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
