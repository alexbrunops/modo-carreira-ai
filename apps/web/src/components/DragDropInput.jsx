import React, { useState, useRef } from 'react';
import '../styles/DragDropInput.css';

function DragDropInput({
    label,
    name,
    value = [],
    onChange,
    options = [],
    placeholder = 'Arraste os valores para cá',
    required = false,
    disabled = false,
    className = ''
}) {
    const [items, setItems] = useState(value);
    const [dragOver, setDragOver] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragItemRef = useRef(null);

    // Atualizar quando value mudar externamente
    React.useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(items)) {
            setItems(value);
        }
    }, [value]);

    // Notificar mudanças
    const updateItems = (newItems) => {
        setItems(newItems);
        if (onChange) {
            onChange(newItems, name);
        }
    };

    // ============================================
    // DRAG FROM OPTIONS
    // ============================================

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData('text/plain', item);
        e.dataTransfer.effectAllowed = 'copy';
        setIsDragging(true);
        dragItemRef.current = item;
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        dragItemRef.current = null;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        setIsDragging(false);

        const droppedItem = e.dataTransfer.getData('text/plain');
        if (droppedItem && !items.includes(droppedItem)) {
            const newItems = [...items, droppedItem];
            updateItems(newItems);
        }
    };

    // ============================================
    // REORDER (Drag dentro da caixa)
    // ============================================

    const handleItemDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        setIsDragging(true);
        dragItemRef.current = index;
    };

    const handleItemDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (draggedIndex !== index) {
            const newItems = [...items];
            const [removed] = newItems.splice(draggedIndex, 1);
            newItems.splice(index, 0, removed);
            updateItems(newItems);
            dragItemRef.current = index;
        }
    };

    const handleItemDragEnd = () => {
        setIsDragging(false);
        dragItemRef.current = null;
    };

    // ============================================
    // ACTIONS
    // ============================================

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        updateItems(newItems);
    };

    const clearAll = () => {
        if (window.confirm('Remover todos os itens?')) {
            updateItems([]);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className={`drag-drop-array ${className}`}>
            <div className="drag-drop-header">
                <label>
                    {label}
                    {required && <span className="required">*</span>}
                </label>
                <div className="drag-drop-actions">
                    {items.length > 0 && (
                        <button 
                            type="button" 
                            className="btn-clear-items"
                            onClick={clearAll}
                            disabled={disabled}
                        >
                            🗑️ Limpar
                        </button>
                    )}
                    <span className="item-counter">{items.length} itens</span>
                </div>
            </div>

            {/* Opções para arrastar */}
            {options.length > 0 && (
                <div className="drag-options">
                    <div className="drag-options-label">📦 Arraste para adicionar:</div>
                    <div className="drag-options-grid">
                        {options.filter(opt => !items.includes(opt)).map((option, index) => (
                            <div
                                key={`${option}-${index}`}
                                className={`drag-option ${isDragging ? 'dragging' : ''}`}
                                draggable={!disabled}
                                onDragStart={(e) => handleDragStart(e, option)}
                                onDragEnd={handleDragEnd}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Área de drop */}
            <div
                className={`drop-area ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {items.length === 0 ? (
                    <div className="drop-placeholder">
                        <span className="drop-icon">📥</span>
                        <p>{placeholder}</p>
                        <small>Arraste os itens de cima ou clique em um item para adicionar</small>
                    </div>
                ) : (
                    <div className="drop-items">
                        {items.map((item, index) => (
                            <div
                                key={`${item}-${index}`}
                                className={`drop-item ${isDragging ? 'dragging' : ''}`}
                                draggable={!disabled}
                                onDragStart={(e) => handleItemDragStart(e, index)}
                                onDragOver={(e) => handleItemDragOver(e, index)}
                                onDragEnd={handleItemDragEnd}
                            >
                                <span className="drag-handle">⠿</span>
                                <span className="item-text">{item}</span>
                                <button
                                    type="button"
                                    className="btn-remove-item"
                                    onClick={() => removeItem(index)}
                                    disabled={disabled}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input hidden para o valor */}
            <input type="hidden" name={name} value={JSON.stringify(items)} />

            <div className="drag-drop-footer">
                <small>Arraste itens para adicionar ou reordenar</small>
                {items.length > 0 && (
                    <span className="items-json">{items.join(', ')}</span>
                )}
            </div>
        </div>
    );
}

export default DragDropArrayInput;