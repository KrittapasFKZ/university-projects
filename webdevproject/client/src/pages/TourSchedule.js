import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import useLocalState from "../localStorage.js";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import WebFont from "webfontloader";
import { Button, Col, Layout, Menu, Dropdown, Popover, Avatar } from "antd";

import { config, config2 } from "../config.js";

const TourSchedule = () => {
  const { Header, Footer, Sider, Content } = Layout;
  const { tourId } = useParams();
  const [tourSchedule, setTourSchedule] = useState(null);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [username, setUsername] = useState("");
  const [userimage, setUserImage] = useState({});
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);


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

  const handleHeaderClick = () => {
    navigate("/login");
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
    WebFont.load({
      google: {
        families: ["Kanit"],
      },
    });
    const getTourSchedule = async () => {
      try {
        const response = await axios.get(
          `${config.serverUrlPrefix}/tours/${tourId}?populate=*`
        );
        setTourSchedule(response.data.data);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      }
    };

    if (tourId) {
      getTourSchedule();
    }

    if (jwt == null) {
    } else {
      getImage();
      roleChecker();
    }
  }, [tourId]);

  if (!tourSchedule) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "สถานที่",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เวลา",
      dataIndex: "time",
      key: "time",
    },
  ];

  const dataSource = tourSchedule.attributes.destination.map(
    (destination, index) => ({
      key: index,
      name: destination.name,
      time: destination.time,
    })
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

  const layoutStyle = {
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  };

  const menu = (
    <Menu>
      {jwt ? (
        <>
          <Menu.Item key="username" disabled>
            <span style={{ color: "#48D3FF" }}>
              {username && `สวัสดีคุณ, ${username}`}
            </span>
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

  const rawDate = tourSchedule.attributes.tour_date;
  const dateObj = new Date(rawDate);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formatDate = dateObj.toLocaleDateString("th-TH", options);

  return (
    <div gap="middle" wrap="wrap" style={{ backgroundColor: "#F5F5F5" }}>
      {jwt === null ? (
        <Header
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
                    style={{ fontSize: "25px", marginRight: "80px" }}
                  />
                </Dropdown>

              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    marginLeft: "600px",
                    color: "white",
                    fontSize: isSmallScreen ? "15px" : "18px",
                  }}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  style={{
                    marginLeft: "50px",
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
                      marginRight: "60px",
                    }}
                    size={52}
                    src={`${config2.serverUrlPrefix}${userimage.profile_image?.url}`}
                  />
                </Dropdown>

              </div>
            ) : (
              <>
                <div style={{ textAlign: "right" }}>
                  <Link
                    onClick={() => {
                      navigate("/profile");
                    }}
                    style={{
                      marginRight: "50px",
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
                        marginRight: "200px",
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
      )}
      <div style={{ textAlign: "center" }}>
        <h3>ตารางท่องเที่ยว: {tourSchedule.attributes.tour_name}</h3>
        <h3>{formatDate}</h3>
      </div>
      <Table columns={columns} dataSource={dataSource} style={{ marginLeft: "5%", marginRight: "5%" }} />
      <Layout gap="middle" style={layoutStyle}>
        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#1C3953",
            borderColor: "#1C3953",
            margin: "0",
            width: isSmallScreen ? "15%" : "8%",
          }}
        >
          ย้อนกลับ
        </Button>
      </Layout>
    </div>
  );
};

export default TourSchedule;
