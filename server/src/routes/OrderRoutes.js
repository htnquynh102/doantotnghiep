const express = require("express");
const { authMiddleware } = require("../middleware/AuthMiddleware");
const {
  getOrders,
  placeOrder,
  getOrdersByUser,
  getOrderById,
  updateTicketOrder,
  updateOrderCompleted,
  updateOrderCanceled,
  getOrdersByEvent,
} = require("../controllers/OrderController");

const router = express.Router();

router.get("/get-orders", getOrders);
router.post(
  "/place-order",
  //  authMiddleware(["VT000004"]),
  placeOrder
);
router.get("/get-order-by-user/:id", getOrdersByUser);
router.get("/get-order-by-event/:id", getOrdersByEvent);
router.get("/get-order-by-id/:id", getOrderById);
router.put("/update-ticket-order", updateTicketOrder);
router.put("/update-order-completed", updateOrderCompleted);
router.patch("/update-order-canceled", updateOrderCanceled);

module.exports = router;
