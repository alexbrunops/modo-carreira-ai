// components/ToggleSection.jsx
import React from 'react';
import { useToggle } from '../hooks/useToggle';

export function ToggleSection({ 
    sectionId, 
    title, 
    children, 
    defaultOpen = true,
    badge = null,
    icon = '📦'
}) {
    const { isOpen, toggle } = useToggle(defaultOpen);

    return (
        <div className="type-section">
            <div className="type-section-header">
                <div className="type-section-header-left">
                    <span className="type-section-icon">{icon}</span>
                    <span className="type-section-label">{title}</span>
                    {badge && <span className="type-section-badge">{badge}</span>}
                </div>
                <div className="type-section-header-right">
                    <button 
                        type="button" 
                        className="toggle-section-btn"
                        onClick={toggle}
                        aria-expanded={isOpen}
                    >
                        <span className="toggle-icon">{isOpen ? '▼' : '▶'}</span>
                        <span className="toggle-label">
                            {isOpen ? 'Ocultar detalhes' : 'Mostrar detalhes'}
                        </span>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="type-section-body" id={sectionId}>
                    {children}
                </div>
            )}
        </div>
    );
}