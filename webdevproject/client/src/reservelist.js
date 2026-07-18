import React, { useState, useEffect } from "react";
import {
    Input,
    message,
    Col,
    Layout,
    Flex,
    Menu, Dropdown, Avatar
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import CardHistory from "./Tour/getHistory.js";
import { useMediaQuery } from "react-responsive";
import WebFont from 'webfontloader';

import { config, config2 } from "./config.js";




const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const ReserveForm = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const [menuVisible, setMenuVisible] = useState(false);
    const [userimage, setUserImage] = useState({});

    const roleChecker = async () => {
        try {
            axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
            };
            const userResult = await axios.get(
                `${config.serverUrlPrefix}/users/me?populate=role`
            );

            setUsername(userResult.data.username);

            if (userResult.data.role && userResult.data.role.name === "Member") {
                navigate("/history");
            } else {
                if (userResult.data.role && userResult.data.role.name === "Admin") {
                    navigate("/confirm");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getImage = async () => {
        try {
            const res = await axios.get(`${config.serverUrlPrefix}/users/me?populate=*`);
            setUserImage(res.data);
        } catch (error) {
            console.error("การแสดงข้อมูล user ผิดพลาด", error);
        }
    };

    const handleLogout = async () => {
        setjwt(null)
        messageApi.open({
            type: 'loading',
            content: 'Please wait...',
            duration: 1,
        })
            .then(() => message.success('Completed!', 0.5))
            .then(() => window.location.href = '/')
    };

    useEffect(() => {
        if (jwt == null) {
            navigate("/");
        } else roleChecker();
        getImage();
    }, []);
    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Sriracha', 'Kanit']
            }
        });
    }, []);
    const handleHeaderClick = () => {
        navigate('/Member');
    };

    const menu = (
        <Menu>
            {jwt ? (
                <>
                    <Menu.Item
                        onClick={() => {
                            navigate("/profile");
                        }}
                        key="username"
                    >
                        <span style={{ fontFamily: 'Kanit', color: "#48D3FF" }}>
                            {username && `โปรไฟล์ของ, ${username}`}
                        </span>
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => {
                            navigate("/");
                        }}
                        key="back"
                    >กลับสู่หน้าหลัก</Menu.Item>
                    <Menu.Item key="logout" onClick={() => handleLogout()}>
                        ออกจากระบบ
                    </Menu.Item>
                </>
            ) : (
                <></>
            )}
        </Menu>
    );
    const menu2 = (
        <Menu>
            {jwt ? (
                <>
                    <Menu.Item
                        onClick={() => {
                            navigate("/profile");
                        }}
                        key="username"
                    >
                    </Menu.Item>
                    <Menu.Item key="profile" onClick={() => navigate("/profile")}>
                        {username && `โปรไฟล์ของ, ${username}`}
                    </Menu.Item>

                    <Menu.Item key="back" onClick={() => navigate("/member")}>
                        กลับสู่หน้าหลัก
                    </Menu.Item>
                    <Menu.Item key="logout" onClick={() => handleLogout()}>
                        ออกจากระบบ
                    </Menu.Item>
                </>
            ) : (
                <></>
            )}
        </Menu>
    );

    const headerStyle = {
        textAlign: 'center',
        color: '#fff',
        height: 120,
        paddingInline: "center",
        lineHeight: '120x',
        backgroundColor: '#1C3953',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '45px',
    };

    const layoutStyle = {
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
    };

    const blueTextStyle = {
        color: "#48D3FF",
        fontWeight: "bold",
        fontSize: isSmallScreen ? "24px" : "45px",
    };

    const NormalTextStyle = {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: isSmallScreen ? "24px" : "45px",
    };

    const invtext = {
        color: "#1C3953",
        fontWeight: "bold",
        fontSize: isSmallScreen ? "24px" : "45px",
    };

    return (
        <Flex gap="middle" wrap="wrap" style={{ backgroundColor: "#F5F5F5" }}>
            <Helmet>
                <title>HATYAI Journey - เว็ปจองทัวร์หาดใหญ่ที่ดีที่สุด</title>
            </Helmet>
            {contextHolder}
            <Layout style={layoutStyle}>
                <Header style={{ ...headerStyle, justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
                    <Col onClick={isSmallScreen ? handleHeaderClick : undefined} style={{ ...headerStyle, justifyContent: isSmallScreen ? 'center' : 'flex-start' }} >
                        <span style={blueTextStyle}>H</span>
                        <span style={NormalTextStyle}>AT</span>
                        <span style={invtext}>.</span>
                        <span style={blueTextStyle}>Y</span>
                        <span style={NormalTextStyle}>AI</span>
                        <span style={invtext}>.</span>
                        <span style={blueTextStyle}>J</span>
                        <span style={NormalTextStyle}>ourney</span>
                    </Col>
                    <Col span={isSmallScreen ? 12 : 22}>
                        {isSmallScreen ? (
                            <div style={{ textAlign: isSmallScreen ? 'right' : 'left' }}>
                                <Dropdown overlay={menu} trigger={['click']} visible={menuVisible} onVisibleChange={setMenuVisible}>
                                    <Avatar
                                        style={{
                                            marginLeft: "50px",
                                            color: "white",
                                            fontSize: "50px",
                                            fontFamily: "Kanit",
                                            marginBottom: "10px",
                                            marginRight: "-10px",
                                        }}
                                        size={52}
                                        src={`${config2.serverUrlPrefix}${userimage.profile_image?.url}`}
                                    />
                                </Dropdown>

                            </div>
                        ) : (
                            <>
                                <Link
                                    onClick={() => {
                                        navigate("/");
                                    }}
                                    style={{ fontFamily: 'Kanit', marginLeft: "500px", color: "white", fontSize: isSmallScreen ? "14px" : "18px", width: "300px" }}
                                >
                                    สวัสดีคุณ {username}
                                </Link>

                                <Dropdown placement="bottomLeft"
                                    overlay={menu2}
                                    trigger={["click"]}


                                >
                                    <Avatar
                                        style={{
                                            marginLeft: "50px",
                                            color: "white",
                                            fontSize: "50px",
                                            fontFamily: 'Kanit',
                                            marginBottom: "10px",
                                            marginRight: "-70px"
                                        }}
                                        size={52}
                                        src={`${config2.serverUrlPrefix}${userimage.profile_image?.url}`}
                                    />
                                </Dropdown>
                            </>
                        )}
                    </Col>



                </Header>
                <span style={{ fontFamily: 'Kanit', textAlign: 'center', fontSize: "50px", marginTop: "20px" }}>ประวัติการจอง</span>
                <CardHistory />
            </Layout>

        </Flex>

    );
};


export default ReserveForm;
