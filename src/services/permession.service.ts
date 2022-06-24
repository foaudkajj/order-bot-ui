

const getPermissions = async (): Promise<string[]> => {
    // TODO make this cached like shareReplay in rxjs
    const Permissions = JSON.parse(localStorage.getItem('user'))?.Permessions; // TODO rename Permessions to PermIssions
    return Permissions ? JSON.parse(Permissions) : [];
};

const PermissionService = {
    getPermissions
};

export default PermissionService;