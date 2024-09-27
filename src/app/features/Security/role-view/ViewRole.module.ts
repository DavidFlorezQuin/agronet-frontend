import { Role } from "../role/role.module"
import { View } from "../views/view.module"

export interface RoleView{
    id:number,
    roleId:number,
    viewId:number
    view:View
    role:Role
}