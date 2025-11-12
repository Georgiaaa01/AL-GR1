// client/src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom' // ✅ adăugat Outlet aici
import LoadingSpinner from './LoadingSpinner'

/**
 * ProtectedLayout - Layout for routes that require authentication
 * If the user is not authenticated, redirects to login
 */
export const ProtectedLayout = () => {
    const { loggedIn, checkTokenLoading } = useSelector((state) => state.user)

    if (checkTokenLoading) {
        return <LoadingSpinner />
    }

    if (!loggedIn) {
        return <Navigate to="/login" replace />
    }

    return <Outlet /> // ✅ acum Outlet e definit
}

/**
 * AuthLayout - Layout for routes that require the user to NOT be authenticated
 * If the user is authenticated, redirects to home
 */
export const AuthLayout = () => {
    const { loggedIn, checkTokenLoading } = useSelector((state) => state.user)

    if (checkTokenLoading) {
        return <LoadingSpinner />
    }

    if (loggedIn) {
        return <Navigate to="/" replace />
    }

    return <Outlet /> // ✅ Outlet funcționează și aici
}
