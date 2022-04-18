const {
    ENV_NAME,
    PORT = '3000',
    NATS_URI,
    NATS_USER,
    NATS_PASSWORD
} = process.env;

let port = parseInt(PORT, 10);
if (isNaN(port)) {
    port = 3000;
}

const config = {
    envName: ENV_NAME || 'dev',
    http: {
        port: port
    },
    nats: {
        maxReconnectAttempts: -1,
        reconnectTimeWait: 250,

        // Это позволит получить ответ от всех облажавшихся дальше nats.request
        requestTimeout: 30000,
        url: NATS_URI || 'http://nats:4222',
        user: NATS_USER,
        pass: NATS_PASSWORD,
        group: 'flomni-new'
    }
};

export {config};