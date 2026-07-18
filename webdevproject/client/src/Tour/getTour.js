import axios from "axios";
import { useState, useEffect } from "react";
import { json, useLocation, useNavigate } from "react-router-dom";
import useLocalState from "../localStorage.js";
import { useMediaQuery } from "react-responsive";
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
  Card,
  Input,
  Image,
  Button,
  Modal,
  Row,
  Col,
  Popconfirm,
  message,
  DatePicker
} from "antd";
import LoadingIcon from "../Navbar/LoadingIcon.js";
import WebFont from "webfontloader";

import { config, config2 } from "../config.js";

const { TextArea } = Input;

dayjs.extend(customParseFormat);

const Tour = ({ data, filterData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname;
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [edit_tour, setedit_tour] = useState({});

  const handleTourScheduleClick = (tourId) => {
    navigate(`/tour-schedule/${tourId}`);
  };

  const handleOpenModal = async (id) => {
    const res = await axios.get(
      `${config.serverUrlPrefix}/tours/${id}?populate=*`
    );
    setedit_tour(res.data.data);
    setSelectedTourId(id);
    setIsModalOpen(true);
  };

  const handleforce = async () => {
    try {
      const res = await axios.get(
        `${config.serverUrlPrefix}/tours/1?populate=*`
      );
      setedit_tour(res.data.data);
    } catch (error) {
      console.log();
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

  const getDate = (time) => {
    const dateObj = new Date(time);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const date = dateObj.getDate();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    if (
      `${date} ${month} ${year} ${hours}:${minutes}:${seconds}` ==
      "1 January 1970 07:00:00"
    ) {
      return "-";
    }
    return `${date} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleSave = async () => {
    const hide = message.loading("กำลังบันทึก...", 0);

    const formattedDate = moment(edit_tour.attributes.tour_date).format("YYYY-MM-DD HH:mm:ss");

    try {
      const payload = {
        data: {
          tour_name: edit_tour.attributes.tour_name,
          tour_date: formattedDate,
          price: edit_tour.attributes.price,
          description: edit_tour.attributes.description,
          user_max: edit_tour.attributes.user_max,
        },
      };

      const response = await axios.put(
        `${config.serverUrlPrefix}/tours/${selectedTourId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      await axios.put(
        `${config.serverUrlPrefix}/tours/${selectedTourId}/refresh`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      hide();
      message.success("บันทึกการแก้ไขเรียบร้อยแล้ว!", 1);
      window.location.href = "/admin"
    } catch (error) {
      hide();
      if (error.response) {
        console.error("Server Error:", error.response.data);
        message.error(
          "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: " + error.response.data.message,
          1
        );
      } else if (error.request) {
        console.error("Request Error:", error.request);
        message.error("ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์", 1);
      } else {
        console.error("Client Error:", error.message);
        message.error("มีข้อผิดพลาดในการส่งคำขอ: " + error.message, 1);
      }
    }
  };

  const handleDuplicate = async () => {
    const hide = message.loading("กำลังสร้างทัวร์ใหม่...", 0);

    const formattedDate = moment(edit_tour.attributes.tour_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    try {
      console.log(edit_tour.attributes)
      const payload = {
        data: {
          tour_name: edit_tour.attributes.tour_name,
          tour_date: formattedDate,
          price: edit_tour.attributes.price,
          status: true,
          description: edit_tour.attributes.description,
          user_max: edit_tour.attributes.user_max,
          destination: edit_tour.attributes.destination,
          tour_image: edit_tour.attributes.tour_image && edit_tour.attributes.tour_image.data ? edit_tour.attributes.tour_image.data : [],
        },
      };

      console.log(payload)

      const response = await axios.post(
        `${config.serverUrlPrefix}/tours`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      hide();
      message.success("สร้างทัวร์ใหม่เรียบร้อยแล้ว!", 1);
      window.location.href = "/admin"
    } catch (error) {
      hide();
      if (error.response) {
        console.error("Server Error:", error.response.data);
        message.error(
          "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: " + error.response.data.message,
          1
        );
      } else if (error.request) {
        console.error("Request Error:", error.request);
        message.error("ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์", 1);
      } else {
        console.error("Client Error:", error.message);
        message.error("มีข้อผิดพลาดในการส่งคำขอ: " + error.message, 1);
      }
    }
  };

  const getPrice = (price) => {
    const newPrice = price.toLocaleString("th-TH", {
      currency: "THB",
      minimumFractionDigits: 2,
    });
    return newPrice;
  };

  const getStatus = (status) => {
    switch (status) {
      case true:
        return `ว่าง`;
      case false:
        return `เต็ม`;
    }
  };

  const handleSelect = async () => {
    if (jwt) {
      try {
        const handleBook = async () => {
          const res_tour = await axios.get(
            `${config.serverUrlPrefix}/tours/${selectedTourId}?populate=*`
          );
          var tmp_amount = res_tour.data.data.attributes.user_amount;
          var tmp_max = res_tour.data.data.attributes.user_max;


          if (tmp_amount >= tmp_max) {
            Modal.error({
              title: "Error",
              content: "ขออภัยทัวร์นี้เต็มแล้ว",
            });
          }
          else if ((tmp_amount + numberOfPeople) > tmp_max) {
            Modal.error({
              title: "Error",
              content: "ขออภัยจำนวนที่รับได้ไม่เพียงพอ",
            });
          } else {
            const res = await axios.post(
              `${config.serverUrlPrefix}/tours/${selectedTourId}/complete`,
              {
                numberOfPeople: numberOfPeople,
              },
              {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              }
            );

            //

            let temp_userID = "";
            let temp_selectedTour = [];
            let temp_date = new Date();

            try {
              axios.defaults.headers.common = {
                Authorization: `Bearer ${jwt}`,
              };
              const userResult = await axios.get(
                `${config.serverUrlPrefix}/users/me?populate=role`
              );

              temp_userID = userResult.data.id;

              const tourResult = await axios.get(
                `${config.serverUrlPrefix}/tours/${selectedTourId}?populate=*`
              );

              temp_selectedTour = tourResult.data.data;
            } catch (error) {
              console.error(error);
            }

            const user = await axios.get(
              `${config.serverUrlPrefix}/users/me`
            );

            const addNewTour = {
              tour_id: selectedTourId,
              user_id: temp_userID,
              reserve_amount: numberOfPeople,
              total_price: temp_selectedTour.attributes.price * numberOfPeople,
              reserve_date: temp_date,
              user_phone: user.data.phone_number,
              user_email: user.data.email,
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(addNewTour));

            const response = await axios.post(
              `${config.serverUrlPrefix}/reserves`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            //

            navigate("/payments");
          }
        };
        Modal.confirm({
          title: "ยืนยันการจองทัวร์",
          content: (
            <div>
              <p style={{ fontFamily: "Kanit" }}>
                กรุณายืนยันการจองทัวร์และดำเนินการชำระเงิน
              </p>
            </div>
          ),
          okText: "ยืนยัน",
          cancelText: "ยกเลิก",
          onOk: () => {
            handleBook();
          },
          onCancel: () => { },
        });
      } catch (error) {
        console.error("error selecting tour", error);
      }
    } else {
      Modal.confirm({
        title: "ท่านยังไม่ได้ล็อกอิน",
        content: (
          <div>
            <p style={{ fontFamily: "Kanit" }}>กรุณาทำการล็อกอินก่อนจองทัวร์</p>
          </div>
        ),
        okText: "ล็อกอิน",
        cancelText: "ยกเลิก",
        onOk: () => {
          navigate("/login");
        },
        onCancel: () => { },
      });
    }
  };

  const handleTourDelete = async (id) => {
    try {
      await axios.delete(`${config.serverUrlPrefix}/tours/${id}/remove`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      message.success("ลบทัวร์เรียบร้อย!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  const toursToDisplay = filterData.length > 0 ? filterData : data;

  useEffect(() => {
    handleforce();
    WebFont.load({
      google: {
        families: ["Sriracha", "Kanit"],
      },
    });
  }, []);

  return (
    <div
      style={{
        display: isSmallScreen ? "grid" : "flex",
        backgroundColor: "#F5F5F5",
      }}
    >
      {toursToDisplay.length === 0 ? (
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
        <Row gutter={[16, 16]}>
          {toursToDisplay.map(({ id, attributes }) => (
            <Col
              key={id}
              xs={24}
              sm={12}
              md={toursToDisplay.length === 1 ? 24 : (toursToDisplay.length === 2 ? 12 : 8)}
              lg={toursToDisplay.length === 1 ? 24 : (toursToDisplay.length === 2 ? 12 : 8)}
              style={{
                display: "flex",
                width: isSmallScreen ? "100%" : "auto",
              }}
            >
              <Card
                hoverable
                key={id}
                style={{
                  fontFamily: "Kanit",
                  width: 450,
                  margin: 20,
                  marginTop: 50,
                }}
              >
                {currentPage === "/admin" ? (
                  <Modal
                    title={
                      <Input
                        value={edit_tour.attributes.tour_name}
                        onChange={(e) =>
                          setedit_tour((prevState) => ({
                            ...prevState,
                            attributes: {
                              ...prevState.attributes,
                              tour_name: e.target.value,
                            },
                          }))
                        }
                        style={{
                          width: "80%",
                        }}
                      />
                    }
                    open={isModalOpen && selectedTourId === id}
                    onCancel={() => {
                      setIsModalOpen(false);
                    }}
                    footer={[
                      <Button
                        key="back"
                        onClick={() => {
                          setIsModalOpen(false);
                        }}
                      >
                        ปิด
                      </Button>,
                      <Popconfirm
                        title="Delete the tour"
                        description="Are you sure to delete this tour?"
                        onConfirm={() => {
                          setIsModalOpen(false);
                          handleTourDelete(id);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button style={{ backgroundColor: "#DE3163", color: "white" }}>ลบ</Button>
                      </Popconfirm>,
                      <Button
                        key="submit"
                        type="primary"
                        style={{ backgroundColor: "#00cc00", color: "white" }}
                        onClick={() => {
                          handleDuplicate();
                          setIsModalOpen(false);
                        }}
                      >
                        ทำซ้ำ
                      </Button>,
                      <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                          handleSave();
                          setIsModalOpen(false);
                        }}
                      >
                        บันทึก
                      </Button>,
                    ]}
                  >
                    {/* Admin Modal*/}
                    <div style={{ textAlign: "center" }}>
                      <Image
                        src={
                          attributes.tour_image && attributes.tour_image.data
                            ? `${config2.serverUrlPrefix}${attributes.tour_image.data.attributes.formats.thumbnail.url}`
                            : ""
                        }
                        preview={false}
                      />
                    </div>
                    {/* Admin Modal*/}
                    <br />* Tour ID: /api/tours/{id}
                    <br />
                    สถานะ:{" "}
                    <span style={{ color: getStatusColor(attributes.status) }}>
                      <b>{getStatus(attributes.status)}</b>
                      <b>
                        {" "}
                        {"(" +
                          attributes.user_amount +
                          "/" +
                          attributes.user_max +
                          ")"}
                      </b>
                    </span>
                    <br />
                    จำกัดจำนวน:
                    <Input
                      type="number"
                      value={edit_tour.attributes.user_max}
                      onChange={(e) =>
                        setedit_tour((prevState) => ({
                          ...prevState,
                          attributes: {
                            ...prevState.attributes,
                            user_max: Number(e.target.value),
                          },
                        }))
                      }
                    />
                    <br />
                    ราคา:
                    <Input
                      type="number"
                      value={edit_tour.attributes.price}
                      onChange={(e) =>
                        setedit_tour((prevState) => ({
                          ...prevState,
                          attributes: {
                            ...prevState.attributes,
                            price: Number(e.target.value),
                          },
                        }))
                      }
                    />
                    <br />วันที่ทัวร์:
                    <div>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        defaultValue={dayjs(edit_tour.attributes.tour_date)}
                        onChange={(date, dateString) =>
                          setedit_tour((prevState) => ({
                            ...prevState,
                            attributes: {
                              ...prevState.attributes,
                              tour_date: dateString,
                            },
                          }))
                        }
                      />
                    </div>
                    <br />
                    รายละเอียด:
                    <TextArea
                      value={edit_tour.attributes.description}
                      onChange={(e) =>
                        setedit_tour((prevState) => ({
                          ...prevState,
                          attributes: {
                            ...prevState.attributes,
                            description: e.target.value,
                          },
                        }))
                      }
                      autoSize={{ minRows: 3, maxRows: 8 }}
                    />
                    <br></br>
                  </Modal>
                ) : (
                  // VVVVVVVV THIS IS NON ADMIN MODAL PLEASE EDIT THIS ONLY /////////////////////////////////////////////////////
                  <Modal
                    style={{ fontFamily: "Kanit" }}
                    title={attributes.tour_name}
                    open={isModalOpen && selectedTourId === id}
                    onCancel={() => {
                      setIsModalOpen(false);
                    }}
                    footer={[
                      <Button
                        key="back"
                        onClick={() => {
                          setIsModalOpen(false);
                        }}
                      >
                        ปิด
                      </Button>,
                      <Button
                        key="submit"
                        type="primary"
                        onClick={() => handleTourScheduleClick(id)}
                      >
                        ตารางท่องเที่ยว
                      </Button>,
                      <Button
                        key="submit"
                        type="primary"
                        onClick={handleSelect}
                        style={{
                          backgroundColor: "green"
                        }}
                      >
                        จองทัวร์
                      </Button>,
                    ]}
                  >
                    {/* User Modal*/}
                    <div style={{ textAlign: "center" }}>
                      <Image onClick={() => setPreviewVisible(true)}
                        src={
                          attributes.tour_image && attributes.tour_image.data
                            ? `${config2.serverUrlPrefix}${attributes.tour_image.data.attributes.formats.thumbnail.url}`
                            : ""
                        }
                        preview={false}
                      />
                      <Modal
                        visible={previewVisible}
                        onCancel={() => setPreviewVisible(false)}
                        footer={null}
                      >
                        <img alt="tour" style={{ width: '100%' }} src={
                          attributes.tour_image && attributes.tour_image.data
                            ? `${config2.serverUrlPrefix}${attributes.tour_image.data.attributes.formats.thumbnail.url}`
                            : ""
                        } />
                      </Modal>
                    </div>
                    {/* User Modal*/}
                    <br />
                    สถานะ:{" "}
                    <span style={{ color: getStatusColor(attributes.status) }}>
                      <b>{getStatus(attributes.status)}</b>
                      <b>
                        {" "}
                        {"(" +
                          attributes.user_amount +
                          "/" +
                          attributes.user_max +
                          ")"}
                      </b>
                    </span>
                    <br />
                    ราคา: {getPrice(attributes.price)} บาท / ท่าน
                    <br />
                    วันที่ทัวร์: {getDate(attributes.tour_date)}
                    <br />
                    รายละเอียด:
                    <br />
                    {attributes.description}
                    <br></br>
                    <br />
                    จำนวนคน:{" "}
                    <Input
                      type="number"
                      min={1}
                      value={numberOfPeople}
                      onChange={(e) =>
                        setNumberOfPeople(parseInt(e.target.value, 10))
                      }
                    />
                  </Modal>
                )}
                <div style={{ textAlign: "center" }}>
                  <Image
                    src={
                      attributes.tour_image && attributes.tour_image.data
                        ? `${config2.serverUrlPrefix}${attributes.tour_image.data.attributes.formats.thumbnail.url}`
                        : ""
                    }
                    preview={false}
                  />
                </div>
                <br />
                <b style={{ fontSize: "18px" }}>{attributes.tour_name}</b>
                <br />
                สถานะ:{" "}
                <span style={{ color: getStatusColor(attributes.status) }}>
                  <b>{getStatus(attributes.status)}</b>
                  <b>
                    {" "}
                    {"(" +
                      attributes.user_amount +
                      "/" +
                      attributes.user_max +
                      ")"}
                  </b>
                </span>
                <br />
                ราคา: {getPrice(attributes.price)} บาท / ท่าน
                <br />
                วันที่ทัวร์: {getDate(attributes.tour_date)}
                <br />
                <br></br>
                {currentPage === "/admin" ? (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleOpenModal(id)}
                      style={{
                        fontFamily: "Kanit",
                        display: "block",
                        margin: "0 auto",
                        backgroundColor: "#DE3163",
                      }}
                    >
                      แก้ไข
                    </Button>
                  </>
                ) : (
                  // VVVVVVVV THIS IS NON ADMIN MODAL PLEASE EDIT THIS ONLY /////////////////////////////////////////////////////
                  <Button
                    type="primary"
                    onClick={() => handleOpenModal(id)}
                    style={{
                      fontFamily: "Kanit",
                      display: "block",
                      margin: "0 auto",
                    }}
                  >
                    ดูเพิ่มเติม
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Tour;
