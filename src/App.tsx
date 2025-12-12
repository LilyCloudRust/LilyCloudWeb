import { Route, Router } from "@solidjs/router";

import MainPage from "./pages/MainPage";

export default function App() {
  return (
    <Router>
      <Route path="/" component={MainPage} />
    </Router>
  );
}
