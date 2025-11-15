import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// สร้าง Context
const AuthContext = createContext(null);

// สร้าง Provider (ตัวจัดการข้อมูล)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // เพิ่ม state loading

    // ตรวจสอบ token ที่ค้างใน localStorage ตอนเริ่มแอป
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('authUser');
            
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                // (ถ้าใช้ axios) ตั้งค่า Header เริ่มต้นสำหรับทุก request
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.error("Failed to load auth state", error);
            // ถ้ามีปัญหา ให้เคลียร์ทิ้ง
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        } finally {
            setLoading(false); // โหลดเสร็จแล้ว
        }
    }, []);

    // ฟังก์ชันสำหรับ Login (เรียกใช้จากหน้า Login)
    const login = (newToken, userData) => {
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        // (ถ้าใช้ axios) ตั้งค่า Header สำหรับ request ต่อๆ ไป
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    // ฟังก์ชันสำหรับ Logout
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // ส่งค่า state และฟังก์ชันต่างๆ ไปให้ child components
    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token, // boolean บอกว่า login แล้วหรือยัง
        loadingAuth: loading // สถานะการโหลด auth
    };

    // ไม่แสดงผลจนกว่าจะโหลด state เสร็จ
    if (loading) {
        return null; // หรือแสดง loading spinner เต็มจอ
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// สร้าง Hook สำหรับเรียกใช้ง่ายๆ
export const useAuth = () => {
    return useContext(AuthContext);
};