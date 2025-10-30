import { useState } from 'react'
import {
  Page,
  PageSection,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Button,
  Split,
  SplitItem,
  Brand,
} from '@patternfly/react-core'
import {
  PlayIcon,
  SaveIcon,
  FolderOpenIcon,
  CogIcon,
  CodeIcon,
  TerminalIcon,
} from '@patternfly/react-icons'
import Editor from './components/Editor'
import Terminal from './components/Terminal'
import FileExplorer from './components/FileExplorer'
import { useStore } from './store/useStore'
import './styles/App.css'

function App() {
  const [showFileExplorer, setShowFileExplorer] = useState(true)
  const [showTerminal, setShowTerminal] = useState(true)
  const { currentFile, runCode, saveFile } = useStore()

  const handleRun = async () => {
    await runCode()
  }

  const handleSave = async () => {
    await saveFile()
  }

  const Header = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <Brand
            src="/dnalang-redhat-logo.svg"
            alt="DNA Lang Mobile IDE - Powered by Red Hat"
            heights={{ default: '40px' }}
          >
            <Split hasGutter>
              <SplitItem>
                <img src="/dnalang-logo.svg" alt="DNA Lang" height="40" />
              </SplitItem>
              <SplitItem style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  fontFamily: 'Red Hat Display, sans-serif'
                }}>
                  DNA<span style={{ color: '#0066cc' }}>Lang</span>
                </span>
                <span style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  fontFamily: 'Red Hat Text, sans-serif'
                }}>
                  Mobile IDE
                </span>
              </SplitItem>
            </Split>
          </Brand>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarGroup variant="icon-button-group">
              <ToolbarItem>
                <Button
                  variant="primary"
                  icon={<PlayIcon />}
                  onClick={handleRun}
                  isDisabled={!currentFile}
                >
                  Run
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="secondary"
                  icon={<SaveIcon />}
                  onClick={handleSave}
                  isDisabled={!currentFile}
                >
                  Save
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="plain"
                  icon={<FolderOpenIcon />}
                  onClick={() => setShowFileExplorer(!showFileExplorer)}
                  aria-label="Toggle file explorer"
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="plain"
                  icon={<TerminalIcon />}
                  onClick={() => setShowTerminal(!showTerminal)}
                  aria-label="Toggle terminal"
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="plain"
                  icon={<CogIcon />}
                  aria-label="Settings"
                />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup align={{ default: 'alignRight' }}>
              <ToolbarItem>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  background: '#ee0000',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  color: 'white',
                  fontFamily: 'Red Hat Text, sans-serif',
                  fontWeight: 500
                }}>
                  Powered by Red Hat
                </div>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  )

  return (
    <Page header={Header} className="dnalang-app">
      <PageSection isFilled padding={{ default: 'noPadding' }}>
        <div className="ide-layout">
          {showFileExplorer && (
            <div className="file-explorer-panel">
              <FileExplorer />
            </div>
          )}
          <div className="editor-panel">
            <div className="editor-container">
              <Editor />
            </div>
            {showTerminal && (
              <div className="terminal-container">
                <Terminal />
              </div>
            )}
          </div>
        </div>
      </PageSection>
    </Page>
  )
}

export default App
