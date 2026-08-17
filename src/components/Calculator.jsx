import React, { useState, useRef, useEffect } from "react";
import "./Calculator.css";
import Box from "@mui/material/Box";

export default function Calculator() {
  const [num, setNum] = useState("");
  const [oldNum, setOldNum] = useState("");
  const [operator, setOperator] = useState("");
  const [lastNum, setLastNum] = useState("");
  const [lastOperator, setLastOperator] = useState("");
  const [justCalculated, setJustCalculated] = useState(false);

  // Arredondar números decimais
  function roundResult(valor) {
    return parseFloat(valor.toFixed(10));
  }

  // Digitar números
  function inputNum(valor) {

    // Começar uma nova conta depois do "="
    if (justCalculated) {
      setNum(valor === "." ? "0." : valor);
      setOldNum("");
      setOperator("");
      setLastNum("");
      setLastOperator("");
      setJustCalculated(false);
      return;
    }

    // Se clicar em "." mais de uma vez, não faz nada
    if (valor === "." && num.includes(".")) {
      return;
    }

    if (valor === "." && num === "") {
      setNum("0.");
      return;
    }

    // Evita vários zeros no início (00, 000...)
    if (num === "0" && valor !== ".") {
      setNum(valor);
      return;
    }

    setNum((prev) => prev + valor);
  }

  // Limpar tudo
  function clear() {
    setNum("");
    setOldNum("");
    setOperator("");
    setLastNum("");
    setLastOperator("");
    setJustCalculated(false);
  }

  // Porcentagem
  function percentage() {
    if (num !== "") {
      const currentNum = parseFloat(num);

      // Se existe um número anterior e um operador
      if (oldNum !== "" && operator !== "") {
        const previousNum = parseFloat(oldNum);

        // Calcula a porcentagem em relação ao número anterior
        setNum((previousNum * currentNum / 100).toString());
        return;
      }

      // Porcentagem de um número sozinho
      setNum((currentNum / 100).toString());
    }
  }

  // Trocar sinal
  function invertSignal() {
    if (num !== "") {
      setNum((parseFloat(num) * -1).toString());
    }
  }

  // Salvar operador
  function operatorHandler(e) {
    const nextOperator = e.target.value;

    // Começar um número negativo
    if (num === "" && oldNum === "" && nextOperator === "-") {
      setNum("-");
      return;
    }

    // Trocar o operador enquanto ainda não existe número
    if (num === "" && oldNum === "") {
      setOperator(nextOperator);
      return;
    }

    // Trocar operador sem realizar cálculo
    if (num === "" && oldNum !== "") {
      setOperator(nextOperator);
      return;
    }

    // Evita tentar calcular apenas "-"
    if (num === "-") {
      return;
    }

    const currentNum = parseFloat(num);

    // Primeiro número
    if (oldNum === "") {
      setOldNum(currentNum.toString());
      setOperator(nextOperator);
      setNum("");
      return;
    }

    const previousNum = parseFloat(oldNum);
    let result;

    switch (operator) {
      case "+":
        result = roundResult(previousNum + currentNum);
        break;

      case "-":
        result = roundResult(previousNum - currentNum);
        break;

      case "X":
        result = roundResult(previousNum * currentNum);
        break;

      case "/":
        if (currentNum === 0) {
          setNum("Erro");
          setOldNum("");
          setOperator("");
          return;
        }

        result = roundResult(previousNum / currentNum);
        break;

      default:
        result = currentNum;
    }

    setOldNum(result.toString());
    setNum("");
    setOperator(nextOperator);
  }

  function calculate() {
    // Repetir última operação
    if (
      num !== "" &&
      oldNum === "" &&
      operator === "" &&
      lastNum !== "" &&
      lastOperator !== ""
    ) {
      const currentNum = parseFloat(num);
      const previousNum = parseFloat(lastNum);

      let result;

      switch (lastOperator) {
        case "+":
          result = roundResult(previousNum + currentNum);
          break;

        case "-":
          result = roundResult(previousNum - currentNum);
          break;

        case "X":
          result = roundResult(previousNum * currentNum);
          break;

        case "/":
          if (currentNum === 0) {
            setNum("Erro");
            setOldNum("");
            setOperator("");
            return;
          }

          result = roundResult(previousNum / currentNum);
          break;

        default:
          return;
      }

      setNum(result.toString());
      setLastNum(previousNum.toString());
      return;
    }

    if (num === "" || oldNum === "" || operator === "") {
      return;
    }

    const previousNum = parseFloat(oldNum);
    const currentNum = parseFloat(num);

    let result;

switch (operator) {
  case "+":
    result = roundResult(previousNum + currentNum);
    break;

  case "-":
    result = roundResult(previousNum - currentNum);
    break;

  case "X":
    result = roundResult(previousNum * currentNum);
    break;

  case "/":
    if (currentNum === 0) {
      setNum("Erro");
      setOldNum("");
      setOperator("");
      setLastNum("");
      setLastOperator("");
      setJustCalculated(true);
      return;
    }

    result = roundResult(previousNum / currentNum);
    break;

  default:
    return;
}

    setNum(result.toString());

    // Guarda a última informação
    setLastNum(currentNum.toString());
    setLastOperator(operator);

    setOldNum("");
    setOperator("");
    setJustCalculated(true);
  }
  const resultRef = useRef(null);

  useEffect(() => {
    const container = resultRef.current;
    if (!container) return;
    const inner = container.querySelector(".result-inner");
    if (!inner) return;


    inner.style.fontSize = "";
    container.classList.remove("start-visible");

    const containerW = container.clientWidth;
    const comp = window.getComputedStyle(inner).fontSize;
    let font = parseFloat(comp) || 40;
    const minFont = 14; 

    let iter = 0;
    while (inner.scrollWidth > containerW && font > minFont && iter < 40) {
      font = Math.max(minFont, font - 1);
      inner.style.fontSize = font + "px";
      iter++;
    }

    if (inner.scrollWidth > containerW) {
      container.classList.add("start-visible");
      inner.style.fontSize = minFont + "px";
    } else {
      container.classList.remove("start-visible");
    }
  }, [num]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <div className="wrapper">
        <div className="result" ref={resultRef} aria-live="polite">
          <div className="result-inner">{num === "" ? "0" : num}</div>
        </div>

        <button className="white" onClick={clear}>
          AC
        </button>

        <button className="white" onClick={invertSignal}>
          +/-
        </button>

        <button className="white" onClick={percentage}>
          %
        </button>

        <button className="orange" value="/" onClick={operatorHandler}>
          /
        </button>

        <button className="gray" onClick={() => inputNum("7")}>
          7
        </button>
        <button className="gray" onClick={() => inputNum("8")}>
          8
        </button>
        <button className="gray" onClick={() => inputNum("9")}>
          9
        </button>

        <button className="orange" value="X" onClick={operatorHandler}>
          X
        </button>

        <button className="gray" onClick={() => inputNum("4")}>
          4
        </button>
        <button className="gray" onClick={() => inputNum("5")}>
          5
        </button>
        <button className="gray" onClick={() => inputNum("6")}>
          6
        </button>

        <button className="orange" value="-" onClick={operatorHandler}>
          -
        </button>

        <button className="gray" onClick={() => inputNum("1")}>
          1
        </button>
        <button className="gray" onClick={() => inputNum("2")}>
          2
        </button>
        <button className="gray" onClick={() => inputNum("3")}>
          3
        </button>

        <button className="orange" value="+" onClick={operatorHandler}>
          +
        </button>

        <button className="gray zero" onClick={() => inputNum("0")}>
          0
        </button>

        <button className="gray" onClick={() => inputNum(".")}>
          .
        </button>

        <button className="orange" onClick={calculate}>
          =
        </button>
      </div>
    </Box>
  );
}
