import AdminLayout from "./AdminLayout/AdminLayout";
import AccountManage from "./AccountManage/AccountManage";
import Dashboard from "./Dashboard/Dashboard";

import EditUser from "./EditUser/EditUser";
import EditOrganizer from "./EditOrganizer/EditOrganizer";
import DeletedAccount from "./DeletedAccount/DeletedAccount";
import EditStaff from "./EditStaff/EditStaff";
import CreateAccount from "./CreateAccount/CreateAccount";

const adminLayoutRoutes = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "account-manage", element: <AccountManage /> },
  { path: "account-manage/user/:accountId", element: <EditUser /> },
  { path: "account-manage/org/:accountId", element: <EditOrganizer /> },
  { path: "account-manage/staff/:accountId", element: <EditStaff /> },
  { path: "account-manage/deleted", element: <DeletedAccount /> },
  { path: "account-manage/create", element: <CreateAccount /> },
];

export default {
  __layout__: {
    path: "/admin",
    layout: AdminLayout,
    children: adminLayoutRoutes,
  },
};
