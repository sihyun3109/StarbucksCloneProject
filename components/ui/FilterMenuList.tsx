import Config from "@/configs/config.export";
import { MenuDataType, filterDataType } from "@/types/filter/filterTypes";
import axios from "axios";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { menuListDepth3 } from "@/datas/navData";

export default function FilterMenuList(props: {
  data: MenuDataType[];
  filterFile: filterDataType[];
  setFilter: Dispatch<SetStateAction<filterDataType[]>>;
}) {
  const router = useRouter();
  const baseUrl = Config().baseUrl;
  const [categoryMain, setCategoryMain] = useState<MenuDataType[]>();
  const [categoryMiddle, setCategoryMiddle] = useState<MenuDataType[]>();
  const [categoryId, setCategoryId] = useState<number>(0);
  const [subCategoryId, setSubCategoryId] = useState<number[]>([]);
  const [priceId, setPriceId] = useState<number>(0);

  const handleAddQuery = (item: MenuDataType) => {
    if (item.key === "category" && item.id === 0) {//전체 메뉴
      router.push(`/listview?category=0`);
      setCategoryId(0);
      setSubCategoryId([])
      setCategoryMiddle([]);
      return;
    }
    if (item.key === "category" && item.id !== 0) {//전체x 일 때
      router.push(`/listview?category=${item.id}`);
      setCategoryId(item.id);
      setSubCategoryId([]);
      setCategoryMiddle([]);

      axios.get(`${baseUrl}/v1/api/categories/middle`).then((res) => {
        setCategoryMiddle(res.data[item.id-1].data);
      });
      console.log("123",item)
      // if (props.filterFile.find((data) => data.id === item.id)) {
      //   console.log("123",props.filterFile)
      //   props.setFilter(props.filterFile.filter((data) => data.id !== item.id));
      //   return;
      // }

    } else if (item.key === "subCategory" && item.id !== 0 ) {//전체x인 subCategory
      let subQuery = subCategoryId.map(item2=> item2? "&subCategory="+item2 :"").join("")
      
      console.log("subQuery    "+ subQuery)
      router.push(`/listview?category=${categoryId}${subQuery}`);
      
      return;
    }
  }
  const handlePrice = (id: number) => {};

  useEffect(() => {
    axios.get(`${baseUrl}/v1/api/categories/main`).then((res) => {
      console.log(res.data);
      setCategoryMain(res.data);
    });
  }, []);

  // console.log('filterfile',props.filterFile);
  return (
    <div className="header-sub">
      <nav>
        <ul className="allProducts-ul">
          {categoryMain &&
            categoryMain.map((item: MenuDataType) => (
              <li
                key={item.id}
                onClick={() => handleAddQuery(item)}
                className={item.id === categoryId ? "active" : ""}
              >
                <p>{item.name}</p>
              </li>
            ))}
        </ul>
        <ul className="allProducts-ul">
          {categoryMiddle &&
            categoryMiddle.map((item: MenuDataType) => (
              <li
                key={item.id}
                className={subCategoryId.includes(item.id) ? "active" : ""}
                onClick={() =>{subCategoryId.includes(item.id)
                  ? setSubCategoryId(subCategoryId.filter(item2=>item2!==item.id))
                  : subCategoryId.push(item.id); handleAddQuery(item)} }
              >
                <p>{item.name}</p>
              </li>
            ))}
        </ul>
        <ul className="allProducts-ul">
          {menuListDepth3 &&
            menuListDepth3.map((item) => (
              <li
                key={item.id}
                onClick={() => handlePrice(item.id)}
                className={priceId === item.id ? "active" : ""}
              >
                <p>{item.name}</p>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
}
