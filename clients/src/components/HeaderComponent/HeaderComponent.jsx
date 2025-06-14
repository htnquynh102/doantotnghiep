import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import {
  WrapperLogo,
  WrapperHeader,
  UserMenuWrapper,
  MenuWrapper,
} from "./style";
import { Flex, Icon } from "@chakra-ui/react";
import { LuSearch, LuTickets, LuCircleUser, LuLogOut } from "react-icons/lu";
import { Avatar } from "../../components/ui/avatar";
import { InputGroup } from "../../components/ui/input-group";
import { useAuth } from "../../hooks/useAccount";
import { useUserById } from "../../hooks/useUser";
import { useCategories } from "../../hooks/useCategory";

const HeaderComponent = () => {
  const { isAuthenticated, userEmail, accountId, logout } = useAuth();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
  } = useUserById(accountId);
  const {
    data: category,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    error: errorCategory,
  } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (isLoadingUser || isLoadingCategory) return <p>Đang tải...</p>;
  if (isErrorUser) return <p>Lỗi: {errorUser.message}</p>;
  if (isErrorCategory) return <p>Lỗi: {errorCategory.message}</p>;

  return (
    <div>
      <WrapperHeader>
        <Flex
          style={{
            backgroundColor: "#fff",
            justifyContent: "space-between",
            margin: "0 max(0.5em, 10vw)",
            borderRadius: "32px",
            padding: "0 32px",
            boxShadow: "rgba(0, 0, 0, 0.12) 0px 3px 20px 0px",
          }}
        >
          <MenuWrapper gap={4}>
            <WrapperLogo>
              <img src={logo} alt="" />
            </WrapperLogo>
            <Link className="main-menu" to="/">
              Trang chủ
            </Link>
            <Flex
              className="main-menu"
              style={{
                position: "relative",
                height: "100%",
                alignItems: "center",
              }}
              onMouseEnter={() => setIsSubMenuOpen(true)}
              onMouseLeave={() => setIsSubMenuOpen(false)}
            >
              <p>Danh mục sự kiện</p>
              {isSubMenuOpen && (
                <div className="sub-menu">
                  <Flex className="menu-list" flexDirection="column">
                    {category.map((item) => (
                      <Flex
                        key={item.maDanhMuc}
                        className="menu-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events?cate=${item.maDanhMuc}`);
                        }}
                      >
                        {item.tenDanhMuc}
                      </Flex>
                    ))}
                  </Flex>
                </div>
              )}
            </Flex>
            <Link className="main-menu">Hướng dẫn đặt vé</Link>
          </MenuWrapper>
          <UserMenuWrapper style={{ position: "relative" }}>
            <Flex
              ref={searchRef}
              onClick={() => setIsSearchOpen(true)}
              style={{ position: "relative", height: "100%" }}
              alignItems="center"
            >
              <LuSearch style={{ fontSize: "20px" }} />
              {isSearchOpen && (
                <div className="user-menu">
                  <InputGroup
                    height="40px"
                    borderRadius="12px"
                    startElement={
                      <Icon as={LuSearch} style={{ fontSize: "16px" }} />
                    }
                  >
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onFocus={() => setIsInputActive(true)}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                </div>
              )}
            </Flex>
            <button>
              <Flex gap={2}>
                <LuTickets style={{ fontSize: "20px" }} />
                <span>Vé của tôi</span>
              </Flex>
            </button>
            <Flex
              h="100%"
              onMouseEnter={() => isAuthenticated && setIsUserMenuOpen(true)}
              onMouseLeave={() => isAuthenticated && setIsUserMenuOpen(false)}
            >
              <button
                style={{
                  width: "220px",
                }}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/sign-in");
                  }
                }}
              >
                <Avatar
                  name={isAuthenticated ? userEmail : "Đăng nhập | Đăng ký"}
                  src={user?.anhDaiDien}
                />
              </button>

              {isAuthenticated && isUserMenuOpen && (
                <div className="user-menu">
                  <Flex className="menu-list" flexDirection="column">
                    <Flex gap={2} className="menu-item">
                      <LuTickets style={{ fontSize: "20px" }} /> Vé đã mua
                    </Flex>
                    <Flex
                      gap={2}
                      className="menu-item"
                      onClick={() => navigate("/user/profile")}
                    >
                      <LuCircleUser style={{ fontSize: "20px" }} />
                      Tài khoản của tôi
                    </Flex>
                    <Flex
                      gap={2}
                      className="menu-item"
                      onClick={() => logout()}
                    >
                      <LuLogOut style={{ fontSize: "20px" }} />
                      Đăng xuất
                    </Flex>
                  </Flex>
                </div>
              )}
            </Flex>
          </UserMenuWrapper>
        </Flex>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
