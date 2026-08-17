import MoneyInput from './MoneyInput';
import React, { useState } from 'react';
import { ToggleSection } from '../components/ToogleSection';
import { TYPES } from '../config/types';
import { isTypeReference, extractNestedData, extractTableRowsData } from '../utils/formHelpers';
import { useEvents } from '../hooks/useEvents';

function DynamicForm({ eventConfig, onSubmit }) {
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rowCount, setRowCount] = useState(5);
    let events = [];
    const saved = localStorage.getItem('mc3_events');
    if (saved) {
        try {
            // setEvents(JSON.parse(saved));
            events = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved events from localStorage:', e);
        }
    }

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.target;
        const formDataObj = new FormData(form);
        const data = {};

        // Processar cada campo
        eventConfig.fields.forEach(field => {
            if (field.type === 'tableRows') {
                const prefix = field.name || 'rows';
                data[prefix] = extractTableRowsData(formDataObj, prefix);
            } else if (isTypeReference(field)) {
                const typeDef = TYPES[field.type];
                const nestedData = {};
                const prefix = field.name || field.type;
                
                typeDef.fields.forEach(nf => {
                    const fieldName = `${prefix}_${nf.name}`;
                    const value = formDataObj.get(fieldName);
                    if (value !== null && value !== '') {
                        nestedData[nf.name] = nf.type === 'number' ? parseFloat(value) : value;
                    }
                });
                
                if (Object.keys(nestedData).length > 0) {
                    data[prefix] = nestedData;
                }
            } else {
                const value = formDataObj.get(field.name);
                if (value !== null && value !== '') {
                    data[field.name] = field.type === 'number' ? parseFloat(value) : value;
                }
            }
        });

        // Validar se a tabela tem dados
        const rowsField = eventConfig.fields.find(f => f.type === 'tableRows');
        if (rowsField) {
            const prefix = rowsField.name || 'rows';
            if (!data[prefix] || data[prefix].length === 0) {
                alert('Adicione pelo menos uma linha na tabela!');
                setIsSubmitting(false);
                return;
            }
        }

        onSubmit(data);
        form.reset();
        setFormData({});
        setIsSubmitting(false);
    };

    const renderField = (field, prefix = '') => {
        const fieldName = prefix ? `${prefix}_${field.name}` : field.name;
        const value = formData[fieldName] || '';

        const handleFieldChange = (e) => {
            handleChange(fieldName, e.target.value);
        };

        if (field.type === 'select') {
            // Loop events to find the event initMatch
            events.map(e => {
                console.log(e.eventId);
                if (e.eventId === 'initMatch') {
                    const matchData = e.data;
                    if (field.name === 'team') {
                        field.options = ['Palermo', matchData.opposingTeam.name];
                    }
                }
            });

            return (
                <div key={fieldName} className="field-group">
                    <label>{field.label}{field.required && <span className="required">*</span>}</label>
                    <select 
                        name={fieldName} 
                        value={value} 
                        onChange={handleFieldChange}
                        required={field.required}
                    >
                        <option value="">Selecione...</option>
                        {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );
        }

        if (field.type === 'textarea') {
            return (
                <div key={fieldName} className="field-group">
                    <label>{field.label}{field.required && <span className="required">*</span>}</label>
                    <textarea 
                        name={fieldName} 
                        value={value} 
                        onChange={handleFieldChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={4}
                    />
                </div>
            );
        }

        if (field.type === 'date') {
            return (
                <div key={fieldName} className="field-group">
                    <label>{field.label}{field.required && <span className="required">*</span>}</label>
                    <input 
                        type="date" 
                        name={fieldName} 
                        value={value} 
                        onChange={handleFieldChange}
                        required={field.required}
                    />
                </div>
            );
        }

        if (field.type === 'money') {
            return (
                <MoneyInput
                    key={fieldName}
                    label={field.label}
                    required={field.required}
                    placeholder={field.placeholder || '0,00'}
                    value={value}
                    onChange={(val) => handleChange(fieldName, val)}
                    name={fieldName}
                />
            );
        }

        return (
            <div key={fieldName} className="field-group">
                <label>{field.label}{field.required && <span className="required">*</span>}</label>
                <input 
                    type={field.type} 
                    name={fieldName} 
                    value={value} 
                    onChange={handleFieldChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                />
            </div>
        );
    };

    const renderTypeSection = (field) => {
        const typeDef = TYPES[field.type];
        const prefix = field.name || field.type;
        const sectionLabel = field.label || typeDef.label;
        const sectionId = `section_${prefix}_${Date.now()}`;

        return (
            <ToggleSection
                key={field.type}
                sectionId={sectionId}
                title={sectionLabel}
                badge={typeDef.label}
                defaultOpen={true}
            >
                {typeDef.fields.map(nestedField =>
                    renderField(nestedField, prefix)
                )}
            </ToggleSection>
        );
    };

    const renderTableRows = (field) => {
        const prefix = field.name || 'rows';
        const typeDef = TYPES.tableRow;

        const updateRowCount = (count) => {
            setRowCount(Math.max(2, Math.min(30, parseInt(count) || 5)));
        };

        return (
            <div className="table-rows-container">
                <div className="table-rows-header">
                    <div className="table-rows-controls">
                        <label>Quantidade de times:</label>
                        <input 
                            type="number" 
                            value={rowCount} 
                            onChange={(e) => updateRowCount(e.target.value)}
                            min="2" 
                            max="30"
                        />
                        <button 
                            type="button" 
                            className="btn-refresh-table"
                            onClick={() => {
                                const tbody = document.getElementById(`tableRowsBody_${prefix}`);
                                if (tbody) {
                                    tbody.innerHTML = '';
                                    for (let i = 0; i < rowCount; i++) {
                                        tbody.innerHTML += generateRowHTML(prefix, i);
                                    }
                                }
                            }}
                        >
                            🔄 Atualizar Tabela
                        </button>
                    </div>
                </div>
                <div className="table-rows-scroll">
                    <table className="table-rows-grid">
                        <thead>
                            <tr>
                                <th>#</th>
                                {typeDef.fields.map(f => <th key={f.name}>{f.label}</th>)}
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id={`tableRowsBody_${prefix}`}>
                            {/* {Array.from({ length: rowCount }, (_, i) => generateRowHTML(prefix, i))} */}
                        </tbody>
                    </table>
                </div>
                <div className="table-rows-footer">
                    <span className="row-counter">{rowCount} times</span>
                    <button 
                        type="button" 
                        className="btn-add-row"
                        onClick={() => {
                            const tbody = document.getElementById(`tableRowsBody_${prefix}`);
                            if (tbody) {
                                const currentCount = tbody.querySelectorAll('tr').length;
                                tbody.innerHTML += generateRowHTML(prefix, currentCount);
                                setRowCount(currentCount + 1);
                            }
                        }}
                    >
                        ➕ Adicionar linha
                    </button>
                    <button 
                        type="button" 
                        className="btn-remove-last-row"
                        onClick={() => {
                            const tbody = document.getElementById(`tableRowsBody_${prefix}`);
                            if (tbody) {
                                const rows = tbody.querySelectorAll('tr');
                                if (rows.length > 2) {
                                    rows[rows.length - 1].remove();
                                    setRowCount(rows.length - 1);
                                } else {
                                    alert('A tabela deve ter pelo menos 2 times!');
                                }
                            }
                        }}
                    >
                        ➖ Remover última
                    </button>
                </div>
            </div>
        );
    };

    const generateRowHTML = (prefix, index) => {
        const typeDef = TYPES.tableRow;
        const rowId = `row_${prefix}_${index}`;
        const fieldName = (field) => `${prefix}_${index}_${field.name}`;

        let html = `<tr id="${rowId}" class="table-row">`;
        html += `<td class="row-index">${index + 1}</td>`;
        
        typeDef.fields.forEach(field => {
            html += `<td>${renderFieldHTML(field, fieldName(field))}</td>`;
        });
        
        html += `
            <td class="row-actions">
                <button type="button" class="btn-remove-row" onclick="removeRow('${rowId}')">✕</button>
            </td>
        `;
        
        html += `</tr>`;
        return html;
    };

    const renderFieldHTML = (field, name) => {
        let html = `<div class="field-group" style="margin:2px 0;">`;
        
        if (field.type === 'select') {
            html += `<select name="${name}" ${field.required ? 'required' : ''}>`;
            html += `<option value="">Selecione...</option>`;
            field.options.forEach(opt => {
                html += `<option value="${opt}" ${field.default == opt ? `selected="selected"` : ''}>${opt}</option>`;
            });
            html += `</select>`;
        } else {
            html += `<input type="${field.type}" name="${name}" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}" ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.max !== undefined ? `max="${field.max}"` : ''}>`;
        }
        
        html += `</div>`;
        return html;
    };

    // Funções globais para a tabela
    window.removeRow = (rowId) => {
        const row = document.getElementById(rowId);
        if (row) {
            const tbody = row.parentElement;
            if (tbody.querySelectorAll('tr').length > 2) {
                row.remove();
                // Atualizar índices
                const rows = tbody.querySelectorAll('tr');
                rows.forEach((r, idx) => {
                    const indexCell = r.querySelector('.row-index');
                    if (indexCell) indexCell.textContent = idx + 1;
                });
            } else {
                alert('A tabela deve ter pelo menos 2 times!');
            }
        }
    };

    window.toggleSection = function(sectionId) {
        const body = document.getElementById(sectionId);
        const btn = document.querySelector(`[onClick={toggleSection('{sectionId}')}]`);
        if (body) {
            const isHidden = body.style.display === 'none';
            body.style.display = isHidden ? 'block' : 'none';
            if (btn) {
                const icon = btn.querySelector('.toggle-icon');
                const label = btn.querySelector('.toggle-label');
                if (isHidden) {
                    icon.textContent = '▼';
                    label.textContent = 'Ocultar detalhes';
                } else {
                    icon.textContent = '▶';
                    label.textContent = 'Mostrar detalhes';
                }
            }
        }
    };

    return (
        <div className="dynamic-form">
            <div className="form-header">
                <h2>
                    <span>{eventConfig.icon || '📌'}</span>
                    {eventConfig.label}
                </h2>
                <span className="category-badge">{eventConfig.category}</span>
            </div>

            <form id="eventForm" onSubmit={handleSubmit}>
                {eventConfig.fields.map(field => {
                    if (field.type === 'tableRows') {
                        return renderTableRows(field);
                    } else if (isTypeReference(field)) {
                        return renderTypeSection(field);
                    } else {
                        return renderField(field);
                    }
                })}
                
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? '⏳ Registrando...' : '✅ Registrar Evento'}
                </button>
            </form>
        </div>
    );
}

export default DynamicForm;