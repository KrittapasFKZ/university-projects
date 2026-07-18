import { render, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  it("should call handleSearch when search button is clicked and onSearch with correct input", () => {
    const onSearchMock = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <SearchBar onSearch={onSearchMock} />
    );
    const searchButton = getByText(/ค้นหา/i);
    const inputElement = getByPlaceholderText(
      /ค้นหาสถานที่ท่องเที่ยว หรือโปรแกรมทัวร์/i
    );
    fireEvent.change(inputElement, { target: { value: "HatYai" } });
    fireEvent.click(searchButton);
    expect(onSearchMock).toHaveBeenCalled();
    expect(onSearchMock).toHaveBeenCalledWith("HatYai");
  });
});
