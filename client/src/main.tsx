import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n/i18n.ts'
import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './stores/index.ts'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <ConfigProvider
        theme={
          {
            token: { colorPrimary: '#3c8dbc' }
          }
        }
      >
        <StrictMode>
          <App />
          <ToastContainer />
        </StrictMode>
      </ConfigProvider>
    </Provider>
  </BrowserRouter>
)
