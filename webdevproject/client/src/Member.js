import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  message,
  Col,
  Layout,
  Flex,
  Menu,
  Dropdown,
  Avatar,
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import useLocalState from "./localStorage.js";
import { useMediaQuery } from "react-responsive";
import WebFont from "webfontloader";
import PromotionalSlider from "./PromotionalSlider";
import Logo from "./Image/logo.png";
import RecommendTour from "./Tour/recommendTour.js";
import promotionImages from "./Image/slide.js";
import Contact from "./Navbar/Contact.js"

import { config, config2 } from "./config.js";


const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const MemberForm = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [username, setUsername] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [allData, setAllData] = useState([]);
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchPopoverVisible, setSearchPopoverVisible] = useState(false);
  const [userimage, setUserImage] = useState({});

  const getImage = async () => {
    try {
      const res = await axios.get(
        `${config.serverUrlPrefix}/users/me?populate=*`
      );
      setUserImage(res.data);
    } catch (error) {
      console.error("การแสดงข้อมูล user ผิดพลาด", error);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get(`${config.serverUrlPrefix}/tours?populate=*`);
      setAllData(res.data.data);
    } catch (error) {
      console.error("การแสดงข้อมูลทัวร์ผิดพลาด", error);
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
        navigate("/member");
      } else {
        if (userResult.data.role && userResult.data.role.name === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
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
          ></Menu.Item>
          <Menu.Item key="profile" onClick={() => navigate("/profile")}>
            {username && `โปรไฟล์ของ, ${username}`}
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              navigate("/history");
            }}
            key="History"
          >
            ทัวร์ของคุณ
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
        families: ["Sriracha", "Chilanka"],
      },
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

  const promotionalSliderStyle = {
    marginTop: isSmallScreen ? "150px" : "50px",
  };

  const handleScrollToElement = () => {
    const element = document.getElementById("scroll");
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Flex gap="middle" wrap="wrap" style={{ backgroundColor: "#F5F5F5" }}>
      <Helmet>
        <title>HATYAI Journey - เว็ปจองทัวร์หาดใหญ่ที่ดีที่สุด</title>
      </Helmet>
      {contextHolder}
      <Layout style={layoutStyle}>
        <Header
          style={{
            ...headerStyle,
            justifyContent: isSmallScreen ? "center" : "flex-start",
            display: "flex",
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
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  visible={menuVisible}
                  onVisibleChange={setMenuVisible}
                >
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
                <div style={{ textAlign: 'right' }}>
                  <Link
                    onClick={() => {
                      navigate("/profile");
                    }}
                    style={{
                      marginRight: "20px",
                      color: "white",
                      fontSize: isSmallScreen ? "14px" : "18px",
                      width: "300px",
                      fontFamily: "Kanit",
                    }}
                  >
                    สวัสดีคุณ {username}
                  </Link>
                  <Dropdown
                    placement="bottomLeft"
                    overlay={menu2}
                    trigger={["click"]}
                  >
                    <Avatar
                      style={{
                        marginLeft: "50px",
                        color: "white",
                        fontSize: "50px",
                        fontFamily: "Kanit",
                        marginBottom: "10px",
                        marginRight: "250px",
                      }}
                      size={52}
                      src={`${config2.serverUrlPrefix}${userimage.profile_image?.url}`}
                    />
                  </Dropdown>
                </div>
              </>
            )}
          </Col>
        </Header>
        <PromotionalSlider
          images={promotionImages}
          style={promotionalSliderStyle}
        />
        <h2
          id="scroll"
          style={{
            fontFamily: "Kanit",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: isSmallScreen ? "25px" : "45px",
          }}
        >
          {isSmallScreen ? (
            <></>
          ) : (
            <div className="scroll_button">
              <button onClick={handleScrollToElement} className="circle_button"></button>
            </div>
          )}
          โปรแกรมทัวร์แนะนำ
        </h2>
        <RecommendTour />
      </Layout>
      <Button
        type="primary"
        onClick={() => navigate("/alltour")}
        style={{
          backgroundColor: "#1C3953",
          borderColor: "#1C3953",
          margin: "0 auto",
          fontFamily: "Kanit",
        }}
      >
        ดูโปรแกรมทั้งหมด
      </Button>
      <Contact />

      <Footer style={headerbottom}>
        <img src={Logo} alt="Logo" style={{ width: "auto", height: "50px" }} />
      </Footer>
    </Flex>
  );
};

export default MemberForm;
