import React, { useState } from 'react';
import { Collapse, Drawer, Radio, Space,Popover,FloatButton } from 'antd';
import { MessageOutlined,MailOutlined,PhoneOutlined} from '@ant-design/icons';
import { useMediaQuery } from "react-responsive";   
const Contact = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const { Panel } = Collapse;
  let url3 = "https://qr-official.line.me/gs/M_305iwzmm_GW.png?oat_content=qr"
  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Popover
        title={<div style={{ textAlign: 'center', fontFamily: 'Kanit' }}>แสดงตัวอย่าง</div>}
            >
                <FloatButton
                    icon={<MessageOutlined />}
                    description="ติดต่อเรา"
                   
                    onClick={showDrawer}
                    type="primary"
                    style={{
                        fontSize:"100px",
                        position: 'fixed',
                        width: "80px", 
                        height: "80px", 
                        bottom: 20,
                        right: 20,
                        zIndex: 9999,
                    }}
                />
            </Popover>
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
                                <br/>
                                
                            </div>
                            <img src={url3} className="Logo1" alt="" style={{ width: isSmallScreen ? '100%' : "100%", }} />
                        </Panel>
                        <Panel style={{ fontFamily: 'Kanit' }} header="ช่องทางอีเมล" key="2">
                            <div style={{ fontFamily: 'Kanit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                                <p><strong>
                                    Name :  HATYAI Journey Inc.
                                    <br/>   
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
                                    <br/>
                                    สำนักงาน: บจ. หาดใหญ่ จอว์ลนี่ เซอร์วิสเซส สำนักงานใหญ่ 1 (ประชายินดี 5)

                                </strong>
                                </p>
                                <PhoneOutlined />
                                
                            </div>
                        </Panel>
                       
                    </Collapse>
            </Drawer>
    </>
  );
};
export default Contact;