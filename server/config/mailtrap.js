if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}
import { MailtrapClient } from 'mailtrap'

const mailtrapClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
});

const sender = {
    email: "hello@demomailtrap.com",
    name: "PixAI Mailtrap Test",
};

export { mailtrapClient, sender }