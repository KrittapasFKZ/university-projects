import React from 'react';
import { Steps } from 'antd';
import '../App.css'; // Import your CSS file here
import WebFont from 'webfontloader';

const Step = ({ current }) => (
    <Steps current={current} percent={60} style={{ fontFamily: 'Kanit' }} items={[
        {
            title: 'ข้อมูลการชำระเงิน',
        },
        {
            title: 'อัพโหลดหลักฐานการชำระเงิน',
        },
        {
            title: 'สำเร็จ',
        },
    ]} />
);

export default Step;
