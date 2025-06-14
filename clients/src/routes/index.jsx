import React from "react";
import userRoutes from "../pages/users";
import authRoutes from "../pages/auth";
import orgRoutes from "../pages/organizers";
import staffRoutes from "../pages/staff";
import adminRoutes from "../pages/admin";

const routeGroups = [
  userRoutes,
  authRoutes,
  orgRoutes,
  staffRoutes,
  adminRoutes,
];

const generateRoutes = () => {
  const result = [];

  routeGroups.forEach((group) => {
    // 1. Route không layout
    if (group.flat) {
      result.push(...group.flat);
    }

    // 2. Route có layout nhưng phải flatten
    if (group.__layout__) {
      const {
        path: layoutPath,
        layout: LayoutComponent,
        children,
      } = group.__layout__;

      children.forEach((child) => {
        result.push({
          path: `${layoutPath}/${child.path}`,
          element: <LayoutComponent>{child.element}</LayoutComponent>,
        });
      });
    }
  });

  return result;
};

const routes = generateRoutes();

export default routes;
