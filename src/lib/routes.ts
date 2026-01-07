export interface Route {
    path: string;
    name: string;
    public?: boolean;
    role?: string;
    subRoutes?: Route[];
}
export const publicRoutes = [
    {
        path: '/test/tests',
        name: 'tests',
        role: 'user',
        public: true,
        subRoutes: [
            {
                path: '/test/tests/create',
                name: 'create test',
                public: false,
                role: 'user',
            },
             {
                path: '/test/xxx/edit',
                name: 'edit test',
                public: true,
                role: 'admin',
                subRoutes: [
                    {
                        path: '/test/xxx/edit/deep',
                        name: 'deep edit test',
                        public: true,
                        role: 'user',
                    },
                    {
                        path: '/test/xxx/edit/deeper',
                        name: 'deeper edit test',
                        public: false,
                        role: 'admin'
                    }
                ]
                    
            }
        ]
    }
] as Route[];



export const protectedRoutes = [
    {
        path: '/admin/manage-shops',
        name: 'manage shops',
        role: 'admin',
        public: false,
        subRoutes: [
            {
                path: '/admin/manage-shops/create',
                name: 'create shop',
                public: false,
                role: 'admin'
            },
            {
                path: '/admin/manage-shops/edit',
                name: 'edit shop',
                public: false,
                role: 'admin'
            },
             {
                path: '/admin/manage-shops/delete',
                name: 'delete shop',
                public: false,
                role: 'admin'
            }
        ]
    },
    {
        path: '/admin/stuff',
        name: 'stuff',
        role: 'admin',
        public: false,
        subRoutes: [
            {
                path: '/admin/stuff/create',
                name: 'create stuff',
                public: false,
                role: 'super-admin',
            },
            
             {
                path: '/admin/stuff/edit',
                name: 'edit stuff',
                public: false,
                role: 'admin',
            }
        ]
    },
  
] as Route[];


export const routes = [
    {
        path: '/',
        name: 'home',
        public: true,
    },
    {
        path: '/admin',
        name: 'admin',
        role: 'admin',
        public: false,
        subRoutes: protectedRoutes
    },
    {
        path: '/products',
        name: 'products',
        role: 'user',
        public: true,
        subRoutes: publicRoutes
    }

] as Route[];