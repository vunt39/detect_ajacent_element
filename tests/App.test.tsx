import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
    it('renders grid and buttons', () => {
        render(<App />);
        expect(screen.getByText('Grid Matching Game')).toBeInTheDocument();
        expect(screen.getByText('Customize Grid')).toBeInTheDocument();
        expect(screen.getByText('Reset Grid')).toBeInTheDocument();
    });

    it('opens modal when clicking Customize Grid', () => {
        render(<App />);
        fireEvent.click(screen.getByText('Customize Grid'));
        expect(screen.getByText('Grid Size:')).toBeInTheDocument();
    });

    it('updates grid size when submitting modal', () => {
        render(<App />);
        fireEvent.click(screen.getByText('Customize Grid'));

        const input = screen.getByLabelText('Grid Size:');
        fireEvent.change(input, { target: { value: '6' } });
        fireEvent.click(screen.getByText('Submit'));

        // Ensure grid size is updated
        expect(document.querySelectorAll('.cell').length).toBe(36);
    });
});
