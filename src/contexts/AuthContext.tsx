import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'client' | null;

interface AuthContextType {
    role: Role;
    loginAs: (role: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>(null);

    const loginAs = (newRole: Role) => setRole(newRole);
    const logout = () => setRole(null);

    return (
        <AuthContext.Provider value={{ role, loginAs, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};
