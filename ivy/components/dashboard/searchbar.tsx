"use client"
import React from 'react'

export default function Searchbar() {
  return (
    <>
        {(() => {
            function PopoverSearch() {
                const [open, setOpen] = React.useState(false)
                const [query, setQuery] = React.useState('')
                const [activeIndex, setActiveIndex] = React.useState(0)
                const containerRef = React.useRef<HTMLDivElement | null>(null)
                const inputRef = React.useRef<HTMLInputElement | null>(null)

                const items = [
                    'Dashboard',
                    'Projects',
                    'Issues',
                    'Pull requests',
                    'Users',
                    'Settings',
                    'Notifications',
                    'Help'
                ]

                const results = React.useMemo(() => {
                    const q = query.trim().toLowerCase()
                    return q === '' ? items : items.filter((it) => it.toLowerCase().includes(q))
                }, [query])

                React.useEffect(() => {
                    function onGlobalKey(e: KeyboardEvent) {
                        // Toggle with Ctrl/Cmd + K
                        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                            e.preventDefault()
                            setOpen((v) => !v)
                            // focus input on next tick
                            setTimeout(() => inputRef.current?.focus(), 0)
                        }
                        if (e.key === 'Escape') {
                            setOpen(false)
                        }
                    }
                    window.addEventListener('keydown', onGlobalKey)
                    return () => window.removeEventListener('keydown', onGlobalKey)
                }, [])

                React.useEffect(() => {
                    function onDocClick(ev: MouseEvent) {
                        if (!open) return
                        if (containerRef.current && !containerRef.current.contains(ev.target as Node)) {
                            setOpen(false)
                        }
                    }
                    document.addEventListener('mousedown', onDocClick)
                    return () => document.removeEventListener('mousedown', onDocClick)
                }, [open])

                function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setActiveIndex((i) => Math.max(i - 1, 0))
                    } else if (e.key === 'Enter') {
                        e.preventDefault()
                        if (results[activeIndex]) {
                            setQuery(results[activeIndex])
                            setOpen(false)
                        }
                    } else if (e.key === 'Escape') {
                        setOpen(false)
                    }
                }

                return (
                    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                            onClick={() => {
                                setOpen((v) => !v)
                                setTimeout(() => inputRef.current?.focus(), 0)
                            }}
                            aria-expanded={open}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 6,
                                border: '1px solid #ddd',
                                background: '#fff',
                                cursor: 'pointer'
                            }}
                            title="Toggle search (Ctrl/Cmd+K)"
                        >
                            Search ⌘K
                        </button>

                        {open && (
                            <div
                                role="dialog"
                                aria-modal="false"
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 8px)',
                                    right: 0,
                                    width: 320,
                                    background: '#fff',
                                    border: '1px solid #e6e6e6',
                                    borderRadius: 8,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                                    zIndex: 1000,
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ padding: 10 }}>
                                    <input
                                        ref={inputRef}
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value)
                                            setActiveIndex(0)
                                        }}
                                        onKeyDown={onInputKeyDown}
                                        placeholder="Search..."
                                        aria-label="Search"
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: 6,
                                            border: '1px solid #ccc',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <ul
                                    role="listbox"
                                    aria-activedescendant={results[activeIndex] ?? undefined}
                                    style={{
                                        listStyle: 'none',
                                        margin: 0,
                                        padding: 8,
                                        maxHeight: 200,
                                        overflowY: 'auto'
                                    }}
                                >
                                    {results.length === 0 ? (
                                        <li style={{ padding: 8, color: '#666' }}>No results</li>
                                    ) : (
                                        results.map((r, i) => (
                                            <li
                                                id={r}
                                                key={r}
                                                role="option"
                                                aria-selected={i === activeIndex}
                                                onMouseEnter={() => setActiveIndex(i)}
                                                onClick={() => {
                                                    setQuery(r)
                                                    setOpen(false)
                                                }}
                                                style={{
                                                    padding: '8px 10px',
                                                    borderRadius: 6,
                                                    background: i === activeIndex ? '#f3f4f6' : 'transparent',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {r}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )
            }

            return <PopoverSearch />
        })()}
    </>
  )
}
