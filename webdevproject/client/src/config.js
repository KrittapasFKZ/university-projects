const isProd = process.env.NODE_ENV === 'production'

export const config = {
    isProd,
    serverUrlPrefix: isProd ? 'https://wd07.cloud-workshop.online/api' : 'http://localhost:1337/api'
};

export const config2 = {
    isProd,
    serverUrlPrefix: isProd ? 'https://wd07-admin.cloud-workshop.online' : 'http://localhost:1337'
};
