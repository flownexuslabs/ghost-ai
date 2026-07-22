import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog"

function renderDialog(overrides: Partial<Parameters<typeof CreateProjectDialog>[0]> = {}) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    name: "",
    slug: "",
    isLoading: false,
    onNameChange: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
  }
  const utils = render(<CreateProjectDialog {...props} />)
  return { ...utils, props }
}

describe("CreateProjectDialog", () => {
  it("does not render its content when closed", () => {
    renderDialog({ open: false })
    expect(screen.queryByText("Create project")).not.toBeInTheDocument()
  })

  it("renders the title and description when open", () => {
    renderDialog()
    expect(screen.getByText("Create project")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Name your architecture workspace. You can rename it later."
      )
    ).toBeInTheDocument()
  })

  it("shows placeholder helper text when the name is empty", () => {
    renderDialog({ name: "", slug: "" })
    expect(
      screen.getByText("Enter a name to see the project URL")
    ).toBeInTheDocument()
  })

  it("shows the live slug preview once a name is provided", () => {
    renderDialog({ name: "My Project", slug: "my-project" })
    expect(screen.getByText("/my-project")).toBeInTheDocument()
  })

  it("reflects the name prop in the input value", () => {
    renderDialog({ name: "Existing value" })
    expect(screen.getByPlaceholderText("Project name")).toHaveValue(
      "Existing value"
    )
  })

  it("calls onNameChange when the user types", async () => {
    const user = userEvent.setup()
    const { props } = renderDialog({ name: "" })

    await user.type(screen.getByPlaceholderText("Project name"), "a")

    expect(props.onNameChange).toHaveBeenCalledWith("a")
  })

  it("disables the submit button when the name is empty", () => {
    renderDialog({ name: "" })
    expect(screen.getByRole("button", { name: "Create project" })).toBeDisabled()
  })

  it("disables the submit button when isLoading is true even with a name", () => {
    renderDialog({ name: "Something", isLoading: true })
    expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled()
  })

  it("enables the submit button when a non-empty name is present and not loading", () => {
    renderDialog({ name: "Something" })
    expect(screen.getByRole("button", { name: "Create project" })).toBeEnabled()
  })

  it("shows loading label while isLoading is true", () => {
    renderDialog({ name: "Something", isLoading: true })
    expect(screen.getByText("Creating...")).toBeInTheDocument()
  })

  it("calls onSubmit when the form is submitted via the submit button", async () => {
    const user = userEvent.setup()
    const { props } = renderDialog({ name: "Something" })

    await user.click(screen.getByRole("button", { name: "Create project" }))

    expect(props.onSubmit).toHaveBeenCalledTimes(1)
  })

  it("does not call onSubmit when the button is disabled", async () => {
    const user = userEvent.setup()
    const { props } = renderDialog({ name: "" })

    await user.click(screen.getByRole("button", { name: "Create project" }))

    expect(props.onSubmit).not.toHaveBeenCalled()
  })
})