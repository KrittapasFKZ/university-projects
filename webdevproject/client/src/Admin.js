import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  Col,
  Layout,
  Flex,
  FloatButton,
  DatePicker,
  Upload,
  Menu,
  Dropdown,
  Popover,
  Avatar,
  Select,
  Drawer,
  Collapse,
  Space
} from "antd";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import useLocalState from "./localStorage.js";
import { useMediaQuery } from "react-responsive";
import { UploadOutlined } from "@ant-design/icons";
import {
  SearchOutlined,
} from "@ant-design/icons";
import {
  MinusCircleOutlined, PlusOutlined, TeamOutlined,
  MailOutlined, PhoneOutlined, MessageOutlined, FileAddOutlined
} from "@ant-design/icons";
import WebFont from "webfontloader";
import Tour from "./Tour/getTour.js";
import SearchBar from "./Navbar/SearchBar";
import PromotionalSlider from "./PromotionalSlider";
import Logo from "./Image/logo.png";
import promotionImages from "./Image/slide.js";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import { config, config2 } from "./config.js";

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

let url3 = "https://qr-official.line.me/gs/M_305iwzmm_GW.png?oat_content=qr"
const AdminForm = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [username, setUsername] = useState("");
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchPopoverVisible, setSearchPopoverVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [userimage, setUserImage] = useState({});
  const [filterData, setFilterData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [create_name, setcreate_name] = useState("");
  const [create_desc, setcreate_desc] = useState("");
  const [create_date, setcreate_date] = useState(new Date());
  const [create_price, setcreate_price] = useState(0);
  const [create_max, setcreate_max] = useState(50);
  const [create_destination, setcreate_destination] = useState([{}]);
  const [create_setSave, setcreate_setSave] = useState(false)
  const [open, setOpen] = useState(false);
  const { Panel } = Collapse;
  const [drawerVisible, setDrawerVisible] = useState(false);

  const onFinish = (values) => {
    setcreate_setSave(true)
    const jsonparse = JSON.stringify(values.tour_place)
    setcreate_destination(JSON.parse(jsonparse))
  }

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
      console.error("error fetching tour data", error);
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

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
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

  const handleAddTour = async (e) => {
    try {
      const formattedDate = moment(create_date).format("YYYY-MM-DD HH:mm:ss");

      if (create_setSave == false) {
        message.error("Please save destinations!");
        return;
      }

      if (!create_date) {
        message.error("Please select a date for the tour.");
        return;
      }

      if (create_destination.length === 0) {
        message.error("Please add at least one destination");
        return;
      }

      if (!imageFile) {
        message.error("Please upload an image for the tour.");
        return;
      }

      const imageFiles = Array.isArray(imageFile) ? imageFile : [imageFile];
      const uploadedImages = await Promise.all(imageFiles.map(uploadImage));

      const addNewTour = {
        tour_name: create_name,
        tour_date: create_date,
        description: create_desc,
        price: create_price,
        user_max: create_max,
        status: true,
        tour_image: uploadedImages.map((image) => ({ id: image.id })),
        destination: create_destination,
        tour_date: formattedDate,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(addNewTour));

      const response = await axios.post(
        `${config.serverUrlPrefix}/tours`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);
      message.success("เพิ่มทัวร์ใหม่เรียบร้อย!");
      setIsAddMenuOpen(false);
      window.location.href = "/admin"
    } catch (error) {
      console.error("Error uploading data:", error);
      message.error("Failed to add tour");
    }
  };

  const uploadImage = async (image) => {
    try {
      const formData = new FormData();
      formData.append("files", image);
      const response = await axios.post(
        `${config.serverUrlPrefix}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data[0];
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
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
        families: ["Sriracha", "Chilanka"],
      },
    });
  }, []);

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
              {username && `สวัสดีคุณ, ${username}`}
            </span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              navigate("/confirm");
            }}
            key="History"
          >
            สถานะการจองของลูกค้า
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
              navigate("/confirm");
            }}
            key="History"
          >
            สถานะการจองของลูกค้า
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
  const searchPopoverContent = (
    <div>
      <SearchBar onSearch={handleSearch} />
    </div>
  );

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 20,
      },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 4,
      },
    },
  };

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

      <Modal
        title="Add New Tour"
        open={isAddMenuOpen}
        style={{ fontFamily: "Kanit" }}
        onCancel={() => {
          setIsAddMenuOpen(false);
        }}
        footer={[
          <Button
            key="back"
            style={{ fontFamily: "Kanit" }}
            onClick={() => {
              setIsAddMenuOpen(false);
            }}
          >
            ยกเลิก
          </Button>,
          <Button
            style={{ fontFamily: "Kanit" }}
            key="submit"
            type="primary"
            onClick={handleAddTour}
          >
            เพิ่ม
          </Button>,
        ]}
      >
        <p>ชื่อทัวร์: </p>
        <Input
          value={create_name}
          onChange={(e) => setcreate_name(e.target.value)}
        />
        <p>จำกัดจำนวน: </p>
        <Input
          type="number"
          value={create_max}
          onChange={(e) => setcreate_max(e.target.value)}
        />
        <p>ราคา: </p>
        <Input
          type="number"
          value={create_price}
          onChange={(e) => setcreate_price(e.target.value)}
        />
        <p>รายละเอียด: </p>
        <TextArea
          value={create_desc}
          onChange={(e) => setcreate_desc(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 10 }}
        />
        <p>วันที่ทัวร์: </p>
        <DatePicker
          de
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          defaultValue={dayjs(create_date)}
        />
        <p>ตารางทัวร์: </p>
        <Form
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
        >
          <Form.List name="tour_place">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing Name',
                        },
                      ]}
                    >
                      <Input placeholder="ชื่อสถานที่" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'time']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing Time',
                        },
                      ]}
                    >
                      <Input placeholder="00:00-01:00" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
        <p>รูปภาพ: </p>
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
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Tour"
              style={{ width: "100%" }}
            />
          ) : (
            <div>
              <UploadOutlined />
              <div style={{ fontFamily: "Kanit", marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Modal>

      <Layout style={layoutStyle}>
        <Header
          style={{
            ...headerStyle,
            justifyContent: isSmallScreen ? "center" : "flex-start",
          }}
          className="headerStyle"
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
                    style={{
                      fontSize: "35px",
                      marginLeft: "8px",
                      marginBottom: "10px",
                    }}
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
                      fontFamily: "Kanit",
                      marginBottom: "15px",
                      marginRight: "-15px",
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
                  {isSmallScreen ? null : <SearchBar onSearch={handleSearch} />}
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
            <h2
              id="scroll"
              style={{
                fontFamily: "Kanit",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: isSmallScreen ? "25px" : "45px",
              }}
            >
              <div className="scroll_button">
                <button
                  onClick={handleScrollToElement}
                  className="circle_button"
                ></button>
              </div>
            </h2>
          )}
          โปรแกรมทัวร์ทั้งหมด
        </h2>
        <Tour data={allData} filterData={filterData} />
        <FloatButton.Group
          trigger="click"
          type="primary"
          icon={<TeamOutlined />}
          style={{
            right: 24,

          }}

        >
          <FloatButton
            tooltip={<div>เพิ่มทัวร์ใหม่</div>}
            icon={<FileAddOutlined />}
            onClick={() => {
              setIsAddMenuOpen(true)
              setcreate_setSave(false)
            }}
            type="primary"
            style={{
              fontFamily: "Kanit",
              right: 24,
              width: "45px",
              height: "45px",
            }}
          />
          <FloatButton
            tooltip={<div>ติดต่อเรา</div>}
            icon={<MessageOutlined />}
            onClick={showDrawer}
            type="primary"
            style={{
              fontFamily: "Kanit",
              right: 24,
              width: "45px",
              height: "45px",
            }}
          />
        </FloatButton.Group>
      </Layout>

      <Footer style={headerbottom}>
        <img src={Logo} alt="Logo" style={{ width: "auto", height: "50px" }} />
      </Footer>
      <Drawer title="ช่องทางการติดต่อ  " onClose={onClose} open={open} style={{ fontFamily: 'Kanit', display: 'flex', width: isSmallScreen ? '100%' : 'auto' }}>
        <Collapse defaultActiveKey={['1']}>
          <Panel style={{ fontFamily: 'Kanit' }} header="ช่องทาง Line " key="1">
            <div style={{ fontFamily: 'Kanit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <p><strong>

                ชื่อบัญชี: HAT YAI Journey
                <br />
                Lind ID : @305iwzmm
                <br />

              </strong>
              </p>
              <br />

            </div>
            <img src={url3} className="Logo1" alt="" style={{ width: isSmallScreen ? '100%' : "100%", }} />
          </Panel>
          <Panel style={{ fontFamily: 'Kanit' }} header="ช่องทางอีเมล" key="2">
            <div style={{ fontFamily: 'Kanit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <p><strong>
                Name :  HATYAI Journey Inc.
                <br />
                Email : HATYAIJourney@gmail.com
              </strong>
              </p>
              <MailOutlined />
            </div>
          </Panel>
          <Panel style={{ fontFamily: 'Kanit' }} header="ช่องทางเบอร์โทรศัพท์ " key="3">
            <div style={{ fontFamily: 'Kanit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <p><strong>

                เบอร์ :  062-0XX-XXXX{' '}
                <br />
                สำนักงาน: บจ. หาดใหญ่ จอว์ลนี่ เซอร์วิสเซส สำนักงานใหญ่ 1 (ประชายินดี 5)

              </strong>
              </p>
              <PhoneOutlined />

            </div>
          </Panel>

        </Collapse>
      </Drawer>
    </Flex>

  );
};

export default AdminForm;
