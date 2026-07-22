import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function BasicMenu({
  onRename = vi.fn(),
  onDelete = vi.fn(),
}: {
  onRename?: () => void
  onDelete?: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe("DropdownMenu", () => {
  it("does not render menu items before the trigger is activated", () => {
    render(<BasicMenu />)
    expect(screen.queryByText("Rename")).not.toBeInTheDocument()
    expect(screen.queryByText("Delete")).not.toBeInTheDocument()
  })

  it("opens the menu and shows its items when the trigger is clicked", async () => {
    const user = userEvent.setup()
    render(<BasicMenu />)

    await user.click(screen.getByText("Open menu"))

    expect(await screen.findByText("Rename")).toBeInTheDocument()
    expect(screen.getByText("Delete")).toBeInTheDocument()
    expect(screen.getByText("Actions")).toBeInTheDocument()
  })

  it("invokes the item's onClick handler when clicked", async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<BasicMenu onRename={onRename} />)

    await user.click(screen.getByText("Open menu"))
    await user.click(await screen.findByText("Rename"))

    expect(onRename).toHaveBeenCalledTimes(1)
  })

  it("marks destructive items with data-variant='destructive'", async () => {
    const user = userEvent.setup()
    render(<BasicMenu />)

    await user.click(screen.getByText("Open menu"))
    const deleteItem = await screen.findByText("Delete")

    expect(deleteItem.closest('[data-slot="dropdown-menu-item"]')).toHaveAttribute(
      "data-variant",
      "destructive"
    )
  })

  it("defaults non-destructive items to data-variant='default'", async () => {
    const user = userEvent.setup()
    render(<BasicMenu />)

    await user.click(screen.getByText("Open menu"))
    const renameItem = await screen.findByText("Rename")

    expect(renameItem.closest('[data-slot="dropdown-menu-item"]')).toHaveAttribute(
      "data-variant",
      "default"
    )
  })

  it("renders a separator between items", async () => {
    const user = userEvent.setup()
    const { container } = render(<BasicMenu />)

    await user.click(screen.getByText("Open menu"))
    await screen.findByText("Rename")

    expect(
      container.querySelector('[data-slot="dropdown-menu-separator"]')
    ).toBeInTheDocument()
  })

  it("invokes the delete item's onClick handler independently from rename", async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    const onDelete = vi.fn()
    render(<BasicMenu onRename={onRename} onDelete={onDelete} />)

    await user.click(screen.getByText("Open menu"))
    await user.click(await screen.findByText("Delete"))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onRename).not.toHaveBeenCalled()
  })
})