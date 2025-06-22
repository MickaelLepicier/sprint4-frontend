import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router'
import './services/lyrics.service.js'

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
import { MainFooter } from './cmps/MainFooter'
import { UserMsg } from './cmps/UserMsg'
import { SongList } from './cmps/SongList'
import { Sidebar } from './cmps/Sidebar/Sidebar'
import { SearchStations } from './pages/SearchStations'
import { LyricsPanel } from './cmps/LyricsPanel.jsx'

export function RootCmp() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className={`main-container${isCollapsed ? ' collapsed' : ''} ${isAuthPage ? 'auth-layout' : ''}`}>
      {!isAuthPage && <AppHeader />}
      {!isAuthPage && (<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />)}

      <UserMsg />

      <main className="main-content">
        <Routes>
          <Route path="" element={<HomePage />} />

          <Route path="about" element={<AboutUs />}>
            <Route path="team" element={<AboutTeam />} />
            <Route path="vision" element={<AboutVision />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          <Route path="station" element={<StationIndex />} />
          <Route path="station/:stationId" element={<StationDetails />} />
          <Route path="playlist/:stationId" element={<SongList />} />
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
          
          <Route path="lyrics" element={<LyricsPanel />} />
          
          {/* <Route path="login" element={<LoginSignup />}>
              <Route index element={<Login />} />
              <Route path="signup" element={<Signup />} />
              </Route> */}

        </Routes>
        
        <MainFooter />
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
