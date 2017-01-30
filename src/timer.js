let interval;
let timeout;

function updateTimer() {
    if (timeout) {
        clearTimeout(timeout);
        document.getElementById('btn-timer').innerHTML = 'Start Timer';
        timeout = undefined;
        clearInterval(interval);
        interval = undefined;
    } else {
        const timer = prompt('How long to set a timer (in minutes)?', '45');
        if (timer) {
            const timerms = parseInt(timer, 10) * 60 * 1000;
            const start = new Date().getTime();
            interval = setInterval(() => {
                const now = new Date().getTime();
                const timeout = (timerms - (now - start)) / 1000;
                document.getElementById('btn-timer').innerHTML =
                    `Clear Timer ${parseInt(timeout / 60, 10)}:${parseInt(timeout % 60, 10)}`;
            }, 1000);
            timeout = setTimeout(() => {
                alert('Time out');
                document.getElementById('btn-timer').innerHTML = 'Start Timer';
                timeout = undefined;
                clearInterval(interval);
                interval = undefined;
            }, timerms);
        }
    }
}

module.exports = {
    updateTimer
};
