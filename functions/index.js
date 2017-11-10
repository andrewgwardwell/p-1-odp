const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const ip6addr = require('ip6addr');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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
    return ip6addr.createCIDR(cdir).contains(ip)
}
