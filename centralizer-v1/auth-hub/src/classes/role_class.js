import {RoleSchema} from "../database/mongoose/role_schema";
import {randomString} from "../helper";
import {permittedAppSlugsFromPolicies, policiesByIds, policyIdsFromRole} from "../database/mongo/methods/permissions";
import rolesJson from "../data/roles.json";
import {loadRoles} from "../database/mongo/methods/roles";
export  default  class  Role{
    get roleId() {
        return this._roleId;
    }

    set roleId(value) {
        this._roleId = value;
    }
    get roleDelete() {
        return this._roleDelete;
    }

    set roleDelete(value) {
        this._roleDelete = value;
    }

    get role() {
        return this._role;
    }

    set role(value) {
        this._role = value;
    }

    get roleName() {
        return this._roleName;
    }

    set roleName(value) {
        this._roleName = value;
    }

    get roleDisplay() {
        return this._roleDisplay;
    }

    set roleDisplay(value) {
        this._roleDisplay = value;
    }

    get policies() {
        return this._policies;
    }

    set policies(value) {
        this._policies = value;
    }

    get roleType() {
        return this._roleType;
    }

    set roleType(value) {
        this._roleType = value;
    }

    get roleCreator() {
        return this._roleCreator;
    }

    set roleCreator(value) {
        this._roleCreator = value;
    }

    constructor(roleName, roleDisplay, policies, roleType, roleCreator) {
        this._role =  randomString(16); ;
        this._roleDelete = false;
        this._roleName = roleName;
        this._roleDisplay = roleDisplay;
        this._policies = policies;
        this._roleType = roleType;
        this._roleCreator = roleCreator;
        this._roleId =  this.roleId
    }

    async checkIfExistsById(roleId) {
        const role = await RoleSchema.findOne({roleId: roleId}).exec();
        return !!role;
    }
    async checkIfExistByOrFilter(filter) {
        const role = await RoleSchema.findOne({$or: [filter]}).exec();

        return !!role;
    }

    update(){

    }

    async loadRoles() {
        await loadRoles(rolesJson).then(result => {
            console.log("[MONGO_CLIENT]::", "[RESULT]", "Load Immutable Roles", result);

        }).catch(error => {
            console.log("[MONGO_CLIENT]::", "[ERROR]", "Load Immutable Roles", error);
        });
        return rolesJson;
    }

    async checkForDuplicate() {
        const role = await RoleSchema.findOne({$or: [{roleName: this.roleName}, {roleDisplay: this.roleDisplay}]}).exec();
        return !!role;
    }
    async generateRoleId(){
        const allRole = await RoleSchema.find().exec();
        const roleLength = allRole.length;
        let roleId = roleLength === 0 ? 100000 : 100000 + (11 * roleLength);
        while(await this.checkIfExistsById(roleId)){
            roleId += 11
        }
        return roleId;
    }
     roleInstance() {
        return new RoleSchema({
            roleName: this.roleName,
            roleId: this.roleId,
            roleDisplay: this.roleDisplay,
            policies: this.policies,
            roleDelete: this.roleDelete,
            roleType: this.roleType,
            role: this.role,
            roleCreator: this.roleCreator
        })
    }

    async create() {
      this.roleId = await this.generateRoleId();
        try {
            return await this.roleInstance().save();
        } catch (e) {
            console.log("[AUTH HUB] create role", e)
            return false
        }
    }

    async findAndUpdate(filter, updates){
        try{
            await RoleSchema.findOneAndUpdate(filter, updates);
        }catch (e) {
            console.error(e)
            return false;
        }
    }

    async getRole(filter) {
        try {
            console.log(filter, "filter")
            return await RoleSchema.findOne(filter).exec();

        } catch (e) {
            console.error("[AUTH HUB] ERROR", e)
            return  false
        }
    }

    async getAll() {
        try {
            return await RoleSchema.find().exec();

        } catch (e) {
            console.error("[AUTH HUB] ERROR", e)
            return  false
        }
    }

    async getAllWithSoftDeleteFlag(){
        try {
            return await RoleSchema.find({roleDelete: false}).exec();
        } catch (e) {
            console.error("[AUTH HUB] ERROR", e)
            return false
        }
    }


    async hardDelete() {
        try {
            await RoleSchema.deleteOne({roleId: this.roleId});
            return {status: true, message: "role deleted"}
        }catch (e){
            return {status: false, message: e.message}
        }
    }

    async softDelete(){
        try{
            await RoleSchema.findByIdAndUpdate({roleId: this.roleId}, {roleDelete: true})
            return {status: true, message: "role soft deleted"}
        }catch (e){
            return {status: false, message: e.message}
        }
    }

    async permittedAppSlugs(){
        console.log("[AUTH HUB]::", "[PERMITTED APP SLUGS]::", "PERMITTED APP SLUGS roleid used", this.roleId);
        try{
            const policyIds = await policyIdsFromRole(this.roleId);
            console.log("policyIds", policyIds);
            const policies = await policiesByIds(policyIds);
            return await permittedAppSlugsFromPolicies(policies);
        }catch (e){
            return {status: false, message: e.message}
        }
    }

}