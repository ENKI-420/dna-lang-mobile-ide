import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { useStore } from '../store/useStore'
import './Editor.css'

const Editor = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const { currentFile, updateFileContent } = useStore()

  useEffect(() => {
    if (!editorRef.current) return

    // Create initial editor state
    const startState = EditorState.create({
      doc: currentFile?.content || '// Welcome to DNA Lang Mobile IDE\n// Powered by Red Hat OpenShift Dev Spaces\n\nfunction hello() {\n  console.log("Hello from DNA Lang!");\n}\n\nhello();',
      extensions: [
        basicSetup,
        javascript(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const content = update.state.doc.toString()
            if (currentFile) {
              updateFileContent(currentFile.id, content)
            }
          }
        }),
        // Mobile-friendly settings
        EditorView.lineWrapping,
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
          },
          '.cm-scroller': {
            overflow: 'auto',
            fontFamily: 'Red Hat Mono, monospace',
          },
          '.cm-content': {
            padding: '10px 0',
          },
          '.cm-gutters': {
            backgroundColor: '#1e1e1e',
            color: '#858585',
            border: 'none',
          },
        }),
      ],
    })

    // Create editor view
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [])

  // Update editor content when current file changes
  useEffect(() => {
    if (viewRef.current && currentFile) {
      const currentContent = viewRef.current.state.doc.toString()
      if (currentContent !== currentFile.content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: currentFile.content,
          },
        })
      }
    }
  }, [currentFile])

  return (
    <div className="editor-wrapper">
      {currentFile && (
        <div className="editor-header">
          <span className="file-name">{currentFile.name}</span>
          <span className="file-path">{currentFile.path}</span>
        </div>
      )}
      <div ref={editorRef} className="editor-container" />
    </div>
  )
}

export default Editor
