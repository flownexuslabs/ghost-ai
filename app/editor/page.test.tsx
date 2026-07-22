import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import EditorPage from "@/app/editor/page"

vi.mock("@/components/editor/editor-home", () => ({
  EditorHome: () => <div data-testid="editor-home-stub">editor home</div>,
}))

describe("EditorPage", () => {
  it("renders the EditorHome component", () => {
    render(<EditorPage />)
    expect(screen.getByTestId("editor-home-stub")).toBeInTheDocument()
  })
})