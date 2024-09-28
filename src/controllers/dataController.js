const Data = require('../models/dataModel');
const Joi = require('joi');
const mongoose = require('mongoose');

// Define the schemas for nested objects
const costSharesSchema = Joi.object({
    deductible: Joi.number().integer().required(),
    _org: Joi.string().required(),
    copay: Joi.number().integer().optional(), // Optional for PATCH
    objectId: Joi.string().required(),
    objectType: Joi.string().required()
});

const linkedServiceSchema = Joi.object({
    _org: Joi.string().required(),
    objectId: Joi.string().required(),
    objectType: Joi.string().required(),
    name: Joi.string().required()
});

const linkedPlanServicesSchema = Joi.object({
    linkedService: linkedServiceSchema.required(),
    planserviceCostShares: costSharesSchema.required(),
    _org: Joi.string().required(),
    objectId: Joi.string().required(),
    objectType: Joi.string().required()
});

const fullDataSchema = Joi.object({
    planCostShares: costSharesSchema.required(),
    linkedPlanServices: Joi.array().items(linkedPlanServicesSchema).required(),
    _org: Joi.string().required(),
    objectId: Joi.string().required(),
    objectType: Joi.string().required(),
    planType: Joi.string().required(),
    creationDate: Joi.date().required(),
    etag: Joi.string().optional() // Optional in request but will be handled internally
});

const partialDataSchema = Joi.object({
    planCostShares: costSharesSchema.optional(),
    linkedPlanServices: Joi.array().items(linkedPlanServicesSchema).optional(),
    _org: Joi.string().optional(),
    objectId: Joi.string().optional(),
    objectType: Joi.string().optional(),
    planType: Joi.string().optional(),
    creationDate: Joi.date().optional(),
    etag: Joi.string().optional() // Optional in request but will be handled internally
}).min(1); // Ensure at least one field is being updated

// Validation functions
const validateFullData = (data) => {
    return fullDataSchema.validate(data, { abortEarly: false });
};

const validatePartialData = (data) => {
    return partialDataSchema.validate(data, { abortEarly: false });
};

// Controller for creating data
// exports.createData = async (req, res) => {
//     const { error, value } = validateFullData(req.body);
//     if (error) return res.status(400).send(error.details.map(detail => detail.message).join(', '));

//     try {
//         const data = new Data(value);
//         await data.save();
//         res.status(201).send(data);
//     } catch (err) {
//         res.status(400).send(err.message);
//     }
// };

// // Controller for getting data
// exports.getData = async (req, res) => {
//     try {
//         const objectId = req.params.objectId;
//         const data = await Data.findOne({ objectId: objectId });
//         if (!data) return res.status(404).send('Data not found');
//         res.send(data);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// // Controller for updating data
// exports.updateData = async (req, res) => {
//     const { error, value } = validateFullData(req.body);
//     if (error) return res.status(400).send(error.details.map(detail => detail.message).join(', '));

//     try {
//         const data = await Data.findOne({ objectId: req.params.objectId });
//         if (!data) return res.status(404).send('Data not found');

//         if (data.version !== parseInt(req.headers['if-match'], 10)) {
//             return res.status(412).send('Data has been modified');
//         }

//         value.version = data.version + 1; // Increment version
//         const updatedData = await Data.findOneAndUpdate(
//             { objectId: req.params.objectId },
//             { $set: value, version: value.version }, // Update version in database
//             { new: true, runValidators: true }
//         );
//         res.send(updatedData);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// // Controller for patching data
// exports.patchData = async (req, res) => {
//     const { error, value } = validatePartialData(req.body);
//     if (error) return res.status(400).send(error.details.map(detail => detail.message).join(', '));

//     try {
//         const data = await Data.findOne({ objectId: req.params.objectId });
//         if (!data) return res.status(404).send('Data not found');

//         if (data.version !== parseInt(req.headers['if-match'], 10)) {
//             return res.status(412).send('Data has been modified');
//         }

//         value.version = data.version + 1; // Increment version
//         const updatedData = await Data.findOneAndUpdate(
//             { objectId: req.params.objectId },
//             { $set: value, version: value.version }, // Update version in database
//             { new: true, runValidators: true }
//         );
//         res.send(updatedData);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// // Controller for deleting data
// exports.deleteData = async (req, res) => {
//     try {
//         const data = await Data.findOneAndDelete({ objectId: req.params.objectId });
//         if (!data) return res.status(404).send('Data not found');
//         res.send('Data deleted');
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// // Controller for conditional update
// exports.updateIfNotChanged = async (req, res) => {
//     const { error, value } = validateFullData(req.body);
//     if (error) return res.status(400).send(error.details.map(detail => detail.message).join(', '));

//     try {
//         const data = await Data.findOne({ objectId: req.params.objectId });
//         if (!data) return res.status(404).send('Data not found');

//         if (data.version !== parseInt(req.headers['if-match'], 10)) {
//             return res.status(412).send('Data has been modified');
//         }

//         value.version = data.version + 1; // Increment version
//         const updatedData = await Data.findOneAndUpdate(
//             { objectId: req.params.objectId },
//             { $set: value, version: value.version }, // Update version in database
//             { new: true, runValidators: true }
//         );
//         res.send(updatedData);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// // Controller for conditional read
// exports.conditionalRead = async (req, res) => {
//     try {
//         const data = await Data.findOne({ objectId: req.params.objectId });
//         if (!data) return res.status(404).send('Data not found');

//         const clientVersion = parseInt(req.headers['if-none-match'], 10);

//         if (data.version === clientVersion) {
//             return res.status(304).send('Not Modified');
//         }

//         res.send(data);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };


// Controller for creating data
exports.createData = async (req, res) => {
    const { error, value } = validateFullData(req.body);
    if (error) return res.status(400).send(error.details.map(detail => detail.message).join(', '));

    try {
        value.etag = new mongoose.Types.ObjectId().toString(); // Generate initial etag
        const data = new Data(value);
        await data.save();
        res.status(201).send(data);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Controller for getting data
exports.getData = async (req, res) => {
    try {
        const objectId = req.params.objectId;
        const data = await Data.findOne({ objectId: objectId });
        if (!data) return res.status(404).send('Data not found');
        res.setHeader('ETag', data.etag); // Set etag in response header
        res.send(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Controller for updating data
exports.updateData = async (req, res) => {
    const { error, value } = validateFullData(req.body);
    if (error) return res.status(400).send(error.details.map(detail => detail.message).join(', '));

    try {
        const data = await Data.findOne({ objectId: req.params.objectId });
        if (!data) return res.status(404).send('Data not found');

        if (data.etag !== req.headers['if-match']) {
            return res.status(412).send('Data has been modified');
        }

        value.etag = new mongoose.Types.ObjectId().toString(); // Generate new etag
        const updatedData = await Data.findOneAndUpdate(
            { objectId: req.params.objectId },
            { $set: value },
            { new: true, runValidators: true }
        );
        res.setHeader('ETag', updatedData.etag); // Set new etag in response header
        res.send(updatedData);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Controller for patching data
exports.patchData = async (req, res) => {
    const { error, value } = validatePartialData(req.body);
    if (error) return res.status(400).send(error.details.map(detail => detail.message).join(', '));

    try {
        const data = await Data.findOne({ objectId: req.params.objectId });
        if (!data) return res.status(404).send('Data not found');

        if (data.etag !== req.headers['if-match']) {
            return res.status(412).send('Data has been modified');
        }

        value.etag = new mongoose.Types.ObjectId().toString(); // Generate new etag
        const updatedData = await Data.findOneAndUpdate(
            { objectId: req.params.objectId },
            { $set: value },
            { new: true, runValidators: true }
        );
        res.setHeader('ETag', updatedData.etag); // Set new etag in response header
        res.send(updatedData);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Controller for deleting data
exports.deleteData = async (req, res) => {
    try {
        const data = await Data.findOneAndDelete({ objectId: req.params.objectId });
        if (!data) return res.status(404).send('Data not found');
        res.send('Data deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Controller for conditional update
exports.updateIfNotChanged = async (req, res) => {
    const { error, value } = validateFullData(req.body);
    if (error) return res.status(400).send(error.details.map(detail => detail.message).join(', '));

    try {
        const data = await Data.findOne({ objectId: req.params.objectId });
        if (!data) return res.status(404).send('Data not found');

        if (data.etag !== req.headers['if-match']) {
            return res.status(412).send('Data has been modified');
        }

        value.etag = new mongoose.Types.ObjectId().toString(); // Generate new etag
        const updatedData = await Data.findOneAndUpdate(
            { objectId: req.params.objectId },
            { $set: value },
            { new: true, runValidators: true }
        );
        res.setHeader('ETag', updatedData.etag); // Set new etag in response header
        res.send(updatedData);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Controller for conditional read
exports.conditionalRead = async (req, res) => {
    try {
        const data = await Data.findOne({ objectId: req.params.objectId });
        if (!data) return res.status(404).send('Data not found');

        if (data.etag === req.headers['if-none-match']) {
            return res.status(304).send('Not Modified');
        }

        res.setHeader('ETag', data.etag); // Set etag in response header
        res.send(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
};