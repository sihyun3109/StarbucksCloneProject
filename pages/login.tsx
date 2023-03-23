import React, { ChangeEvent, useState } from "react";

import Config from "@/configs/config.export";

import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";

import { LoginReq } from "@/types/UserRequest/Request";

import { userLoginState } from "@/state/atom/userLoginState";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const BASE_URL = Config().baseUrl;
  const [loginData, setLoginData] = useRecoilState(userLoginState);

  const [inputData, setInputData] = useState<LoginReq>({
    email: "",
    password: "",
  });

  const [isError, setIsError] = useState({
    email: false,
    password: false,
  });

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value });
  };
  //로그인 확인용 => Recoil 셋업 되는대로 라우팅 처리 하겠습니다.
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("login");
    console.log(inputData);
    if (inputData.email === "" || inputData.password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "이메일과 비밀번호를 입력해주세요!",
      });
      return;
    } else {
      axios
        .post(`${BASE_URL}/api/v1/users/login`, {
          email: inputData.email,
          password: inputData.password,
        })
        .then((res) => {
          if (res.data.state === 400) {
            console.log(res.data.message);
            Swal.fire({
              icon: "error",
              text: res.data.message,
            });
            return;
          }
          setLoginData({
            userId: res.data.data.userId,
            accessToken: res.data.data.accessToken,
            refreshToken: res.data.data.refreshToken,
            isLogin: true,
          });
          let myLogin = localStorage;
          myLogin.setItem("userId", res.data.data.userId);
          myLogin.setItem("accessToken", res.data.data.accessToken);
          myLogin.setItem("refreshToken", res.data.data.refreshToken);
          Swal.fire({
            icon: "success",
            text: "Welcome!",
          });
          router.back();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "아이디 혹은 비밀번호가 틀렸습니다.",
          });
          setInputData({
            email: "",
            password: "",
          });
          console.log(err);
        });
    }
  };

  return (
    <div className="modal">
      <div onClick={() => router.back()}>
        <img src="./assets/images/icons/close.png" className="back-button" />
      </div>
      <section className="login-section">
        <div className="login-top">
          <h2>로그인</h2>
          <img id="starbucks" src="./assets/images/starbucks-logo.png" alt="" />
          <p className="title">
            안녕하세요. <br /> 스타벅스입니다.
          </p>
          <p className="sub">회원 서비스 이용을 위해 로그인 해주세요.</p>
        </div>
        <div className="login">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="이메일"
              onChange={handleOnChange}
            />
            {isError.email ? (
              <p className="error-message">이메일을 입력해 주세요.</p>
            ) : null}
            <br />
            <input
              type="password"
              name="password"
              id="pwd"
              placeholder="비밀번호"
              onChange={handleOnChange}
            />
            {isError.password ? (
              <p className="error-message">비밀번호를 입력해 주세요.</p>
            ) : null}
            <div className="login-btn">
              <div className="login-btn-inner">
                <ul>
                  <li>
                    <Link href="">아이디 찾기</Link>
                  </li>
                  <li>
                    <Link href="">비밀번호 찾기</Link>
                  </li>
                  <li>
                    <Link href="/signup">회원가입</Link>
                  </li>
                </ul>
              </div>
            </div>
            <br />
            <div className="submit-container">
              <button type="submit">로그인</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}