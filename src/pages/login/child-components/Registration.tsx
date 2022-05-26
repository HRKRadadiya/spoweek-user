import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import Buttons from "../../../components/Buttons";
import InputField from "../../../components/Inputfield";
import NumberInput from "../../../components/NumberInput";
import { ApiPostNoAuth } from "../../../helper/API/ApiData";
import AuthStorage from "../../../helper/AuthStorage";
import { LoginWith } from "../../../helper/Constant";

const termko = () => {
  return (
    <p className="mb-0">리멤버드 <u><b>이용약관</b></u>과 <u><b>개인정보 수집 및 이용</b></u>에 모두 동의합니다.</p>
  )
}

const termen = () => {
  return (
    <p className="mb-0">I agree to the <u><b>Terms of Use</b></u> and <u><b>Privacy Policy.</b></u></p>
  )
}

const Registration = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryParams = new URLSearchParams(window.location.search);
  const resetForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    verificationCode: "",
    agreeTerms: false,
  };

  const resetFormError = {
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPassError: "",
    phoneNumberError: "",
    verificationError: "",
    agreeTerms: "",
  };

  const [userData, setUserData] = useState(resetForm);
  const [formError, setFormError] = useState(resetFormError);
  const [chackBoxValue, setChackBoxValue] = useState(false);
  const [incorrectOTP, setIncorrectOTP] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isMobileEntered, setIsMobileEntered] = useState(false);
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [isRegisterd, setIsRegisterd] = useState(false);
  const [modalShow, setModalShow] = React.useState(true);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [memorialHallId, setMemorialHallId] = useState<string | undefined>("");
  const [isEmailDisable, setIsEmailDisable] = useState(false);

  //Send OTP
  const sendOTP = () => {
    ApiPostNoAuth("user/otp-send", {
      mobile: userData.phoneNumber,
    });
  };
  //----------

  //Mobile Number Verification
  const mobileVerification = () => {
    ApiPostNoAuth("user/otp-verify", {
      mobile: userData.phoneNumber,
      code: userData.verificationCode,
    })
      .then((res) => {
        setIncorrectOTP("");
        setIsVerified(true);
        setIsMobileVerified(true)
      })
      .catch((error) => {
        setIncorrectOTP(error);
        setIsMobileVerified(false)
      });
  };

  const validateForm = () => {
    let errors = {
      nameError: "",
      emailError: "",
      passwordError: "",
      confirmPassError: "",
      phoneNumberError: "",
      verificationError: "",
      agreeTerms: "",
    };
    if (!userData.name) {
      errors.nameError = `${t("signup.Errors.This_is_required_information")}`;
    }
    const validEmail: any = new RegExp(
      "^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
    );

    if (!validEmail.test(userData.email)) {
      errors.emailError = `${t("signup.Errors.Email")}`;
    }
    if (!userData.password) {
      errors.passwordError = `${t("signup.Errors.This_is_required_information")}`;
    }

    if (userData.password.length < 8) {
      errors.passwordError = `${t("signup.Errors.Password_at_least_eight_character")}`;
    }
    if (!userData.confirmPassword) {
      errors.confirmPassError = `${t("signup.Errors.ConfirmPassword")}`;
    }

    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassError = `${t("signup.Errors.PasswordMatch")}`;
    }

    if (!userData.phoneNumber) {
      errors.phoneNumberError = `${t("signup.Errors.This_is_required_information")}`;
    }
    if (!userData.verificationCode) {
      errors.verificationError = `${t("signup.Errors.Verification_Code")}`;
    }
    if (!userData.agreeTerms) {
      errors.agreeTerms = `${t("signup.Errors.agreeTerms")}`;
    }
    setFormError(errors);

    if (
      !errors.emailError &&
      !errors.passwordError &&
      !errors.confirmPassError &&
      !errors.nameError &&
      !errors.phoneNumberError &&
      !errors.verificationError &&
      !errors.agreeTerms
    ) {
      return true;
    }
    return false;
  };

  const handleChange = (e: any) => {
    if (e.target.name === "agreeTerms") {
      setUserData({ ...userData, [e.target.name]: e.target.checked });
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };
  useEffect(() => {
    if (isVerified) {
      validateForm();
    }
  }, [isVerified]);

  useEffect(() => {
    if (isRegisterd) {
      validateForm();
    }
  }, [userData, isRegisterd]);

  const SignUp = async () => {
    setIsRegisterd(true);

    if (!validateForm()) {
      return;
    }

    ApiPostNoAuth("user/auth/signup", {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      mobile: userData.phoneNumber,
      is_verified: isVerified,
      login_with: LoginWith.Manual
    })
      .then((res) => {
        setUserData(resetForm);
        setFormError(resetFormError);
        setIsVerified(false);
        setIsRegisterd(false);
        if (memorialHallId) {
          const mHId = memorialHallId
          setMemorialHallId(undefined)
          history.push(`/login?id=${mHId}`);
        } else {
          history.push(`/login`);
        }
      })
      .catch((error) => {
        setIsVerified(false);
      });
  };

  useEffect(() => {
    const id = queryParams.get('id')?.toString();
    const eid: string | undefined = queryParams.get('eid')?.toString();
    if (id) {
      setMemorialHallId(id)
    }
    if (eid) {
      setUserData({ ...userData, email: eid });
      setIsEmailDisable(true)
    }
  }, [])

  return (
    <>

      <div className="modal-dialog modal-lg signup-popup signup-popup-padding modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header justify-content-center p-0">
            <img src="./img/memorial-Frame.svg" className="logo-img" />
          </div>
          <div className="modal-body p-0">
            <form className="login-form">
              <InputField
                label={`${t("signup.Email")}`}
                fromrowStyleclass=""
                name="email"
                value={userData.email}
                placeholder={`${t("signup.Placeholder.Email")}`}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                disabled={isEmailDisable}
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />

              {isRegisterd && formError.emailError && (
                <div className="position-relative">
                  <p className="log-error">{formError.emailError}</p>
                </div>
              )}
              <InputField
                label={`${t("signup.Password")}`}
                fromrowStyleclass=""
                name="password"
                value={userData.password}
                placeholder={`${t("signup.Placeholder.Password")}`}
                type="password"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.passwordError && (
                <div className="position-relative">
                  <p className="log-error">{formError.passwordError}</p>
                </div>
              )}{" "}
              <InputField
                label={`${t("signup.Password_Confirmation")}`}
                fromrowStyleclass=""
                name="confirmPassword"
                value={userData.confirmPassword}
                placeholder={`${t("signup.Placeholder.Password_Confirmation")}`}
                type="password"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.confirmPassError && (
                <div className="position-relative">
                  <p className="log-error">{formError.confirmPassError}</p>
                </div>
              )}{" "}
              <InputField
                label={`${t("signup.Name")}`}
                fromrowStyleclass=""
                name="name"
                value={userData.name}
                placeholder={`${t("signup.Placeholder.Name")}`}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.nameError && (
                <div className="position-relative">
                  <p className="log-error">{formError.nameError}</p>
                </div>
              )}{" "}
              <div className="p-relative">
                <label className="login-label ">
                  {`${t("signup.Phone_number")}`}

                </label>
                <Buttons
                  disabled={!isMobileEntered}
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={() => { sendOTP(); }}
                  children={`${t("signup.Send_Verification_Code")}`}
                />
              </div>
              <NumberInput
                name="phoneNumber"
                InputstyleClass="login-input"
                value={userData.phoneNumber}
                placeholder={`${t("signup.Placeholder.Phone_number")}`}
                onChange={(e: any) => {
                  handleChange(e);
                  if (e.target.value) {
                    setIsMobileEntered(true)
                  } else {
                    setIsMobileEntered(false)
                  }
                }}
                maxLength={10}
              />
              {isRegisterd && formError.phoneNumberError && (
                <div className="position-relative">
                  <p className="log-error">{formError.phoneNumberError}</p>
                </div>
              )}{" "}
              <div className="p-relative">
                <label className="login-label p-relative">
                  {`${t("signup.Verification_Code")}`}
                </label>
                <Buttons
                  disabled={!isCodeEntered}
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={mobileVerification}
                  children={`${t("signup.Verify")}`}
                />
              </div>
              <NumberInput
                name="verificationCode"
                value={userData.verificationCode}
                placeholder={`${t("signup.Placeholder.Verification_Code")}`}
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  if (e.target.value) {
                    setIsCodeEntered(true)
                  } else {
                    setIsCodeEntered(false)
                  }
                  setUserData({
                    ...userData,
                    verificationCode: e.target.value,
                  });
                }}
                maxLength={6}
              />
              {isRegisterd && formError.verificationError && (
                <div className="position-relative">
                  <p className="log-error">{formError.verificationError}</p>
                </div>
              )}{" "}

              <label
                className={
                  chackBoxValue
                    ? "login-label-checkbox-checked"
                    : "login-label-checkbox"
                }
              >
                <input
                  type="checkbox"
                  name="agreeTerms"
                  onChange={(e) => {
                    handleChange(e);
                    setChackBoxValue(e.target.checked);
                  }}
                  className="checkbox-input"
                />
                {" "}
                {AuthStorage.getLang() === "en" ? termen() : termko()}
              </label>
              {isRegisterd && formError.agreeTerms && (
                <div className="position-relative">
                  <p className="log-error">{formError.agreeTerms}</p>
                </div>
              )}
              <Buttons
                ButtonStyle={`login-btn ${!isMobileVerified && "login-btn-btnDisabled"}`}
                onClick={() => {
                  SignUp();
                }}
                children={`${t("signup.Register")}`}
                disabled={!isMobileVerified}
              />
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                <img src="./img/kakaotalk 1.svg" className="kakaotalk-img" />
                {`${t("signup.Register_with_Kakaotalk")}`}
              </Buttons>
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                <img src="./img/Naver-img.svg" className="kakaotalk-img" />
                {`${t("signup.Register_with_Naver")}`}
              </Buttons>
            </form>
          </div>
        </div>
      </div>

      {/* <div className="trans-bg-modal">
        <Modal
          show={modalShow}
          size="lg"
          dialogClassName="signup-popup"
          aria-labelledby="contained-modal-title-vcenter trans-bg"
          centered>
          <Modal.Header className="justify-content-center p-0">
            <Modal.Title><img src="./img/memorial-Frame.svg" className="logo-img" /></Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-0">
            <form className="login-form">
              <InputField
                label={`${t("signup.Email")}`}
                fromrowStyleclass=""
                name="email"
                value={userData.email}
                placeholder={`${t("signup.Placeholder.Email")}`}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                disabled={isEmailDisable}
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />

              {isRegisterd && formError.emailError && (
                <div className="position-relative">
                  <p className="log-error">{formError.emailError}</p>
                </div>
              )}
              <InputField
                label={`${t("signup.Password")}`}
                fromrowStyleclass=""
                name="password"
                value={userData.password}
                placeholder={`${t("signup.Placeholder.Password")}`}
                type="password"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.passwordError && (
                <div className="position-relative">
                  <p className="log-error">{formError.passwordError}</p>
                </div>
              )}{" "}
              <InputField
                label={`${t("signup.Password_Confirmation")}`}
                fromrowStyleclass=""
                name="confirmPassword"
                value={userData.confirmPassword}
                placeholder={`${t("signup.Placeholder.Password_Confirmation")}`}
                type="password"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.confirmPassError && (
                <div className="position-relative">
                  <p className="log-error">{formError.confirmPassError}</p>
                </div>
              )}{" "}
              <InputField
                label={`${t("signup.Name")}`}
                fromrowStyleclass=""
                name="name"
                value={userData.name}
                placeholder={`${t("signup.Placeholder.Name")}`}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.nameError && (
                <div className="position-relative">
                  <p className="log-error">{formError.nameError}</p>
                </div>
              )}{" "}
              <div className="p-relative">
                <label className="login-label ">
                  {`${t("signup.Phone_number")}`}

                </label>
                <Buttons
                  disabled={!isMobileEntered}
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={() => { sendOTP(); }}
                  children={`${t("signup.Send_Verification_Code")}`}
                />
              </div>
              <NumberInput
                name="phoneNumber"
                InputstyleClass="login-input"
                value={userData.phoneNumber}
                placeholder={`${t("signup.Placeholder.Phone_number")}`}
                onChange={(e: any) => {
                  handleChange(e);
                  if (e.target.value) {
                    setIsMobileEntered(true)
                  } else {
                    setIsMobileEntered(false)
                  }
                }}
                maxLength={10}
              />
              {isRegisterd && formError.phoneNumberError && (
                <div className="position-relative">
                  <p className="log-error">{formError.phoneNumberError}</p>
                </div>
              )}{" "}
              <div className="p-relative">
                <label className="login-label p-relative">
                  {`${t("signup.Verification_Code")}`}
                </label>
                <Buttons
                  disabled={!isCodeEntered}
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={mobileVerification}
                  children={`${t("signup.Verify")}`}
                />
              </div>
              <NumberInput
                name="verificationCode"
                value={userData.verificationCode}
                placeholder={`${t("signup.Placeholder.Verification_Code")}`}
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  if (e.target.value) {
                    setIsCodeEntered(true)
                  } else {
                    setIsCodeEntered(false)
                  }
                  setUserData({
                    ...userData,
                    verificationCode: e.target.value,
                  });
                }}
                maxLength={6}
              />
              {isRegisterd && formError.verificationError && (
                <div className="position-relative">
                  <p className="log-error">{formError.verificationError}</p>
                </div>
              )}{" "}

              <label
                className={
                  chackBoxValue
                    ? "login-label-checkbox-checked"
                    : "login-label-checkbox"
                }
              >
                <input
                  type="checkbox"
                  name="agreeTerms"
                  onChange={(e) => {
                    handleChange(e);
                    setChackBoxValue(e.target.checked);
                  }}
                  className="checkbox-input"
                />
                {" "}
                {AuthStorage.getLang() === "en" ? termen() : termko()}
              </label>
              {isRegisterd && formError.agreeTerms && (
                <div className="position-relative">
                  <p className="log-error">{formError.agreeTerms}</p>
                </div>
              )}
              <Buttons
                ButtonStyle={`login-btn ${!isMobileVerified && "login-btn-btnDisabled"}`}
                onClick={() => {
                  SignUp();
                }}
                children={`${t("signup.Register")}`}
                disabled={!isMobileVerified}
              />
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
        </Modal>
      </div> */}
    </>
  );
};

export default Registration;
