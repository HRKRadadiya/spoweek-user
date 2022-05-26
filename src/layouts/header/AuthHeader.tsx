import { Nav } from "react-bootstrap";
import Buttons from "../../components/Buttons";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { setToggleMenu } from '../../redux/actions/toggleMenuAction';
import { Link, useHistory } from "react-router-dom";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import {
  getUserData,
} from "../../redux/actions/userDataAction";
import { getCookie } from "../../helper/utils";
import InputField from "../../components/Inputfield";
import { ApiGet, ApiGetNoAuth } from "../../helper/API/ApiData";
import ReactHtmlParser from 'react-html-parser';
registerLocale("ko", ko);

interface memorialHallDetail {
  id: string,
  image: string,
  name: string,
  date_of_death: string,
  date_of_birth: string,
  job_title: string,
  user_id: string,
  friend_list: Array<[]>
}

const AuthHeader: React.FC = () => {
  const pathName = ['']
  const hideMobMenu = ['']
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { is_toggleMenu } = useSelector((state: RootStateOrAny) => state.menuToggle);
  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
  const closeopenClass = is_toggleMenu ? 'HideMenu' : 'showHideMenu';
  const bgLayerOpen = is_toggleMenu ? 'bg-layer-mob' : '';
  const history = useHistory();
  const [selectedLang, setSelectedLang] = useState("한국어(KR)");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [IsLogout, setIsLogout] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);
  const { innerHeight, innerWidth } = window
  const [temp, setTemp] = useState(false);
  const [memorialHallDetailCard, setMemorialHallDetailCard] = useState<memorialHallDetail[]>([])

  useEffect(() => {
    console.log("memorialHallDetailCard =========================", memorialHallDetailCard);

  }, [memorialHallDetailCard]);

  useEffect(() => {
    let getLangLocal = localStorage.getItem("i18nextLng");
    let getLangCookie = getCookie("i18next");
    let getLangTag = document.documentElement.lang;

    if (
      getLangLocal === "en" ||
      getLangCookie === "en" ||
      getLangTag === "en"
    ) {
      changeLanguage("en", "English(EN)");
    } else {
      changeLanguage("ko", "한국어(KR)");
    }

    dispatch(getUserData());
    GetMemorialHalls();
  }, []);


  const changeLanguage = (lang: string, name: string) => {
    setSelectedLang(name);
    i18next.changeLanguage(lang);
    if (temp) {
      let currentPath = location.pathname + location.search;
      window.location.href = currentPath;
    }
    setTemp(true);
  };

  const LogOut = () => {
    setIsLogout(true)
  };

  const closeModal = () => {
    setIsLogout(false)
  }

  const handleRoute = (PageName: any) => {
    if (PageName === "_About_Remembered") {
      history.push("/aboutremembered");
    } else if (PageName === "_memorialHall_Status") {
      history.push("/memorialhallstatus");
    } else if (PageName === "_faq") {
      history.push("/faq");
    } else if (PageName === "_Funeral_News") {
      history.push("/funeralnews");
    } else if (PageName === "_Priceguide") {
      history.push("/Priceguide");
    }
  }

  const openMobMenu = () => {
    if (is_toggleMenu) {
      dispatch(setToggleMenu(false));
    }
    else {
      dispatch(setToggleMenu(true));
    }
  }

  const removeAllMenu = () => {
    dispatch(setToggleMenu(false));
  }

  const gotToHomePage = () => {
    history.push(`/homepage?search_term=${searchTerm ? searchTerm : ""}`)
    setOpenSearch(false);
  }

  const openSearchpage = () => {
    setOpenSearch(true);
  }

  const closeSearchpage = () => {
    setOpenSearch(false);
  }

  const GetMemorialHallsNoAuth = () => {
    ApiGetNoAuth(`memorialHall/memorialHalls?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
      setMemorialHallDetailCard(res.data.memorials);
    });
  }

  const GetMemorialHalls = () => {
    ApiGet(`memorialHall/getMemorialHallAuth?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
      setMemorialHallDetailCard(res.data.memorials);
    });
  }

  return (
    <>
      <div className=" d-md-none d-block">
        <div className={hideMobMenu.includes(location.pathname) ? 'd-none' : 'mob-menu'}>
          {/* <div className="mob-menu"> */}
          <div className="menu-search-button">
            <button className="menu-search-button" onClick={openSearchpage}>
              <img src={pathName.includes(location.pathname) ? './img/black-search.svg' : './img/menu-mob.svg'} className="search-menu" />
              {/* <img src="./img/menu-mob.svg" className="search-menu" /> */}
            </button>
          </div>
          <div className="ml-auto menu-humberge-button">
            <button onClick={openMobMenu} className="menu-humberge-button">
              <img src={pathName.includes(location.pathname) ? './img/black-menu.svg' : './img/search-mob.svg'} className="humburge-menu" />
              {/* <img src="./img/search-mob.svg" className="humburge-menu" /> */}
            </button>
          </div>
        </div>
        <div onClick={removeAllMenu} className={bgLayerOpen}></div>
      </div>

      <div className={`${closeopenClass} ml-auto`}>
        <div className="custom-container custom-nav">

          <div className="d-md-flex  nav-width header-top">
            <div className="item1">
              <Link to="/"><img src="./img/memorial-Frame.svg" className="nav-logo" /> </Link>
            </div>
            <div className="d-md-flex align-items-center mob-menu-links item2">
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_About_Remembered") }}>{`${t("About_Remembered")}`}</Nav.Link>
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_memorialHall_Status") }}>{`${t("Memorial_Hall")}`}</Nav.Link>
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_Priceguide") }} >{`${t("Price_Guide")}`}</Nav.Link>
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_faq") }} >{`${t("FAQ")}`}</Nav.Link>
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_Funeral_News") }}>{`${t("Funeral_News")}`}</Nav.Link>
            </div>
            <div className="ml-auto hide-mob item3">
              <div className={location.pathname === '/' ? ' header-search' : pathName.includes(location.pathname) ? ' header-search-black' : ' header-search'}>
                <InputField
                  label=""
                  fromrowStyleclass=""
                  name="serach"
                  value={searchTerm}
                  placeholder={`${t("Search")}`}
                  type="text"
                  lablestyleClass=""
                  InputstyleClass={location.pathname === '/' ? 'nav-search' : pathName.includes(location.pathname) ? 'nav-search-black' : 'nav-search'}
                  onChange={(e: any) => {
                    setSearchTerm(e.target.value)
                  }}
                />
                < img
                  src={location.pathname === '/' ? './img/Ellipse.png' : pathName.includes(location.pathname) ? './img/blackelipse.png' : './img/Ellipse.png'}
                  className="p-absolute-img"
                  onClick={gotToHomePage}
                />
              </div>
            </div>
            <div className="d-md-flex align-items-center item4" >
              <div className="d-md-flex  nav-profile-section">
                <img src={location.pathname === '/' ? userData?.avatar ? userData?.avatar : "../img/transuser.png" :
                  pathName.includes(location.pathname) ? userData?.avatar ? userData?.avatar : "../img/navimg.png" : userData?.avatar ? userData?.avatar : "../img/transuser.png"} className="nav-user-img cursor-pointer item2" onClick={() => { history.push("/myaccount") }} />


                <p className={location.pathname === '/' ? 'nav-user-name cursor-pointer item4' : pathName.includes(location.pathname) ? 'nav-user-name-black cursor-pointer item4' : 'nav-user-name cursor-pointer item4'} onClick={() => { history.push("/myaccount") }}> {userData?.name > 7
                  ? userData?.name.slice(0, 7) + "..."
                  : userData?.name}</p>
              </div>
              <div>
                <Buttons
                  ButtonStyle={location.pathname === '/' ? 'nav-btn' : pathName.includes(location.pathname) ? 'nav-btn-black' : 'nav-btn'}
                  onClick={LogOut}
                  children={`${t("signup.Log_out")}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {openSearch &&
        <div className="full-search-page d-md-none d-block">
          <div className="my-page-head">
            <img src="./img/back-arrow.svg" className="d-md-none d-block page-back-arrow" onClick={closeSearchpage} />
            <h1>검색</h1>
          </div>
          <div className="searchbar-row">
            <InputField
              label=""
              fromrowStyleclass=""
              name="serach"
              value={searchTerm}
              placeholder="검색어를 입력해주세요."
              type="text"
              lablestyleClass=""
              InputstyleClass="full-serchbar"
              onChange={(e: any) => {
                setSearchTerm(e.target.value)
              }}
            />
            < img
              src='./img/blackelipse.png'
              className="full-search-img"
              onClick={gotToHomePage}
            />
          </div>

          {searchTerm && memorialHallDetailCard?.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((items: any, i: number) => {
              const simpletext = new RegExp("(" + searchTerm + ")", "gi");
              const memorialHallName = items?.name.replace(simpletext, `<span class="text-yellow">${searchTerm}</span>`)
              return (
                <p>{ReactHtmlParser(memorialHallName)}</p>

              )
            }
            )}
        </div>
      }

      {/* {IsLogout && <Logout show={IsLogout} onHide={closeModal} />} */}
    </>
  );
};

export default AuthHeader;
