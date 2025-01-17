import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import SubNavigation from "@/components/widgets/SubNavigation";
import Category from "@/components/widgets/Category";
import { bottomNavMenuType } from "@/types/header/navMenuType";
import { bottomNavData } from "@/datas/navData";
import { cartState } from "@/state/atom/cartState";
import { menuModalState } from "@/state/atom/menuModalState";
import { userLoginState } from "@/state/atom/userLoginState";

import Swal from "sweetalert2";
import BackButton from "../ui/BackButton";
import { useCookies } from "react-cookie";
import axios from "axios";
import Config from "@/configs/config.export";
import HeaderTopShipping from "./HeaderTopShipping";
import BackButton3 from "../ui/BackButton3";
import BackButton2 from "../ui/BackButton2";

export default function Header() {
  const router = useRouter();
  const baseUrl = Config().baseUrl;

  const [navBottomData] = useState<bottomNavMenuType[]>(bottomNavData);
  const [cartCnt, setCartCnt] = useRecoilState(cartState);
  const setIsMenuModalOpen = useSetRecoilState(menuModalState);
  const [isLogin, setIsLogin] = useRecoilState(userLoginState);
  const [cookies, setCookie, removeCookie] = useCookies(["id"]);
  const [useStateCookie, setUseStateCookie] = useState();

  const handleLogout = () => {
    Swal.fire({
      title: "로그아웃 하시겠습니까?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `확인`,
      denyButtonText: `취소`,
    }).then((result) => {
      console.log(cookies.id);
      if (result.isConfirmed) {
        // axios.post(`${baseUrl}/api/v1/users/logout`, {
        //   headers: {
        //     Authorization: `Bearer ${cookies.id}`,
        //   },
        // });
        setIsLogin({
          userId: "",
          accessToken: "",
          refreshToken: "",
          isLogin: false,
        });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("nickname");
        removeCookie("id");
        let timerInterval: string | number | NodeJS.Timer | undefined;
        Swal.fire({
          html: "Bye~",
          timer: 300,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            // const b = Swal.getHtmlContainer().querySelector("b");
            // timerInterval = setInterval(() => {
            //   b.textContent = Swal.getTimerLeft();
            // }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
          }
        });
        router.push("/");
      }
    });
  };

  useEffect(() => {
    setUseStateCookie(cookies.id)
    if (useStateCookie) {
      axios.get(`${baseUrl}/v1/api/carts/get`, {
        headers: {
          Authorization: `Bearer ${useStateCookie}`,
        },
      }).then((res) => {
        setCartCnt(res.data.length);
      });
    }
  }, [cookies.id]);

  return (
    <header>
      {router.pathname === "/shippingAddressChange" ||
        router.pathname === "/shippingAddressModify/[shippingAddressId]" ||
        router.pathname === "/shippingAddressRegister" ? (
        <HeaderTopShipping />
      ) : (
        <div className="header-top">
          <div className="menu-icon">
            {router.pathname === "/cart" ||
              router.pathname === "/shippingAddress" ||
              router.pathname === "/signup" ||
              router.pathname === "/search/[search]" ||
              router.pathname === "/products/[productId]" ? (
              <BackButton />
            ) : router.pathname === "/listview" ? (
              <BackButton2 />
            ) : router.pathname === "/payment" ? (
              <BackButton3 />
            ) : (
              <div onClick={() => setIsMenuModalOpen(true)}>
                <img src="/assets/images/icons/menu.svg" alt="" />
              </div>
            )}
          </div>
          <Link href={"/"}>
            <h1>온라인 스토어</h1>
          </Link>
          <nav>
            <ul>
              <li onClick={() => router.push("/search")}>
                <img src="/assets/images/icons/search.svg" />
              </li>
              <li onClick={() => router.push("/cart")}>
                {
                  useStateCookie ?
                    <p className="cart-badge">{cartCnt}</p> : null
                }
                <img src="/assets/images/icons/shopping-cart.svg" />
              </li>
              {isLogin.isLogin ? (
                <li onClick={handleLogout}>
                  <img src="/assets/images/icons/logout.png" />
                </li>
              ) : (
                <li onClick={() => router.push("/login")}>
                  <img src="/assets/images/icons/user.svg" />
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
      {router.pathname === "/" ||
        router.pathname === "/event" ||
        router.pathname === "/best" ||
        router.pathname === "/mypage" ? (
        <div className="header-bottom">
          <nav>
            <ul>
              {navBottomData &&
                navBottomData.map((nav) =>
                  nav.link === "/event?category=1" ||
                    nav.link === "/best?category=1" ? (
                    <li
                      key={nav.id}
                      className={
                        router.pathname === nav.link.split("?")[0]
                          ? "active"
                          : ""
                      }
                    >
                      <Link href={nav.link}>{nav.name}</Link>
                    </li>
                  ) : (
                    <li
                      key={nav.id}
                      className={router.pathname === nav.link ? "active" : ""}
                    >
                      <Link href={nav.link}>{nav.name}</Link>
                    </li>
                  )
                )}
            </ul>
          </nav>
        </div>
      ) : (
        ""
      )}
      {router.pathname === "/event" || router.pathname === "/best" ? (
        <SubNavigation />
      ) : (
        ""
      )}
      {router.pathname === "/listview" ? <Category /> : ""}
    </header>
  );
}
