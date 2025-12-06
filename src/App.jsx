import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { PrimeReactProvider } from "primereact/api";


function App() {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
