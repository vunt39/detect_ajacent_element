import { render, screen, fireEvent } from '@testing-library/react';
import CustomModal from '../src/modals/CustomModal';
import { describe, it, expect, vi } from 'vitest';

describe('CustomModal Component', () => {
    const mockOnApply = vi.fn();
    const mockOnClose = vi.fn();

    it('renders with default values', () => {
        render(
            <CustomModal
                isOpen={true}
                onClose={mockOnClose}
                initialGridSize={5}
                onApply={mockOnApply}
            />
        );

        expect(screen.getByText('Customize Grid')).toBeInTheDocument();
        expect(screen.getByLabelText('Grid Size:')).toHaveValue(5);
    });

    it('applies new grid size', () => {
        render(
            <CustomModal
                isOpen={true}
                onClose={mockOnClose}
                initialGridSize={5}
                onApply={mockOnApply}
            />
        );

        fireEvent.change(screen.getByLabelText('Grid Size:'), {
            target: { value: '8' },
        });
        fireEvent.click(screen.getByText('Submit'));

        expect(mockOnApply).toHaveBeenCalledWith(8);
    });

    it('closes when clicking outside', () => {
        render(
            <CustomModal
                isOpen={true}
                onClose={mockOnClose}
                initialGridSize={5}
                onApply={mockOnApply}
            />
        );

        fireEvent.click(screen.getByText('Cancel'));
        expect(mockOnClose).toHaveBeenCalled();
    });
});
