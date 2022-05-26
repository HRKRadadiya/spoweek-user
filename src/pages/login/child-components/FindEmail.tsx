import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import Buttons from '../../../components/Buttons'
import InputField from "../../../components/Inputfield";
import NumberInput from "../../../components/NumberInput";
import { ApiPostNoAuth } from "../../../helper/API/ApiData";

interface findEmailState {
  email: string;
  name: string;
  phone: string;
  verification: string;
}
const FindEmail = () => {

  const { t } = useTranslation();
  const history = useHistory();

  const findEmailState: findEmailState = {
    email: "",
    name: "",
    phone: "",
    verification: ""
  };

  const findEmail_Err = {
    nameError: "",
    phoneError: "",
    verificationError: "",
  };

  const [findEmail, setFindEmail] = useState(findEmailState);
  const [findEmailErrors, setfindEmailErrors] = useState(findEmail_Err);
  const [incorrectPhone, setIncorrectPhone] = useState("");
  const [incorrectVerification, setIncorrectVerification] = useState("");
  const [issendEmail, setisSendEmail] = useState(false);
  const [emailData, setEmailData] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isPhoneCode, setIsPhoneCode] = useState(false);
  const [isVerifiCode, setIsVerifiCode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [modalShow, setModalShow] = React.useState(true);
  const [modalGetEmailHide, setModalGetEmailHide] = React.useState(false);

  const sendOTP = () => {
    ApiPostNoAuth("user/otp-send", {
      mobile: findEmail.phone,
    });
  };

  //Mobile Number Verification
  const mobileVerification = () => {
    ApiPostNoAuth("user/otp-verify", {
      mobile: findEmail.phone,
      code: findEmail.verification,
    }).then((res) => {
      setIsVerified(true);

    }).catch((error) => {
      setIsVerified(false);
    })
  }
  const findPasswordValidation = () => {
    let findPassword_Err = {
      nameError: "",
      phoneError: "",
      verificationError: "",
    };

    if (!findEmail.name) {
      findPassword_Err.nameError = `${t("find_email.Errors.This_is_required_information")}`;
    }

    if (findEmail.phone === "") {
      findPassword_Err.phoneError = `${t("find_email.Errors.This_is_required_information")}`;
    }

    if (findEmail.verification === "") {
      findPassword_Err.verificationError = `${t("find_email.Errors.This_is_required_information")}`;
    }

    setfindEmailErrors(findPassword_Err);
    setIncorrectPhone("");
    setIncorrectVerification("");

    if (!findEmailErrors.nameError && !findEmailErrors.phoneError && !findEmailErrors.verificationError) {
      return true;
    }

    return false;
  };
  const FindEmail = () => {
    setisSendEmail(true);

    if (!findPasswordValidation()) {
      setBtnDisabled(true);
      return;
    }

    ApiPostNoAuth("user/getEmail", {
      name: findEmail.name,
      mobile: findEmail.phone,
    }).then((res: any) => {
      setModalGetEmailHide(true);
      setModalShow(false);
      setEmailData(res.data.email);

    }).catch((error) => {
      setModalGetEmailHide(false);
    })
  }

  const validityCheck = () => {
    if (findEmail.name !== "" && findEmail.phone !== "" && findEmail.verification !== "") {
      setBtnDisabled(false);
    } else {
      if (isVerified) {
        setBtnDisabled(true);
        setModalShow(true);
      }
    }
  };

  useEffect(() => {
    validityCheck();
  }, [findEmail]);
  return (
    <>

      {!modalGetEmailHide &&
        <div className="modal-dialog modal-lg signup-popup modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header justify-content-center p-0">
              <img src="./img/memorial-Frame.svg" className="logo-img" />
            </div>
            <div className="modal-body p-0">
              <form className="login-form">
                <InputField
                  label={`${t("find_email.Name")}`}
                  fromrowStyleclass=""
                  name="name"
                  value={findEmail.name}
                  placeholder={`${t("find_email.Placeholder.Name")}`}
                  type="text"
                  lablestyleClass="login-label"
                  InputstyleClass="login-input"
                  onChange={(e: any) => {
                    setfindEmailErrors({
                      ...findEmail_Err,
                      nameError: ""
                    });
                    setFindEmail({ ...findEmail, name: e.target.value })
                  }
                  }
                />
                {findEmailErrors.nameError && (
                  <div className="position-relative">
                    <p className="log-error">{findEmailErrors.nameError}</p>
                  </div>
                )}

                <div className="p-relative">
                  <label className="login-label p-relative">{`${t("find_email.Phone_number")}`}</label>
                  <Buttons
                    ButtonStyle="Register-Send-Verification-Code"
                    onClick={() => { sendOTP(); }}
                    children={`${t("find_email.Send_Verification_Code")}`}
                    disabled={!isPhoneCode}
                  />
                </div>

                <NumberInput
                  name="phone"
                  value={findEmail.phone}
                  placeholder={`${t("find_email.Placeholder.Phone_number")}`}
                  InputstyleClass="login-input"
                  onChange={(e: any) => {
                    setfindEmailErrors({
                      ...findEmail_Err,
                      phoneError: ""
                    });
                    if (e.target.value) {
                      setIsPhoneCode(true)
                    } else {
                      setIsPhoneCode(false)
                    }
                    setFindEmail({ ...findEmail, phone: e.target.value })
                  }
                  } maxLength={10}
                />
                {findEmailErrors.phoneError && (
                  <div className="position-relative">
                    <p className="log-error">{findEmailErrors.phoneError}</p>
                  </div>
                )}
                <div className="p-relative">
                  <label className="login-label p-relative">{`${t("find_email.Verification_Code")}`}</label>
                  <Buttons
                    ButtonStyle="Register-Send-Verification-Code"
                    onClick={mobileVerification}
                    children={`${t("find_email.Verify")}`}
                    disabled={!isVerifiCode}
                  />
                </div>
                <NumberInput
                  name="verification"
                  value={findEmail.verification}
                  placeholder={`${t("find_email.Placeholder.Enter_Verification_code")}`}
                  InputstyleClass="login-input"
                  onChange={(e: any) => {
                    setfindEmailErrors({
                      ...findEmail_Err,
                      verificationError: ""
                    });
                    if (e.target.value) {
                      setIsVerifiCode(true)
                    } else {
                      setIsVerifiCode(false)
                    }
                    setFindEmail({ ...findEmail, verification: e.target.value })
                  }
                  } maxLength={5}
                />
                {findEmailErrors.verificationError && (
                  <div className="position-relative">
                    <p className="log-error">{findEmailErrors.verificationError}</p>
                  </div>
                )}
                <Buttons
                  ButtonStyle={`login-btn find-email-btn ${!isVerified && "login-btn-btnDisabled"}`}
                  onClick={() => FindEmail()}
                  disabled={!isVerified}
                >
                  {`${t("find_email.Find_Email")}`}
                </Buttons>
              </form>
            </div>
          </div>
        </div>
      }

      {/* <Modal
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
                label={`${t("find_email.Name")}`}
                fromrowStyleclass=""
                name="name"
                value={findEmail.name}
                placeholder={`${t("find_email.Placeholder.Name")}`}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  setfindEmailErrors({
                    ...findEmail_Err,
                    nameError: ""
                  });
                  setFindEmail({ ...findEmail, name: e.target.value })
                }
                }
              />
              {findEmailErrors.nameError && (
                <div className="position-relative">
                  <p className="log-error">{findEmailErrors.nameError}</p>
                </div>
              )}

              <div className="p-relative">
                <label className="login-label p-relative">{`${t("find_email.Placeholder.Phone_number")}`}</label>
                <Buttons
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={() => { sendOTP(); }}
                  children={`${t("find_email.Send_Verification_Code")}`}
                  disabled={!isPhoneCode}
                />
              </div>

              <NumberInput
                name="phone"
                value={findEmail.phone}
                placeholder={`${t("find_email.Placeholder.Phone_number")}`}
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  setfindEmailErrors({
                    ...findEmail_Err,
                    phoneError: ""
                  });
                  if (e.target.value) {
                    setIsPhoneCode(true)
                  } else {
                    setIsPhoneCode(false)
                  }
                  setFindEmail({ ...findEmail, phone: e.target.value })
                }
                } maxLength={10}
              />
              {findEmailErrors.phoneError && (
                <div className="position-relative">
                  <p className="log-error">{findEmailErrors.phoneError}</p>
                </div>
              )}
              <div className="p-relative">
                <label className="login-label p-relative">{`${t("find_email.Verification_Code")}`}</label>
                <Buttons
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={mobileVerification}
                  children={`${t("find_email.Verify")}`}
                  disabled={!isVerifiCode}
                />
              </div>
              <NumberInput
                name="verification"
                value={findEmail.verification}
                placeholder={`${t("find_email.Placeholder.Enter_Verification_code")}`}
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  setfindEmailErrors({
                    ...findEmail_Err,
                    verificationError: ""
                  });
                  if (e.target.value) {
                    setIsVerifiCode(true)
                  } else {
                    setIsVerifiCode(false)
                  }
                  setFindEmail({ ...findEmail, verification: e.target.value })
                }
                } maxLength={5}
              />
              {findEmailErrors.verificationError && (
                <div className="position-relative">
                  <p className="log-error">{findEmailErrors.verificationError}</p>
                </div>
              )}
              <Buttons
                ButtonStyle={`login-btn find-email-btn ${!isVerified && "login-btn-btnDisabled"}`}
                onClick={() => FindEmail()}
                disabled={!isVerified}
              >
                {`${t("find_email.Find_Email")}`}
              </Buttons>
            </form>
          </Modal.Body>

        </Modal> */}
      {modalGetEmailHide &&
        <div className="modal-dialog modal-lg find-email-popup modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header justify-content-center p-0">
              <img src="./img/memorial-Frame.svg" className="logo-img" />
            </div>
            <div className="modal-body p-0 ">
              <form className="login-form">
                <div className="sucess-login text-center">
                  <p className="content-email-address">{`${t("find_password.Email")}`}</p>
                  <p className="email-view"> {emailData}</p>
                </div>
              </form>
            </div>
            <div className="w-100 p-0 m-0">
              <div className="login-popup-footer d-flex m-0">
                <Buttons
                  ButtonStyle={`login-btn find-email-btn-two ${!isVerified && "login-btn-btnDisabled"}`}
                  onClick={() => { history.push("/login") }}
                >
                  {t("logIn.Log_In")}
                </Buttons>
              </div>
            </div>
          </div>
        </div>
      }
      {/* <Modal
        show={modalGetEmailHide}
        size="lg"
        dialogClassName="signup-popup"
        aria-labelledby="contained-modal-title-vcenter trans-bg"
        centered
      >
        <Modal.Header className="justify-content-center p-0">
          <Modal.Title><img src="./img/memorial-Frame.svg" className="logo-img" /></Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 text-center">
          <div className="sucess-login">
            <p className="content-email-address">{`${t("find_password.Email")}`}</p>
            <p className="email-view"> {emailData}</p>
          </div>
        </Modal.Body>
        <Buttons
          ButtonStyle={`login-btn find-email-btn ${!isVerified && "login-btn-btnDisabled"}`}
          onClick={() => { history.push("/login") }}
        >
          {t("logIn.Log_In")}
        </Buttons>
      </Modal> */}
    </>
  )
}

export default FindEmail
