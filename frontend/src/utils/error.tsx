// type ErrorProps = {
//   error: Error;
//   reset: () => void;
// };

// export const error = ({ error, reset }: ErrorProps) => {
//   return (
//     <div>
//       <h1>Something went wrong</h1>
//       <p>{error.message}</p>
//       <button onClick={reset}>Try again</button>
//     </div>
//   );
// };

import React from "react";
import { Navigate } from "react-router-dom";

class ErrorHandler extends React.Component {
  state = { hasError: false };
  name: string;
  constructor(message = "Authentication failed") {
    super(message);
    this.name = "ErrorHandler";
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // if (this.state.hasError) {
    //   return <Navigate to="/error" />;
    // }

    // return this.props.children;

    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;

    // if (this.state.hasError) {
    //   return <div>Error: {this.name}</div>;
    //   // return this.props.fallback;
    // }

    // return <div>{this.name}</div>;
    // return this.props.children;
  }
}

export default ErrorHandler;
