import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { MainLayout } from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import DetailsPage from './pages/DetailsPage'
import FlashCardsPage from './pages/FlashCardsPage'
import FlashcardsWidget from './pages/FlashcardsWidget'
import ConverterPage from './pages/ConverterPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="details/:widgetId" element={<DetailsPage />} />
          <Route path="flashcards" element={<FlashCardsPage />} />
          <Route path="converter" element={<ConverterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        {/* Rota para widget iframe sem layout */}
        <Route path="widgets/flashcards" element={<FlashcardsWidget />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
