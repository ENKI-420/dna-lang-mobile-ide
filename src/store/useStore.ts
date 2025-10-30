import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { executeDNALang } from '../dnalang/executor'

export interface FileItem {
  id: string
  name: string
  path: string
  content: string
  language: 'dnalang' | 'javascript' | 'typescript'
  lastModified: number
}

export interface TerminalLine {
  text: string
  type: 'output' | 'error' | 'info' | 'success'
  timestamp: number
}

interface StoreState {
  files: FileItem[]
  currentFile: FileItem | null
  terminalOutput: TerminalLine[]

  // File operations
  createFile: (name: string, content?: string) => void
  deleteFile: (id: string) => void
  updateFileContent: (id: string, content: string) => void
  setCurrentFile: (id: string) => void
  saveFile: () => Promise<void>

  // Terminal operations
  addTerminalOutput: (text: string, type?: TerminalLine['type']) => void
  clearTerminal: () => void

  // Code execution
  runCode: () => Promise<void>
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      files: [
        {
          id: 'welcome',
          name: 'welcome.dna',
          path: '/welcome.dna',
          content: `// Welcome to DNA Lang Mobile IDE
// Powered by Red Hat OpenShift Dev Spaces

// DNA Lang is a modern programming language
// designed for genetic algorithms and bio-inspired computing

function greet(name) {
  console.log("Hello from DNA Lang, " + name + "!");
  console.log("Running on Red Hat OpenShift!");
}

greet("Developer");

// Try running this code!
// Click the "Run" button in the toolbar above
`,
          language: 'dnalang',
          lastModified: Date.now(),
        },
      ],
      currentFile: null,
      terminalOutput: [],

      createFile: (name: string, content = '') => {
        const newFile: FileItem = {
          id: `file-${Date.now()}`,
          name,
          path: `/${name}`,
          content,
          language: name.endsWith('.dna') ? 'dnalang' : 'javascript',
          lastModified: Date.now(),
        }
        set((state) => ({
          files: [...state.files, newFile],
          currentFile: newFile,
        }))
      },

      deleteFile: (id: string) => {
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
          currentFile: state.currentFile?.id === id ? null : state.currentFile,
        }))
      },

      updateFileContent: (id: string, content: string) => {
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id
              ? { ...f, content, lastModified: Date.now() }
              : f
          ),
          currentFile:
            state.currentFile?.id === id
              ? { ...state.currentFile, content, lastModified: Date.now() }
              : state.currentFile,
        }))
      },

      setCurrentFile: (id: string) => {
        const file = get().files.find((f) => f.id === id)
        if (file) {
          set({ currentFile: file })
        }
      },

      saveFile: async () => {
        const { currentFile, addTerminalOutput } = get()
        if (currentFile) {
          // In a real implementation, this would save to a backend or local storage
          addTerminalOutput(`Saved: ${currentFile.name}`, 'success')
        }
      },

      addTerminalOutput: (text: string, type: TerminalLine['type'] = 'output') => {
        set((state) => ({
          terminalOutput: [
            ...state.terminalOutput,
            { text, type, timestamp: Date.now() },
          ],
        }))
      },

      clearTerminal: () => {
        set({ terminalOutput: [] })
      },

      runCode: async () => {
        const { currentFile, addTerminalOutput, clearTerminal } = get()

        if (!currentFile) {
          addTerminalOutput('No file selected', 'error')
          return
        }

        clearTerminal()
        addTerminalOutput('--- DNA Lang Execution Started ---', 'info')
        addTerminalOutput(`Running: ${currentFile.name}`, 'info')
        addTerminalOutput('', 'output')

        try {
          const result = await executeDNALang(currentFile.content)

          result.output.forEach((line) => {
            addTerminalOutput(line, 'output')
          })

          if (result.errors.length > 0) {
            addTerminalOutput('', 'output')
            addTerminalOutput('Errors:', 'error')
            result.errors.forEach((error) => {
              addTerminalOutput(error, 'error')
            })
          } else {
            addTerminalOutput('', 'output')
            addTerminalOutput('✓ Execution completed successfully', 'success')
          }
        } catch (error) {
          addTerminalOutput(`Error: ${error}`, 'error')
        }

        addTerminalOutput('', 'output')
        addTerminalOutput('--- DNA Lang Execution Completed ---', 'info')
      },
    }),
    {
      name: 'dnalang-mobile-ide-storage',
      partialize: (state) => ({
        files: state.files,
      }),
    }
  )
)
