import { Category, Role } from "../pages/models";
import AxiosService from "./axios.service";

const getRoles = async () => {
    return AxiosService.get<Role>(`Roles/Get`);
};

const getCategories = async () => {
    return AxiosService.get<Category>(`Category/Get`);
};

const GetService = {
    getRoles,
    getCategories
};

export default GetService;