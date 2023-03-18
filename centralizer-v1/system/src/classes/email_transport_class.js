import nodemailer from "nodemailer";

export default class EmailTransport{
    get config() {
        return this._config;
    }

    set config(value) {
        this._config = value;
    }


    constructor(config) {

        this._config = config;
    }

    emailTransporter(){
        return nodemailer.createTransport(this._config);
    }

    async sendAnEmail(body) {
        const transporter = this.emailTransporter();
        try {
            console.log("[NODEMAILER] sending email")
            await transporter.sendMail(body).then(r => {
                console.log("[NODEMAILER] sent email", r)
            });
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }



}