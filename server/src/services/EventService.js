const eventModel = require("../models/EventModel");
const notificationModel = require("../models/NotificationModel");
const { sendRealtimeNotification } = require("../socket/socketManager");

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
  const event = await eventModel.findEventById(eventId);
  const maTaiKhoan = event?.maTaiKhoan;

  await eventModel.updateStatus(eventId, status);

  if (maTaiKhoan) {
    let noiDung = "";

    if (status == 1) noiDung = `Sự kiên: ${event.tenSuKien} đã được phê duyệt`;
    if (status == 2) noiDung = `Sự kiên: ${event.tenSuKien} đã bị từ chối`;

    if (noiDung !== "")
      await notificationModel.createNotification(
        maTaiKhoan,
        "Phản hồi đăng ký sự kiện",
        noiDung
      );

    sendRealtimeNotification(maTaiKhoan, {
      tieuDe: "Phản hồi đăng ký sự kiện",
      noiDung: noiDung,
    });
  }
};

exports.createEvent = async (eventData) => {
  return await eventModel.insertEvent(eventData);
};

exports.updateEvent = async (eventId, eventData) => {
  return await eventModel.updateEvent(eventId, eventData);
};
