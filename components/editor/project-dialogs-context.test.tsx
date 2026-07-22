import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  ProjectDialogsProvider,
  useProjectDialogsContext,
} from "@/components/editor/project-dialogs-context"
import { mockProjects } from "@/lib/projects"

function Consumer() {
  const { projects, openCreateDialog, openRenameDialog, openDeleteDialog } =
    useProjectDialogsContext()
  return (
    <div>
      <span data-testid="project-count">{projects.length}</span>
      <button onClick={openCreateDialog}>trigger-create</button>
      <button onClick={() => openRenameDialog(projects[0])}>
        trigger-rename
      </button>
      <button onClick={() => openDeleteDialog(projects[0])}>
        trigger-delete
      </button>
    </div>
  )
}

describe("useProjectDialogsContext", () => {
  it("throws when used outside of ProjectDialogsProvider", () => {
    // Swallow the expected React error boundary console output.
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow(
      "useProjectDialogsContext must be used within ProjectDialogsProvider"
    )
    errorSpy.mockRestore()
  })
})

describe("ProjectDialogsProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders children and exposes the mock projects via context", () => {
    render(
      <ProjectDialogsProvider>
        <Consumer />
      </ProjectDialogsProvider>
    )

    expect(screen.getByTestId("project-count")).toHaveTextContent(
      String(mockProjects.length)
    )
  })

  it("renders no dialog content by default", () => {
    render(
      <ProjectDialogsProvider>
        <Consumer />
      </ProjectDialogsProvider>
    )

    expect(screen.queryByText("Create project")).not.toBeInTheDocument()
    expect(screen.queryByText("Rename project")).not.toBeInTheDocument()
    expect(screen.queryByText("Delete project")).not.toBeInTheDocument()
  })

  it("openCreateDialog opens the create dialog", async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <ProjectDialogsProvider>
        <Consumer />
      </ProjectDialogsProvider>
    )

    await user.click(screen.getByText("trigger-create"))

    expect(screen.getByText("Create project")).toBeInTheDocument()
    expect(screen.queryByText("Rename project")).not.toBeInTheDocument()
  })

  it("openRenameDialog opens the rename dialog naming the target project", async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <ProjectDialogsProvider>
        <Consumer />
      </ProjectDialogsProvider>
    )

    await user.click(screen.getByText("trigger-rename"))

    expect(screen.getByText("Rename project")).toBeInTheDocument()
    expect(
      screen.getByText(`Choose a new name for ${mockProjects[0].name}.`)
    ).toBeInTheDocument()
  })

  it("openDeleteDialog opens the delete dialog naming the target project", async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <ProjectDialogsProvider>
        <Consumer />
      </ProjectDialogsProvider>
    )

    await user.click(screen.getByText("trigger-delete"))

    expect(screen.getByText("Delete project")).toBeInTheDocument()
    expect(
      screen.getByText(
        `This permanently deletes ${mockProjects[0].name}. This action cannot be undone.`
      )
    ).toBeInTheDocument()
  })

  it("only one dialog is open at a time", async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <ProjectDialogsProvider>
        <Consumer />
      </ProjectDialogsProvider>
    )

    await user.click(screen.getByText("trigger-rename"))
    expect(screen.getByText("Rename project")).toBeInTheDocument()

    await user.click(screen.getByText("trigger-delete"))
    expect(screen.queryByText("Rename project")).not.toBeInTheDocument()
    expect(screen.getByText("Delete project")).toBeInTheDocument()
  })

  it("does not close the dialog while a submission is in flight", async () => {
    render(
      <ProjectDialogsProvider>
        <Consumer />
      </ProjectDialogsProvider>
    )

    fireEvent.click(screen.getByText("trigger-create"))

    const nameInput = screen.getByPlaceholderText("Project name")
    fireEvent.change(nameInput, { target: { value: "New Name" } })

    const submitButton = screen.getByRole("button", { name: "Create project" })
    fireEvent.click(submitButton)

    // Loading state: attempting to close should be a no-op.
    expect(screen.getByText("Creating...")).toBeInTheDocument()
    const closeButton = screen.getByRole("button", { name: /close/i })
    fireEvent.click(closeButton)
    expect(screen.getByText("Create project")).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(screen.queryByText("Create project")).not.toBeInTheDocument()
  })
})