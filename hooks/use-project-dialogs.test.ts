import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { mockProjects } from "@/lib/projects"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

async function flushSubmit(promise: Promise<void>) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(400)
    await promise
  })
}

describe("useProjectDialogs", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("initializes with the mock projects and no dialog open", () => {
    const { result } = renderHook(() => useProjectDialogs())

    expect(result.current.projects).toHaveLength(mockProjects.length)
    expect(result.current.projects.map((p) => p.id)).toEqual(
      mockProjects.map((p) => p.id)
    )
    expect(result.current.dialogType).toBeNull()
    expect(result.current.activeProject).toBeNull()
    expect(result.current.name).toBe("")
    expect(result.current.slug).toBe("")
    expect(result.current.isLoading).toBe(false)
  })

  describe("openCreateDialog", () => {
    it("opens the create dialog and clears name/active project", () => {
      const { result } = renderHook(() => useProjectDialogs())

      act(() => {
        result.current.openRenameDialog(mockProjects[0])
      })
      expect(result.current.name).toBe(mockProjects[0].name)

      act(() => {
        result.current.openCreateDialog()
      })

      expect(result.current.dialogType).toBe("create")
      expect(result.current.name).toBe("")
      expect(result.current.activeProject).toBeNull()
    })
  })

  describe("openRenameDialog", () => {
    it("opens the rename dialog prefilled with the project's name", () => {
      const { result } = renderHook(() => useProjectDialogs())
      const project = mockProjects[0]

      act(() => {
        result.current.openRenameDialog(project)
      })

      expect(result.current.dialogType).toBe("rename")
      expect(result.current.activeProject).toEqual(project)
      expect(result.current.name).toBe(project.name)
    })
  })

  describe("openDeleteDialog", () => {
    it("opens the delete dialog and sets the active project", () => {
      const { result } = renderHook(() => useProjectDialogs())
      const project = mockProjects[1]

      act(() => {
        result.current.openDeleteDialog(project)
      })

      expect(result.current.dialogType).toBe("delete")
      expect(result.current.activeProject).toEqual(project)
    })

    it("does not clear the name field (only create/close reset it)", () => {
      const { result } = renderHook(() => useProjectDialogs())

      act(() => {
        result.current.openRenameDialog(mockProjects[0])
      })
      expect(result.current.name).toBe(mockProjects[0].name)

      act(() => {
        result.current.openDeleteDialog(mockProjects[1])
      })

      expect(result.current.name).toBe(mockProjects[0].name)
    })
  })

  describe("closeDialog", () => {
    it("resets dialogType, activeProject, and name", () => {
      const { result } = renderHook(() => useProjectDialogs())

      act(() => {
        result.current.openRenameDialog(mockProjects[0])
      })

      act(() => {
        result.current.closeDialog()
      })

      expect(result.current.dialogType).toBeNull()
      expect(result.current.activeProject).toBeNull()
      expect(result.current.name).toBe("")
    })
  })

  describe("setName / slug", () => {
    it("derives slug from the current name on every change", () => {
      const { result } = renderHook(() => useProjectDialogs())

      act(() => {
        result.current.setName("My New Project")
      })

      expect(result.current.name).toBe("My New Project")
      expect(result.current.slug).toBe("my-new-project")
    })
  })

  describe("submitCreate", () => {
    it("does nothing if the name is empty or whitespace-only", async () => {
      const { result } = renderHook(() => useProjectDialogs())

      act(() => {
        result.current.openCreateDialog()
      })
      act(() => {
        result.current.setName("   ")
      })

      await act(async () => {
        await result.current.submitCreate()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.dialogType).toBe("create")
      expect(result.current.projects).toHaveLength(mockProjects.length)
    })

    it("adds a new owner project after the simulated delay and closes the dialog", async () => {
      vi.spyOn(crypto, "randomUUID").mockReturnValue(
        "11111111-1111-1111-1111-111111111111"
      )
      const { result } = renderHook(() => useProjectDialogs())

      act(() => {
        result.current.openCreateDialog()
      })
      act(() => {
        result.current.setName("Brand New Project")
      })

      let submitPromise!: Promise<void>
      act(() => {
        submitPromise = result.current.submitCreate()
      })

      expect(result.current.isLoading).toBe(true)

      await flushSubmit(submitPromise)

      expect(result.current.isLoading).toBe(false)
      expect(result.current.dialogType).toBeNull()
      expect(result.current.name).toBe("")
      expect(result.current.projects).toHaveLength(mockProjects.length + 1)

      const created = result.current.projects.at(-1)
      expect(created).toMatchObject({
        id: "11111111-1111-1111-1111-111111111111",
        name: "Brand New Project",
        slug: "brand-new-project",
        role: "owner",
      })
    })
  })

  describe("submitRename", () => {
    it("does nothing if there is no active project", async () => {
      const { result } = renderHook(() => useProjectDialogs())

      act(() => {
        result.current.setName("Something")
      })

      await act(async () => {
        await result.current.submitRename()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.projects).toEqual(mockProjects)
    })

    it("does nothing if the name is empty or whitespace-only", async () => {
      const { result } = renderHook(() => useProjectDialogs())
      const project = mockProjects[0]

      act(() => {
        result.current.openRenameDialog(project)
      })
      act(() => {
        result.current.setName("   ")
      })

      await act(async () => {
        await result.current.submitRename()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.dialogType).toBe("rename")
      const unchanged = result.current.projects.find((p) => p.id === project.id)
      expect(unchanged?.name).toBe(project.name)
    })

    it("renames the active project and re-slugifies it, leaving others untouched", async () => {
      const { result } = renderHook(() => useProjectDialogs())
      const project = mockProjects[0]

      act(() => {
        result.current.openRenameDialog(project)
      })
      act(() => {
        result.current.setName("Renamed Project")
      })

      let submitPromise!: Promise<void>
      act(() => {
        submitPromise = result.current.submitRename()
      })

      expect(result.current.isLoading).toBe(true)

      await flushSubmit(submitPromise)

      expect(result.current.isLoading).toBe(false)
      expect(result.current.dialogType).toBeNull()

      const renamed = result.current.projects.find((p) => p.id === project.id)
      expect(renamed).toMatchObject({
        name: "Renamed Project",
        slug: "renamed-project",
      })

      const others = result.current.projects.filter((p) => p.id !== project.id)
      others.forEach((other) => {
        const original = mockProjects.find((p) => p.id === other.id)
        expect(other).toEqual(original)
      })
    })
  })

  describe("submitDelete", () => {
    it("does nothing if there is no active project", async () => {
      const { result } = renderHook(() => useProjectDialogs())

      await act(async () => {
        await result.current.submitDelete()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.projects).toHaveLength(mockProjects.length)
    })

    it("removes the active project after the simulated delay and closes the dialog", async () => {
      const { result } = renderHook(() => useProjectDialogs())
      const project = mockProjects[0]

      act(() => {
        result.current.openDeleteDialog(project)
      })

      let submitPromise!: Promise<void>
      act(() => {
        submitPromise = result.current.submitDelete()
      })

      expect(result.current.isLoading).toBe(true)

      await flushSubmit(submitPromise)

      expect(result.current.isLoading).toBe(false)
      expect(result.current.dialogType).toBeNull()
      expect(result.current.activeProject).toBeNull()
      expect(result.current.projects.find((p) => p.id === project.id)).toBeUndefined()
      expect(result.current.projects).toHaveLength(mockProjects.length - 1)
    })
  })
})