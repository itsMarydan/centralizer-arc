
import {
    createSettings,
    deleteSettings,
    retrieveAllSettings,
    retrieveSettings, retrieveSettingsByType,
    updateSettings
} from "./route/settings_route";

export const routes = [

    createSettings,
    updateSettings,
    retrieveSettings,
    deleteSettings,
    retrieveAllSettings,
    retrieveSettingsByType,

];
