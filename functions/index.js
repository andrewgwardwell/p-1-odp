const functions = require('firebase-functions');
const _ = require('lodash');
const cors = require('cors')({ origin: true });
const ip6addr = require('ip6addr');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.valid = functions.https.onRequest((req, res) => {
    admin.firestore().collection('config').doc('whitelist').get().then(
        ips => {
            const { cdirs } = ips.data();
            const valid = cdirs.some(cdir => cdirContains(cdir, req.ip));
            cors(req, res, () => {
                res.send({ valid })
            })
        },
        error => console.error(error)
    );
});

function cdirContains(cdir, ip) {
    return ip6addr.createCIDR(cdir).contains(ip)
}

// exports.updateUncategorized = functions.firestore.document('sightings/{sightingId}/elements}').onWrite(event => {
//     var sightingElements = event.data.data();
//     if (!sightingElements) { return; }
//     var elements = sighting.name;
// });

exports.categorize = functions.https.onRequest((req, res) => {
    const elementIds = {};
    admin.firestore().collection('elements').get().then(qs => {
        qs.forEach(ds => elementIds[ds.id] = true);
        // console.info('element ids', elementIds);
        return admin.firestore().collection('sightings').get()
    }).then(qs =>
        qs.forEach(ds => analyze(ds.data(), elementIds))
        ).then(() => res.send({ ok: true }))
        .catch(error => console.error(error));
});

function analyze(sighting, elementIds) {
    let categorized = false;
    // console.info('analyze', sighting.elements);
    _.mapKeys(sighting.elements, (v, k) => {
        // console.info(sighting.title, k, elementIds[k]);
        if (elementIds[k]) {
            categorized = true;
        } else {
            console.info('unknown sighting id', k, 'in', sighting.title);
        }
    })
    if (!sighting.uncategorized != categorized) {
        console.info(sighting.title, categorized);
    }
}
