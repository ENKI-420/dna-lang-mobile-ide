import { useState } from 'react'
import {
  TreeView,
  TreeViewDataItem,
} from '@patternfly/react-core'
import {
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  CodeIcon,
} from '@patternfly/react-icons'
import { useStore } from '../store/useStore'
import './FileExplorer.css'

const FileExplorer = () => {
  const { files, currentFile, setCurrentFile, createFile } = useStore()
  const [expandedIds, setExpandedIds] = useState<string[]>(['root'])

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:')
    if (fileName) {
      createFile(fileName, '// New DNA Lang file\n')
    }
  }

  const buildTreeData = (): TreeViewDataItem[] => {
    return [
      {
        name: 'DNA Lang Project',
        id: 'root',
        icon: <FolderOpenIcon />,
        children: files.map((file) => ({
          name: file.name,
          id: file.id,
          icon: <CodeIcon />,
          defaultExpanded: false,
        })),
      },
    ]
  }

  const onSelect = (_event: React.MouseEvent, item: TreeViewDataItem) => {
    const file = files.find((f) => f.id === item.id)
    if (file) {
      setCurrentFile(file.id)
    }
  }

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3 className="explorer-title">Explorer</h3>
        <button className="new-file-btn" onClick={handleCreateFile} title="New File">
          <CodeIcon /> New
        </button>
      </div>
      <div className="file-explorer-content">
        <TreeView
          data={buildTreeData()}
          activeItems={currentFile ? [currentFile.id] : []}
          onSelect={onSelect}
          expandedNodeIds={expandedIds}
          onExpand={(_event, item) => {
            if (expandedIds.includes(item.id as string)) {
              setExpandedIds(expandedIds.filter((id) => id !== item.id))
            } else {
              setExpandedIds([...expandedIds, item.id as string])
            }
          }}
        />
        {files.length === 0 && (
          <div className="empty-explorer">
            <p>No files yet</p>
            <button onClick={handleCreateFile}>Create your first file</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileExplorer
