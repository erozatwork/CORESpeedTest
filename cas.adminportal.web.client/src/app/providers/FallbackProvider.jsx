import React from "react";

export default class FallbackProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Optional: log to a service or console
        console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500">
                            Something went wrong.
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Please refresh the page or try again later.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
