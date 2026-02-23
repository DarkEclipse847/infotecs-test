import Router from "./routing/Router";
import UsersPage from "@/pages/UsersPage";

const App = () => {
  const routes = {
    "/infotecs-test/": UsersPage,
    "*": () => <div>404 Page not found</div>,
  };

  return <Router routes={routes} />;
};

export default App;
