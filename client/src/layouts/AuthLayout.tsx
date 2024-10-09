import { Outlet } from "react-router-dom"

export const AuthLayout = () => {
  return (
    <>
      <main className="h-screen w-screen bg-[#E5EAFF] flex justify-center items-center">
        <Outlet />
      </main>
    </>
  )
}

export default AuthLayout