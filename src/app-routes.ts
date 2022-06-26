import { Categories, HomePage, OrderPage, Products, RoleManagement, TasksPage, UserManagementPage } from "./pages";
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
  },
  {
    path: "/categories",
    element: Categories
  }
  ,
  {
    path: "/products",
    element: Products
  }
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
