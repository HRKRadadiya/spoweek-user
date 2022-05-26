import React from 'react'
import Buttons from '../components/Buttons'
import { useTranslation } from "react-i18next";

const Login = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-color">
            <div className="inducing-pop-up">
                <div className="register-content-set">
                    <p className="heding">{`${t("logIn.Log_In")}`}
                        <img src="./img/Group 12432.svg" />
                    </p>
                </div>
                <div className="border-line"></div>
                <div className="content">
                    <p>{`${t("Modal.Login")}`}</p>
                    <p className="content-p">{`${t("Modal.Logins")}`}</p>
                </div>
                <Buttons
                    ButtonStyle="register-btn"
                    onClick={() => { }}
                    children={`${t("logIn.Log_In")}`}
                />
            </div>
        </div>
    )
}

export default Login
