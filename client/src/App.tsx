import { useRoutes } from 'react-router-dom';
import { routeManagement } from './routes';

function App() {
  
  return (
    <>
      {
        useRoutes(routeManagement)
      }
    </>
  )
}

export default App
