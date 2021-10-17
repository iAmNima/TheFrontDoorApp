const router = require("express").Router();
const events = require('events');
const emitter = new events.EventEmitter();

const useServerSentEventsMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();

    const sendEventStreamData = (data) => {
        const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`;
        res.write(sseFormattedResponse);
    }

    // we are attaching sendEventStreamData to res, so we can use it later
    Object.assign(res, {
        sendEventStreamData
    });

    next();
}

const onReservationEvent = (req, res) => {
    const sendReservation = (data) => {
        res.sendEventStreamData(data);
    };
    emitter.on('update', sendReservation);

    res.on('close', () => {
        emitter.removeListener('update', sendReservation);
        res.end();
    });
}

router.route("/refresh").get(useServerSentEventsMiddleware, onReservationEvent);

router.route("/emit").post((req, res) => {
    emitter.emit('update', req.body);
    res.status(200).json();
});

module.exports = router;
