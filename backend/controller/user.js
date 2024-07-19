const User = require("../model/user");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const upload = require("../middlewares/multer");
const db = require("../model/db.js");

const _user = {}

_user.uploadFiles = upload.fields([
  { name: 'adhaarImage', maxCount: 1 },
  { name: 'panImage', maxCount: 1 },
  { name: 'bank_statements', maxCount: 10}
]);

//--------------Signup API Start----------------//
_user.create = async (req, res) => {
  const { name, email, password, age, role } = req.body;

  if (!name || !email || !password || !age) {
    return res.status(400).send({ message: "Name, email, password, and age are required!" });
  }

  try {

    db.query("SELECT * FROM signup WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).send({ message: "Database query error" });
      }

      if (results.length > 0) {
        return res.status(400).send({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);

      const adhaarImage = req.files && req.files['adhaarImage'] ? req.files['adhaarImage'][0].filename : null;
      const panImage = req.files && req.files['panImage'] ? req.files['panImage'][0].filename : null;
      const bank_statements = req.files && req.files['bank_statements'] ? req.files['bank_statements'][0].filename : null;

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        age,
        adhaarImage,
        panImage,
        bank_statements
      });

      User.create(user, (err, data) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
        }
        res.status(201).send(data);
      });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send({ message: "An error occurred while hashing the password." });
  }
};

//--------------Signup API End----------------//

//--------------Login API Start----------------//
_user.login = async (req, res) => {

    if (!req.body) {
      return res.status(400).send({
        message: "Content cannot be empty!"
      });
    }
  
    const { email, password } = req.body;
  
    try {
      User.findByEmail(email, async (err, user) => {
        if (err) {
          console.error("Error finding user:", err);
          return res.status(500).send({
            message: err.message || "Some error occurred while retrieving the User."
          });
        }
  
        if (!user) {
          return res.status(404).send({
            message: "User not found."
          });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          return res.status(401).send({
            message: "Invalid password."
          });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, 'Trading_App', {
          expiresIn: '1h',
          });
  
        return res.status(200).send({
          message: "Login successful.",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
          }
        });
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).send({
        message: "An error occurred during login."
      });
    }
  };
//--------------Login API End----------------//

//--------------Get All User API Start----------------//
_user.findAll = (req, res) => {

    const name = req.query.name;

    if(req.user.role === 'admin'){
    User.getAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving user."
        });
      else res.status(200).send(data);
    });
  }else{
    return res.status(400).send('you are not an Admin.')
  }
  };
//--------------Get All User API End----------------//

//--------------Get Single User API Start----------------//
_user.findOne = (req, res) => {
    User.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found user with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving user with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };
//--------------Get Single User API End----------------//

//--------------Update User API Start----------------//
_user.update = async (req, res) => {
  const { name, email, password } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
  }
  
  const adhaarImage = req.files && req.files['adhaarImage'] ? req.files['adhaarImage'][0].filename : null;
  const panImage = req.files && req.files['panImage'] ? req.files['panImage'][0].filename : null;
  const bank_statements = req.files && req.files['bank_statements'] ? req.files['bank_statements'][0].filename : null;

  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (email) updatedFields.email = email;
  if (hashedPassword) updatedFields.password = hashedPassword;
  if (adhaarImage) updatedFields.adhaarImage = adhaarImage;
  if (panImage) updatedFields.panImage = panImage;
  if (bank_statements) updatedFields.bank_statements = bank_statements;

  User.updateById(req.params.id, updatedFields, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: "Error updating User with id " + req.params.id
        });
      }
    } else {
      return res.send(data);
    }
  });
};
//--------------Update User API End----------------//

//--------------Delete User API Start----------------//
_user.delete = (req, res) => {
    User.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete User with id " + req.params.id
          });
        }
      } else res.send({ message: `User was deleted successfully!` });
    });
  };
//--------------Delete User API End----------------//

//--------------Delete All User API Start----------------//
_user.deleteAll = (req, res) => {
  if(req.user.role === 'admin'){
    User.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all user."
        });
      else res.send({ message: `All User were deleted successfully!` });
    });
  }else{
    return res.status(400).send('you are not an Admin.')
  }
  };
//--------------Delete All User API End----------------//

module.exports = _user