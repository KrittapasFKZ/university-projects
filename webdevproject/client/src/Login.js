import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Row, Col, Card, Layout } from "antd";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useLocalState from "./localStorage.js";
import { useMediaQuery } from "react-responsive";
import Logo from './Image/logo.png'
import WebFont from 'webfontloader';
import { Footer } from "antd/es/layout/layout.js";
import Contact from "./Navbar/Contact.js"
import { config } from "./config.js";

const { Header } = Layout;

const LoginForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [username, setUsername] = useState('')

  const handleSubmit = async (values) => {
    axios.defaults.headers.common = {
      Authorization: ``,
    };
    setSubmitEnabled(false);
    try {
      const loginResult = await axios.post(
        `${config.serverUrlPrefix}/auth/local`,
        {
          identifier: values.username,
          password: values.password,
        }
      );

      const jwtToken = loginResult.data.jwt;
      setjwt(jwtToken);
      axios.defaults.headers.common = {
        Authorization: `Bearer ${loginResult.data.jwt}`,
      };
      const userResult = await axios.get(
        `${config.serverUrlPrefix}/users/me?populate=role`
      );

      if (userResult.data.role && userResult.data.role.name === "Member") {
        navigate("/member");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Wrong username or password");
      setShowErrorModal(true);
    } finally {
      setSubmitEnabled(true);
    }
  };

  const roleChecker = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${jwt}`,
      };
      const userResult = await axios.get(`${config.serverUrlPrefix}/users/me?populate=role`);

      setUsername(userResult.data.username)

      if (userResult.data.role && userResult.data.role.name === 'Member') {
        navigate('/member');
      } else {
        if (userResult.data.role && userResult.data.role.name === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (jwt == null) { navigate("/login") } else roleChecker();
  }, []);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Sriracha', 'Kanit']
      }
    });
  }, []);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleHeaderClick = () => {
    navigate('/');
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
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '45px',

  };

  const headerbottom = {
    textAlign: 'center',
    color: '#fff',
    height: 60,
    paddingInline: "center",
    lineHeight: '120x',
    backgroundColor: '#1C3953',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '45px',

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

  const rowStyle = {
    minHeight: isSmallScreen ? "74vh" : "77vh",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const WarningStyle = {
    color: "red",
    fontWeight: "bold",
  };

  return (
    <div style={{}}>
      <Header style={headerStyle} onClick={handleHeaderClick}>
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
      </Header>
      <Row justify="center" align="middle" style={rowStyle}>
        <Helmet>
          <title>HATYAI Journey - เว็ปจองทัวร์หาดใหญ่ที่ดีที่สุด</title>
        </Helmet>

        <Col >
          <Card
            title="เข้าสู่ระบบ"
            bordered={true}
            style={{ fontFamily: 'Kanit', width: "100%", textAlign: "center" }}
          >
            <Form form={form} onFinish={handleSubmit} >
              <Form.Item

                label="ชื่อผู้ใช้"
                name="username"
                rules={[
                  { required: true, message: "Please enter your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="รหัสผ่าน"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!submitEnabled}
                  style={{ fontFamily: 'Kanit' }}
                >
                  เข้าสู่ระบบ
                </Button>
              </Form.Item>

              <Form.Item>
                <span style={{ fontFamily: 'Kanit', marginRight: "8px" }}>ยังไม่มีบัญชี?</span>
                <Link to="/register" style={{ fontFamily: 'Kanit' }}>สมัครสมาชิก</Link>
              </Form.Item>
              <Form.Item>
                <span style={{ fontFamily: 'Kanit', marginRight: "8px" }}>หากลืมรหัสผ่าน โปรดติดต่อแอดมินมุมขวาล่าง</span>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Error Modal */}
        <Modal
          title={<span style={WarningStyle}>Warning</span>}
          visible={showErrorModal}
          onCancel={handleCloseErrorModal}
          footer={null}
        >
          <p>{errorMessage}</p>
          <Button type="primary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal>
      </Row>
      <Contact />
      <Footer style={headerbottom}>
        <img src={Logo} alt="Logo" style={{ width: 'auto', height: '50px', }} />
      </Footer>
    </div>
  );
};

export default LoginForm;
