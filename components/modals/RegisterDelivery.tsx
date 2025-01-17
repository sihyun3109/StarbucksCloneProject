import React from "react";
import CloseButton from "../ui/CloseButton";

export default function RegisterDelivery() {
  return (
    <div className="cart-container">
      <div>
        <header id="store-head">
          <div className="store-header-top">
            <div className="menu-icon"></div>
            <h1>
              <a href="">배송지 등록</a>
            </h1>
            <nav>
              <ul>
                <li>
                  <CloseButton />
                </li>
              </ul>
              A
            </nav>
          </div>
        </header>
        <section id="info-header">
          <div>배송지 정보</div>
        </section>
        <section id="delivery-input">
          <div>
            <input type="text" placeholder="주소 별칭" />
            <input type="text" placeholder="받는 분 *" />
            <div className="post-number">
              <input type="text" placeholder="우편번호 *" />
              <a href="">
                <div className="search-address">주소검색</div>
              </a>
            </div>
            <input type="text" placeholder="기본주소 *" />
            <input type="text" placeholder="상세주소 *" />
            <input type="text" placeholder="연락처1 *" />
            <input type="text" placeholder="연락처2" />
            <div className="delivery-memo">
              <p>배송 메모</p>
              <select name="" id="">
                <option value="">배송 메모를 선택해 주세요.</option>
                <option value="">배송 전 연락 바랍니다.</option>
                <option value="">부재 시 경비실에 맡겨주세요.</option>
                <option value="">부재 시 문 앞에 놓아주세요.</option>
                <option value="">부재 시 전화 또는 문자 남겨주세요.</option>
                <option value="">직접 입력</option>
              </select>
            </div>
            <div className="save-delivery">
              <input type="checkbox" />
              <span>기본 배송지로 저장합니다.</span>
            </div>
          </div>
        </section>
        <section className="submit-container">
          <button type="submit">등록하기</button>
        </section>
      </div>
    </div>
  );
}
