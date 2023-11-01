import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeModeContextProvider } from './contexts/ThemeModeContextProvider'
import './scrollbar.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeModeContextProvider>
            <App />
        </ThemeModeContextProvider>
    </React.StrictMode>
)
