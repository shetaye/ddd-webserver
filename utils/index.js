let nonce = 0;
module.exports = {
    checkSnowflake(snowflake) {
        if(!snowflake) { return false; } /* Is it null? */
        if(!/^\d+$/.test(snowflake)) { return false; } /* is it a number? */
        if(BigInt(snowflake) < 0 || BigInt(snowflake) > BigInt('18446744073709551615')) { return false; } /* Is it a 64-bit number? */
        return true;
    },
    generateSnowflake() {
        /* Timestamp: seconds since DDD epoch (first second of 2019) */
        let timestamp = (Math.floor(Date.now() / 1000) - 1546300800).toString(2);
        // Best way to pad I guess
        timestamp = '000000000000000000000000000000000000000000'.substr(timestamp.length) + timestamp;
        /* Process ID */
        let pid = (0).toString(2);
        pid = '00000'.substr(pid.length) + pid;
        /* Machine ID */
        let mid = (process.env.mid | 0).toString(2);
        mid = '00000'.substr(mid.length) + mid;
        /* Nonce */
        let incrementor = nonce.toString(2);
        incrementor = '000000000000'.substr(incrementor.length) + incrementor;
        nonce++;
        if(nonce > Math.pow(2, 12) - 1) {
            nonce = 0;
        }
        /* Put it together */
        return parseInt(`${timestamp}${mid}${pid}${incrementor}`, 2).toString(10);
    },
};