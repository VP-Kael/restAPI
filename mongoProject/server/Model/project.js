const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    ProjectName: {
        type: String,
        required: true
    },
    Status: {
        type: Number,
        required: true,
        default: 0
    },
    Internal: {
        type: Number,
        required: true,
        default: 0
    },
    Deployed: {
        type: Number,
        required: true,
        default: 0
    },
    ActivelyUsed: {
        type: Number,
        required: true,
        default: 0
    },
    SubjectID: {
        type: String,
        required: true,
    },
    Industry: {
        type: String,
        required: true,
    },
    SupervisorID: {
        type: String,
        required: true,
    },
    CoordinatorID: {
        type: String,
        required: true,
    },
    ProposalID: {
        type: String,
        required: true,
    },
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const projectModel = mongoose.model("project", projectSchema);

module.exports = { projectModel };