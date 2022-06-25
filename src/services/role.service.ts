import { RoleIdAndPermessions } from "../pages/models";
import AxiosService from "./axios.service";


const saveRolePermessions = (
    roleIdAndPermessions: RoleIdAndPermessions,
) => {
    let result$ = AxiosService.post<any>(
        `Roles/SaveRolePermessions`,
        roleIdAndPermessions,
    );
    return result$;
}

const RoleService = {
    saveRolePermessions
};

export default RoleService;