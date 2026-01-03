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
            },
             {
                path: '/test/xxx/edit',
                name: 'edit test',
                public: true,
                role: 'admin-ss',
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
        path: '/admin/posts',
        name: 'postsssssssssssaaaaaaaa',
        role: 'admin',
        public: false,
        subRoutes: [
            {
                path: '/admin/posts/create',
                name: 'create post',
                public: false,
                role: 'admin'
            },
            {
                path: '/admin/posts/edit',
                name: 'edit postdddddd',
                public: false,
            },
             {
                path: '/admin/posts/edit',
                name: 'edit posssssst',
                public: false,
                role: 'user-cc'
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
        path: '/test',
        name: 'test',
        role: 'user',
        public: true,
        subRoutes: publicRoutes
    }

] as Route[];