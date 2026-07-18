import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  message,
  Col,
  Layout,
  Flex,
  Menu,
  Dropdown,
  Popover,
  Avatar,
  Cascader
} from "antd";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import useLocalState from "../localStorage.js";
import SearchBar from "../Navbar/SearchBar";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../Image/logo.png";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import Tour from "../Tour/getTour";

import { config, config2 } from "../config.js";

const AllTour = () => {
  const [allData, setAllData] = useState([]);
  const { Header, Footer, Sider, Content } = Layout;
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchPopoverVisible, setSearchPopoverVisible] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userimage, setUserImage] = useState({});

  const getAllData = async () => {
    try {
      const res = await axios.get(`${config.serverUrlPrefix}/tours?populate=*`);
      setAllData(res.data.data);
    } catch (error) {
      console.error("error fetching all data", error);
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

  const roleChecker = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${jwt}`,
      };
      const userResult = await axios.get(
        `${config.serverUrlPrefix}/users/me?populate=role`
      );

      setUsername(userResult.data.username);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllData();
    if (jwt == null) { } else { roleChecker() }
    getImage();
  }, []);

  const handleHeaderClick = () => {
    navigate("/login");
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

  const handleSearch = async (searchText) => {
    try {
      const res = await axios.get(
        `${config.serverUrlPrefix}/tours?filters[tour_name][$containsi]=${searchText}&populate=*`
      );
      setFilterData(res.data.data);
    } catch (error) {
      console.error("error filter data", error);
    }
  };

  const options = [
    {
      value: 'ว่าง',
      label: 'ว่าง',
    },
    {
      value: 'test',
      label: 'test',
    },
  ];

  const onChange = (value) => {
    console.log(value);
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
            <span style={{ fontFamily: "Kanit", color: "#48D3FF" }}>
              {username && `โปรไฟล์ของ, ${username}`}
            </span>
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              navigate("/history");
            }}
            key="History"
          >
            ทัวร์ของคุณ{" "}
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
          <Menu.Item key="logout" onClick={() => handleLogout()}>
            ออกจากระบบ
          </Menu.Item>
        </>
      ) : (
        <></>
      )}
    </Menu>
  );


  const searchPopoverContent = (
    <div>
      <SearchBar onSearch={handleSearch} />
    </div>
  );

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>HATYAI Journey - เว็ปจองทัวร์หาดใหญ่ที่ดีที่สุด</title>
      </Helmet>
      {contextHolder}
      <Layout style={layoutStyle}>
        {jwt === null ?
          (<Header
            style={{
              ...headerStyle,
              justifyContent: isSmallScreen ? "center" : "flex-start",
            }}
            className="headerStyle"
          >
            <Col>
              <span style={blueTextStyle} className="blueTextStyle">
                H
              </span>
              <span style={NormalTextStyle} className="NormalTextStyle">
                AT
              </span>
              <span style={invtext}>.</span>
              <span style={blueTextStyle} className="blueTextStyle">
                Y
              </span>
              <span style={NormalTextStyle} className="NormalTextStyle">
                AI
              </span>
              <span style={invtext}>.</span>
              <span style={blueTextStyle} className="blueTextStyle">
                J
              </span>
              <span style={NormalTextStyle} className="NormalTextStyle">
                ourney
              </span>
            </Col>

            <Col span={isSmallScreen ? 12 : 22}>
              {isSmallScreen ? (
                <div style={{ textAlign: isSmallScreen ? "right" : "left" }}>
                  <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    visible={menuVisible}
                    onVisibleChange={setMenuVisible}
                  >
                    <UserOutlined
                      onClick={isSmallScreen ? handleHeaderClick : undefined}
                      style={{ fontSize: "25px", marginRight: "8px" }}
                    />
                  </Dropdown>
                  <Popover
                    content={searchPopoverContent}
                    trigger="click"
                    visible={searchPopoverVisible}
                    onVisibleChange={setSearchPopoverVisible}
                  >
                    <SearchOutlined
                      style={{ fontSize: "25px", marginLeft: "8px" }}
                    />
                  </Popover>
                </div>
              ) : (
                <>
                  <SearchBar onSearch={handleSearch} />
                  <Link
                    to="/login"
                    style={{
                      marginLeft: "40px",
                      color: "white",
                      fontSize: isSmallScreen ? "15px" : "18px",
                    }}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      marginLeft: "40px",
                      color: "white",
                      fontSize: isSmallScreen ? "15px" : "18px",
                    }}
                  >
                    ลงทะเบียน
                  </Link>
                </>
              )}
            </Col>
          </Header>
          ) : (
            <Header
              style={{
                ...headerStyle,
                justifyContent: isSmallScreen ? "center" : "flex-start",
              }}
            >
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
              <Col span={isSmallScreen ? 12 : 22}>
                {isSmallScreen ? (
                  <div style={{ textAlign: isSmallScreen ? "right" : "left" }}>
                    <Popover
                      content={searchPopoverContent}
                      trigger="click"
                      visible={searchPopoverVisible}
                      onVisibleChange={setSearchPopoverVisible}
                    >
                      <SearchOutlined
                        style={{ fontSize: "35px", marginLeft: "8px", marginBottom: "10px" }}
                      />
                    </Popover>
                    <Dropdown
                      overlay={menu}
                      trigger={["click"]}
                      visible={menuVisible}
                      onVisibleChange={setMenuVisible}
                    >
                      <Avatar
                        style={{
                          marginLeft: "20px",
                          color: "white",
                          fontSize: "50px",
                          fontFamily: 'Kanit',
                          marginBottom: "15px",
                          marginRight: "-15px"
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
                        navigate("/profile");
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
                    {isSmallScreen ? null : <SearchBar onSearch={handleSearch} />}
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
          )}
        <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: isSmallScreen ? "25px" : "45px" }}>โปรแกรมทัวร์ทั้งหมด</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '20px' }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            style={{ maxWidth: '300px' }}
          />
        </div>
        {/*<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <span style={{ marginRight: '10px', display: 'flex', justifyContent: 'center', marginTop: '5px' }}>Filters:</span>
          <Cascader options={options} onChange={onChange} />
        </div>*/}
        <Tour data={allData} filterData={filterData} />
        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#1C3953",
            borderColor: "#1C3953",
            margin: "0 auto"
          }}
        >
          Back
        </Button>
      </Layout>
      <Header style={headerbottom}>
        <img src={Logo} alt="Logo" style={{ width: "auto", height: "50px" }} />
      </Header>
    </Flex>

  );
};

export default AllTour;
