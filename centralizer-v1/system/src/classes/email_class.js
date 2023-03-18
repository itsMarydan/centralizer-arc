import EmailTransport from "./email_transport_class";

export default class Emailing {
    get from() {
        return this._from;
    }

    set from(value) {
        this._from = value;
    }

    get to() {
        return this._to;
    }

    set to(value) {
        this._to = value;
    }

    get subject() {
        return this._subject;
    }

    set subject(value) {
        this._subject = value;
    }

    get html() {
        return this._html;
    }

    set html(value) {
        this._html = value;
    }

    constructor(from, to, subject, html) {
        this._from = from;
        this._to = to;
        this._subject = subject;
        this._html = html;
    }

    async sendEmail(config) {
        const transporter = new EmailTransport(config);
        try {

            return transporter.sendAnEmail({
                from: `"Blue Content" <${this.from}>`,
                to: this.to,
                subject: this.subject,
                html: this.html,
            })
        } catch (e) {
            console.log(e)
            console.log("failed here")
            return false
        }

    }


}