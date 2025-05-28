import { Routes, Route, Navigate } from 'react-router'

// Services
import { userService } from './services/user'

// Pages
import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { StationIndex } from './pages/StationIndex'
import { StationDetails } from './pages/StationDetails'
import { ReviewIndex } from './pages/ReviewIndex'
import { ChatApp } from './pages/Chat'
import { AdminIndex } from './pages/AdminIndex'
import { UserDetails } from './pages/UserDetails'
import { LoginSignup } from './pages/LoginSignup'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'

// Components
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg'
import { PlayList } from './pages/PlayList'

export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />
            <UserMsg />

            <main>
                <Routes>
                    <Route path="" element={<HomePage />} />

                    <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route>

                    <Route path="station" element={<StationIndex />} />
                    <Route path="station/:stationId" element={<StationDetails />} />
                    <Route path="playlist/:stationId" element={<PlayList />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="review" element={<ReviewIndex />} />
                    <Route path="chat" element={<ChatApp />} />

                    <Route path="admin" element={
                        <AuthGuard checkAdmin={true}>
                            <AdminIndex />
                        </AuthGuard>
                    } />

                    <Route path="login" element={<LoginSignup />}>
                        <Route index element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>

            <AppFooter />
        </div>
    )
}

function AuthGuard({ children, checkAdmin = false }) {
    const user = userService.getLoggedinUser()
    const isNotAllowed = !user || (checkAdmin && !user.isAdmin)

    if (isNotAllowed) {
        console.log('Not Authenticated!')
        return <Navigate to="/" />
    }

    return children
}
