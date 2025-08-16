export const selectors = {
  uploadInput: 'input[type="file"]',
  rowSelector: "span.text-sm.truncate",
  deleteButton: 'button[aria-label="Delete file"]',
  processFileButton: 'button[aria-label="Process file"]',
  uploadProgress: '[data-testid="upload-progress"], progress, .upload-progress',
  uploadItemRow: '[data-testid="upload-item"], .uploaded-file, .file-row',
  chatTextarea: 'textarea',
  askButton: 'button:has-text("Ask Question")',
  chatMessageContainer: '[data-testid="chat-messages"], .chat-messages, [role="log"]',
  chatUserBubble: '[data-testid="msg-user"], .message.user, .bubble.user',
  chatBotBubble: '[data-testid="msg-bot"], .message.bot, .bubble.bot',
};
