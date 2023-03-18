
import styles from '../styles/home.module.css'
import SideBar from "./components/sideBar";
import Header from "./components/header";

const Layout = ({children}: any) => {
    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <SideBar />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="my-5">
                            {children}
                        </div>
                        <footer className={styles.footer}>
                            <a href="https://www.blueinit.com" target="_blank" rel="noopener noreferrer">
                                blue content by <span className="color-blue elegance px-2">blueinit</span>
                            </a>
                        </footer>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Layout;