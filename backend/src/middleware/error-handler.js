const errorHandler = (err, req, res, next) => {
  // 1. Log the full error to your backend terminal so YOU can read and debug it
  console.error("[SERVER ERROR]:", {
    message: err.message,
    stack: err.stack,
    status: err.status,
  });

  // 2. Fall back to a 500 status code if no specific code was assigned to the error
  const statusCode = err.status || 500;

  // 3. Send a clean, helpful JSON payload back to the frontend client
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong, please try again later.",
  });
};

// Exporting the function at the bottom to stay matching your style preference
export { errorHandler };
