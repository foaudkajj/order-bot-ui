import { HomePage, OrderPage, RoleManagement, TasksPage, UserManagementPage } from "./pages";
import { withNavigationWatcher } from "./contexts/navigation.context";

const routes = [
  {
    path: "/tasks",
    element: TasksPage,
  },
  {
    path: "/orders",
    element: OrderPage,
  },
  {
    path: "/home",
    element: HomePage,
  },
  {
    path: "/usermanagement",
    element: UserManagementPage,
  },
  {
    path: "/rolemanagement",
    element: RoleManagement
  }
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
