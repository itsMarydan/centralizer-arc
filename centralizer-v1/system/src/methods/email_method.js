import Emailing from "../classes/email_class";
import Settings from "../classes/settings_class";

export async function processEmail(email) {
    const settingsType = "email-server"
    const emailServer = await retrieveSettingsByTypeMethod(settingsType);
    if (emailServer) {
        const emailObj = new Emailing(emailServer.settingsConfig.sender, email.to, email.subject, email.html);
        try {
            await emailObj.sendEmail(emailServer.settingsConfig.config)
            console.log("[SYS-OPS] email sent");
            return true;
        } catch (e) {
            console.error("[SYS-OPS] email not sent", e);
            return false;
        }
    } else {
        console.error("[SYS-OPS] Email SMTP Settings not found");
        return false;
    }

}
async function retrieveSettingsByTypeMethod(settingsType) {
    const newSettings = new Settings();
    newSettings.settingsType = settingsType;
    try {
        return await newSettings.retrieveSettingsByType();
    }catch (e) {
        console.error ( "[SYS-OPS] Error on retrieve settings", e )
        return false
    }

}