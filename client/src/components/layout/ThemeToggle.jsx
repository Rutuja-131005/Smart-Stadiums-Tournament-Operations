import { useTheme } from '../../contexts/ThemeContext';
import { Icons } from './Icons';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode, toggleHighContrast } = useTheme();

  return (
    <>
      {/* High contrast toggle */}
      <button
        onClick={toggleHighContrast}
        className="btn-icon hidden sm:flex"
        aria-label="Toggle high contrast"
        title="High contrast"
      >
        {Icons.contrast}
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleDarkMode}
        className="btn-icon"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={darkMode ? 'Light mode' : 'Dark mode'}
      >
        {darkMode ? Icons.sun : Icons.moon}
      </button>
    </>
  );
}
