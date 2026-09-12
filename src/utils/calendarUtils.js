// lightweight calendar conversion utilities
// All conversions go via Julian Day Number (JDN) for accuracy

// Gregorian to JDN
export function gregorianToJDN(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function jdnToGregorian(jdn) {
    let a = Math.floor(jdn) + 32044;
    let b = Math.floor((4 * a + 3) / 146097);
    let c = a - Math.floor((146097 * b) / 4);
    let d = Math.floor((4 * c + 3) / 1461);
    let e = c - Math.floor((1461 * d) / 4);
    let m = Math.floor((5 * e + 2) / 153);
    let day = Math.floor(e - Math.floor((153 * m + 2) / 5) + 1);
    let month = m + 3 - 12 * Math.floor(m / 10);
    let year = b * 100 + d - 4800 + Math.floor(m / 10);
    return { year, month, day };
}

// Arithmetic Hijri (tabular) conversion
export function hijriToJDN(year, month, day) {
    // month 1..12, day 1..30
    const N = day + Math.ceil(29.5 * (month - 1)) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30);
    return N + 1948439.5; // epoch offset
}

export function jdnToHijri(jdn) {
    const l = jdn - 1948439.5;
    const year = Math.floor((30 * l + 10646) / 10631);
    const month = Math.min(12, Math.ceil((jdn - 29 - hijriToJDN(year, 1, 1)) / 29.5) + 1);
    const day = Math.round(jdn - hijriToJDN(year, month, 1) + 1);
    return { year, month, day };
}

// Ethiopian conversions
export function ethiopianToJDN(year, month, day) {
    const jd = 1723856 + 365 * (year - 1) + Math.floor((year - 1) / 4) + 30 * (month - 1) + day - 1;
    return jd;
}

export function jdnToEthiopian(jdn) {
    const r = jdn - 1723856;
    const year = Math.floor((4 * r + 1463) / 1461);
    const rem = r - (365 * (year - 1) + Math.floor((year - 1) / 4));
    const month = Math.floor(rem / 30) + 1;
    const day = (rem % 30) + 1;
    return { year, month, day };
}

// generic convert
export function convertDate({ from, to, date, options = {} }) {
    // timezone-aware parsing
    function parseISO(dstr) {
        if (!options.timezone) {
            const dt = new Date(dstr);
            return dt;
        }
        // create date for given timezone by using toLocaleString hack
        const dt = new Date(dstr);
        const str = dt.toLocaleString('en-US', { timeZone: options.timezone });
        return new Date(str);
    }

    // date may be ISO string or object with year,month,day
    let jdn;
    let y, m, d;
    if (typeof date === 'string') {
        const dt = parseISO(date);
        y = dt.getUTCFullYear();
        m = dt.getUTCMonth() + 1;
        d = dt.getUTCDate();
    } else {
        ({ year: y, month: m, day: d } = date);
    }
    switch (from) {
        case 'gregorian':
            jdn = gregorianToJDN(y, m, d);
            break;
        case 'hijri':
            jdn = hijriToJDN(y, m, d);
            break;
        case 'ethiopian':
            jdn = ethiopianToJDN(y, m, d);
            break;
        default:
            throw new Error('unsupported from');
    }
    let result;
    switch (to) {
        case 'gregorian':
            result = jdnToGregorian(jdn);
            break;
        case 'hijri':
            result = jdnToHijri(jdn);
            break;
        case 'ethiopian':
            result = jdnToEthiopian(jdn);
            break;
        default:
            throw new Error('unsupported to');
    }
    return result;
}

export function bulkConvert({ from, to, startDate, endDate }) {
    const results = [];
    let current = new Date(startDate);
    const last = new Date(endDate);
    while (current <= last) {
        results.push({
            input: current.toISOString().split('T')[0],
            output: convertDate({ from, to, date: current.toISOString().split('T')[0] })
        });
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return results;
}