import React from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import CrontabConfigPage from "./pages/CrontabConfigPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden p-6">
        <div className="h-full">
          <CrontabConfigPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
