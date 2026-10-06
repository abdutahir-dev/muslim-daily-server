import express from 'express';
import * as calendarController from '../controllers/calendarController.js';
import { authenticateToken, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Conversions ---
router.post('/convert', calendarController.convert);
router.post('/convert/bulk', calendarController.convertBulk);

// --- Holidays ---
router.get('/holidays', calendarController.listHolidays);
router.post('/holidays', authenticateToken, adminOnly, calendarController.addHoliday);
router.put('/holidays/:id', authenticateToken, adminOnly, calendarController.updateHoliday);
router.delete('/holidays/:id', authenticateToken, adminOnly, calendarController.deleteHoliday);

// --- Calendars ---
router.get('/calendars', authenticateToken, calendarController.listCalendars);
router.post('/calendars', authenticateToken, calendarController.addCalendar);
router.put('/calendars/:id', authenticateToken, calendarController.updateCalendar);
router.delete('/calendars/:id', authenticateToken, calendarController.deleteCalendar);

// --- Events ---
router.get('/events', authenticateToken, calendarController.listEvents);
router.post('/events', authenticateToken, calendarController.addEvent);
router.put('/events/:id', authenticateToken, calendarController.updateEvent);
router.delete('/events/:id', authenticateToken, calendarController.deleteEvent);

// --- Tasks ---
router.get('/tasks', authenticateToken, calendarController.listTasks);
router.post('/tasks', authenticateToken, calendarController.addTask);
router.put('/tasks/:id', authenticateToken, calendarController.updateTask);
router.delete('/tasks/:id', authenticateToken, calendarController.deleteTask);

// --- Notes ---
router.get('/notes', authenticateToken, calendarController.listNotes);
router.post('/notes', authenticateToken, calendarController.addNote);
router.put('/notes/:id', authenticateToken, calendarController.updateNote);
router.delete('/notes/:id', authenticateToken, calendarController.deleteNote);

// --- Sync ---
router.post('/sync/push', authenticateToken, calendarController.pushSync);
router.get('/sync/pull', authenticateToken, calendarController.pullSync);

export default router;
