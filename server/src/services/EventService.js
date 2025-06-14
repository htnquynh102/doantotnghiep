const eventModel = require("../models/EventModel");

exports.getAllEvents = async () => {
  const events = await eventModel.findAllEvent();

  if (!events || events.length === 0) {
    const error = new Error("No records found!");
    error.statusCode = 404;
    throw error;
  }

  return events;
};

exports.getLatestEvents = async () => {
  const events = await eventModel.findLatestEvents();
  if (!events || events.length === 0) {
    const error = new Error("No records found!");
    error.statusCode = 404;
    throw error;
  }
  return events;
};

exports.getEventById = async (eventId) => {
  if (!eventId) {
    const error = new Error("Invalid Event Id!");
    error.statusCode = 400;
    throw error;
  }

  const event = await eventModel.findEventById(eventId);

  return event;
};

exports.updateEventStatus = async (eventId, status) => {
  return await eventModel.updateStatus(eventId, status);
};

exports.createEvent = async (eventData) => {
  return await eventModel.insertEvent(eventData);
};

exports.updateEvent = async (eventId, eventData) => {
  return await eventModel.updateEvent(eventId, eventData);
};
