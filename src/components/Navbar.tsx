import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { RiCloseLine } from "react-icons/ri";
import { IconContext } from "react-icons";
import kwoc_logo from "../assets/kwoc_logo.png";
import {
  ROUTER_PATHS,
  GH_OAUTH_URL,
  REGISTRATIONS_OPEN,
} from "../util/constants";
import { useAuthContext } from "../util/auth";
import { UserType } from "../util/types";

const LINKS = [
  { name: "Home", link: ROUTER_PATHS.HOME },
  { name: "Projects", link: ROUTER_PATHS.PROJECTS_LIST },
  // { name: "TESTIMONIALS", link: ROUTER_PATHS.TESTIMONIALS },
  { name: "FAQs", link: ROUTER_PATHS.FAQ },
];

function BrandLogo() {
  return (
    <Link to={"/"}>
      <img
        className="object-contain cursor-pointer h-12 w-12"
        src={kwoc_logo}
        alt="KWoC Logo"
      />
    </Link>
  );
}

function getNavbarLinkClasses(isMobile: boolean, isActive: boolean = false) {
  return (
    (isMobile
      ? "w-full text-end block p-2 text-sm flex justify-end "
      : " hover:underline ") + (isActive ? "text-primary text-yellow-300 nav-glow" : "text-white")
  );
}

function LinksList(isMobile: boolean) {
  const location = useLocation();

  return LINKS.map((link) => (
    <li key={link.name} className={isMobile ? "mb-1" : "md:ml-4"}>
      <Link
        to={link.link}
        className={getNavbarLinkClasses(
          isMobile,
          location.pathname == link.link,
        )}
      >
        {link.name}
      </Link>
    </li>
  ));
}

function LoginButton({ isMobile }: { isMobile: boolean }) {
  const authContext = useAuthContext();

  const linkClasses = getNavbarLinkClasses(isMobile);

  return (
    <>
      {authContext.isAuthenticated ? (
        <Link
          className={linkClasses}
          to={
            authContext.isRegistered
              ? authContext.dashboardLink
              : authContext.formLink
          }
        >
          <img
            className="w-10 h-full rounded-full block"
            src={`https://github.com/${authContext.userData.username}.png`}
          />
        </Link>
      ) : REGISTRATIONS_OPEN ? (
        ["mentor", "student"].map((userType, i) => (
          <button
            key={i}
            className={linkClasses}
            onClick={(e) => {
              e.preventDefault();

              authContext.setUserType(userType as UserType);
              window.location.href = GH_OAUTH_URL;
            }}
          >
            {userType.toUpperCase()} LOGIN
          </button>
        ))
      ) : (
        <Link
          to={GH_OAUTH_URL}
          className={`text-gray-950 bg-white px-6 py-2 rounded shadow-[3px_3px_0_3px_#707070]`}
        >
          Register <span> </span> →
        </Link>
      )}
    </>
  );
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="fixed inset-x-0 z-[210] w-full">
      <nav
        className={`flex mt-12 items-center justify-between max-w-full gap-4 mx-auto px-4 md:px-8 py-2 rounded-lg w-[95%] inset-x-0 z-50 ${
          mobileMenuOpen ? "hidden" : ""
        }`}
      >
        <BrandLogo />
        <div className="lg:hidden ml-auto -mr-5">
          <button
            className="flex items-center text-primary-600 p-3"
            onClick={toggleMobileMenu}
          >
            <CiMenuBurger size="2em" color="#3b82f6" />
          </button>
        </div>

        <div className={`${mobileMenuOpen ? "hidden" : null}`}>
          <ul
            className={`lg:flex lg:items-center lg:w-auto lg:space-x-16 ${
              mobileMenuOpen ? "block" : "hidden"
            }`}
          >
            {LinksList(false)}

            <IconContext.Provider value={{ size: "2.3em" }}>
              <LoginButton isMobile={false} />
            </IconContext.Provider>
          </ul>
        </div>
      </nav>

      {mobileMenuOpen && <MobileNavbar toggleMobileMenu={toggleMobileMenu} />}
    </div>
  );
}

function MobileNavbar({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
  return (
    <div className="w-full z-50 h-screen transition-transform transform ease-in-out duration-500 translate-x-0 p-2 flex justify-end">
      <div className="navbar-backdrop fixed bg-gray-800 opacity-25"></div>
      <nav className="h-full flex flex-col w-5/6 max-w-sm py-5 px-5 border border-[#FFFFFF]/[0.16] rounded-lg backdrop-blur-md overflow-y-auto">
        <div className="flex-items-center flex flex-row mb-8 mx-2">
          <span className="mr-auto">
            <BrandLogo />
          </span>

          <button onClick={toggleMobileMenu}>
            <RiCloseLine size="2.5em" color="#3b82f6" />
          </button>
        </div>

        <div>
          <ul className="mr-4 text-right">
            {LinksList(true)}
            <IconContext.Provider value={{ size: "2.5em" }}>
              <LoginButton isMobile={true} />
            </IconContext.Provider>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
