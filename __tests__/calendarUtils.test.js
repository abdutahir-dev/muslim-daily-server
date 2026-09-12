import { convertDate, gregorianToJDN, jdnToGregorian, hijriToJDN, jdnToHijri, ethiopianToJDN, jdnToEthiopian } from '../src/utils/calendarUtils.js';

describe('calendar utilities', () => {
    test('gregorian <-> jdn roundtrip', () => {
        const j = gregorianToJDN(2026, 3, 5);
        const { year, month, day } = jdnToGregorian(j);
        expect(year).toBe(2026);
        expect(month).toBe(3);
        expect(day).toBe(5);
    });

    test('hijri conversion sample', () => {
        const j = hijriToJDN(1447, 9, 14); // 14 Ramadan 1447 or approximate
        const h = jdnToHijri(j);
        expect(h.year).toBe(1447);
        expect(h.month).toBe(9);
    });

    test('ethiopian conversion sample', () => {
        const j = ethiopianToJDN(2018, 6, 15);
        const e = jdnToEthiopian(j);
        expect(e.year).toBe(2018);
        expect(e.month).toBe(6);
        expect(e.day).toBe(15);
    });

    test('generic conversion via convertDate', () => {
        const g2h = convertDate({ from: 'gregorian', to: 'hijri', date: '2026-03-05' });
        expect(g2h).toHaveProperty('year');
        const h2g = convertDate({ from: 'hijri', to: 'gregorian', date: { year: g2h.year, month: g2h.month, day: g2h.day } });
        expect(h2g.year).toBe(2026);
    });

    test('timezone option does not break conversion', () => {
        const g2h = convertDate({ from: 'gregorian', to: 'ethiopian', date: '2026-03-05', options: { timezone: 'UTC' } });
        expect(g2h).toHaveProperty('year');
        expect(typeof g2h.month).toBe('number');
    });
});
