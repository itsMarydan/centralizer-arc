import User from "../classes/user_class";
import {
    appLevelPermissionExists,
    isActionPermittedInAppByRole,
    isPermittedTOAccessApp,
    permittedAppSlugsFromPolicies,
    policiesByIds,
    policyIdsFromRole
} from "../database/mongo/methods/permissions";

export const develop = {
    path: '/api/develop/:slug',
    method: 'get',
    handler: async (req, res) => {
        const retrievedUser = await appLevelPermissionExists(req.params.slug);
        const policyIds = await policyIdsFromRole(100022);
        console.log("policyIds", policyIds);

       const policies = await policiesByIds(policyIds);
       const permittedAppSlugs = await permittedAppSlugsFromPolicies(policies);

       console.log("Check App Level");

       const checkAppLevelAccess = await isPermittedTOAccessApp( req.params.slug,100022 );

        console.log("End Check App Level", checkAppLevelAccess);

        console.log("Check Action Access");
        const checkActionAccess = await isActionPermittedInAppByRole( 100022, "READ", req.params.slug );

        console.log("End Check Action Access", checkActionAccess);
        console.log(retrievedUser, policies, permittedAppSlugs);
        if (retrievedUser) {
            res.status(200).json({retrievedUser, policies, permittedAppSlugs, checkAppLevelAccess, checkActionAccess});
        } else {
            res.status(500).json({message: 'User not found'});
        }
    }
}