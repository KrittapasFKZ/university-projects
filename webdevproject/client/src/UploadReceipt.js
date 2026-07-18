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
    Drawer,
    FloatButton,
    Popover
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useLocalState from './localStorage.js';
import Step from "./Navbar/Step.js";
import { useMediaQuery } from "react-responsive";
import { QuestionCircleOutlined } from '@ant-design/icons'
import WebFont from 'webfontloader';

import { config } from "./config.js";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const UploadReceipt = () => {
    const navigate = useNavigate();
    const [jwt, setjwt] = useLocalState(null, 'jwt');
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const cardWidth = isSmallScreen ? '100%' : 1000;
    const cardHeight = isSmallScreen ? 'auto' : 700;
    const { Panel } = Collapse;
    let url = "https://qr-official.line.me/gs/M_305iwzmm_GW.png?oat_content=qr"
    let url2 = "https://play-lh.googleusercontent.com/eOzvk-ekluYaeLuvDkLb5RJ0KqfFQpodZDnppxPfpEfqEqbNo5erEkmwLBgqP-k-e2kQ"
    let url3 = "https://cdn.discordapp.com/attachments/1070568112459632682/1213170138891812894/IMG_0254.png?ex=65f47fbc&is=65e20abc&hm=514a7a19f83f6438a0d8566fe45a167d11f779246e2294310fc6eed702d4d0fd&"
    const [open, setOpen] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
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
    const handleHeaderClick = () => {
        navigate('/Member');
    };

    const handleButtonClick = () => {
        navigate('/AllStepDone');
    };

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

    const showDrawer = () => {
        if (!drawerVisible) {
            setOpen(true);
            setDrawerVisible(true);
        } else {
            setOpen(false);
            setDrawerVisible(false);
        }
    };
    const onClose = () => {
        setOpen(false);
        setDrawerVisible(false);
    };

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
                            <Step current={1} />
                        </Col>
                    )}
                </Header>
            </Layout>
            <Space direction="vertical" size="middle" style={{ display: 'flex', width: isSmallScreen ? '100%' : 'auto' }}>
                <Card title="อัพโหลดหลักฐานการชำระเงิน" bordered={false} style={{ fontFamily: 'Kanit', width: isSmallScreen ? '100%' : 950 }}>
                    <div style={{ fontFamily: 'Kanit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontFamily: 'Kanit', marginBottom: '20px', textAlign: 'center' }}>
                            <img src={url} className="Logo1" alt="" style={{ width: isSmallScreen ? '100%' : "100%", }} />
                        </div>
                        <Card style={{ fontFamily: 'Kanit', width: isSmallScreen ? '100%' : "75%", backgroundColor: '#F9F9F9' }}> <p><strong>
                            ชื่อบัญชี: HAT YAI Journey
                            <br />
                            Lind ID : @305iwzmm
                            <br />
                            กรุณาแจ้งข้อมูลดังนี้
                            <br />
                            1.ชื่อบัญชีผู้ทำการจอง
                            <br />
                            2.ชื่อรายการที่ทำการจอง
                            <br />
                            3.จำนวนการเข้าจอง
                            <br />
                            4.สลิปโอนเงิน พร้อมหมายเหตุ
                        </strong>
                            <br />
                        </p>
                            ทางแอดมินจะทำการอัพเดตสถานะตามคิว รบกวนไม่ทักแชทซ้ำ หากมีการทักซ้ำเท่ากับต่อคิวใหม่
                            <p>
                                <strong style={{ color: 'red', fontSize: '16px' }}>
                                    ก่อนทำการโอนเงิน กรุณาเติมข้อความในหมายเหตุว่า "เที่ยวกับ Hatyai Journey" ทุกครั้ง หากไม่มีทางเราขอทำการโอนคืน
                                </strong>
                            </p>

                            <Link
                                onClick={showDrawer}
                                style={{ fontSize: '25px' }}
                            >
                                ตัวอย่างการอัพโหลดหลักฐานการโอนเงิน
                            </Link>
                        </Card>
                        <br />
                        <Button type="primary" block onClick={handleButtonClick} style={{ fontFamily: 'Kanit' }}>ขั้นตอนถัดไป</Button>
                    </div>
                </Card>
            </Space>
            <Popover
                title={<div style={{ textAlign: 'center', fontFamily: 'Kanit' }}>แสดงตัวอย่าง</div>}
            >
                <FloatButton
                    icon={<QuestionCircleOutlined />}
                    onClick={showDrawer}
                    type="default"
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        zIndex: 9999,
                    }}
                />
            </Popover>
            <Drawer title="ตัวอย่างการอัพโหลดหลักฐานการโอนเงิน" onClose={onClose} open={open} style={{ fontFamily: 'Kanit', display: 'flex', width: isSmallScreen ? '100%' : 'auto' }}>
                <p><strong>ตัวอย่างการอัพโหลดหลักฐานการโอนเงินผ่านทาง Line</strong></p>
                <br />
                <img src={url3} className="Logo3" alt="" style={{ width: isSmallScreen ? '100%' : '100%', marginLeft: 'auto' }} />
                <br />
                <p><strong style={{ color: 'red', fontSize: '16px' }}>กรุณาเติมข้อความในหมายเหตุทุกครั้ง</strong></p>
                <p><strong style={{ color: 'red', fontSize: '16px' }}>หากลืมบันทึกหมายเหตุทางเราขอทำการโอนคืน</strong></p>
            </Drawer>
        </Flex >
    );
};


export default UploadReceipt;

