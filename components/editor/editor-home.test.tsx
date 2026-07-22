import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { EditorHome } from "@/components/editor/editor-home"

const openCreateDialog = vi.fn()

vi.mock("@/components/editor/project-dialogs-context", () => ({
  useProjectDialogsContext: () => ({
    openCreateDialog,
  }),
}))

describe("EditorHome", () => {
  afterEach(() => {
    openCreateDialog.mockClear()
  })

  it("renders the heading and description", () => {
    render(<EditorHome />)

    expect(
      screen.getByText("Create a project or open an existing one")
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Start a new architecture workspace, or choose a project from the sidebar."
      )
    ).toBeInTheDocument()
  })

  it("renders a New Project button", () => {
    render(<EditorHome />)
    expect(
      screen.getByRole("button", { name: /new project/i })
    ).toBeInTheDocument()
  })

  it("calls openCreateDialog exactly once when the button is clicked", async () => {
    const user = userEvent.setup()
    render(<EditorHome />)

    await user.click(screen.getByRole("button", { name: /new project/i }))

    expect(openCreateDialog).toHaveBeenCalledTimes(1)
  })
})