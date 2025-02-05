import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Input from "./Input";

test("Page", () => {
  const label = "Input";
  render(
    <Input
      id={label}
      label={label}
      placeholder={label}
    />
  );
  expect(screen.getByText(label)).toBeDefined();
});
