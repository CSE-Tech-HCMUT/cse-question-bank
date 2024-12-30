import i18n from "i18next";
import { initReactI18next } from "react-i18next"
import HOME_EN from '../locales/en/home.json'
import HOME_VI from '../locales/vi/home.json'
import MAINLAYOUT_EN from '../locales/en/main-layout.json'
import MAINLAYOUT_VI from '../locales/vi/main-layout.json'
import TAGMANAGEMENT_EN from '../locales/en/tag/tag-management.json'
import TAGMANAGEMENT_VI from '../locales/vi/tag/tag-management.json'
import TAGCREATIONMODAL_EN from '../locales/en/tag/modal/tag-creation-modal.json'
import TAGCREATIONMODAL_VI from '../locales/vi/tag/modal/tag-creation-modal.json'
import TAGEDITMODAL_EN from '../locales/en/tag/modal/tag-edit-modal.json'
import TAGEDITMODAL_VI from '../locales/vi/tag/modal/tag-edit-modal.json'
import TAGDELETEMODAL_EN from '../locales/en/tag/modal/tag-delete-modal.json'
import TAGDELETEMODAL_VI from '../locales/vi/tag/modal/tag-delete-modal.json'
import TAGVIEWMODAL_EN from '../locales/en/tag/modal/tag-view-modal.json'
import TAGVIEWMODAL_VI from '../locales/vi/tag/modal/tag-view-modal.json'
import DASHBOARD_EN from '../locales/en/dashboard/dashboard.json'
import DASHBOARD_VI from '../locales/vi/dashboard/dashboard.json'
import QUESTION_EN from '../locales/en/question/question-creation/question-creation.json'
import QUESTION_VI from '../locales/vi/question/question-creation/question-creation.json'
import TEXTEDITOR_EN from '../locales/en/editor/text-editor.json'
import TEXTEDITOR_VI from '../locales/vi/editor/text-editor.json'
import QUESTIONMANAGEMENT_EN from '../locales/en/question/question-management.json'
import QUESTIONMANAGEMENT_VI from '../locales/vi/question/question-management.json'
import QUESTIONDELETEMODAL_EN from '../locales/en/question/modal/question-delete-modal.json'
import QUESTIONDELETEMODAL_VI from '../locales/vi/question/modal/question-delete-modal.json'
import LOGIN_EN from '../locales/en/auth/login.json'
import LOGIN_VI from '../locales/vi/auth/login.json'
import SIGNUP_EN from '../locales/en/auth/signup.json'
import SIGNUP_VI from '../locales/vi/auth/signup.json'

export const locales = {
    en: 'English',
    vi: 'Việt Nam'
}

const resources = {
    en: {
        home: HOME_EN,
        main_layout: MAINLAYOUT_EN,
        tag_management: TAGMANAGEMENT_EN,
        tag_creation_modal: TAGCREATIONMODAL_EN,
        tag_edit_modal: TAGEDITMODAL_EN,
        tag_delete_modal: TAGDELETEMODAL_EN,
        tag_view_modal: TAGVIEWMODAL_EN,
        dashboard: DASHBOARD_EN,
        question_creation: QUESTION_EN,
        text_editor: TEXTEDITOR_EN,
        question_management: QUESTIONMANAGEMENT_EN,
        question_delete_modal: QUESTIONDELETEMODAL_EN,
        login: LOGIN_EN,
        signup: SIGNUP_EN,
    },

    vi: {
        home: HOME_VI,
        main_layout: MAINLAYOUT_VI,
        tag_management: TAGMANAGEMENT_VI,
        tag_creation_modal: TAGCREATIONMODAL_VI,
        tag_edit_modal: TAGEDITMODAL_VI,
        tag_delete_modal: TAGDELETEMODAL_VI,
        tag_view_modal: TAGVIEWMODAL_VI,
        dashboard: DASHBOARD_VI,
        question_creation: QUESTION_VI,
        text_editor: TEXTEDITOR_VI,
        question_management: QUESTIONMANAGEMENT_VI,
        question_delete_modal: QUESTIONDELETEMODAL_VI,
        login: LOGIN_VI,
        signup: SIGNUP_VI,
    }
}

const defaultNS = 'home'

i18n.use(initReactI18next).init({
    resources,
    lng:'vi',
    ns: ['home', 'main_layout', 'tag_management', 'tag_creation_modal', 'tag_edit_modal', 'tag_delete_modal', 'tag_view_modal', 'dashboard', 'question_creation', 'text_editor', 'question_management', 'question_delete_modal', 'login', 'signup'],
    fallbackLng: 'vi',
    defaultNS,
    interpolation: {
        escapeValue: false, 
    }
})