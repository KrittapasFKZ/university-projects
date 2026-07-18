import { Button, Input } from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import WebFont from 'webfontloader';
import React, {  useEffect } from "react";


const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const handleSearch = () => {
    onSearch(searchText);
  };

  const searchInput = {
    placeholder: "ค้นหาสถานที่ท่องเที่ยว หรือโปรแกรมทัวร์",
    color: "black",
    width: isSmallScreen ? "70%" : "30%",
    height: "40px",
    fontWeight: "bold",
    justifyContent: "center",
    fontFamily:'Kanit'
  };

  const searchButtonStyle = {
    height: "40px",
    marginLeft: "5px",
    paddingLeft: "20px",
    paddingRight: "20px",
    fontFamily:'Kanit'
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Sriracha', 'Kanit']
      }
    });
   }, []);

  return (
    <>
      <Input
        style={searchInput}
        placeholder={searchInput.placeholder}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={() => onSearch(searchText)}
      />
      <Button
        type="primary"
        style={searchButtonStyle}
        onClick={() => handleSearch()}

      >
        ค้นหา
      </Button>
    </>
  );
};

export default SearchBar;
