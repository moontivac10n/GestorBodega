import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, company: null, isCompany: false, user: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = JSON.parse(atob(token.split('.')[1]));
                    const isCompany = decoded.isCompany || false;

                    const company = isCompany ? {
                        name: decoded.companyName,
                        email: decoded.email,
                        address: decoded.address,
                        phone: decoded.phone,
                        website: decoded.website,
                    } : null;

                    const user = isCompany ? null : {
                        id: decoded.userId,
                        email: decoded.email,
                        username: decoded.username,
                        fullname: decoded.fullname,
                        role: decoded.role,
                        status: decoded.status,
                        company: decoded.company,
                    };

                    setAuth({ token, company, isCompany, user });
                } catch (error) {
                    console.error("Error al decodificar el token", error);
                    setAuth({ token: null, company: null, isCompany: false, user: null });
                }
            } else {
                setAuth({ token: null, company: null, isCompany: false, user: null });
            }
            setLoading(false);
        };

        checkToken();
    }, []);

    const login = (token, user) => {
        if (token) {
            localStorage.setItem('token', token);
            const decoded = JSON.parse(atob(token.split('.')[1]));
            const isCompany = decoded.isCompany || false;

            const company = isCompany ? {
                name: decoded.companyName,
                email: decoded.email,
                address: decoded.address,
                phone: decoded.phone,
                website: decoded.website,
            } : null;

            setAuth({ token, company, isCompany, user: isCompany ? null : user });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ token: null, company: null, isCompany: false, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};