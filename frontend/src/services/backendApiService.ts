/**
 * Backend API Service for chat functionality.
 * Provides a single exported function to send a message to the backend and receive the parsed response.
 * Helpers and configuration are encapsulated within this module.
 */

// Global configuration variables
const API_URL = 'http://127.0.0.1:5000/chat_with_semantic_search';
const HEADERS = {
  'Content-Type': 'application/json',
};

function _buildRequestBody(message: string): string {
	return JSON.stringify({ message });
}

/**
 * Handles the API response for the semantic search endpoint.
 * Returns the 'response' field from the backend.
 */
async function _handleApiResponse(response: Response): Promise<{ response: string }> {
	if (!response.ok) {
		throw new Error(`API error: ${response.status}`);
	}
	return response.json();
}

/**
 * Sends a chat message to the semantic search backend API and returns the AI response string.
 * @param message - The user message to send
 * @returns Promise resolving to the backend response object: { response: string }
 */
export async function sendChatMessage(message: string): Promise<{ response: string }> {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: HEADERS,
		body: _buildRequestBody(message),
	});
	return _handleApiResponse(response);
}
