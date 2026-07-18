import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLocalState from "../localStorage.js";
import { useMediaQuery } from "react-responsive";

import {
  Card,
  Image,
  Row,
} from "antd";
import LoadingIcon from "../Navbar/LoadingIcon.js";
import WebFont from 'webfontloader';

import { config } from "../config.js";

const CardHistory = ({ data, filterData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname;
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [jwt, setjwt] = useLocalState(null, "jwt");
  const [username, setUsername] = useState('')
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  const [allData, setAllData] = useState([]);

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
      const res = await axios.get(`${config.serverUrlPrefix}/reserves?populate=*`);
      setAllData(res.data.data);
    } catch (error) {
      console.error("error fetching tour data", error);
    }
  };

  useEffect(() => {
    if (jwt == null) {
      navigate("/");
    } else roleChecker();
    getData()
  }, []);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Sriracha', 'Kanit']
      }
    });
  }, []);

  const userReserves = allData.filter(reserve => reserve.attributes.user_id.data.attributes.username === username);

  return (
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
        <Row gutter={[16, 16]}>
          {userReserves.map(({ id, attributes }) => (
            <Card hoverable key={id} xs={24} sm={12} md={8} lg={8} style={{ fontFamily: 'Kanit', width: 300, margin: 20, marginTop: 50 }}>
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
              <br></br>
            </Card>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CardHistory;
