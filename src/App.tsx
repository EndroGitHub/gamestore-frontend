import { BrowserRouter, Route, Routes } from "react-router-dom";
import Entry from "./components/entry/Entry";
import Private from "./components/auth components/Private";
import Start from "./components/auth components/Start";
import UserHome from "./components/user/UserHome";
import BuyGame from "./components/user/BuyGame";
import ShowResults from "./components/custom components/show results/ShowResults";
import Cart from "./components/user/Cart";
import AddBalance from "./components/user/AddBalance";
import UserGames from "./components/user/UserGames";
import PaymentChecker from "./components/custom components/payment checker/PaymentChecker";
import Purchase from "./components/user/Purchase";
import GuestUserChecker from "./components/custom components/guest user checker/GuestUserChecker";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Private />}>
            <Route path="/" element={<Start />} />
            <Route path="/home" element={<UserHome />} />
            <Route element={<GuestUserChecker />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/your-games" element={<UserGames />} />
              <Route path="/add-balance" element={<AddBalance />} />
            </Route>

            <Route path="/buy-game/:game_title" element={<BuyGame />} />
            <Route
              path="/category/:category"
              element={<ShowResults type="category" />}
            />
            <Route
              path="/top-discounts"
              element={<ShowResults type="discount" heading="DISCOUNTS" />}
            />
            <Route
              path="/search/:search_key"
              element={<ShowResults type="search" heading="SEARCH RESULTS" />}
            />

            <Route element={<PaymentChecker />}>
              <Route path="/payment/:game_title" element={<Purchase />} />
            </Route>
          </Route>
          <Route
            path="/login"
            element={
              <Entry
                headingText="LOGIN"
                buttonText="login"
                navigateMsg="New to Game-Store"
                navigateText="signup"
                route="/signup"
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Entry
                headingText="SIGNUP"
                buttonText="signup"
                navigateMsg="Go back to"
                navigateText="login"
                route="/login"
              />
            }
          />
          <Route
            path="*"
            element={<h1 style={{ color: "white" }}>The route do not exist</h1>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
