import { RoleIdAndPermissions } from "../models";
import AxiosService from "./axios.service";


const saveRolePermissions = (
    roleIdAndPermissions: RoleIdAndPermissions,
) => {
    let result$ = AxiosService.post<any>(
        `Roles/SaveRolePermissions`,
        roleIdAndPermissions,
    );
    return result$;
}

const RoleService = {
    saveRolePermissions: saveRolePermissions
};

export default RoleService;