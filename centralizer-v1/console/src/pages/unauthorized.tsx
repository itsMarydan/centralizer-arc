import  styles from "../styles/home.module.css"
import Layout from "../layout";
import  NoAuth from  "../assets/images/no-auth.svg"
const Unauthorized = () => {
    return (
        <Layout>
            <div className={styles.container}>
                <div className="unauthorized">
                    <img src={NoAuth} alt="unauthorized" />
                </div>
            </div>
        </Layout>
    )
}

export default Unauthorized;
