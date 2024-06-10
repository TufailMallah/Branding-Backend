const express = require("express");
const contactController = require("../controller/contact.controller");
const router = express.Router();

router.post("/create", contactController.createContact);
router.get("/get-all-contacts", contactController.getAllContacts);
router.put("/update/:id", contactController.updateContact);
router.delete("/delete/:id", contactController.deleteContact);
router.delete("/delete-all", contactController.deleteAllContacts);

module.exports = router;
