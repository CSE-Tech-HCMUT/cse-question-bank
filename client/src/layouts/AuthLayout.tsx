import { Outlet } from "react-router-dom"

export const AuthLayout = () => {
  return (
    <>
      <main className="h-screen w-screen bg-[#EEEEEE] flex justify-center items-center">
        <Outlet />
      </main>
    </>
  )
}

export default AuthLayout