// hooks/useToggle.js
import { useState } from 'react';

export function useToggle(initialState = true) {
    const [isOpen, setIsOpen] = useState(initialState);

    const toggle = () => setIsOpen(!isOpen);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return { isOpen, toggle, open, close };
}