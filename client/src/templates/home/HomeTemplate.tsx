import { Col, Divider, Row, theme } from "antd"
import { useTranslation } from "react-i18next";


export const HomeTemplate = () => {
    const { 
        token: { colorPrimary }
    } = theme.useToken();
    
    const { t } = useTranslation('home');

    return (
        <main>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <div className="bg-white p-2 px-4">
                        <p className="font-normal text-[16px]" 
                            style={{ color: colorPrimary }}
                        >
                            { t("application for administrator") }
                        </p>
                        <Divider className="!m-2 !ml-0" orientation="left"></Divider>
                        <ul>
                            <li>
                                <div className="flex items-center">
                                    <img 
                                        src="https://mybk.hcmut.edu.vn/my/images/upload/app_bk_e-learning.png" 
                                        alt="..." 
                                        width="50" 
                                        height="50" 
                                        className="mr-2"
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            className="hover:cursor-pointer transition-all duration-200 font-medium"
                                            style={{ color: colorPrimary }}
                                        >
                                            {
                                                t("user management")
                                            }
                                        </p>
                                        <p
                                            style={{
                                                color: '#999',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {
                                                t("content user management")
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Divider className="!m-3 !ml-0" orientation="left"></Divider>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <img 
                                        src="https://mybk.hcmut.edu.vn/my/images/upload/app_bk_e-learning.png" 
                                        alt="..." 
                                        width="50" 
                                        height="50" 
                                        className="mr-2"
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            className="hover:cursor-pointer transition-all duration-200 font-medium"
                                            style={{ color: colorPrimary }}
                                        >
                                           {
                                                t("department management")
                                            }
                                        </p>
                                        <p
                                            style={{
                                                color: '#999',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {
                                                t("content department management")
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Divider className="!m-3 !ml-0" orientation="left"></Divider>
                            </li>
                            <li className="mb-4">
                                <div className="flex items-center">
                                    <img 
                                        src="https://mybk.hcmut.edu.vn/my/images/upload/app_bk_e-learning.png" 
                                        alt="..." 
                                        width="50" 
                                        height="50" 
                                        className="mr-2"
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            className="hover:cursor-pointer transition-all duration-200 font-medium"
                                            style={{ color: colorPrimary }}
                                        >
                                            {
                                                t("subject management")
                                            }
                                        </p>
                                        <p
                                            style={{
                                                color: '#999',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {
                                                t("content subject management")
                                            }
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="bg-white p-2 px-4">
                        <p className="font-normal text-[16px]" 
                            style={{ color: colorPrimary }}
                        >
                            { t("application for lecturer") }
                        </p>
                        <Divider className="!m-2 !ml-0" orientation="left"></Divider>
                        <ul>
                            <li>
                                <div className="flex items-center">
                                    <img 
                                        src="https://mybk.hcmut.edu.vn/my/images/upload/app_bk_e-learning.png" 
                                        alt="..." 
                                        width="50" 
                                        height="50" 
                                        className="mr-2"
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            className="hover:cursor-pointer transition-all duration-200 font-medium"
                                            style={{ color: colorPrimary }}
                                        >
                                            {
                                                t("question management")
                                            }
                                        </p>
                                        <p
                                            style={{
                                                color: '#999',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {
                                                t("content question management")
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Divider className="!m-3 !ml-0" orientation="left"></Divider>
                            </li>
                            <li className="mb-4">
                                <div className="flex items-center">
                                    <img 
                                        src="https://mybk.hcmut.edu.vn/my/images/upload/app_bk_e-learning.png" 
                                        alt="..." 
                                        width="50" 
                                        height="50" 
                                        className="mr-2"
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            className="hover:cursor-pointer transition-all duration-200 font-medium"
                                            style={{ color: colorPrimary }}
                                        >
                                            {
                                                t("exam management")
                                            }
                                        </p>
                                        <p
                                            style={{
                                                color: '#999',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {
                                                t("content exam management")
                                            }
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="bg-white p-2 px-4">
                        <p className="font-normal text-[16px]" 
                            style={{ color: colorPrimary }}
                        >
                            { t("application for student") }
                        </p>
                        <Divider className="!m-2 !ml-0" orientation="left"></Divider>
                        <ul>
                            <li>
                                <div className="flex items-center">
                                    <img 
                                        src="https://mybk.hcmut.edu.vn/my/images/upload/app_bk_e-learning.png" 
                                        alt="..." 
                                        width="50" 
                                        height="50" 
                                        className="mr-2"
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            className="hover:cursor-pointer transition-all duration-200 font-medium"
                                            style={{ color: colorPrimary }}
                                        >
                                            {
                                                t("reference question")
                                            }
                                        </p>
                                        <p
                                            style={{
                                                color: '#999',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {
                                                t("content reference question")
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Divider className="!m-3 !ml-0" orientation="left"></Divider>
                            </li>
                            <li className="mb-4">
                                <div className="flex items-center">
                                    <img 
                                        src="https://mybk.hcmut.edu.vn/my/images/upload/app_bk_e-learning.png" 
                                        alt="..." 
                                        width="50" 
                                        height="50" 
                                        className="mr-2"
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            className="hover:cursor-pointer transition-all duration-200 font-medium"
                                            style={{ color: colorPrimary }}
                                        >
                                            {
                                                t("reference exam")
                                            }
                                        </p>
                                        <p
                                            style={{
                                                color: '#999',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {
                                                t("content reference exam")
                                            }
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </main>
    )
}

export default HomeTemplate