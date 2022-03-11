import "./App.css";
import { message, Button, Col, Input, Layout, Row, Space, Tooltip, Typography, InputNumber, DatePicker } from "antd";
import { sum } from "@fxts/core";
import { useEffect, useState } from "react";
import { format, startOfDay } from "date-fns";

const { Text } = Typography;
const style = { padding: "8px 0" };

function App() {
  const [postUrl, setPostUrl] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [monthStr, setMonthStr] = useState("");
  const [isurlValid, setIsUrlValid] = useState(false);
  const [price, setPrice] = useState(0);

  // const price = 229000;
  const month = 3;

  const pricePerMonth = price / month;
  const a = Math.floor(pricePerMonth / 100) * 100;
  const b = price - a * (month - 1);
  const arr = new Array(month).fill(a);
  arr[0] = b;
  console.log(arr, sum(arr));
  // 03/09,윤지(생일선물선결제)//3,229000,받을돈,신한딥드림,하하

  useEffect(() => {
    if (/\?/.test(postUrl)) {
      setIsUrlValid(false);
    } else if (/^https:\/\/whooing.com\/webhook\/s\//.test(postUrl)) {
      setIsUrlValid(true);
    } else {
      setIsUrlValid(false);
    }
  }, [postUrl]);

  useEffect(() => {
    const value = parseInt(priceStr.replace(/[^0-9,]/g, ""));
    if (!isNaN(value)) {
      setPrice(value);
    } else {
      setPrice(0);
    }
  }, [priceStr]);

  return (
    <div className="App">
      <h1>후잉 카드할부 입력기</h1>
      <h2>현재 무이자할부 입력만 지원합니다.</h2>
      <h2>현재 페이지에서는 어떠한 개인정보도 수집하지 않습니다.</h2>
      <br />
      <br />
      <br />
      <br />
      <h3>
        {"POST URL 입력"}
        <br />
        <a href="https://whooing.com/#main/setting">https://whooing.com/#main/setting</a>
        <>
          &nbsp;아래쪽의 <Text code>POST URL로 전달하기(키는 아무거나 무관)</Text> URL을 복사해서 아래에 붙여넣어주세요.
        </>
      </h3>
      <Input
        status={isurlValid ? undefined : "error"}
        placeholder="POST URL"
        width={12}
        value={postUrl}
        onChange={(e) => {
          setPostUrl(e.target.value);
        }}
      />
      <br />
      <br />
      <br />

      <h3>금액 입력</h3>
      <Input
        status={price <= 0 || price > 1000000000 ? "error" : undefined}
        prefix="￦"
        value={priceStr}
        onChange={(e) => {
          const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
          if (isNaN(value)) {
            setPriceStr("");
            return;
          } else if (value > 1000000000) {
            setPriceStr("1000000000");
          } else {
            setPriceStr(value.toLocaleString());
          }
        }}
      />
      <br />
      <br />
      <br />

      <h3>결제일자 입력</h3>
      <DatePicker
        placeholder="날짜 입력하기.."
        onChange={(e) => {
          if (e) {
            console.log(format(e.toDate(), "yyyyMMdd"));
          }
        }}
      />
      {/* <InputNumber
        status={price <= 0 || price > 1000000000 ? "error" : undefined}
        prefix="개월"
        width={100}
        value={priceStr}
        onChange={(e) => {
          const value = parseInt(e.replace(/[^0-9]/g, ""));
          if (isNaN(value)) {
            setPriceStr("");
            return;
          } else if (value > 1000000000) {
            setPriceStr("1000000000");
          } else {
            setPriceStr(value.toLocaleString());
          }
        }}
      /> */}
      <br />
      <br />
      <br />

      <h3>할부 개월 입력</h3>
      <InputNumber
        status={price <= 0 || price > 1000000000 ? "error" : undefined}
        prefix="개월수 : "
        width={100}
        value={priceStr}
        onChange={(e) => {
          const value = parseInt(e.replace(/[^0-9]/g, ""));
          if (isNaN(value)) {
            setPriceStr("");
            return;
          } else if (value > 1000000000) {
            setPriceStr("1000000000");
          } else {
            setPriceStr(value.toLocaleString());
          }
        }}
      />
      <br />
      <br />
      <br />

      <h3>품목명 입력</h3>
      <Input
        status={price <= 0 || price > 1000000000 ? "error" : undefined}
        prefix="￦"
        width={12}
        value={priceStr}
        onChange={(e) => {
          const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
          if (isNaN(value)) {
            setPriceStr("");
            return;
          } else if (value > 1000000000) {
            setPriceStr("1000000000");
          } else {
            setPriceStr(value.toLocaleString());
          }
        }}
      />
      <br />
      <br />
      <br />

      <h3>왼쪽/오른쪽 입력 (항목명을 정확히 기입하거나 항목고유번호를 입력해주세요)</h3>
      <Row>
        <Col span={12}>
          <h3>왼쪽</h3>
          <Input
            status={price <= 0 || price > 1000000000 ? "error" : undefined}
            prefix="￦"
            width={12}
            value={priceStr}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
              if (isNaN(value)) {
                setPriceStr("");
                return;
              } else if (value > 1000000000) {
                setPriceStr("1000000000");
              } else {
                setPriceStr(value.toLocaleString());
              }
            }}
          />
        </Col>
        <Col span={12}>
          <h3>오른쪽</h3>
          <Input
            status={price <= 0 || price > 1000000000 ? "error" : undefined}
            prefix="￦"
            width={12}
            value={priceStr}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
              if (isNaN(value)) {
                setPriceStr("");
                return;
              } else if (value > 1000000000) {
                setPriceStr("1000000000");
              } else {
                setPriceStr(value.toLocaleString());
              }
            }}
          />
        </Col>
      </Row>

      <br />
      <br />
      <br />

      <h3>메모</h3>
      <Input
        status={price <= 0 || price > 1000000000 ? "error" : undefined}
        prefix="￦"
        width={12}
        value={priceStr}
        onChange={(e) => {
          const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
          if (isNaN(value)) {
            setPriceStr("");
            return;
          } else if (value > 1000000000) {
            setPriceStr("1000000000");
          } else {
            setPriceStr(value.toLocaleString());
          }
        }}
      />
      <br />
      <br />
      <br />

      <Button
        block
        type="default"
        size="large"
        onClick={() => {
          // navigator.clipboard.writeText("하하함ㄴ다핟");
          message.info(
            <>
              <br />
              붙여넣기용 데이터가 클립보드에 복사되었습니다.
              <br />
              <a href="https://whooing.com/#main/insert">후잉</a> 외부입력 - 붙여넣기 메뉴에서 붙여넣어주세요.
            </>,
            3,
          );
        }}
      >
        붙여넣기용 데이터 클립보드에 복사하기
      </Button>
      <br />
      <br />
      <Button block type="primary" size="large" onClick={() => {}}>
        후잉 임시저장소로 보내기
      </Button>
      <br />
      <br />
      <Button block type="primary" size="large">
        후잉으로 보내기
      </Button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h2 style={{ textAlign: "center" }}>
        <a href="https://github.com/Kuhave/whooing-card-installment">created by Kuhave @ 2022</a>
      </h2>
    </div>
  );
}

export default App;
