const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });

exports.valid = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        admin.firestore().collection('config').doc('whitelist').get().then(
            ips => {
                const { cdirs } = ips.data();
                const valid = cdirs.some(cdir => cdirContains(cdir, req.ip));
                res.send({ valid })
            },
            error => console.error(error)
        )
    })
});

function cdirContains(cdir, ip) {
    return cdir.split('/', 2)[0] == ip;
}
