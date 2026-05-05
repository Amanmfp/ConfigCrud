"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicModel = exports.invalidateModel = exports.buildDynamicModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SchemaDefinition_1 = require("../models/SchemaDefinition");
const modelCache = new Map();
const buildMongooseField = (field) => {
    switch (field.type) {
        case "string": {
            const f = { type: String };
            if (field.required)
                f.required = [true, `${field.label ?? field.name} is required`];
            if (field.unique)
                f.unique = true;
            if (field.default !== undefined)
                f.default = field.default;
            if (field.validators?.length) {
                f.validate = field.validators.map((v) => {
                    if (v.type === "minLength")
                        return { validator: (val) => val.length >= v.value, message: v.message };
                    if (v.type === "maxLength")
                        return { validator: (val) => val.length <= v.value, message: v.message };
                    if (v.type === "match")
                        return { validator: (val) => new RegExp(v.value).test(val), message: v.message };
                    return null;
                }).filter(Boolean);
            }
            return f;
        }
        case "number": {
            const f = { type: Number };
            if (field.required)
                f.required = true;
            if (field.default !== undefined)
                f.default = field.default;
            if (field.validators?.length) {
                f.validate = field.validators.map((v) => {
                    if (v.type === "min")
                        return { validator: (val) => val >= v.value, message: v.message };
                    if (v.type === "max")
                        return { validator: (val) => val <= v.value, message: v.message };
                    return null;
                }).filter(Boolean);
            }
            return f;
        }
        case "boolean": return { type: Boolean, default: field.default ?? false };
        case "date": return { type: Date, required: field.required ?? false };
        case "enum": return { type: String, enum: { values: field.options ?? [], message: "{VALUE} is not valid" }, required: field.required };
        case "relation":
            return field.multiple
                ? [{ type: mongoose_1.Schema.Types.ObjectId, ref: field.relation }]
                : { type: mongoose_1.Schema.Types.ObjectId, ref: field.relation };
        case "array": {
            const itemType = field.arrayOf === "number" ? Number : field.arrayOf === "boolean" ? Boolean : String;
            return [{ type: itemType }];
        }
        case "mixed": return mongoose_1.Schema.Types.Mixed;
        default: return mongoose_1.Schema.Types.Mixed;
    }
};
const buildDynamicModel = (schemaDef) => {
    if (modelCache.has(schemaDef.name))
        return modelCache.get(schemaDef.name);
    const shape = {};
    for (const field of schemaDef.fields) {
        shape[field.name] = buildMongooseField(field);
    }
    const mongooseSchema = new mongoose_1.Schema(shape, { timestamps: true });
    const model = mongoose_1.default.model(schemaDef.name, mongooseSchema, schemaDef.name);
    modelCache.set(schemaDef.name, model);
    return model;
};
exports.buildDynamicModel = buildDynamicModel;
const invalidateModel = (modelName) => {
    modelCache.delete(modelName);
    if (mongoose_1.default.modelNames().includes(modelName)) {
        delete mongoose_1.default.connection.models[modelName];
    }
};
exports.invalidateModel = invalidateModel;
const getDynamicModel = async (modelName) => {
    if (modelCache.has(modelName))
        return modelCache.get(modelName);
    const schemaDef = await SchemaDefinition_1.SchemaDefinition.findOne({ name: modelName });
    if (!schemaDef)
        return null;
    return (0, exports.buildDynamicModel)(schemaDef);
};
exports.getDynamicModel = getDynamicModel;
