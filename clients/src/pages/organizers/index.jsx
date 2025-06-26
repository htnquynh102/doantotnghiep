import OrganizerLayout from "./OrganizerLayout/OrganizerLayout";
import CreateEvent from "./CreateEvent/CreateEvent";
import OrganizerEvents from "./OrganizerEvents/OrganizerEvents";
import OrganizerProfile from "./OrganizerProfile/OrganizerProfile";
import EditEvent from "./EditEvent/EditEvent";
import ViewEvent from "./ViewEvent/ViewEvent";

import ChangePassword from "./ChangePassword/ChangePassword";

const orgLayoutRoutes = [
  { path: "dashboard", element: <div>Dashboard</div> },
  { path: "profile", element: <OrganizerProfile /> },
  { path: "password", element: <ChangePassword /> },
  { path: "my-events", element: <OrganizerEvents /> },
  { path: "create-event", element: <CreateEvent /> },
  { path: "logout", element: <div>Logout</div> },
  {
    path: "my-events/:eventId/edit",
    element: <EditEvent />,
  },
  {
    path: "my-events/:eventId/view",
    element: <ViewEvent />,
  },
];

export default {
  __layout__: {
    path: "/organizer",
    layout: OrganizerLayout,
    children: orgLayoutRoutes,
  },
};
