import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ProjectSidebar } from "@/components/editor/project-sidebar"
import type { Project } from "@/lib/projects"

const openCreateDialog = vi.fn()
const openRenameDialog = vi.fn()
const openDeleteDialog = vi.fn()

let projectsState: Project[] = []

vi.mock("@/components/editor/project-dialogs-context", () => ({
  useProjectDialogsContext: () => ({
    projects: projectsState,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
  }),
}))

const ownedProject: Project = {
  id: "1",
  name: "Checkout Redesign",
  slug: "checkout-redesign",
  role: "owner",
}
const secondOwnedProject: Project = {
  id: "2",
  name: "Notification Service",
  slug: "notification-service",
  role: "owner",
}
const sharedProject: Project = {
  id: "3",
  name: "Payments Platform",
  slug: "payments-platform",
  role: "collaborator",
}

function setup(projects: Project[]) {
  projectsState = projects
  return render(<ProjectSidebar isOpen onClose={vi.fn()} />)
}

describe("ProjectSidebar", () => {
  afterEach(() => {
    openCreateDialog.mockClear()
    openRenameDialog.mockClear()
    openDeleteDialog.mockClear()
  })

  it("shows an empty state for My Projects when there are no owned projects", () => {
    setup([sharedProject])
    expect(screen.getByText("No projects yet")).toBeInTheDocument()
  })

  it("lists owned projects under My Projects", () => {
    setup([ownedProject, secondOwnedProject, sharedProject])
    expect(screen.getByText("Checkout Redesign")).toBeInTheDocument()
    expect(screen.getByText("Notification Service")).toBeInTheDocument()
  })

  it("shows an empty state for Shared when there are no collaborator projects", async () => {
    const user = userEvent.setup()
    setup([ownedProject])

    await user.click(screen.getByRole("tab", { name: "Shared" }))

    expect(screen.getByText("No shared projects yet")).toBeInTheDocument()
  })

  it("lists shared projects under the Shared tab without row actions", async () => {
    const user = userEvent.setup()
    setup([ownedProject, sharedProject])

    await user.click(screen.getByRole("tab", { name: "Shared" }))

    expect(screen.getByText("Payments Platform")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Payments Platform actions" })
    ).not.toBeInTheDocument()
  })

  it("shows a row actions menu trigger for owned projects only", () => {
    setup([ownedProject, sharedProject])

    expect(
      screen.getByRole("button", { name: "Checkout Redesign actions" })
    ).toBeInTheDocument()
  })

  it("opens the create dialog when New Project is clicked", async () => {
    const user = userEvent.setup()
    setup([])

    await user.click(screen.getByRole("button", { name: /new project/i }))

    expect(openCreateDialog).toHaveBeenCalledTimes(1)
  })

  it("calls openRenameDialog with the project when Rename is selected from the row menu", async () => {
    const user = userEvent.setup()
    setup([ownedProject])

    await user.click(
      screen.getByRole("button", { name: "Checkout Redesign actions" })
    )
    await user.click(await screen.findByRole("menuitem", { name: /rename/i }))

    expect(openRenameDialog).toHaveBeenCalledWith(ownedProject)
  })

  it("calls openDeleteDialog with the project when Delete is selected from the row menu", async () => {
    const user = userEvent.setup()
    setup([ownedProject])

    await user.click(
      screen.getByRole("button", { name: "Checkout Redesign actions" })
    )
    await user.click(await screen.findByRole("menuitem", { name: /delete/i }))

    expect(openDeleteDialog).toHaveBeenCalledWith(ownedProject)
  })

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    projectsState = []
    render(<ProjectSidebar isOpen onClose={onClose} />)

    await user.click(screen.getByRole("button", { name: "Close sidebar" }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when the mobile backdrop is clicked", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    projectsState = []
    const { container } = render(<ProjectSidebar isOpen onClose={onClose} />)

    const backdrop = container.querySelector('[aria-hidden="true"]')
    expect(backdrop).not.toBeNull()
    await user.click(backdrop as Element)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("keeps the backdrop non-interactive (opacity-0, pointer-events-none) when closed", () => {
    projectsState = []
    const { container } = render(
      <ProjectSidebar isOpen={false} onClose={vi.fn()} />
    )

    const backdrop = container.querySelector('[aria-hidden="true"]')
    expect(backdrop?.className).toMatch(/opacity-0/)
    expect(backdrop?.className).toMatch(/pointer-events-none/)
  })
})