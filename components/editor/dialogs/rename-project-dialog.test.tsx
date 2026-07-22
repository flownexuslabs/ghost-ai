import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog"
import type { Project } from "@/lib/projects"

const project: Project = {
  id: "1",
  name: "Checkout Redesign",
  slug: "checkout-redesign",
  role: "owner",
}

function renderDialog(
  overrides: Partial<Parameters<typeof RenameProjectDialog>[0]> = {}
) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    project,
    name: project.name,
    isLoading: false,
    onNameChange: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
  }
  const utils = render(<RenameProjectDialog {...props} />)
  return { ...utils, props }
}

describe("RenameProjectDialog", () => {
  it("does not render its content when closed", () => {
    renderDialog({ open: false })
    expect(screen.queryByText("Rename project")).not.toBeInTheDocument()
  })

  it("renders the title when open", () => {
    renderDialog()
    expect(screen.getByText("Rename project")).toBeInTheDocument()
  })

  it("names the current project in the description", () => {
    renderDialog()
    expect(
      screen.getByText("Choose a new name for Checkout Redesign.")
    ).toBeInTheDocument()
  })

  it("falls back to generic wording when project is null", () => {
    renderDialog({ project: null })
    expect(
      screen.getByText("Choose a new name for this project.")
    ).toBeInTheDocument()
  })

  it("prefills the input with the current name", () => {
    renderDialog({ name: "Checkout Redesign" })
    expect(screen.getByPlaceholderText("Project name")).toHaveValue(
      "Checkout Redesign"
    )
  })

  it("auto-focuses the input when opened", async () => {
    renderDialog()
    await waitFor(() =>
      expect(screen.getByPlaceholderText("Project name")).toHaveFocus()
    )
  })

  it("calls onNameChange as the user edits the name", async () => {
    const user = userEvent.setup()
    const { props } = renderDialog({ name: "Checkout Redesign" })

    const input = screen.getByPlaceholderText("Project name")
    await user.clear(input)
    await user.type(input, "X")

    expect(props.onNameChange).toHaveBeenLastCalledWith("X")
  })

  it("disables the submit button when the name is empty", () => {
    renderDialog({ name: "" })
    expect(screen.getByRole("button", { name: "Rename project" })).toBeDisabled()
  })

  it("disables the submit button while isLoading", () => {
    renderDialog({ isLoading: true })
    expect(screen.getByRole("button", { name: "Renaming..." })).toBeDisabled()
  })

  it("calls onSubmit when the submit button is clicked", async () => {
    const user = userEvent.setup()
    const { props } = renderDialog({ name: "Checkout Redesign v2" })

    await user.click(screen.getByRole("button", { name: "Rename project" }))

    expect(props.onSubmit).toHaveBeenCalledTimes(1)
  })

  it("calls onSubmit when Enter is pressed inside the input", async () => {
    const user = userEvent.setup()
    const { props } = renderDialog({ name: "Checkout Redesign v2" })

    const input = screen.getByPlaceholderText("Project name")
    await user.click(input)
    await user.keyboard("{Enter}")

    expect(props.onSubmit).toHaveBeenCalledTimes(1)
  })
})