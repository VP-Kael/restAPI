const mongoose = require('mongoose');

const clientNoteSchema = mongoose.Schema({
    NoteText: {
        type: String,
        required: true
    },
    ClientID: {
        type: String,
        required: true
    },
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const clientNoteModel = mongoose.model("note", clientNoteSchema);

module.exports = { clientNoteModel };