import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InputDate from "./InputDate";

describe("InputDate component", () => {
  it("deve renderizar a label corretamente", () => {
    render(<InputDate label="Selecione a data:" />);
    expect(screen.getByText("Selecione a data:")).toBeDefined();
  });

  it("deve aplicar atributos adicionais no input", () => {
    render(<InputDate aria-label="input-date" name="data" />);
    const inputElement = screen.getByLabelText("input-date");
    expect(inputElement).toBeDefined();
  });
});
