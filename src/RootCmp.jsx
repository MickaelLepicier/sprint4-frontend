import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { login } from './store/user/user.actions'

// Services
import { userService } from './services/user'

// Pages
import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { StationIndex } from './pages/StationIndex'
import { StationDetails } from './pages/StationDetails'
import { GenreIndex } from './pages/GenreIndex'
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
import { PlayList } from './cmps/PlayList'
import { Sidebar } from './cmps/Sidebar/Sidebar'
import { SearchStations } from './pages/SearchStations'

export function RootCmp() {
  // Automatically login as puki (id: u101)
  // Check user.service.local -> _createDemoUsers() or further info
  useEffect(() => {
      if (import.meta.env.DEV) {
          login({ username: 'puki', password: '123' })
      }
  }, [])

  return (
    <div className="main-container">
      <AppHeader />
      <Sidebar />
      
      <UserMsg />

        <main className="main-content">
          <Routes>
            <Route path="" element={<HomePage />} />

            <Route path="about" element={<AboutUs />}>
              <Route path="team" element={<AboutTeam />} />
              <Route path="vision" element={<AboutVision />} />
            </Route>

            <Route path="station" element={<StationIndex />} />
            <Route path="station/:stationId" element={<StationDetails />} />
            <Route path="playlist/:stationId" element={<PlayList />} />
            <Route path="search" element={<GenreIndex />} />
            <Route path="search/:txt" element={<SearchStations />} />
            <Route path="genre/:genre" element={<SearchStations />} />

            <Route path="user/:id" element={<UserDetails />} />
            <Route path="review" element={<ReviewIndex />} />
            <Route path="chat" element={<ChatApp />} />

            <Route
              path="admin"
              element={
                <AuthGuard checkAdmin={true}>
                  <AdminIndex />
                </AuthGuard>
              }
            />

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
