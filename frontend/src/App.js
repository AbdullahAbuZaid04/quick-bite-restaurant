import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { CartProvider } from "./context/cartContext";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;