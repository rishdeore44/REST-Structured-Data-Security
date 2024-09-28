const mongoose = require('mongoose');

const costSharesSchema = new mongoose.Schema({
    deductible: { type: Number, required: true },
    _org: { type: String, required: true },
    copay: { type: Number, required: true },
    objectId: { type: String, required: true },
    objectType: { type: String, required: true }
});

const linkedServiceSchema = new mongoose.Schema({
    _org: { type: String, required: true },
    objectId: { type: String, required: true },
    objectType: { type: String, required: true },
    name: { type: String, required: true }
});

const linkedPlanServicesSchema = new mongoose.Schema({
    linkedService: { type: linkedServiceSchema, required: true },
    planserviceCostShares: { type: costSharesSchema, required: true },
    _org: { type: String, required: true },
    objectId: { type: String, required: true },
    objectType: { type: String, required: true }
});

const dataSchema = new mongoose.Schema({
    planCostShares: { type: costSharesSchema, required: true },
    linkedPlanServices: { type: [linkedPlanServicesSchema], required: true },
    _org: { type: String, required: true },
    objectId: { type: String, required: true },
    objectType: { type: String, required: true },
    planType: { type: String, required: true },
    creationDate: { type: Date, required: true },
    etag: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() } // Adding etag
}, { versionKey: false });

module.exports = mongoose.model('Data', dataSchema);