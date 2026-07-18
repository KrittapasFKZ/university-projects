import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLocalState from "./localStorage.js";
import { useMediaQuery } from "react-responsive";

import {
    Button,
    Image,
    message,
    Modal,
    Row,
    Col,
    Layout,
    Flex,
    Card, Menu, Dropdown, Avatar, Cascader
} from "antd";
import LoadingIcon from "./Navbar/LoadingIcon.js";
import WebFont from 'webfontloader';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { config, config2 } from "./config.js";

const { Header, Footer, Sider, Content } = Layout;

const Confirm = ({ data, filterData }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPage = location.pathname;
    const [selectedTourId, setSelectedTourId] = useState(null);
    const [jwt, setjwt] = useLocalState(null, "jwt");
    const [username, setUsername] = useState('')
    const isSmallScreen = useMediaQuery({ maxWidth: 767 });
    const [messageApi, contextHolder] = message.useMessage();
    const [menuVisible, setMenuVisible] = useState(false);
    const [userimage, setUserImage] = useState({});
    const [allData, setAllData] = useState([]);

    const [statusFilters, setStatusFilters] = useState("All");

    const options = [
        {
            value: 'all',
            label: 'ทั้งหมด',
        },
        {
            value: 'true',
            label: 'ชำระเงินแล้ว',
        },
        {
            value: 'false',
            label: 'รอการยืนยัน',
        },
    ];

    const onChange = async (value) => {
        setStatusFilters(value)
        if (value == "all") {
            const res = await axios.get(`${config.serverUrlPrefix}/reserves?populate=*`);
            setAllData(res.data.data);
        } else {
            const res = await axios.get(`${config.serverUrlPrefix}/reserves?filters[payment_status][$eq]=${value}&populate=*`);
            setAllData(res.data.data);
        }
    };

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

    const show_modal_confirm = (id) => {
        Modal.confirm({
            title: "ยืนยันการชำระเงิน",
            content: (
                <div>
                    <p style={{ fontFamily: 'Kanit' }}>ต้องการยืนยันการชำระเงินนี้หรือไม่</p>
                </div>
            ),
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk: () => {
                updateStatus(id)
            },
            onCancel: () => { },
        });
    }

    const show_modal_cancel = (id) => {
        Modal.confirm({
            title: "ยกเลิกการชำระเงิน",
            content: (
                <div>
                    <p style={{ fontFamily: 'Kanit' }}>ต้องการยกเลิกยืนยันการชำระเงินนี้หรือไม่</p>
                </div>
            ),
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk: () => {
                CancelStatus(id)
            },
            onCancel: () => { },
        });
    }

    const show_modal_delete = (id, attributes) => {
        Modal.confirm({
            title: "ดำเนินการเสร็จสิ้น",
            content: (
                <div>
                    <p style={{ fontFamily: 'Kanit' }}>ดำเนินการเสร็จสิ้นแล้วใช่หรือไม่</p>
                </div>
            ),
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk: () => {
                DeleteStatus(id)
                RemoveAmount(attributes)
                console.log(attributes)
            },
            onCancel: () => { },
        });
    }

    const updateStatus = async (reserveId) => {
        try {
            const res = await axios.post(
                `${config.serverUrlPrefix}/reserve/${reserveId}/method_confirm`);
            message.success("Confirmed Reservation!");
            getData();
        } catch (error) {
            console.error("error updating status", error);
            message.error("Action Failed!");
        }
    };

    const CancelStatus = async (reserveId) => {
        try {
            const res = await axios.post(
                `${config.serverUrlPrefix}/reserve/${reserveId}/method_cancel`);
            message.success("ยกเลิกการจองสำเร็จ!");
            getData();
        } catch (error) {
            console.error("error updating status", error);
            message.error("Action Failed!");
        }
    };

    const DeleteStatus = async (reserveId) => {
        try {
            const res = await axios.delete(
                `${config.serverUrlPrefix}/reserves/${reserveId}`);
            message.success("Delete Reservation!");
            getData();
        } catch (error) {
            console.error("error delete status", error);
            message.error("Action Failed!");
            console.log(allData);
        }
    };

    const RemoveAmount = async (attributes) => {
        try {
            const des = await axios.put(
                `${config.serverUrlPrefix}/tours/${attributes.tour_id.data.id}/less`, {
                numberOfPeople: attributes.reserve_amount
            });
            const res = await axios.put(
                `${config.serverUrlPrefix}/tours/${attributes.tour_id.data.id}/refresh`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            getData();
        } catch (error) {
            console.error("error updating status", error);
            message.error("Action Failed!");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case true:
                return `rgba(0, 204, 0)`;
            case false:
                return `rgba(255, 0, 0)`;
        }
    };

    const handleLogout = async () => {
        setjwt(null);
        messageApi
            .open({
                type: "loading",
                content: "กรุณารอสักครู่...",
                duration: 1,
            })
            .then(() => message.success("เสร็จสิ้น!", 0.5))
            .then(() => (window.location.href = "/"));
    };

    const getDate = (time) => {
        const dateObj = new Date(time);
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const year = dateObj.getFullYear();
        const month = months[dateObj.getMonth()];
        const date = dateObj.getDate();
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        const seconds = String(dateObj.getSeconds()).padStart(2, "0");

        if ((`${date} ${month} ${year} ${hours}:${minutes}:${seconds}`) == "1 January 1970 07:00:00") {
            return '-'
        }
        return `${date} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    };

    const getPrice = (price) => {
        const newPrice = price.toLocaleString('th-TH', { currency: 'THB', minimumFractionDigits: 2 });
        return newPrice
    };

    const getStatus = (status) => {
        switch (status) {
            case true:
                return `ชำระเงินแล้ว`;
            case false:
                return `รอการยืนยัน`;
        }
    };

    const getData = async () => {
        try {
            if (statusFilters == "all") {
                const res = await axios.get(`${config.serverUrlPrefix}/reserves?populate=*`);
                setAllData(res.data.data);
            } else {
                const res = await axios.get(`${config.serverUrlPrefix}/reserves?filters[payment_status][$eq]=${statusFilters}&populate=*`);
                setAllData(res.data.data);
            }
        } catch (error) {
            console.error("error fetching tour data", error);

        }
    };

    useEffect(() => {
        if (jwt == null) {
            navigate("/");
        } else roleChecker();
        getData();
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
        navigate('/Admin');
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

                    <Menu.Item key="back" onClick={() => navigate("/admin")}>
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
                                            marginRight: "50px"
                                        }}
                                        size={52}
                                        src={`${config2.serverUrlPrefix}${userimage.profile_image?.url}`}
                                    />
                                </Dropdown>
                            </>
                        )}
                    </Col>

                </Header>
                <span style={{ fontFamily: 'Kanit', textAlign: 'center', fontSize: "50px", marginTop: "20px" }}>สถานะการจอง</span>
                <div style={{ textAlign: "center" }}>
                    <br />
                    <Cascader options={options} onChange={onChange} placeholder="Filters" defaultValue={"all"} />
                </div>
                <div
                    style={{
                        display: isSmallScreen ? "grid" : "flex",
                        backgroundColor: "#F5F5F5",
                    }}
                >
                    {allData.length === 0 ? (
                        <b
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <LoadingIcon />
                        </b>
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                {allData.map(({ id, attributes }) => (
                                    <Card
                                        hoverable
                                        key={id}
                                        style={{
                                            fontFamily: 'Kanit',
                                            width: 300,
                                            margin: isSmallScreen ? '10px auto' : '20px',
                                            marginTop: isSmallScreen ? '25px' : '50px'
                                        }}
                                    >
                                        {attributes.payment_status === false && (
                                            <Image
                                                src={`https://cdn-icons-png.freepik.com/512/6475/6475938.png`}
                                                preview={false}
                                            />)}
                                        {attributes.payment_status === true && (
                                            <Image
                                                src={`https://thumb.ac-illust.com/98/98f98abb339a27ca448a784926b8329d_t.jpeg`}
                                                preview={false}
                                            />)}
                                        <b style={{ fontSize: "18px", fontFamily: 'Kanit' }}>{attributes.tour_id.data.attributes.tour_name}</b>
                                        <br />
                                        สถานะ:{" "}
                                        <span style={{ color: getStatusColor(attributes.payment_status) }}>
                                            <b>{getStatus(attributes.payment_status)}</b>
                                        </span>
                                        <br />
                                        ประเภทการชำระเงิน: {attributes.payment_method}
                                        <br />
                                        จำนวน: {attributes.reserve_amount} ท่าน
                                        <br />
                                        ราคา: {getPrice((attributes.total_price / attributes.reserve_amount))} บาท / ท่าน
                                        <br />
                                        ราคารวม: {getPrice(attributes.total_price)} บาท
                                        <br />
                                        วันที่จอง: {getDate(attributes.reserve_date)}
                                        <br />
                                        วันที่ยืนยัน: {getDate(attributes.confirm_date)}
                                        <br />
                                        ชื่อผู้จอง: {attributes.user_id.data.attributes.username}
                                        <br />
                                        ช่องทางการติดต่อ: {attributes.user_phone}
                                        <br />
                                        อีเมลของผู้จอง: {attributes.user_email}
                                        <br />

                                        {attributes.payment_status === false && (
                                            <Button
                                                type="primary"
                                                onClick={() => show_modal_confirm(id)}
                                                style={{
                                                    fontFamily: 'Kanit',
                                                    textAlign: 'center',
                                                    marginTop: 10,
                                                    backgroundColor: 'green',
                                                    borderColor: 'green',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                ยืนยันการจอง
                                            </Button>
                                        )}
                                        {attributes.payment_status === false && (
                                            <Button
                                                type="primary"
                                                onClick={() => show_modal_delete(id, attributes)}
                                                style={{ fontFamily: 'Kanit', textAlign: 'center', marginTop: 10, }}
                                            >
                                                ลบการจอง
                                            </Button>
                                        )}
                                        {attributes.payment_status === true && (
                                            <Button danger
                                                type="primary"
                                                onClick={() => show_modal_cancel(id)}
                                                style={{ fontFamily: 'Kanit', textAlign: 'center', marginTop: 10, marginRight: '10px' }}
                                            >
                                                ยกเลิกการจอง
                                            </Button>
                                        )}
                                        {attributes.payment_status === true && (
                                            <Button
                                                disabled
                                                type="primary"
                                                onClick={() => show_modal_delete(id)}
                                                style={{ fontFamily: 'Kanit', textAlign: 'center', marginTop: 10, }}
                                            >
                                                ลบการจอง
                                            </Button>
                                        )}
                                        <br></br>
                                    </Card>
                                ))}
                            </Row>
                        </>
                    )}
                </div>

            </Layout>

        </Flex>
    );
};

export default Confirm;
