import { z } from 'zod';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            return res.status(400).json({
                error: 'Validation Error',
                details: error.errors.map(err => ({
                    path: err.path,
                    message: err.message
                }))
            });
        }
    };
};

// Common Schemas
export const schemas = {
    auth: {
        register: z.object({
            body: z.object({
                username: z.string().min(3).max(20),
                password: z.string().min(6),
                role: z.enum(['user', 'admin']).optional(),
            }),
        }),
        login: z.object({
            body: z.object({
                username: z.string(),
                password: z.string(),
            }),
        }),
    },
    prayer: {
        log: z.object({
            body: z.object({
                prayer_name: z.string(),
                status: z.boolean().optional(),
                prayed_as: z.string().optional(),
            }),
        }),
    },
    social: {
        createGroup: z.object({
            body: z.object({
                name: z.string().min(3).max(50),
                description: z.string().max(255).optional(),
            }),
        }),
        joinGroup: z.object({
            body: z.object({
                groupId: z.number().int(),
            }),
        }),
        createChallenge: z.object({
            body: z.object({
                groupId: z.number().int(),
                title: z.string().min(3).max(100),
                description: z.string().optional(),
                type: z.string(),
                targetValue: z.number().int().positive(),
                startDate: z.string(),
                endDate: z.string(),
            }),
        }),
        updateChallengeProgress: z.object({
            body: z.object({
                challengeId: z.number().int(),
                progress: z.number().int().positive(),
            }),
        }),
    }
};
