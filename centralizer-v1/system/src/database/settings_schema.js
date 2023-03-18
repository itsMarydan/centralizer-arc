import mongoose from "mongoose";
const config = require('../config')['environment'];
const settingsSchema = new mongoose.Schema({
    settingsType: {
        type: String
    },
    settingsId: {
        type: String,
    },
    settingsConfig: {
        type: {}
    },

})
mongoose.connect(`${config.db.url}/${config.db.database}`).then();
export const SettingsSchema = mongoose.model('bc_settings', settingsSchema);
