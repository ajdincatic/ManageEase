import { Container } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";

import { Header } from "./components/shared/header/header";
import { RoutesWrapper } from "./components/shared/routes-wrapper";
import { useAppSelector } from "./shared/custom-hooks";

function App() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {user && <Header user={user} />}

      <Container className="mt-5 mb-5">
        <RoutesWrapper isLoggedIn={user !== null} type={user?.type} />
      </Container>
    </BrowserRouter>
  );
}

export default App;
