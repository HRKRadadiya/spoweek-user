import React, { useState } from "react"
import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import Buttons from "../../components/Buttons";
import InputField from "../../components/Inputfield";

const Header: React.FC = () => {
    const pathName = ['']

    const history = useHistory();
    const location = useLocation();

    //i18n
    const { t } = useTranslation();

    //Homepage search filter
    const [searchTerm, setSearchTerm] = useState<string>("");
    const Search = () => {
        let searchParam =
            "?keyword=" +
            (searchTerm ? searchTerm : "");
        history.push({
            pathname: "/",
            search: searchParam,
        });
    };

    const handleRoute = (PageName: any) => {

    }


    return (
        <>
            <div className="custom-container custom-nav">
                <div className="d-md-flex align-items-center nav-width header-top">
                    <div>
                        <Link to="/"><img src="./img/memorial-Frame.svg" className="nav-logo" /></Link>
                    </div>
                    <div className="d-md-flex align-items-center">
                        {/* <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_About_Remembered") }}>{`${t("About_Remembered")}`}</Nav.Link>
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_memorialHall_Status") }}>{`${t("Memorial_Hall")}`}</Nav.Link>
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_Price_Guide") }}>{`${t("Price_Guide")}`}</Nav.Link>
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_faq") }}>{`${t("FAQ")}`}</Nav.Link>
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_Funeral_News") }}>{`${t("Funeral_News")}`}</Nav.Link> */}
                    </div>
                    <div className="ml-auto hide-mob">
                        <div className={location.pathname === '/' ? ' header-search' : pathName.includes(location.pathname) ? ' header-search-black' : ' header-search'}>
                            <InputField
                                label=""
                                fromrowStyleclass=""
                                name="serach"
                                value={searchTerm}
                                placeholder="검색"
                                type="text"
                                lablestyleClass=""
                                InputstyleClass={location.pathname === '/' ? 'nav-search' : pathName.includes(location.pathname) ? 'nav-search-black' : 'nav-search'}
                                onChange={(e: any) => { setSearchTerm(e.target.value) }}
                            />
                            <img
                                src={location.pathname === '/' ? './img/Ellipse.png' : pathName.includes(location.pathname) ? './img/blackelipse.png' : './img/Ellipse.png'}
                                className="p-absolute-img"
                                onClick={() => { }}
                            />
                        </div>
                    </div>
                    <div>
                        <Buttons
                            ButtonStyle="nav-login-btn"
                            onClick={() => { history.push("/login") }}
                            children={`${t("Login")}`}
                        />
                        {/* <Buttons
                            ButtonStyle={location.pathname === '/' ? 'nav-btn' : pathName.includes(location.pathname) ? 'nav-btn-black' : 'nav-btn'}
                            onClick={() => { setRegisterOpen(true) }}
                            children={`${t("Register_Memorial_Hall")}`}
                        /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;

