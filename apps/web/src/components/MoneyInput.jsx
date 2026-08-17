import React, { useState, useEffect } from 'react';

function MoneyInput({ 
    value = '', 
    onChange, 
    label, 
    required = false,
    placeholder = '0,00',
    disabled = false,
    name = '',
    className = ''
}) {
    const [displayValue, setDisplayValue] = useState('');

    // Formata valor para exibição
    const formatDisplay = (val) => {
        if (val === '' || val === null || val === undefined) return '';
        
        const num = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : val;
        
        if (isNaN(num) || num === 0) return '';
        
        // Formata com 2 casas decimais
        return num.toFixed(2).replace('.', ',');
    };

    // Converte string para número
    const parseValue = (str) => {
        if (!str) return '';
        
        // Substitui vírgula por ponto
        let clean = str.replace(',', '.');
        
        // Remove tudo exceto números e ponto
        clean = clean.replace(/[^\d.]/g, '');
        
        // Permite apenas um ponto
        const parts = clean.split('.');
        if (parts.length > 2) {
            clean = parts[0] + '.' + parts.slice(1).join('');
        }
        
        const num = parseFloat(clean);
        return isNaN(num) ? '' : num;
    };

    // Atualiza o display quando o value muda
    useEffect(() => {
        if (value !== '' && value !== null && value !== undefined) {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            if (!isNaN(num) && num > 0) {
                setDisplayValue(formatDisplay(num));
            } else {
                setDisplayValue('');
            }
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e) => {
        let raw = e.target.value;
        console.log(raw)
        
        // Permite apenas números, vírgula e ponto
        let cleaned = raw.replace(/[^\d,.]/g, '');
        
        // Permite apenas uma vírgula OU um ponto
        const hasComma = cleaned.includes(',');
        const hasDot = cleaned.includes('.');
        
        if (hasComma && hasDot) {
            // Se tem ambos, mantém o primeiro
            const firstSep = cleaned.match(/[,.]/);
            if (firstSep) {
                const parts = cleaned.split(firstSep[0]);
                console.log(`parts: ${parts}`)
                if (parts.length > 2) {
                    cleaned = parts[0] + firstSep[0] + parts.slice(1).join('');
                }
            }
        }
        
        // Remove vírgulas extras
        if (hasComma) {
            const parts = cleaned.split(',');
            if (parts.length > 2) {
                cleaned = parts[0] + ',' + parts.slice(1).join('');
            }
        }
        
        // Remove pontos extras
        if (hasDot) {
            const parts = cleaned.split('.');
            if (parts.length > 2) {
                cleaned = parts[0] + '.' + parts.slice(1).join('');
            }
        }
        
        setDisplayValue(cleaned);
        
        // Converte para número
        const numValue = parseValue(cleaned);
        if (onChange) {
            onChange(numValue, name);
        }
    };

    const handleBlur = () => {
        // Formata ao perder o foco
        if (displayValue && displayValue !== '') {
            const num = parseValue(displayValue);
            if (!isNaN(num) && num > 0) {
                setDisplayValue(formatDisplay(num));
                if (onChange) {
                    onChange(num, name);
                }
            } else {
                setDisplayValue('');
                if (onChange) {
                    onChange('', name);
                }
            }
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    return (
        <div className={`field-group ${className}`}>
            {label && (
                <label>
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                type="text"
                inputMode="decimal"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                name={name}
                className="money-input"
                autoComplete="off"
            />
        </div>
    );
}

export default MoneyInput;