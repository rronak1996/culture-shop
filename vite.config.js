import { defineConfig } from 'vite'

export default defineConfig({
    base: '/culture-shop/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                login: 'login.html',
                signup: 'signup.html',
                account: 'account.html'
            }
        }
    }
})
