import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { EditorChrome } from "@/components/editor/editor-chrome"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"

vi.mock("@/components/editor/editor-navbar", () => ({
  EditorNavbar: ({
    isSidebarOpen,
    onToggleSidebar,
  }: {
    isSidebarOpen: boolean
    onToggleSidebar: () => void
  }) => (
    <div>
      <span data-testid="navbar-sidebar-state">
        {isSidebarOpen ? "open" : "closed"}
      </span>
      <button onClick={onToggleSidebar}>toggle-sidebar</button>
    </div>
  ),
}))

vi.mock("@/components/editor/project-sidebar", () => ({
  ProjectSidebar: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean
    onClose: () => void
  }) => (
    <div>
      <span data-testid="sidebar-open-state">{isOpen ? "open" : "closed"}</span>
      <button onClick={onClose}>close-sidebar</button>
    </div>
  ),
}))

function ContextConsumer() {
  const { projects } = useProjectDialogsContext()
  return <div data-testid="child-project-count">{projects.length}</div>
}

describe("EditorChrome", () => {
  it("renders its children inside main content", () => {
    render(
      <EditorChrome>
        <div data-testid="page-content">hello</div>
      </EditorChrome>
    )

    expect(screen.getByTestId("page-content")).toBeInTheDocument()
  })

  it("starts with the sidebar closed", () => {
    render(
      <EditorChrome>
        <div />
      </EditorChrome>
    )

    expect(screen.getByTestId("navbar-sidebar-state")).toHaveTextContent(
      "closed"
    )
    expect(screen.getByTestId("sidebar-open-state")).toHaveTextContent(
      "closed"
    )
  })

  it("toggles the sidebar open and closed via the navbar toggle button", async () => {
    const user = userEvent.setup()
    render(
      <EditorChrome>
        <div />
      </EditorChrome>
    )

    await user.click(screen.getByText("toggle-sidebar"))
    expect(screen.getByTestId("navbar-sidebar-state")).toHaveTextContent(
      "open"
    )
    expect(screen.getByTestId("sidebar-open-state")).toHaveTextContent("open")

    await user.click(screen.getByText("toggle-sidebar"))
    expect(screen.getByTestId("navbar-sidebar-state")).toHaveTextContent(
      "closed"
    )
    expect(screen.getByTestId("sidebar-open-state")).toHaveTextContent(
      "closed"
    )
  })

  it("closes the sidebar via the sidebar's onClose callback", async () => {
    const user = userEvent.setup()
    render(
      <EditorChrome>
        <div />
      </EditorChrome>
    )

    await user.click(screen.getByText("toggle-sidebar"))
    expect(screen.getByTestId("sidebar-open-state")).toHaveTextContent("open")

    await user.click(screen.getByText("close-sidebar"))
    expect(screen.getByTestId("sidebar-open-state")).toHaveTextContent(
      "closed"
    )
    expect(screen.getByTestId("navbar-sidebar-state")).toHaveTextContent(
      "closed"
    )
  })

  it("provides the project dialogs context to its children", () => {
    render(
      <EditorChrome>
        <ContextConsumer />
      </EditorChrome>
    )

    // Does not throw, and forwards the mock project list length (3).
    expect(screen.getByTestId("child-project-count")).toHaveTextContent("3")
  })
})