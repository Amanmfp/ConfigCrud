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
exports.SchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const FieldDefSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true,
        enum: ["string", "number", "boolean", "date", "enum", "relation", "array", "mixed"] },
    required: { type: Boolean, default: false },
    unique: { type: Boolean, default: false },
    default: { type: mongoose_1.Schema.Types.Mixed },
    options: [String],
    relation: String,
    multiple: Boolean,
    arrayOf: String,
    validators: [{ type: String, value: mongoose_1.Schema.Types.Mixed, message: String }],
    label: String,
    placeholder: String,
    helpText: String,
    colSpan: Number,
    order: { type: Number, default: 0 },
    showInTable: { type: Boolean, default: true },
    showInForm: { type: Boolean, default: true },
    readOnly: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
}, { _id: false });
const SchemaDefinitionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    icon: String,
    fields: [FieldDefSchema],
}, { timestamps: true });
exports.SchemaDefinition = mongoose_1.default.model("SchemaDefinition", SchemaDefinitionSchema, "_schemas");
