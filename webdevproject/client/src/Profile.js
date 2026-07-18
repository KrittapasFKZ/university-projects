import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Image,
    message,
    Modal,
    Row,
    Col,
    Layout,
    Flex,
    Space,
    Menu,
    Dropdown,
    Popover, Avatar, Descriptions, Upload, Input as AntInput
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import useLocalState from "./localStorage.js";
import { useMediaQuery } from "react-responsive";
import { MenuOutlined, SearchOutlined, UserOutlined, UnorderedListOutlined } from "@ant-design/icons";
import WebFont from 'webfontloader';
import { UploadOutlined } from "@ant-design/icons";

import Logo from "./Image/logo.png";
import useFormItemStatus from "antd/es/form/hooks/useFormItemStatus.js";

import { config, config2 } from "./config.js";


const { Header, Footer, Sider, Content } = Layout;

const ProfileForm = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [jwt, setjwt] = useLocalState(null, "jwt");
    const [username, setUsername] = useState("");
    const [rolename, setRolename] = useState("")
    const [filterData, setFilterData] = useState([]);
    const [userData, setUserData] = useState({});
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const [menuVisible, setMenuVisible] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPhoneNumber, setEditingPhoneNumber] = useState(false);
    const [userimage, setUserImage] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [previewVisible, setPreviewVisible] = useState(false);


    const getData = async () => {
        try {
            const res = await axios.get(`${config.serverUrlPrefix}/users/me`);
            setUserData(res.data);
        } catch (error) {
            console.error("การแสดงข้อมูล user ผิดพลาด", error);
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

    const handleImageUpload = (info) => {
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleDeleteImage = async () => {
        try {
            const formData = new FormData();
            formData.append('deleteProfileImage', true);
            await axios.delete(`${config.serverUrlPrefix}/users/me`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            });
            setUserImage({});
            console.log(`${userimage.profile_image?.id}`)
            await axios.delete(`${config.serverUrlPrefix}/upload/files/${userimage.profile_image?.id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success("Profile image deleted successfully!", 1);
        } catch (error) {
            console.error("Error deleting profile image:", error);
            message.error("Failed to delete profile image. Please try again.", 1);
        }
    };


    const handleImageChange = async () => {
        const image = imageFile;
        try {
            const response = await axios.get(`${config.serverUrlPrefix}/users/me`)

            if (userimage) { await handleDeleteImage(); }

            if (image) {
                const formData = new FormData();
                formData.append("field", "profile_image");
                formData.append("ref", "plugin::users-permissions.user");
                formData.append("refId", userData.id);
                formData.append("files", image);

                axios.post(`${config.serverUrlPrefix}/upload`, formData)
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            window.location.reload()
            message.success("Profile image change successfully!", 1);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleEditName = () => {
        setEditingName(true);
    };

    const handleEditEmail = () => {
        setEditingEmail(true);
    };

    const handleEditPhoneNumber = () => {
        setEditingPhoneNumber(true);
    };

    const handleHeaderClick = () => {
        navigate('/Member');
    };

    const handleShowChangePasswordModal = () => {
        setChangePasswordModalVisible(true);
    };

    const handleCloseChangePasswordModal = () => {
        setChangePasswordModalVisible(false);
    };

    const handleChangePassword = async () => {
        try {
            await axios.post(`${config.serverUrlPrefix}/auth/change-password`, {
                currentPassword: currentPassword,
                password: newPassword,
                passwordConfirmation: confirmPassword,
            })
            handleCloseChangePasswordModal();
            message.success("Changes Password successfully!", 1);
            window.location.reload()
        } catch (error) {
            console.error("Error updating user data:", error);
            message.error("Incorrect Password", 1);
        }
    };


    const handleSaveChanges = async () => {
        const hide = message.loading("Saving changes...", 0);

        console.log(userData)

        try {
            await axios.put(`${config.serverUrlPrefix}/users/${userData.id}`, userData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            setEditingName(false);
            setEditingEmail(false);
            setEditingPhoneNumber(false);

            hide();
            message.success("Changes saved successfully!", 1);
        } catch (error) {
            console.error("Error updating user data:", error);

            hide();
            message.error("Failed to save changes. Please try again.", 1);
        }
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
                            {username && `สวัสดีคุณ, ${username}`}
                        </span>
                    </Menu.Item>

                    <Menu.Item
                        onClick={() => {
                            navigate("/history");
                        }}
                        key="History"
                    >ทัวร์ของคุณ</Menu.Item>
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
                    <Menu.Item
                        onClick={() => {
                            navigate("/history");
                        }}
                        key="History"
                    >ทัวร์ของคุณ</Menu.Item>
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
    const menu3 = (
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

                    <Menu.Item
                        onClick={() => {
                            navigate("/confirm");
                        }}
                        key="History"
                    >สถานะการจองของลูกค้า</Menu.Item>
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

    const roleChecker = async () => {
        try {
            axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
            };
            const userResult = await axios.get(
                `${config.serverUrlPrefix}/users/me?populate=role`
            );

            setUsername(userResult.data.username);
            setRolename(userResult.data.role.name)
            if (userResult.data.role && userResult.data.role.name === "Member") {
                navigate("/profile");
            } else {
                if (userResult.data.role && userResult.data.role.name === "Admin") {
                    navigate("/profile");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.error(error);
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
                families: ['Kanit', 'Chilanka']
            }
        });
    }, []);

    const headerStyle = {
        textAlign: "center",
        color: "#fff",
        height: 120,
        paddingInline: "center",
        lineHeight: "120x",
        backgroundColor: "#1C3953",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "45px",
        width: isSmallScreen ? "100%" : "auto",
    };

    const headerbottom = {
        textAlign: "center",
        color: "#fff",
        height: 60,
        paddingInline: "center",
        lineHeight: "120x",
        backgroundColor: "#1C3953",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "45px",
        width: "100%",
    };

    const layoutStyle = {
        borderRadius: 0,
        overflow: "hidden",
        backgroundColor: "#F5F5F5",
    };

    const blueTextStyle = {
        color: "#48D3FF",
        fontWeight: "bold",
        fontSize: isSmallScreen ? "24px" : "45px",
    };

    const NormalTextStyle = {
        color: "#FFFFFF",
        fontWeight: "bold",
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
                            <div style={{ textAlign: 'right' }}> {/* Align content to the right */}
                                <Link
                                    onClick={() => {
                                        navigate("/member");
                                    }}
                                    style={{
                                        marginRight: "50px",
                                        color: "white",
                                        fontSize: isSmallScreen ? "14px" : "18px",
                                        width: "300px",
                                        fontFamily: 'Kanit'
                                    }}
                                >
                                    สวัสดีคุณ {username}
                                </Link>
                                <Dropdown
                                    placement="bottomLeft"
                                    trigger={["click"]}
                                    overlay={rolename === "Member" ? menu2 : menu3}
                                >
                                    <Avatar
                                        style={{
                                            marginLeft: "50px",
                                            color: "white",
                                            fontSize: "50px",
                                            fontFamily: 'Kanit',
                                            marginBottom: "10px",
                                            marginRight: "200px"
                                        }}
                                        size={52}
                                        src={`${config2.serverUrlPrefix}${userimage.profile_image?.url}`}
                                    />
                                </Dropdown>
                            </div>
                        )}


                    </Col>



                </Header>
                <Layout>
                    <Content style={{ fontFamily: 'Kanit', padding: "24px", minHeight: 500 }}>
                        <div style={{ fontFamily: 'Kanit', textAlign: "center" }}>
                            <Avatar onClick={() => setPreviewVisible(true)} size={100} src={`${config2.serverUrlPrefix}${userimage.profile_image?.url}`} />
                            <h2>{userData.username}</h2>
                            <Modal
                                visible={previewVisible}
                                onCancel={() => setPreviewVisible(false)}
                                footer={null}
                                width={userimage.profile_image?.size}
                            >
                                <img
                                    alt="Profile"
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    src={`${config2.serverUrlPrefix}${userimage.profile_image?.url}`}
                                />
                            </Modal>
                        </div>
                        <Descriptions title="รายละเอียดของผู้ใช้" bordered column={1} >
                            <Descriptions.Item label="ชื่อผู้ใช้">
                                {editingName ? (
                                    <Input
                                        value={userData.username}
                                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                    />
                                ) : (
                                    userData.username
                                )}
                                <Button danger
                                    type="link"
                                    onClick={handleEditName}
                                    style={{ marginLeft: '8px', fontFamily: 'Kanit' }}
                                >
                                    {editingName ? '' : "แก้ไข"}
                                </Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {editingEmail ? (
                                    <Input
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                ) : (
                                    userData.email
                                )}
                                <Button danger
                                    type="link"
                                    onClick={handleEditEmail}
                                    style={{ marginLeft: '8px', fontFamily: 'Kanit' }}
                                >
                                    {editingEmail ? '' : "แก้ไข"}
                                </Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="หมายเลขโทรศัพท์">
                                {editingPhoneNumber ? (
                                    <Input
                                        value={userData.phone_number}
                                        onChange={(e) => {
                                            const inputPhoneNumber = e.target.value;
                                            const formattedPhoneNumber = inputPhoneNumber.slice(0, 10);
                                            setUserData({ ...userData, phone_number: formattedPhoneNumber });
                                        }}
                                    />
                                ) : (
                                    userData.phone_number
                                )}
                                <Button danger
                                    type="link"
                                    onClick={handleEditPhoneNumber}
                                    style={{ marginLeft: '8px', fontFamily: 'Kanit' }}
                                >
                                    {editingPhoneNumber ? '' : "แก้ไข"}
                                </Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="บทบาท">{rolename}</Descriptions.Item>
                            <Descriptions.Item label="รหัสผ่าน">
                                <span style={{ color: 'red' }}>ความลับ</span>
                            </Descriptions.Item>
                        </Descriptions>
                        <h2 style={{ color: '#36cfc9' }}>เปลี่ยนรูปโปรไฟล์</h2>
                        <Upload
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            action={`${config.serverUrlPrefix}/upload`}
                            beforeUpload={(file) => {
                                setImageFile(file);
                                return false;
                            }}
                            onChange={handleImageUpload}
                        >
                            {imageFile ? (
                                <img src={URL.createObjectURL(imageFile)} alt="Tour" style={{ width: "100%" }} />
                            ) : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ fontFamily: 'Kanit', marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                        <Button onClick={handleImageChange} type="primary" style={{
                            marginTop: '16px', fontFamily: 'Kanit', backgroundColor: 'black',
                            borderColor: 'green', marginRight: '16px'
                        }}> ยืนยันการเปลี่ยนรูปโปรไฟล์ </Button>
                        <Button type="primary" onClick={handleSaveChanges} style={{
                            marginTop: '16px', fontFamily: 'Kanit', backgroundColor: 'green',
                            borderColor: 'green',
                        }}>
                            ยืนยันการแก้ไขข้อมูล
                        </Button>
                        <Link onClick={() => {
                            navigate("/history");
                        }}
                        ><Button type="primary" style={{
                            marginTop: '16px', fontFamily: 'Kanit', marginLeft: '16px'

                        }}>
                                ประวัติการจองทัวร์
                            </Button></Link>
                        <Button type="primary" onClick={handleShowChangePasswordModal} style={{
                            marginLeft: '16px', marginTop: '16px', fontFamily: 'Kanit', backgroundColor: 'red', borderColor: 'red',
                        }}>
                            ยืนยันการเปลี่ยนรหัสผ่าน
                        </Button>

                        <Modal
                            title="Change Password"
                            visible={changePasswordModalVisible}
                            onOk={handleChangePassword}
                            onCancel={handleCloseChangePasswordModal}
                        >
                            <Form>
                                <Form.Item
                                    label="Current Password"
                                    name="currentPassword"
                                    rules={[{ required: true, message: 'Please input your current password!' }]}
                                >
                                    <AntInput.Password value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                </Form.Item>
                                <Form.Item
                                    label="New Password"
                                    name="newPassword"
                                    rules={[{ required: true, message: 'Please input your new password!' }]}
                                >
                                    <AntInput.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </Form.Item>
                                <Form.Item
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    rules={[
                                        { required: true, message: 'Please confirm your new password!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <AntInput.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
            <Footer style={headerbottom}>
                <img src={Logo} alt="Logo" style={{ width: "auto", height: "50px" }} />
            </Footer>
        </Flex>
    );
};

export default ProfileForm;
