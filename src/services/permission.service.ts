

const getPermissions = async (): Promise<string[]> => {
    // TODO make this cached like shareReplay in rxjs
    const Permissions = JSON.parse(localStorage.getItem('user'))?.permissions;
    return Permissions ? JSON.parse(Permissions) : [];
};

const PermissionService = {
    getPermissions
};

export default PermissionService;