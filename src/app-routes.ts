import {
  Categories,
  Customers,
  HomePage,
  OrderPage,
  Products,
  RoleManagement,
  UserManagementPage,
} from "./pages";
import { withNavigationWatcher } from "./contexts/navigation.context";

const routes = [
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
    element: RoleManagement,
  },
  {
    path: "/categories",
    element: Categories,
  },
  {
    path: "/products",
    element: Products,
  },
  {
    path: "/customers",
    element: Customers,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
