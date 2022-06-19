import { HomePage, TasksPage } from './pages';
import { withNavigationWatcher } from './contexts/navigation.context';

const routes = [
    {
        path: '/tasks',
        element: TasksPage
    },
    {
        path: '/home',
        element: HomePage
    }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
