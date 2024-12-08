import { useState } from 'react';

const GameIntroModal = ({ onClose }: { onClose: () => void }) => {
    const steps = [
        {
            description: 'Welcome to the game!',
        },
        {
            description: 'Your mission is to find matching adjacent cells.',
        },
        {
            description:
                'Click to selection box, then click on the cells you want to swap. If the cells are adjacent and match, they will be highlighted and removed!',
        },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [fadeClass, setFadeClass] = useState('');

    const handleNext = () => {
        setFadeClass('fade-out');
        if (currentStep < steps.length - 1) {
            setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
                setFadeClass('fade-in');
            }, 500);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-row justify-center items-center">
            <div className="bg-white rounded-lg p-5 w-full h-full max-w-xl text-center introModal flex flex-row justify-end">
                <div className="block w-2/4 pl-5 h-full flex flex-col justify-between">
                    <div className="speech-bubble-cartoon text-transition">
                        <p className={`text-lg ${fadeClass}`}>
                            {steps[currentStep].description}
                        </p>
                    </div>
                    <button
                        onClick={handleNext}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 self-end"
                    >
                        {currentStep < steps.length - 1 ? 'Next' : 'Start'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameIntroModal;
