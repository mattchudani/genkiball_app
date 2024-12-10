/**
 * This is the main server script that provides the API endpoints
 * The script uses the database helper in /src
 * The endpoints retrieve, update, and return data to the page handlebars files
 *
 * The API returns the front-end UI handlebars pages, or
 * Raw json if the client requests it with a query parameter ?raw=json
 */

// Utilities we need
const fs = require("fs");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const db = require("./public/sqlite.js");
const req = require("express/lib/request.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
console.log(path.join(__dirname, "/public"));


const readPoints = (callback) => {
  const sql = "SELECT * FROM users";
  db.all(sql, [], callback);
};

function updateUserMetrics(id, points, ala, salt, wai, callback) {
  const sql = `
    UPDATE users
    SET points = ?, ala = ?, salt = ?, wai = ?
    WHERE id = ?
  `;
  db.run(sql, [points, ala, salt, wai, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    callback(this.changes); // Number of rows updated
  });
}

const hbs = require('hbs');
hbs.registerHelper('inc', function(value, options) {
  return parseInt(value) + 1;
});


//Sign in Login Variables
var email = 'none';
var eID;
var user;
var points;
var ala;
var salt;
var wai;
var place;
var position = [];

const createAccount = (username, email, password, points, ala, salt, wai, callback) => {
  const sql =
    "INSERT INTO users (username, email, password, points, ala, salt, wai) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [username, email, password, points, ala, salt, wai], function (err) {
    if (err) {
      return console.error(err.message);
    }
    callback(this.lastID); // Return the last inserted ID
  });
};

readPoints((err, rows) => {
  if (err) {
    console.log(err.message);
  } else {

    console.log(rows);
  }
});

app.get("/leaderboard-points", (req, res) => {
  if (email != "none") {
    readPoints((err, rows) => {
      if (err) {
        return;
      }
      let leaderboard = rows.map(row => ({
        id: row.id,
        username: row.username,
        points: row.points,
        ala: row.ala,
        salt: row.salt,
        wai: row.wai
      }));

      leaderboard.sort((a, b) => b.points - a.points); // Descending order by points

      // Find the user's position
      const userPosition = leaderboard.findIndex(user => user.id === eID) + 1;

      res.render("leaderboard.hbs", { leaderboard: leaderboard, userPosition: leaderboard, titles: 'Points', username: user + " - Points " + (points) });
    });
  } else {
    readPoints((err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      let leaderboard = rows.map(row => ({
        id: row.id,
        username: row.username,
        points: row.points,
        ala: row.ala,
        salt: row.salt,
        wai: row.wai
      }));

      leaderboard.sort((a, b) => b.points - a.points); // Descending order by points

      // Find the user's position
      const userPosition = leaderboard.findIndex(user => user.id === eID) + 1;

      res.render("leaderboard.hbs", {leaderboard: leaderboard, titles: 'Points' });
    });
  }
});

app.get("/leaderboard-ala-wai", (req, res) => {
  if (email != "none") {
    readPoints((err, rows) => {
      if (err) {
        return;
      }
      let leaderboard = rows.map(row => ({
        id: row.id,
        username: row.username,
        points: row.ala
      }));

      leaderboard.sort((a, b) => b.points - a.points); // Descending order by points

      // Find the user's position
      const userPosition = leaderboard.findIndex(user => user.id === eID) + 1;

      res.render("leaderboard.hbs", { leaderboard: leaderboard, userPosition: leaderboard, titles: ' Ala-Wai', username: user + " - Ala Wai " + (ala) });
    });
  } else {
    readPoints((err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      let leaderboard = rows.map(row => ({
        id: row.id,
        username: row.username,
        points: row.ala
      }));

      leaderboard.sort((a, b) => b.points - a.points); // Descending order by points

      // Find the user's position
      const userPosition = leaderboard.findIndex(user => user.id === eID) + 1;

      res.render("leaderboard.hbs", {leaderboard: leaderboard, titles: 'Ala-Wai' });
    });
  }
});

app.get("/leaderboard-salt-lake", (req, res) => {
  if (email != "none") {
    readPoints((err, rows) => {
      if (err) {
        return;
      }
      let leaderboard = rows.map(row => ({
        id: row.id,
        username: row.username,
        points: row.salt
      }));

      leaderboard.sort((a, b) => b.points - a.points); // Descending order by points

      // Find the user's position
      const userPosition = leaderboard.findIndex(user => user.id === eID) + 1;

      res.render("leaderboard.hbs", { leaderboard: leaderboard, userPosition: leaderboard, titles: 'Salt Lake', username: user + " - Salt Lake " + (salt) });
    });
  } else {
    readPoints((err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      let leaderboard = rows.map(row => ({
        id: row.id,
        username: row.username,
        points: row.salt
      }));

      leaderboard.sort((a, b) => b.points - a.points); // Descending order by points

      // Find the user's position
      const userPosition = leaderboard.findIndex(user => user.id === eID) + 1;

      res.render("leaderboard.hbs", {leaderboard: leaderboard, titles: 'Salt Lake' });
    });
  }
});


app.get("/home", (req, res) => {
  res.render("index.hbs");
});
app.get("/", (req, res) => {
  res.render("index.hbs");
});
app.get("/genki", (req, res) => {
  res.render("genki.hbs");
});

app.get("/ala-wai", (req, res) => {
  place = "ala";
  res.render("form.hbs", {
    place: "Ala Wai",
    description: "The spot that started all of this"
  });
});
app.get("/salt-lake", (req, res) => {
  place = "salt";
  res.render("form.hbs", {
    place: "Salt Lake",
    description: "A second offical spot for throwing"
  });
});
app.get("/waipahu", (req, res) => {
  place = "wai";
  res.render("form.hbs", {
    place: "Ala Wai",
    description: "A theoretical place for throwing"
  });
});

app.get("/map", async (req, res) => {
  if (email != "none") {
    res.render("map.hbs", {username: user + " - G" + (ala + salt + wai)});
  } else {
    res.render("map.hbs");
  }
});

app.get("/account", async (req, res) => {
  readPoints((err, rows) => {
    if (err) {
      console.log(err);
      return res.render("error.hbs", { message: "Error reading points" });
    }

    // Assuming eID is the index of the current user in rows
    email = rows[eID].email;
    user = rows[eID].username;
    points = rows[eID].points;
    ala = rows[eID].ala;
    salt = rows[eID].salt;
    wai = rows[eID].wai;
    console.log(wai);

    // Create leaderboard array and sort it by points
    let leaderboard = rows.map(row => ({
      id: row.id,
      username: row.username,
      points: row.points
    }));
    
    leaderboard.sort((a, b) => b.points - a.points); // Descending order by points

    // Find the user's position
    const userPosition = leaderboard.findIndex(user => user.id === rows[eID].id) + 1;
    console.log(leaderboard);
    var genkis = ala + salt + wai;
    if (email != "none") {
      res.render("account.hbs", {
        username: user,
        points: points,
        alaa: ala,
        salts: salt,
        waipahu: wai,
        genki: genkis,
        position: userPosition, // Pass the user's position to the template
      });
    } else {
      res.render("account.hbs");
    }
  });
});


app.get("/login", (req, res) => {
  res.render("login.hbs");
});

app.get("/sign", (req, res) => {
  res.render("signUp.hbs");
});

app.post("/signup", async (req, res) => {
  readPoints((err, rows) => {
    var noDupEmail = 0;
    if (err) {
      console.log(err.message);
    } else {
      for (let i = 0; i < rows.length; i++) {
        if (req.body.email != rows[i].email) {
          noDupEmail++;
        }
      }
      if (noDupEmail == rows.length) {
        createAccount(
          req.body.name,
          req.body.email,
          req.body.password,
          100,
          1,
          1,
          1,
          (userId) => {
            console.log(`New user ID: ${userId}`);

            eID = userId-1;
            console.log(eID);
            email = req.body.email;
            user = req.body.name;
            points = 100;
            ala = 1;
            salt = 1;
            wai = 1;
            position[eID] = 

            db.all("SELECT * FROM users", [], (err, rows) => {
              if (err) {
                res.render("signUp.hbs", {warning: err})
              }
            });
            res.render("signUp.hbs", {warning: "New user ID: " + userId});
            res.redirect('/map');
          }
        );
      } else {
        res.render("signUp.hbs", {warning: "Please use different Email or Login!"})
      }
    }
  });
});

app.post("/login", async (req, res) => {
  readPoints((err, rows) => {
    if (err) {
      return res.render("login.hbs", {warning: err.message}); // Use 'return' to stop execution
    } 
    let userFound = false;
    for (let i = 0; i < rows.length; i++) {
      if (req.body.email == rows[i].email && req.body.password == rows[i].password) {
        eID = i;
        email = req.body.email;
        user = rows[i].username;
        points = rows[i].points;
        ala = rows[i].ala;
        salt = rows[i].salt;
        wai = rows[i].wai;
        userFound = true;
        break; // Exit the loop early since user is found
      }
    }

    if (userFound) {
      res.render("login.hbs", {warning: "Correct: Redirecting"});
      res.redirect('/map');
    } else {
      res.render("login.hbs", {warning: "Wrong email or password"});
    }
  });
});

app.post("/form", async (req, res) => {
  let userFound = false;
  readPoints((err, rows) => {
    if (err) {
      return res.render("login.hbs", {warning: err.message}); // Use 'return' to stop execution
    } 
    for (let i = 0; i < rows.length; i++) {
      if (req.body.email == rows[i].email && req.body.password == rows[i].password) {
        eID = i;
        email = req.body.email;
        user = rows[i].username;
        points = rows[i].points;
        ala = rows[i].ala;
        salt = rows[i].salt;
        wai = rows[i].wai;
        userFound = true;
        break; // Exit the loop early since user is found
      }
    }
    if (userFound) {
      const number = parseInt(req.body.number, 10); // Convert to an integer
      if (place == "ala") {
        if (isNaN(number)) {
          // Handle case where number is not a valid integer
          res.render("form.hbs", {warning: "Invalid Number"});
        } else {
          updateUserMetrics((eID + 1), 
            (rows[eID].points + number), 
            (rows[eID].ala + number), 
            rows[eID].salt, 
            rows[eID].wai, 
            (changes) => {
              console.log(rows[eID]);
          });
        }
      } else if (place == "salt") {
        if (isNaN(number)) {
          // Handle case where number is not a valid integer
          res.render("form.hbs", {warning: "Invalid Number"});
        } else {
          updateUserMetrics((eID + 1), 
            (rows[eID].points + number), 
            rows[eID].ala, 
            (rows[eID].salt + number), 
            rows[eID].wai, 
            (changes) => {
              console.log(rows[eID]);
          });
        }
      } else if (place == "wai") {
        if (isNaN(number)) {
          // Handle case where number is not a valid integer
          res.render("form.hbs", {warning: "Invalid Number"});
        } else {
          updateUserMetrics((eID + 1), 
            (rows[eID].points + number), 
            rows[eID].ala, 
            rows[eID].salt, 
            (rows[eID].wai + number), 
            (changes) => {
              console.log(rows[eID]);
          });
        }
      }
      email = rows[eID].email;
      user = rows[eID].username;
      points = rows[eID].points;
      ala = rows[eID].ala;
      salt = rows[eID].salt;
      wai = rows[eID].wai;
      console.log(wai);
      res.redirect("/account")
    } else {
      res.render("form.hbs", {warning: "Wrong email or password"});
    }
  });
});


const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port${port}`);
});
