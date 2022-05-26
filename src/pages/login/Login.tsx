import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import Buttons from "../../components/Buttons";
import STORAGEKEY from "../../config/APP/app.config";
import { ApiPost } from "../../helper/API/ApiData";
import AuthStorage from "../../helper/AuthStorage";
import { changeLoginState } from "../../redux/actions/loginAction";

interface loginFormState {
  email: string;
  password: string;
}

const Login = () => {
  //i18n
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch()
  const queryParams = new URLSearchParams(window.location.search);

  const loginFormState: loginFormState = {
    email: "",
    password: "",
  };

  const login_Err = {
    emailError: "",
    emailFormatErr: "",
    passError: "",
  };

  const [statelogin, setStatelogin] = useState(loginFormState);
  const [loginErrors, setLoginErrors] = useState(login_Err);
  const [isloginSubmit, setIsLoginSubmit] = useState(false);
  const [stayLogedIn, setStayLogedIn] = useState(false);
  const [saveEmail, setSaveEmail] = useState(false);
  const [incorrectPass, setIncorrectPass] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [modalShow, setModalShow] = useState(true);
  const [memorialHallId, setMemorialHallId] = useState<string | undefined>("");

  const loginValidation = () => {
    let login_Err = {
      emailError: "",
      emailFormatErr: "",
      passError: "",
    };

    const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

    if (statelogin.email && !validEmail.test(statelogin.email)) {
      login_Err.emailFormatErr = `${t("logIn.Errors.InvalidEmail")}`;
    }

    if (!statelogin.email) {
      login_Err.emailError = `${t("logIn.Errors.This_is_required_information")}`;
    }

    if (statelogin.password === "") {
      login_Err.passError = `${t("logIn.Errors.Please_enter_password_one_more_time")}`;
    }

    setLoginErrors(login_Err);
    setIncorrectPass("");

    if (!loginErrors.emailError && !loginErrors.passError && !loginErrors.emailFormatErr) {
      return true;
    }
    return false;
  };

  const Login = (loginWith: string) => {
    setIsLoginSubmit(true);

    if (!loginValidation()) {
      setBtnDisabled(true);
      return;
    }

    ApiPost("user/auth/login", {
      email: statelogin.email,
      password: statelogin.password,
      login_with: loginWith,
    })
      .then((res: any) => {
        setStatelogin(loginFormState);

        if (saveEmail) {
          AuthStorage.setStorageData(STORAGEKEY.email, statelogin.email, true);
        } else {
          AuthStorage.deleteKey(STORAGEKEY.email);
        }

        AuthStorage.setStorageData(
          STORAGEKEY.token,
          res.data.token,
          stayLogedIn
        );
        delete res.data.token;
        AuthStorage.setStorageJsonData(
          STORAGEKEY.userData,
          res.data,
          stayLogedIn
        );
        dispatch(changeLoginState(true))

        if (memorialHallId) {
          const mHId = memorialHallId
          setMemorialHallId(undefined)
          history.push(`/memorialview?id=${mHId}&isFromLogin=true`);
        } else {
          setMemorialHallId(undefined)
          history.push("/");
        }
      })
      .catch((error) => {
        if (error === "Wrong Email") {
          setIncorrectPass("");
          setInvalidEmail(`${t("logIn.Errors.This_is_required_information")}`);
        }

        if (error === "Wrong Password") {
          setInvalidEmail("");
          setIncorrectPass(`${t("logIn.Errors.Please_enter_password_one_more_time")}`);
        }
      });
  };
  //---------------

  const validityChack = () => {
    if (statelogin.email !== "" && statelogin.password !== "") {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  const showPopups = (popupName: string) => {
    if (popupName === "FindEmail") {
      history.push("/findemail");
    }
    if (popupName === "FindPassword") {
      history.push("/findpassword");
    }
    if (popupName === "Registration") {
      history.push("/Registration");
    }
  }

  useEffect(() => {
    validityChack();
  }, [statelogin]);

  useEffect(() => {
    const id = queryParams.get('id')?.toString();
    if (id) {
      setMemorialHallId(id)
    }
  }, []);

  return (
    <>

      <div className="modal-dialog modal-lg log-popup modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header justify-content-center p-0">
            <img src="./img/memorial-Frame.svg" className="logo-img" />
          </div>
          <div className="modal-body p-0">
            <form className="login-form">
              <label className="login-label">{`${t("logIn.Email")}`}</label>
              <input
                type="email"
                className="login-input"
                name="email"
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    emailError: "",
                    emailFormatErr: ""
                  });
                  setStatelogin({ ...statelogin, email: e.target.value })
                }
                }
                value={statelogin.email}
                placeholder={`${t("logIn.Placeholder.Email")}`}
              />
              <div className="position-relative">
                {loginErrors.emailError && (
                  <p className="log-error">
                    {loginErrors.emailError}
                  </p>
                )}
                {loginErrors.emailFormatErr && (
                  <p className="log-error">
                    {loginErrors.emailFormatErr}
                  </p>
                )}
                {!loginErrors.emailError &&
                  !loginErrors.emailFormatErr &&
                  invalidEmail && (
                    <p className="log-error">{invalidEmail}</p>
                  )}
              </div>
              <label className="login-label">{`${t("logIn.Password")}`}</label>
              <input
                type="password"
                className="login-input"
                name="password"
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    passError: ""
                  });
                  setStatelogin({ ...statelogin, password: e.target.value })
                }
                }
                placeholder={`${t("logIn.Placeholder.Password")}`}
              />
              <div className="position-relative">
                {loginErrors.passError && (
                  <p className="log-error">
                    {loginErrors.passError}
                  </p>
                )}
                {!loginErrors.passError && incorrectPass && (
                  <p className="log-error">{incorrectPass}</p>
                )}
              </div>
              <label
                className={
                  stayLogedIn
                    ? "login-label-checkbox-checked"
                    : "login-label-checkbox"
                }
              >
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setStayLogedIn(e.target.checked);
                  }}
                  className="checkbox-input"
                />
                {`${t("logIn.Stay_logged_in")}`}
              </label>
              <Buttons
                ButtonStyle={`login-btn ${btnDisabled && "login-btn-btnDisabled"}`}
                onClick={() => Login("Manual")}
                disabled={btnDisabled}
              >
                {t("logIn.Log_In")}
              </Buttons>
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                <img src="./img/kakaotalk 1.svg" className="kakaotalk-img" />
                {`${t("logIn.Log_in_with_Kakaotalk")}`}
              </Buttons>
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                <img src="./img/Naver-img.svg" className="kakaotalk-img" />
                {`${t("logIn.Log_in_with_Naver")}`}
              </Buttons>
            </form>
          </div>
          <div className="modal-footer w-100 p-0 m-0">
            <div className="login-popup-footer d-flex">

              <Buttons
                ButtonStyle="login-btn-Find-Email p-0"
                onClick={() => showPopups("FindEmail")}
                children={`${t("logIn.Find_Email")}`}
              />
              <Buttons
                ButtonStyle="login-btn-Find-Email p-0 find-password-btn"
                onClick={() => showPopups("FindPassword")}
                children={`${t("logIn.Find_Password")}`}
              />

              <Buttons
                ButtonStyle="login-btn-Not-a-member p-0"
                onClick={() => showPopups("Registration")}
                children={`${t("logIn.Not_a_member")}`}
              />

            </div>
          </div>
        </div>

        <div className="loader-mob-page d-md-none d-block"><img src="./img/whitelogo.svg" /></div>

      </div>

      {/* <div className="trans-bg-modal">
        <Modal
          show={modalShow}
          dialogClassName="log-popup"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header className="justify-content-center p-0">
            <Modal.Title><img src="./img/memorial-Frame.svg" className="logo-img" /></Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-0">
            <form className="login-form">
              <label className="login-label">{`${t("logIn.Email")}`}</label>
              <input
                type="email"
                className="login-input"
                name="email"
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    emailError: "",
                    emailFormatErr: ""
                  });
                  setStatelogin({ ...statelogin, email: e.target.value })
                }
                }
                value={statelogin.email}
                placeholder={`${t("logIn.Placeholder.Email")}`}
              />
              <div className="position-relative">
                {loginErrors.emailError && (
                  <p className="log-error">
                    {loginErrors.emailError}
                  </p>
                )}
                {loginErrors.emailFormatErr && (
                  <p className="log-error">
                    {loginErrors.emailFormatErr}
                  </p>
                )}
                {!loginErrors.emailError &&
                  !loginErrors.emailFormatErr &&
                  invalidEmail && (
                    <p className="log-error">{invalidEmail}</p>
                  )}
              </div>
              <label className="login-label">{`${t("logIn.Password")}`}</label>
              <input
                type="password"
                className="login-input"
                name="password"
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    passError: ""
                  });
                  setStatelogin({ ...statelogin, password: e.target.value })
                }
                }
                placeholder={`${t("logIn.Placeholder.Email")}`}
              />
              <div className="position-relative">
                {loginErrors.passError && (
                  <p className="log-error">
                    {loginErrors.passError}
                  </p>
                )}
                {!loginErrors.passError && incorrectPass && (
                  <p className="log-error">{incorrectPass}</p>
                )}
              </div>
              <label
                className={
                  stayLogedIn
                    ? "login-label-checkbox-checked"
                    : "login-label-checkbox"
                }
              >
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setStayLogedIn(e.target.checked);
                  }}
                  className="checkbox-input"
                />
                {`${t("logIn.Stay_logged_in")}`}
              </label>
              <Buttons
                ButtonStyle={`login-btn ${btnDisabled && "login-btn-btnDisabled"}`}
                onClick={() => Login("Manual")}
                disabled={btnDisabled}
              >
                {t("logIn.Log_In")}
              </Buttons>
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                <img src="./img/kakaotalk 1.svg" className="kakaotalk-img" />
                {`${t("logIn.Log_in_with_Kakaotalk")}`}
              </Buttons>
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                <img src="./img/Naver-img.svg" className="kakaotalk-img" />
                {`${t("logIn.Log_in_with_Naver")}`}
              </Buttons>
            </form>
          </Modal.Body>

          <Modal.Footer className="w-100 p-0 m-0">
            <div className="login-popup-footer d-sm-flex flex-wrap">
              <div className="right-btn">
                <Buttons
                  ButtonStyle="login-btn-Find-Email p-0"
                  onClick={() => showPopups("FindEmail")}
                  children={`${t("logIn.Find_Email")}`}
                />
                <Buttons
                  ButtonStyle="login-btn-Find-Email p-0"
                  onClick={() => showPopups("FindPassword")}
                  children={`${t("logIn.Find_Password")}`}
                />
              </div>
              <div className="ml-auto">
                <Buttons
                  ButtonStyle="login-btn-Not-a-member p-0"
                  onClick={() => showPopups("Registration")}
                  children={`${t("logIn.Not_a_member")}`}
                />
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </div> */}
    </>
  );
};

export default Login;
