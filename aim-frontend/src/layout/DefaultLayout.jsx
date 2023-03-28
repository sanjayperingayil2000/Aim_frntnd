import React, { useState, useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar, Header } from "../components";
import { SidebarContext } from "../contextObject/global";
import ProgressBar from "../components/ProgressBar/ProgressBar";

const DefaultLayout = ({ myState }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(false);
  const { pathname } = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (window.innerWidth < 992) {
      setIsOpen(false);
    }
  }, [pathname]);

  return (
    <>
      <main className="app">
        <Sidebar
          toggleSidebar={toggleSidebar}
          className={`${isOpen && "open"}`}
        />
        <Header />
        {myState && <ProgressBar setProgress={setProgress} />}
        <section className={`app__wrapper ${isOpen ? "open" : ""}`}>
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default DefaultLayout;
