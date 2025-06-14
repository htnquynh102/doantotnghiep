import StaffLayout from "./StaffLayout/StaffLayout";
import ListOrganizer from "./ListOrganizer/ListOrganizer";
import VerifyOrganizer from "./VerifyOrganizer/VerifyOrganizer";
import ListEvent from "./ListEvent/ListEvent";
import VerifyEvent from "./VerifyEvent/VerifyEvent";
import ListCategory from "./ListCategory/ListCategory";

const staffLayoutRoutes = [
  { path: "list-organizer", element: <ListOrganizer /> },
  { path: "list-event", element: <ListEvent /> },
  { path: "list-category", element: <ListCategory /> },
  {
    path: "list-organizer/:orgId",
    element: <VerifyOrganizer />,
  },
  {
    path: "list-event/:eventId",
    element: <VerifyEvent />,
  },
];

export default {
  __layout__: {
    path: "/staff",
    layout: StaffLayout,
    children: staffLayoutRoutes,
  },
};
