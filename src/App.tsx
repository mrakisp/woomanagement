import React from "react";
import LoginForm from "./common/views/LoginForm";
import useLocalStorage from "./common/hooks/useLocalStorage";
import TabPanel from "./common/views/dashboardTabs";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<string>(
    "isLoged",
    "false"
  );

  return (
    <div>
      {isLoggedIn === "true" ? (
        <TabPanel />
      ) : (
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;
