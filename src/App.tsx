import "./App.css";
import { message, Button, Col, Input, Layout, Row, Space, Tooltip, Typography, InputNumber, DatePicker } from "antd";
import { each, map, pipe, sum, toArray, toAsync } from "@fxts/core";
import { useEffect, useState } from "react";
import { addMonths, format, parse, startOfDay } from "date-fns";

const { Text } = Typography;
const style = { padding: "8px 0" };

interface WhooingData {
  entry_date: string;
  item: string;
  money: number;
  left: string;
  right: string;
  memo: string;
}

type CheckMode = "CLIPBOARD" | "TEMP" | "INPUT";

function App() {
  const [postUrl, setPostUrl] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [isurlValid, setIsUrlValid] = useState(false);
  const [price, setPrice] = useState(0);
  const [month, setMonth] = useState(2);
  const [itemName, setItemName] = useState("");
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState<string | null>(null);

  const [debugStr, setDebugStr] = useState("");
  const [canContinueClipboard, setCanContinueClipboard] = useState(false);
  const [canContinueTemp, setCanContinueTemp] = useState(false);
  const [canContinueInput, setCanContinueInput] = useState(false);
  useEffect(() => {
    setCanContinueClipboard(getData("CLIPBOARD", true, true) === null ? false : true);
    setCanContinueTemp(getData("TEMP", true, true) === null ? false : true);
    setCanContinueInput(getData("INPUT", true, true) === null ? false : true);

    const a = getData("CLIPBOARD", true);
    if (a) {
      setDebugStr(a);
    }
  }, [postUrl, priceStr, isurlValid, price, month, itemName, left, right, memo, date]);

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
    const value = parseInt(priceStr.replace(/[^0-9]/g, ""));
    if (!isNaN(value)) {
      setPrice(value);
    } else {
      setPrice(0);
    }
  }, [priceStr]);

  function getData(checkMode: "CLIPBOARD", skipError?: boolean, onlyCheck?: boolean): string | null;
  function getData(checkMode: "TEMP", skipError?: boolean, onlyCheck?: boolean): string[] | null;
  function getData(checkMode: "INPUT", skipError?: boolean, onlyCheck?: boolean): WhooingData[] | null;
  function getData(
    checkMode: CheckMode,
    skipError: boolean = false,
    onlyCheck: boolean = false,
  ): string | string[] | WhooingData[] | null {
    const err = (msg: string) => (skipError ? undefined /*console.log(msg)*/ : message.error(msg));

    if (checkMode !== "CLIPBOARD") {
      if (!isurlValid) {
        err("POST URL을 확인해주세요.");
        return null;
      }
    }

    if (price <= 0 || price > 1000000000) {
      err("금액을 확인해주세요.");
      return null;
    }

    if (!date) {
      err("결제일자를 입력해주세요.");
      return null;
    }

    if (isNaN(month) || month <= 1) {
      err("할부 개월을 확인해주세요.");
      return null;
    }

    if (itemName.length === 0) {
      err("품목명을 입력해주세요.");
      return null;
    }

    if (left.length === 0) {
      err("왼쪽에 대한 입력을 확인해주세요.");
      return null;
    }

    if (right.length === 0) {
      err("오른쪽에 대한 입력을 확인해주세요.");
      return null;
    }

    if (onlyCheck) {
      return "";
    }

    const pricePerMonth = price / month;
    const a = Math.floor(pricePerMonth / 100) * 100;
    const b = price - a * (month - 1);
    const arr = new Array<number>(month).fill(a);
    arr[0] = b;

    let item = itemName.trim();
    if (/\(/.test(item)) {
      item = `${item.replace(/\)$/, "")}, `;
    } else {
      item = `${item}(`;
    }

    const leftString = left.trim();
    const rightString = right.trim();
    const memoString = memo.trim();

    if (checkMode !== "INPUT") {
      const data = arr.map((price, i) => {
        const nextDate = parse(date, "yyyyMMdd", new Date());
        const dateString = format(addMonths(nextDate, i), "yyyyMMdd");
        return [dateString, `${item}${i + 1}/${month})`, price, leftString, rightString, memoString]
          .filter((v) => v !== "")
          .join(", ");
      });

      if (checkMode === "TEMP") {
        return data;
      }
      return data.join("\n");
    }
    const data = arr.map<WhooingData>((price, i) => {
      const nextDate = parse(date, "yyyyMMdd", new Date());
      const dateString = format(addMonths(nextDate, i), "yyyyMMdd");
      return {
        entry_date: dateString,
        item: `${item}${i + 1}/${month})`,
        money: price,
        left: leftString,
        right: rightString,
        memo: memoString,
      };
      // return [dateString, `${item}${i + 1}/${month})`, price, leftString, rightString, memoString];
    });

    return data;
  }

  return (
    <div className="App">
      <h1>후잉 카드할부 입력기</h1>
      <h2>현재 무이자할부 입력만 지원합니다.</h2>
      <h2>현재 페이지에서는 어떠한 개인정보도 수집하지 않습니다.</h2>
      <h2>신한카드, 삼성카드, 롯데카드</h2>
      <br />
      <br />
      <br />
      <br />

      <h3>
        {"POST URL 입력(후잉 입력 시 필수입니다.)"}
        <br />
        <a href="https://whooing.com/#main/setting">https://whooing.com/#main/setting</a>
        <>
          &nbsp;아래쪽의 <Text code>POST URL로 전달하기(키는 아무거나 무관)</Text> URL을 복사해서 아래에 붙여넣어주세요.
        </>
      </h3>
      <Input
        size="large"
        status={isurlValid ? undefined : "warning"}
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
        size="large"
        status={price <= 0 || price > 1000000000 ? "error" : undefined}
        prefix="￦"
        placeholder="금액(숫자만 입력)"
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
        size="large"
        status={!date ? "error" : undefined}
        placeholder="결제일 입력"
        onChange={(e) => {
          if (e) {
            setDate(format(e.toDate(), "yyyyMMdd"));
          }
        }}
      />
      <br />
      <br />
      <br />

      <h3>할부 개월 입력</h3>
      <InputNumber
        size="large"
        status={isNaN(month) || month <= 1 ? "error" : undefined}
        prefix="개월수 : "
        value={month}
        onChange={(e) => {
          setMonth(e);
        }}
      />
      <br />
      <br />
      <br />

      <h3>품목명 입력</h3>
      <h4>아이템명에 괄호가 들어가는 경우, 동작이 불안정할 수 있습니다.(클립보드 복사 및 임시저장소로 보내기 기능)</h4>
      <Input
        size="large"
        placeholder="품목명을 입력하세요."
        status={itemName.length === 0 ? "error" : undefined}
        value={itemName}
        onChange={(e) => {
          setItemName(e.target.value);
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
            size="large"
            placeholder="왼쪽"
            status={left.length === 0 ? "error" : undefined}
            width={12}
            value={left}
            onChange={(e) => {
              setLeft(e.target.value);
            }}
          />
        </Col>
        <Col span={12}>
          <h3>오른쪽</h3>
          <Input
            size="large"
            placeholder="오른쪽"
            status={right.length === 0 ? "error" : undefined}
            width={12}
            value={right}
            onChange={(e) => {
              setRight(e.target.value);
            }}
          />
        </Col>
      </Row>

      <br />
      <br />
      <br />

      <h3>메모(선택)</h3>
      <Input
        size="large"
        placeholder="메모를 입력하세요."
        value={memo}
        onChange={(e) => {
          setMemo(e.target.value);
        }}
      />
      <br />
      <br />
      <br />
      <br />

      <Button
        block
        disabled={!canContinueClipboard}
        type="default"
        size="large"
        onClick={() => {
          const data = getData("CLIPBOARD");
          if (data) {
            navigator.clipboard.writeText(data);
            message.info(
              <>
                <br />
                붙여넣기용 데이터가 클립보드에 복사되었습니다.
                <br />
                <a href="https://whooing.com/#main/insert">후잉</a> 외부입력 - 붙여넣기 메뉴에서 붙여넣어주세요.
              </>,
              3,
            );
          }
        }}
      >
        붙여넣기용 데이터 클립보드에 복사하기(잘 인식되지 않을 수 있습니다.)
      </Button>
      <br />
      <br />
      <Button
        block
        disabled={!canContinueTemp}
        type="primary"
        size="large"
        onClick={async () => {
          const data = getData("TEMP");
          if (data) {
            await pipe(
              data,
              toAsync,
              map(async (v) => {
                const result = await fetch(postUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: v }),
                })
                  .then((res) => res.text())
                  .then((res) => res === "done")
                  .catch((e) => {
                    console.log(e);
                    return null;
                  });

                return result;
              }),
              toArray,
              (v) => {
                if (v.filter((v) => typeof v !== "boolean").length > 0) {
                  message.error(`데이터 전송에 실패하였습니다.`);
                } else {
                  message.info(`${v.length}개의 데이터가 임시저장소에 전송되었습니다.`);
                }
              },
            );
          }
        }}
      >
        후잉 임시저장소로 보내기(잘 인식되지 않을 수 있습니다.)
      </Button>
      <br />
      <br />
      <Button
        block
        disabled={!canContinueInput}
        type="primary"
        size="large"
        onClick={async () => {
          const data = getData("INPUT");
          if (data) {
            await pipe(
              data,
              toAsync,
              map(async (v) => {
                const result = await fetch(postUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(v),
                })
                  .then((res) => res.text())
                  .then((res) => res === "done")
                  .catch((e) => {
                    console.log(e);
                    return null;
                  });

                return result;
              }),
              toArray,
              (v) => {
                if (v.filter((v) => typeof v !== "boolean").length > 0) {
                  message.error(`데이터 전송에 실패하였습니다.`);
                } else {
                  message.info(`${v.length}개의 데이터가 임시저장소에 전송되었습니다.`);
                }
              },
            );
          }
        }}
      >
        후잉에 직접 입력하기
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
