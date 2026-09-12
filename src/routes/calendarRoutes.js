import express from 'express';
import * as calendarController from '../controllers/calendarController.js';

const router = express.Router();

// --- Conversions ---
router.post('/convert', calendarController.convert);
router.post('/convert/bulk', calendarController.convertBulk);

// --- Holidays ---
router.get('/holidays', calendarController.listHolidays);
router.post('/holidays', calendarController.addHoliday);
router.put('/holidays/:id', calendarController.updateHoliday);
router.delete('/holidays/:id', calendarController.deleteHoliday);

// --- Calendars ---
router.get('/calendars', calendarController.listCalendars);
router.post('/calendars', calendarController.addCalendar);
router.put('/calendars/:id', calendarController.updateCalendar);
router.delete('/calendars/:id', calendarController.deleteCalendar);

// --- Events ---
router.get('/events', calendarController.listEvents);
router.post('/events', calendarController.addEvent);
router.put('/events/:id', calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);

// --- Tasks ---
router.get('/tasks', calendarController.listTasks);
router.post('/tasks', calendarController.addTask);
router.put('/tasks/:id', calendarController.updateTask);
router.delete('/tasks/:id', calendarController.deleteTask);

// --- Notes ---
router.get('/notes', calendarController.listNotes);
router.post('/notes', calendarController.addNote);
router.put('/notes/:id', calendarController.updateNote);
router.delete('/notes/:id', calendarController.deleteNote);

// --- Sync ---
router.post('/sync/push', calendarController.pushSync);
router.get('/sync/pull', calendarController.pullSync);

export default router;
