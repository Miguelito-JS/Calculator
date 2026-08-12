import React, { useState, useRef, useEffect } from "react";
import "./Calculator.css";
import Box from "@mui/material/Box";

export default function Calculator() {
  const [num, setNum] = useState("");
  const [oldNum, setOldNum] = useState("");
  const [operator, setOperator] = useState("");

  // Digitar números
  function inputNum(valor) {
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
  }

  // Porcentagem
  function percentage() {
    if (num !== "") {
      setNum((parseFloat(num) / 100).toString());
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
    setOperator(e.target.value);
    setOldNum(num);
    setNum("");
  }

  // Calcular
  function calculate() {
    const atual = parseFloat(num);
    const anterior = parseFloat(oldNum);

    switch (operator) {
      case "+":
        setNum((anterior + atual).toString());
        break;

      case "-":
        setNum((anterior - atual).toString());
        break;

      case "X":
        setNum((anterior * atual).toString());
        break;

      case "/":
        if (atual === 0) {
          setNum("Erro");
        } else {
          setNum((anterior / atual).toString());
        }
        break;

      default:
        return;
    }

    setOldNum("");
    setOperator("");
  }

  const resultRef = useRef(null);

  useEffect(() => {
    const container = resultRef.current;
    if (!container) return;
    const inner = container.querySelector(".result-inner");
    if (!inner) return;

    // Reset any previous inline sizing
    inner.style.fontSize = "";
    container.classList.remove("start-visible");

    const containerW = container.clientWidth;
    // get computed font size in px
    const comp = window.getComputedStyle(inner).fontSize;
    let font = parseFloat(comp) || 40;
    const minFont = 14; // px lower bound

    // Try shrinking until it fits or hits minFont
    let iter = 0;
    while (inner.scrollWidth > containerW && font > minFont && iter < 40) {
      font = Math.max(minFont, font - 1);
      inner.style.fontSize = font + "px";
      iter++;
    }

    // If still overflowing, fallback to showing the start of the number
    if (inner.scrollWidth > containerW) {
      container.classList.add("start-visible");
      // ensure minimum readable font
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