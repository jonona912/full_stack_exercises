import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { Container } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Container maxWidth="md">
        <App />
      </Container>
    </BrowserRouter>
  </ErrorBoundary>,
)
