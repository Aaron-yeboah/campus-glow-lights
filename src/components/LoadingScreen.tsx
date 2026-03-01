import Lottie from "lottie-react";
import splashAnimation from "@/assets/splashscreen.json";

interface LoadingScreenProps {
    message?: string;
    fullScreen?: boolean;
}

const LoadingScreen = ({ message = "Syncing with Supabase...", fullScreen = false }: LoadingScreenProps) => {
    return (
        <div className={`flex flex-col items-center justify-center ${fullScreen ? "fixed inset-0 bg-background z-50" : "py-20"}`}>
            <div className="w-48 h-48 sm:w-64 sm:h-64">
                <Lottie
                    animationData={splashAnimation}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            {message && (
                <p className="text-muted-foreground font-medium animate-pulse mt-4 text-sm sm:text-base">
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingScreen;
