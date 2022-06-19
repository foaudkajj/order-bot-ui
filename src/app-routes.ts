import { HomePage, OrderPage, TasksPage } from "./pages";
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
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
