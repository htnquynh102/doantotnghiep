import HomePage from "./HomePage/HomePage";
import EventsPage from "./EventsPage/EventsPage";
import EventDetail from "./EventDetail/EventDetail";
import UserLayout from "./UserLayout/UserLayout";
import UserEvent from "./UserEvent/UserEvent";
import TicketList from "./TicketList/TicketList";
import UserProfile from "./UserProfile/UserProfile";
import OrderPage from "./Order/Order";
import OrderSuccess from "./OrderSuccess/OrderSuccess";
import ChangePassword from "./ChangePassword/ChangePassword";

const flatRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/events", element: <EventsPage /> },
  { path: "/eventDetail/:eventId", element: <EventDetail /> },
  { path: "/order/:eventId/:programId", element: <OrderPage /> },
  { path: "/order-result/:orderId", element: <OrderSuccess /> },
];

const userLayoutRoutes = [
  { path: "profile", element: <UserProfile /> },
  { path: "joined-events", element: <UserEvent /> },
  { path: "joined-events/:orderId/list-ticket", element: <TicketList /> },
  { path: "password", element: <ChangePassword /> },
];

export default {
  flat: flatRoutes,
  __layout__: {
    path: "/user",
    layout: UserLayout,
    children: userLayoutRoutes,
  },
};
