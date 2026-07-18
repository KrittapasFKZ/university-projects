import React, { useState, useEffect } from "react";
import {
    Input,
    Button,
    Col,
    Layout,
    Flex,
    Card,
    Collapse,
    Space,
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import Step from "./Navbar/Step.js";
import { useMediaQuery } from "react-responsive";
import WebFont from 'webfontloader';

import { config } from "./config.js";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const AllStepDone = () => {
    const navigate = useNavigate();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const cardWidth = isSmallScreen ? '100%' : 1000;
    const cardHeight = isSmallScreen ? 'auto' : 700;
    const { Panel } = Collapse;
    let url = "https://i.pinimg.com/originals/96/09/5b/96095bfa0b64cdbfd12fcbd030ec41d8.gif"
    const [remainingTime, setRemainingTime] = useState(60000);
    const roleChecker = async () => {
        try {
            axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
            };
            const userResult = await axios.get(`${config.serverUrlPrefix}/users/me?populate=role`);
            setUsername(userResult.data.username)
        } catch (error) {
            console.error(error)
        }
    };
    const handleButtonClick = () => {
        navigate('/member');
    };

    const handleButtonClicks = () => {
        navigate('/history');
    };

    const handleHeaderClick = () => {
        navigate('/Member');
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/member');
        }, remainingTime);

        return () => clearTimeout(timer);
    }, [remainingTime, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(remainingTime => remainingTime - 1000);
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    useEffect(() => {
        if (jwt == null) { navigate("/") } else roleChecker();
    }, []);

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Sriracha', 'Kanit']
            }
        });
    }, []);

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
        width: isSmallScreen ? '100%' : 'auto',
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

            <Layout style={layoutStyle}>
                <Header onClick={isSmallScreen ? handleHeaderClick : undefined} style={{ ...headerStyle, justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
                    <Col>
                        <span style={blueTextStyle}>H</span>
                        <span style={NormalTextStyle}>AT</span>
                        <span style={invtext}>.</span>
                        <span style={blueTextStyle}>Y</span>
                        <span style={NormalTextStyle}>AI</span>
                        <span style={invtext}>.</span>
                        <span style={blueTextStyle}>J</span>
                        <span style={NormalTextStyle}>ourney</span>
                    </Col>
                    {!isSmallScreen && (
                        <Col span={12} style={{ marginLeft: "150px" }}>
                            <Step current={2} />
                        </Col>
                    )}
                </Header>
            </Layout>
            <Space direction="vertical" size="middle" style={{ display: 'flex', width: isSmallScreen ? '100%' : 'auto' }}>
                <Card title="การชำระเงินเสร็จสิ้น" bordered={false} style={{ fontFamily: 'Kanit', width: isSmallScreen ? '100%' : 950 }}>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: isSmallScreen ? '100%' : "100%" }}>
                        <img src={url} className="Logo1" alt="" style={{ width: isSmallScreen ? '100%' : 500, borderRadius: 500 }} />
                    </div>
                    <div style={{ fontFamily: 'Kanit' }}>
                        <p><strong>การสั่งซื้อของคุณเสร็จสิ้นแล้ว สถานะการจองของคุณจะเปลี่ยนแปลงในไม่ช้านี้! แพ็คกระเป๋าและเตรียมตัวออกผจญภัยกันได้เลย!</strong></p>
                        <p>คุณกำลังจะถูกนำออกจากหน้านี้ในอีก {Math.floor(remainingTime / 1000)} วินาที</p>
                    </div>
                    <Button type="primary" style={{ fontFamily: 'Kanit', backgroundColor: '#fff', borderColor: '#91D5FF', color: '#1890FF' }}
                        onClick={handleButtonClick}>กลับสู่หน้าหลัก</Button>
                    <Button type="primary" style={{ fontFamily: 'Kanit', backgroundColor: '#fff', borderColor: '#91D5FF', color: '#1890FF', marginLeft: '10px' }}
                        onClick={handleButtonClicks}>ดูทัวร์ของคุณ</Button>
                </Card>
            </Space>
        </Flex>
    );
};


export default AllStepDone;
