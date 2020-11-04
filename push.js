var webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BBHpPB4nEoFvLqr9ffh1rluBBzC4u1tOuu4quWbeoNt4fLdXiLgwNuN0DqAs7LX-Xa6p3MolEhwRnWLOp6fp-X0",
    "privateKey": "XSQvIYLWQmZ4h4rL84CvOse0a6RTGMbTh9s1BGjKdcg"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
//data berubah2
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cB0y5QWwAeM:APA91bE6WL3Ys1IpIfghSd9dBEbuQoICmhi5qxRUbTEuUEwlPePjcBHGLEdxWGi7eG3oSkZzkRuZF3uJom7GgZYHehbCuUnB-2O7Cy020E2oD9serWUTUqGlOxhUY5Pv-cgPfb5HEh7N",
    "keys": {
        "p256dh": "BCLeaEHqoQE8b6/GX3uWUzc9Soc2VGrbTpH62g95kinkaExUjeLnXDyt5JDoEwkrS5GKQgjZ1cusi01jgOdwZYQ=",
        "auth": "xwFUwQA7OdbSGOw1atlo1g=="
    }
};
//isi
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
var options = {
    gcmAPIKey: '863728007042',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);