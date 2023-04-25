import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Chat } from './pages/Chat'
import { Home } from './pages/Home'
import { Login } from './pages/Login'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/chat' element={<Chat />} />
                <Route path='/login' element={<Login />} />
                {/* <Route path='/login' element={<Temp />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default App
