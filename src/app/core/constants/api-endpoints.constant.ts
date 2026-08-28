/**
 * Endpoints exactos definidos en el Swagger de la Help Desk API.
 * No se agrega ningún endpoint que no exista en la documentación.
 */
export const API_ENDPOINTS = {
    auth: {
        register: '/auth/register',
        login: '/auth/login',
        refresh: '/auth/refresh',
        logout: '/auth/logout',
        me: '/auth/me'
    },
    tickets: {
        list: '/tickets',
        create: '/tickets',
        detail: (id: string) => `/tickets/${id}`,
        update: (id: string) => `/tickets/${id}`,
        remove: (id: string) => `/tickets/${id}`,
        assign: (id: string) => `/tickets/${id}/assign`,
        comments: (id: string) => `/tickets/${id}/comments`
    },
    users: {
        list: '/users',
        detail: (id: string) => `/users/${id}`,
        changeRole: (id: string) => `/users/${id}/role`
    },
    system: {
        health: '/health',
        root: '/'
    }
} as const;