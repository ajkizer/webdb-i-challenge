const express = require("express");

const db = require("../dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
  db("accounts")
    .then(accounts => res.status(200).json(accounts))
    .catch(error => {
      res.status(500).json({ message: "Could not retrieve data" });
    });
});

router.get("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .first()
    .then(account => {
      account
        ? res.status(200).json(account)
        : res.status(404).json({ message: "Account not found" });
    });
});

router.post("/", (req, res) => {
  if (validateAccount(req.body)) {
    db("accounts")
      .insert(req.body, "id")
      .then(([id]) => id)
      .then(id => {
        db("accounts")
          .where({ id })
          .first()
          .then(account => {
            res.status(201).json(account);
          });
      })
      .catch(error =>
        res.status(500).json({ message: "could not add account" })
      );
  } else {
    res.status(400).json({
      message: "Please enter a number for the budget"
    });
  }
});

router.put("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .update(req.body)
    .then(account => {
      account
        ? res.status(200).json({ message: "updated account" })
        : res.status(404).json({ message: "account not found" });
    })
    .catch(error => {
      res.status(500).json({ message: "failed to update account" });
    });
});

router.delete("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then(() => res.status(200).json("account deleted"))
    .catch(error => res.status(500).json({ message: "could not remove" }));
});

function validateAccount({ name, budget }) {
  return name && typeof budget === "number" && budget >= 0;
}

module.exports = router;
