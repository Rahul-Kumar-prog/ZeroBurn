import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/page/Login/Login'
import Signup from '@/page/Signup/Signup'
import CloudProviders from '@/page/CloudProviders/CloudProviders'
import AwsSetup from './page/Setup/AwsSetup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cloudproviders" element={<CloudProviders />} />
        <Route path="/setup/aws" element={<AwsSetup />} />
        

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
