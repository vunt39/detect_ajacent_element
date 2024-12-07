import React, { useState } from 'react';

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialGridSize: number | string,
    onApply: (customSize: number | string) => void
}

const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    initialGridSize,
    onApply
}) => {
    if (!isOpen) return null;

    const [customSize, setCustomSize] = useState(initialGridSize);

    const handleSubmit = () => {
        onApply(customSize)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold">Customize Grid</h2>
                <div className="modal-settings">
                    <label className='flex space-x-2'>
                        <span className='flex items-center min-w-20'>Grid Size:</span>
                        <input
                            type="number"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            min={1}
                            max={20}
                            value={customSize}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCustomSize(
                                    value === ''
                                        ? ''
                                        : Math.max(
                                              1,
                                              Math.min(20, Number(value))
                                          )
                                );
                            }}
                        />
                    </label>
                </div>
                {/* <div className="modal-actions">
                    <button onClick={onClose}>Close</button>
                </div> */}
                <div className="modal-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
