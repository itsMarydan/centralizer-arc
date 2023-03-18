import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Login} from "./pages/loginPage";
import DashBoard from "./pages/dashBoard";
import GeneralLock from "./security/GeneralLock";
import Unauthorized from "./pages/unauthorized";
import ApplicationBoard from "./pages/applicationBoard";
import ContentBuilder from "./pages/contentBuilder";
import ContentBoard from "./pages/contentBoard";
import NewContent from "./pages/newContent";
import ContentEditor from "./pages/contentEditor";
import FormBuilder from "./pages/formBuilder";
import FormBoard from "./pages/formBoard";
import {PreviewForm} from "./pages/previewForm";
import {AuthorizationBoard} from "./pages/authorizationBoard";
import UserDashBoard from "./pages/usersDashboard";
import {Profile} from "./pages/profile";
import {ViewFormSubmissions} from "./pages/viewFormSubmissions";
import {SignUp} from "./pages/signupPage";
import SystemManager from "./pages/systemMamager";

const WiredRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <GeneralLock>
                        <DashBoard />
                    </GeneralLock>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={
                    <GeneralLock>
                        <Unauthorized />
                    </GeneralLock>
                } />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/app/:appSlug" element={
                    <GeneralLock>
                        <ApplicationBoard />
                    </GeneralLock>
                } />
                <Route path="/app/:appSlug/build-content/:contentSlug" element={
                    <GeneralLock>
                        <ContentBuilder />
                    </GeneralLock>
                } />
                <Route path="/app/:appSlug/build-form/:formSlug" element={
                    <GeneralLock>
                        <FormBuilder />
                    </GeneralLock>
                } />
                <Route path="/app/:appSlug/content/:contentSlug" element={
                    <GeneralLock>
                        <ContentBoard />
                    </GeneralLock>
                } />
                <Route path="/app/:appSlug/create-content/:contentSlug" element={
                    <GeneralLock>
                        <NewContent />
                    </GeneralLock>
                } />
                <Route path="/app/:appSlug/edit-content/:contentSlug/:identifier" element={
                    <GeneralLock>
                        <ContentEditor />
                    </GeneralLock>
                } />
                <Route path="/app/:appSlug/form/:formSlug" element={
                    <GeneralLock>
                        <FormBoard />
                    </GeneralLock>
                } />
                <Route path="/app/:appSlug/preview-form/:formSlug" element={
                    <GeneralLock>
                        <PreviewForm />
                    </GeneralLock>
                } />
                <Route path="/app/:appSlug/view-form-submission/:formSlug/:identifier" element={
                    <GeneralLock>
                        <ViewFormSubmissions />
                    </GeneralLock>
                } />
                <Route path="/users" element={
                    <GeneralLock>
                        <UserDashBoard />
                    </GeneralLock>
                } />
                <Route path="/authorization" element={
                    <GeneralLock>
                        <AuthorizationBoard />
                    </GeneralLock>
                }
                />
                <Route path="/profile" element={
                    <GeneralLock>
                        <Profile />
                    </GeneralLock>
                }
                />
                <Route path="/system-manager" element={
                    <GeneralLock>
                        <SystemManager />
                    </GeneralLock>
                }
                />
            </Routes>
        </Router>
    )
}

export default WiredRoutes;