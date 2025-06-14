const eventService = require("../services/EventService");
const AppError = require("../utils/AppError");

const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).send({
      success: true,
      message: "All event records",
      totalEvent: events.length,
      data: events,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Error in get all events api", 500));
  }
};

const getLatestEvents = async (req, res, next) => {
  try {
    const events = await eventService.getLatestEvents();
    res.status(200).send({
      success: true,
      message: "Latest event records",
      data: events,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Error in get latest events api", 500));
  }
};

const getEventById = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const eventDetail = await eventService.getEventById(eventId);

    if (!eventDetail || eventDetail.length === 0) {
      return next(new AppError("No record found", 404));
    }

    res.status(200).send({
      success: true,
      message: "Event record",
      data: eventDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetch full event details api",
      error: {
        details: error.message,
      },
    });
  }
};

const updateEventStatus = async (req, res) => {
  const { id, status } = req.params;

  try {
    await eventService.updateEventStatus(id, status);
    res.status(200).send({
      success: true,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    return res.status(500).send({
      success: false,
      message: "Error in update Event status api",
      error: {
        details: error.message || null,
      },
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const files = req.files;
    const anhBia = files?.anhBia ? files.anhBia[0].path : null;
    const minhChungFiles = files?.minhChung
      ? files.minhChung.map((f) => f.path)
      : [];

    const chuongTrinh = req.body.chuongTrinh
      ? Array.isArray(req.body.chuongTrinh)
        ? req.body.chuongTrinh
        : JSON.parse(req.body.chuongTrinh)
      : [];

    const minhChung = minhChungFiles.length
      ? minhChungFiles.map((file) => ({ tepDinhKem: file }))
      : [];

    const eventData = {
      ...req.body,
      anhBia,
      chuongTrinh,
      minhChung,
    };

    const event = await eventService.createEvent(eventData);

    res.status(200).send({
      success: true,
      message: "New event created!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const files = req.files;
    const anhBia = files?.anhBia ? files.anhBia[0].path : null;
    const minhChungFiles = files?.minhChung
      ? files.minhChung.map((f) => f.path)
      : [];

    const chuongTrinh = req.body.chuongTrinh
      ? Array.isArray(req.body.chuongTrinh)
        ? req.body.chuongTrinh
        : JSON.parse(req.body.chuongTrinh)
      : [];

    const minhChung = minhChungFiles.length
      ? minhChungFiles.map((file) => ({ tepDinhKem: file }))
      : [];

    const eventData = {
      ...req.body,
      anhBia,
      chuongTrinh,
      minhChung,
    };

    const eventId = req.params.id;

    const event = await eventService.updateEvent(eventId, eventData);

    res.status(200).send({
      success: true,
      message: "Event updated!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEvents,
  getLatestEvents,
  getEventById,
  updateEventStatus,
  createEvent,
  updateEvent,
};
