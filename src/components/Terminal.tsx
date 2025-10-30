import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import './Terminal.css'

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const { terminalOutput, clearTerminal } = useStore()

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  return (
    <div className="terminal-wrapper">
      <div className="terminal-header">
        <span className="terminal-title">Terminal - DNA Lang Output</span>
        <button className="terminal-clear-btn" onClick={clearTerminal}>
          Clear
        </button>
      </div>
      <div ref={terminalRef} className="terminal-content">
        {terminalOutput.length === 0 ? (
          <div className="terminal-welcome">
            <p>DNA Lang Mobile IDE Terminal</p>
            <p>Powered by Red Hat OpenShift Dev Spaces</p>
            <p>Ready to execute DNA Lang code...</p>
          </div>
        ) : (
          terminalOutput.map((line, index) => (
            <div
              key={index}
              className={`terminal-line ${line.type}`}
            >
              <span className="terminal-prompt">
                {line.type === 'error' ? '[ERROR]' : line.type === 'info' ? '[INFO]' : '►'}
              </span>
              <span className="terminal-text">{line.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Terminal
