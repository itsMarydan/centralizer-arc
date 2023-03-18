import Layout from '../layout'
import {UsersBoard} from "../componenets/user-mananagement-component/users-board";
import {PageTop} from "../componenets/user-mananagement-component/page-top";

const UserDashBoard = ( ) => {

    return (
        <Layout>
            <PageTop />
            <UsersBoard />
        </Layout>
    )
}

export default UserDashBoard;