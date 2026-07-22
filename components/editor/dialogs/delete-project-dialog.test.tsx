import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog"
import type { Project } from "@/lib/projects"

const project: Project = {
  id: "1",
  name: "Checkout Redesign",
  slug: "checkout-redesign",
  role: "owner",
}

function renderDialog(
  overrides: Partial<Parameters<typeof DeleteProjectDialog>[0]> = {}
) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    project,
    isLoading: false,
    onConfirm: vi.fn(),
    ...overrides,
  }
  const utils = render(<DeleteProjectDialog {...props} />)
  return { ...utils, props }
}

describe("DeleteProjectDialog", () => {
  it("does not render its content when closed", () => {
    renderDialog({ open: false })
    expect(screen.queryByText("Delete project")).not.toBeInTheDocument()
  })

  it("renders the title when open", () => {
    renderDialog()
    expect(screen.getByText("Delete project")).toBeInTheDocument()
  })

  it("names the project in the confirmation description", () => {
    renderDialog()
    expect(
      screen.getByText(
        "This permanently deletes Checkout Redesign. This action cannot be undone."
      )
    ).toBeInTheDocument()
  })

  it("falls back to generic wording when project is null", () => {
    renderDialog({ project: null })
    expect(
      screen.getByText(
        "This permanently deletes this project. This action cannot be undone."
      )
    ).toBeInTheDocument()
  })

  it("uses destructive styling for the confirm button", () => {
    renderDialog()
    const button = screen.getByRole("button", { name: "Delete project" })
    expect(button.className).toMatch(/destructive/)
  })

  it("shows the loading label and disables the button while isLoading", () => {
    renderDialog({ isLoading: true })
    const button = screen.getByRole("button", { name: "Deleting..." })
    expect(button).toBeDisabled()
  })

  it("calls onConfirm when the confirm button is clicked", async () => {
    const user = userEvent.setup()
    const { props } = renderDialog()

    await user.click(screen.getByRole("button", { name: "Delete project" }))

    expect(props.onConfirm).toHaveBeenCalledTimes(1)
  })

  it("does not call onConfirm when disabled due to isLoading", async () => {
    const user = userEvent.setup()
    const { props } = renderDialog({ isLoading: true })

    await user.click(screen.getByRole("button", { name: "Deleting..." }))

    expect(props.onConfirm).not.toHaveBeenCalled()
  })
})