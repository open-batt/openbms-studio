import { describe, it, expect } from "vitest"
import { formatMinutes } from "./format-time"

describe("formatMinutes", () => {
  it("formats zero as 0:00", () => {
    expect(formatMinutes(0)).toBe("0:00")
  })

  it("formats sub-hour minutes", () => {
    expect(formatMinutes(45)).toBe("0:45")
  })

  it("formats exactly one hour", () => {
    expect(formatMinutes(60)).toBe("1:00")
  })

  it("formats hours and minutes", () => {
    expect(formatMinutes(95)).toBe("1:35")
  })

  it("pads single-digit minutes", () => {
    expect(formatMinutes(61)).toBe("1:01")
  })

  it("returns — for 0xFFFF (SBS not-calculated sentinel)", () => {
    expect(formatMinutes(65535)).toBe("—")
  })

  it("formats large but valid values normally", () => {
    expect(formatMinutes(65534)).toBe("1092:14")
  })
})
