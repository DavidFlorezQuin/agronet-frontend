import { Role } from "../role/role.module";
import { User } from "../users/User.module";

export interface UserRole {
    id:number, 
    RoleId:number, 
    UserId:number
}