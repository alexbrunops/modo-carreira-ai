import { TYPES } from "../config/types";


export function resolveField(field) {
    if (field.type && TYPES[field.type]) {
        const typeDef = TYPES[field.type];
        return {
            ...field,
            isTypeReference: true,
            typeRef: field.type,
            nestedFields: typeDef.fields.map(f => ({
                ...f,
                parentField: field.name || field.label
            }))
        };
    }
    return field;
}

export function isTypeReference(field) {
    return field.type && TYPES[field.type] !== undefined;
}

// Obtém os campos aninhados de uma referência de tipo
export function getNestedFields(field) {
    if (isTypeReference(field)) {
        const typeDef = TYPES[field.type];
        return typeDef.fields.map(f => ({
            ...f,
            parentField: field.name || field.label,
            parentType: field.type
        }));
    }
    return [];
}

// Função para obter todos os campos "planos" de um evento (incluindo aninhados)
export function getFlattenedFields(eventConfig) {
    const result = [];
    
    eventConfig.fields.forEach(field => {
        if (isTypeReference(field)) {
            // Adiciona os campos aninhados com prefixo
            const nested = getNestedFields(field);
            nested.forEach(nf => {
                result.push({
                    ...nf,
                    isNested: true,
                    parentLabel: field.label,
                    parentName: field.name || field.type
                });
            });
        } else {
            result.push(field);
        }
    });
    
    return result;
}

// Função para construir o nome do campo para o formulário
export function getFieldName(field, parentPrefix = '') {
    if (field.isNested) {
        const prefix = field.parentName || field.parentType;
        return parentPrefix ? `${parentPrefix}_${prefix}_${field.name}` : `${prefix}_${field.name}`;
    }
    return parentPrefix ? `${parentPrefix}_${field.name}` : field.name;
}

// Função para extrair dados aninhados do formData
export function extractNestedData(formData, eventConfig) {
    const result = {};
    
    eventConfig.fields.forEach(field => {
        if (isTypeReference(field)) {
            // Extrai dados aninhados
            const typeDef = TYPES[field.type];
            const nestedData = {};
            const prefix = field.name || field.type;
            
            typeDef.fields.forEach(nf => {
                const fieldName = `${prefix}_${nf.name}`;
                const value = formData.get(fieldName);
                if (value !== null && value !== '') {
                    nestedData[nf.name] = nf.type === 'number' ? parseFloat(value) : value;
                }
            });
            
            if (Object.keys(nestedData).length > 0) {
                result[prefix] = nestedData;
            }
        } else {
            // Campo simples
            const value = formData.get(field.name);
            if (value !== null && value !== '') {
                result[field.name] = field.type === 'number' ? parseFloat(value) : value;
            }
        }
    });
    
    return result;
}

export function extractTableRowsData(formData, prefix) {
    const rows = [];
    let index = 0;
    let hasMore = true;
    
    while (hasMore) {
        const rowData = {};
        let rowHasData = false;
        const typeDef = TYPES.tableRow;
        
        if (!typeDef) break;
        
        typeDef.fields.forEach(field => {
            const fieldName = `${prefix}_${index}_${field.name}`;
            const value = formData.get(fieldName);
            if (value !== null && value !== '') {
                rowHasData = true;
                rowData[field.name] = field.type === 'number' ? parseFloat(value) : value;
            }
        });
        
        if (rowHasData) {
            rows.push(rowData);
            index++;
        } else {
            hasMore = false;
        }
    }
    
    return rows;
}
