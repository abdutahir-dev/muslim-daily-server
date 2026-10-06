import { jest } from '@jest/globals';

// We must mock the module before importing the controller
jest.unstable_mockModule('../src/utils/calendarUtils.js', () => ({
    bulkConvert: jest.fn(),
    convertDate: jest.fn()
}));

// We also mock the db connection since it might be imported by the controller
jest.unstable_mockModule('../src/db/connection.js', () => ({
    getDb: jest.fn()
}));

describe('calendarController', () => {
    let controller;
    let calUtils;

    beforeEach(async () => {
        // Reset modules and re-import dependencies
        jest.resetModules();
        calUtils = await import('../src/utils/calendarUtils.js');
        controller = await import('../src/controllers/calendarController.js');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('convertBulk', () => {
        it('should return 400 when cal.bulkConvert throws an error', async () => {
            // Arrange
            const errorMessage = 'Invalid date format';
            calUtils.bulkConvert.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            const req = {
                body: {
                    from: 'gregorian',
                    to: 'hijri',
                    startDate: 'invalid-date',
                    endDate: '2023-01-31'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Act
            await controller.convertBulk(req, res);

            // Assert
            expect(calUtils.bulkConvert).toHaveBeenCalledWith({
                from: 'gregorian',
                to: 'hijri',
                startDate: 'invalid-date',
                endDate: '2023-01-31'
            });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: errorMessage
            });
        });
    });
});
