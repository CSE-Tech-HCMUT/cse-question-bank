import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider } from 'antd'
import './style/style.scss'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <ToastContainer />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#6674BB',
            borderRadius: 2,
    
            colorBgContainer: 'white',
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Provider>
  </BrowserRouter>
)
