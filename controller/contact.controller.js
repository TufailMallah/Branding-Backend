const db = require("../models");
const Contact = db.contacts;


const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newContact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        res.status(201).json({ message: "Contact created successfully", contact: newContact });
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();

        if (contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found" });
        }

        res.status(200).json({ message: "All contacts retrieved successfully", contacts });
    } catch (error) {
        console.error("Error retrieving contacts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, subject, message } = req.body;

        // Find the contact by its primary key (id)
        const contact = await Contact.findByPk(id);

        // If contact is not found, return 404 Not Found status
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        // Update the contact with the provided data
        await contact.update({
            name: name || contact.name,
            email: email || contact.email,
            subject: subject || contact.subject,
            message: message || contact.message,
        });

        // Return success message and updated contact
        res.status(200).json({ message: "Contact updated successfully", contact });
    } catch (error) {
        // If any error occurs, return 500 Internal Server Error status
        console.error("Error updating contact:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to delete a contact
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the contact by its primary key (id)
        const contact = await Contact.findByPk(id);

        // If contact is not found, return 404 Not Found status
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        // Delete the contact
        await contact.destroy();

        // Return success message
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        // If any error occurs, return 500 Internal Server Error status
        console.error("Error deleting contact:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to delete all contacts
const deleteAllContacts = async (req, res) => {
    try {
        // Delete all contacts from the database
        await Contact.destroy({ where: {} });

        // Return success message
        res.status(200).json({ message: "All contacts deleted successfully" });
    } catch (error) {
        // If any error occurs, return 500 Internal Server Error status
        console.error("Error deleting all contacts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Export the functions to be used in routes
module.exports = {
    updateContact,
    deleteContact,
    deleteAllContacts,
    createContact,
    getAllContacts,
};
