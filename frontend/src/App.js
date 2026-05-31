import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { CartProvider } from "./context/cartContext";
import { AuthProvider } from "./context/authContext";

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <AppRouter />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;