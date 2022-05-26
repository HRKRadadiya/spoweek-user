import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import './helper/i18n/index'
import './Responsive.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import "../node_modules/slick-carousel/slick/slick.css";
// import "../node_modules/slick-carousel/slick/slick-theme.css";
import "../node_modules/react-datepicker/dist/react-datepicker.css";
// import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import "../node_modules/froala-editor/css/froala_style.min.css";
import "../node_modules/froala-editor/css/froala_editor.pkgd.min.css";
import "../node_modules/froala-editor/css/third_party/embedly.min.css";
import "../node_modules/froala-editor/js/froala_editor.pkgd.min.js";
import "../node_modules/froala-editor/js/plugins.pkgd.min.js";
import "../node_modules/froala-editor/js/third_party/embedly.min.js";
import "../node_modules/tributejs/dist/tribute.css";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
