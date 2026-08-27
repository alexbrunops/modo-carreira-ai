import React, { createContext, useState, useContext, useEffect } from 'react';
import { careersApi } from '../api/client';

const CareerContext = createContext(null);

export function CareerProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {

    }, []);
}