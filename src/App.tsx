import React from "react";
import LoginForm from "./views/LoginForm";
import useLocalStorage from "./common/hooks/useLocalStorage";
import TabPanel from "./common/components/dashboardTabs";
import { logInCredentials } from "./config/config";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<string>(
    "isLogedToken",
    "false",
    true
  );

  return (
    <div>
      {isLoggedIn && logInCredentials.password === JSON.parse(isLoggedIn) ? (
        <TabPanel />
      ) : (
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;
