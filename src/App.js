import { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import Header from "./components/header/Header";
import Homescreen from "./Screens/Homescreen/Homescreen";
import Sidebar from "./components/sidebar/Sidebar";
import Login from "./Screens/LoginScreen/Login";
import PagenotFound from "./Screens/PageNotFound/PagenotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./Screens/ForgotPassword/ForgotPassword";
import UserActions from "./Screens/UserActions/UserActions";
import Upload from "./Screens/Upload/Uplaod";
import VideosReducer from "./Store/reducers/Videos";
import AuthReducer from "./Store/reducers/Auth";
import { AuthProvider } from "./Context/UserAuthContext";
import "./_app.scss";
import WatchScreen from "./Screens/WatchScreen/WatchScreen";
import SearchScreen from "./Screens/SearchScreen/SearchScreen";
import Subscriptions from "./Screens/subscriptions/subscriptions";
import ChannelScreen from "./Screens/channelScreen/ChannelScreen";
import EditVideo from "./Screens/EditVideoScreen/EditVideo";

const RootReducer = combineReducers({
  Vidoes: VideosReducer,
  auth: AuthReducer,
});

const store = createStore(RootReducer, applyMiddleware(ReduxThunk));

const Layout = ({ children }) => {
  const [toggleSidebar, settoggleSidebar] = useState(false);

  const handleToggleSidebar = () => {
    settoggleSidebar(!toggleSidebar);
  };

  return (
    <ProtectedRoute>
      <Header handleToggleSidebar={handleToggleSidebar} />
      <div className="app_container">
        <Sidebar
          handleToggleSidebar={handleToggleSidebar}
          toggleSidebar={toggleSidebar}
        />
        <Container className="app_main" fluid>
          {children}
        </Container>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  const [containerAuth, togglecontainerAuth] = useState(true);
  const handleContainerLogin = () => {
    togglecontainerAuth(!containerAuth);
  };
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="App">
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Homescreen />
                  </Layout>
                }
              />
              <Route
                path="/login"
                element={
                  <Login
                    containerAuth={containerAuth}
                    handleContainerLogin={handleContainerLogin}
                  />
                }
              />
              <Route
                path="/search/:query"
                element={
                  <Layout>
                    <SearchScreen />
                  </Layout>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/UserActions" element={<UserActions />} />
              <Route
                path="/Upload"
                element={
                  <Layout>
                    <Upload />
                  </Layout>
                }
              />
              <Route
                path="/watch/:id"
                element={
                  <Layout>
                    <WatchScreen />
                  </Layout>
                }
              />
              <Route
                path="/channel/:channelId"
                element={
                  <Layout>
                    <ChannelScreen />
                  </Layout>
                }
              />
              <Route
                path="/EditVideo/:id"
                element={
                  <Layout>
                    <EditVideo />
                  </Layout>
                }
              />
              <Route
                path="/feed/subscriptions"
                element={
                  <Layout>
                    <Subscriptions />
                  </Layout>
                }
              />
              <Route path="*" element={<PagenotFound />} />
            </Routes>
          </Router>
          <NotificationContainer />
        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
