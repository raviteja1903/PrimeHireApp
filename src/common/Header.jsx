
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/primehire_logo.png";
import "./Header.css";

const Header = ({ onRefresh }) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Left side: Sidebar + Logo */}
        <div className="header-left">
          <SidebarTrigger />
          <Link to={"/"} className="logo-link">
            <img src={logo} alt="PrimeHire" className="logo" />
          </Link>
        </div>

        {/* Right side: Refresh + Sign-in */}
        <div className="header-right">
          <Button
            variant="outline"
            size="sm"
            className="refresh-button"
            onClick={onRefresh}
          >
            <RefreshCcw className="refresh-icon" />
            Refresh Chat
          </Button>

          <Button variant="default" size="sm" className="signin-button">
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { RefreshCcw } from "lucide-react";
// import { Link } from "react-router-dom";
// import logo from "@/assets/primehire_logo.png";
// import "./Header.css";

// const Header = ({ onRefresh }) => {
//   const [loading, setLoading] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleRefreshClick = async () => {
//     const scrollY = window.scrollY;
//     setLoading(true);

//     await onRefresh(); // Only refresh content (not reload page)

//     setLoading(false);

//     requestAnimationFrame(() => {
//       window.scrollTo(0, scrollY);
//     });
//   };

//   return (
//     <header className={`header ${isScrolled ? "scrolled" : ""}`}>
//       <div className="header-container">

//         {/* Left */}
//         <div className="header-left">
//           <SidebarTrigger />
//           <Link to="/" className="logo-link">
//             <img src={logo} alt="PrimeHire" className="logo" />
//           </Link>
//         </div>

//         {/* Right */}
//         <div className="header-right">
//           <Button
//             variant="outline"
//             size="sm"
//             className={`refresh-button ${loading ? "loading" : ""}`}
//             onClick={handleRefreshClick}
//             disabled={loading}
//           >
//             <RefreshCcw className="refresh-icon" />
//             {!loading && "Refresh Chat"}
//           </Button>

//           <Button variant="default" size="sm" className="signin-button">
//             Sign in
//           </Button>
//         </div>

//       </div>
//     </header>
//   );
// };

// export default Header;
