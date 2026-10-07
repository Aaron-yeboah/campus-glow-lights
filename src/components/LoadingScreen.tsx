import { createPortal } from "react-dom";
import Lottie from "lottie-react";
import splashAnimation from "@/assets/splashscreen.json";

interface LoadingScreenProps {
    message?: string;
    fullScreen?: boolean;
    translucent?: boolean;
}

const LoadingScreen = ({ message = "Syncing with Supabase...", fullScreen = false, translucent = false }: LoadingScreenProps) => {
    const isOverlay = fullScreen || translucent;
    const backgroundClass = translucent
        ? "fixed inset-0 bg-white/85 backdrop-blur-md z-[9999]"
        : (fullScreen ? "fixed inset-0 bg-background z-[9999]" : "py-20");

    const content = (
        <div className={`flex flex-col items-center justify-center ${backgroundClass}`}>
            <div className="w-48 h-48 sm:w-64 sm:h-64">
                <Lottie
                    animationData={splashAnimation}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            {message && (
                <p className={`font-bold animate-pulse mt-4 text-sm sm:text-base ${
                    translucent
                        ? "text-[#1A365D]"
                        : "text-muted-foreground"
                }`}>
                    {message}
                </p>
            )}
        </div>
    );

    if (isOverlay && typeof document !== "undefined") {
        return createPortal(content, document.body);
    }

    return content;
};

export default LoadingScreen;
