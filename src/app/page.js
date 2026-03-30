import React, { Suspense } from 'react'
import AdminPage from './MainClient'

const page = () => {
  return (
    <Suspense fallback="Loading...">
      <AdminPage />
    </Suspense>
  )
}

export default page
