import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { productAtom } from "../recoil/product";
import axiosFunction from "../functions/axios";

const useProductData = () => {
  const [data, setData] = useRecoilState(productAtom);
  //
  const dataFetcher = async () => {
    const response = await axiosFunction({ urlPath: "/product/" });
    setData(response.data);
  };
  //
  useEffect(() => {
    if (data.length === 0) {
      dataFetcher();
    }
  }, [data.length]);

  return [data, setData];
};

export default useProductData;
