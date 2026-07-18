import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Empty } from 'antd';

const LoadingIcon = () => (
  <div>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 75,
          }}
          spin
        />
      }
    />
  </div>
);

export default LoadingIcon;
