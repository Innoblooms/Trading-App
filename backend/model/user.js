const db = require("./db.js");

const User = function(user) {
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
  // this.gender = user.gender;
  this.age = user.age;
  this.adhaarImage = user.adhaarImage || null;
  this.panImage = user.panImage || null;
  this.bank_statements = user.bank_statements || null;
  // this.investmentMode = user.investmentMode;
  // this.returningCurrency = user.returningCurrency;
  this.role = user.role || 'user';
};


User.create = (newUser, result) => {
  db.query("INSERT INTO signup SET ?", newUser, (err, res) => {
    if (err) {
      console.error("Error creating user:", err);
      result(err, null);
      return;
    }
    console.log("Created user:", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};
  

User.findByEmail = (email, result) => {
  db.query("SELECT * FROM signup WHERE email = ?", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    // User not found
    result({ kind: "not_found" }, null);
  });
};


User.getAll = (name, result) => {
    let query = "SELECT * FROM signup";
  
    if (name) {
      query += ` WHERE name LIKE '%${name}%'`;
    }
  
    db.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      // console.log("user: ", res);
      result(null, res);
    });
  };
  

User.findById = (id, result) => {
    db.query(`SELECT * FROM signup WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      result({ kind: "not_found" }, null);
    });
  };


// User.updateById = (id, user, result) => {
//     db.query(
//      "UPDATE signup SET name = ?, email = ?, password = ?, adhaarImage = ?, panImage = ?, bank_statements = ?  WHERE id = ?",
//       [user.name, user.email, user.password, user.adhaarImage, user.panImage, user.bank_statements, id],
//       (err, res) => {
//         if (err) {
//           console.log("error: ", err);
//           result(null, err);
//           return;
//         }
  
//         if (res.affectedRows == 0) {
//           // not found user with the id
//           result({ kind: "not_found" }, null);
//           return;
//         }
  
//         console.log("updated user: ", { id: id, ...user });
//         result(null, { id: id, ...user });
//       }
//     );
//   };
  
User.updateById = (id, user, result) => {
  let updateQuery = "UPDATE signup SET ";
  let queryParams = [];
  
  const updateFields = [];
  if (user.name) {
    updateFields.push("name = ?");
    queryParams.push(user.name);
  }
  if (user.email) {
    updateFields.push("email = ?");
    queryParams.push(user.email);
  }
  if (user.password) {
    updateFields.push("password = ?");
    queryParams.push(user.password);
  }
  if (user.adhaarImage) {
    updateFields.push("adhaarImage = ?");
    queryParams.push(user.adhaarImage);
  }
  if (user.panImage) {
    updateFields.push("panImage = ?");
    queryParams.push(user.panImage);
  }
  if (user.bank_statements) {
    updateFields.push("bank_statements = ?");
    queryParams.push(user.bank_statements);
  }
  
  updateQuery += updateFields.join(", ");
  updateQuery += " WHERE id = ?";
  queryParams.push(id);

  db.query(updateQuery, queryParams, (err, res) => {
      if (err) {
        console.error("Error updating user:", err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        // not found user with the id
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Updated user successfully:", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};


User.remove = (id, result) => {
    db.query("DELETE FROM signup WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted user with id: ", id);
      result(null, res);
    });
  };


User.removeAll = result => {
    db.query("DELETE FROM signup", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} users`);
      result(null, res);
    });
  };


module.exports = User;