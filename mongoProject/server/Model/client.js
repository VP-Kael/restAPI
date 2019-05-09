const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    ContactNumber: {
        type: String,
        required: true,
    },
    TechnicalAbility: String,
    SecondaryContactFirstName: String,
    SecondaryContactLastName: String,
    SecondaryContactEmail: String,
    SecondaryContactNumber: String,
    ClientOrganizationID: {
        type: String,
        required: true,
    },
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const clientModel = mongoose.model("client", clientSchema);

module.exports = { clientModel };