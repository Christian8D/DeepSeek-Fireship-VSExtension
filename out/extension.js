"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ollama_1 = require("ollama"); // Ensure this matches how Ollama exports its functionalities
function activate(context) {
    const disposable = vscode.commands.registerCommand('CC-DeepSeek-ext.Deep', () => {
        // Create a new webview panel
        const panel = vscode.window.createWebviewPanel('deepChat', // Identifies the webview
        'Deep Seek Chat', // Title of the panel
        vscode.ViewColumn.One, // Where it will open
        { enableScripts: true } // Enable JavaScript inside the webview
        );
        // Set the webview's content
        panel.webview.html = getWebviewContent();
        // Initialize Ollama client
        const ollama = new ollama_1.Ollama(); // Adjust initialization based on Ollama's documentation
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';
                try {
                    const streamResponse = await ollama.chat({
                        model: 'deepseek-r1:14b',
                        messages: [{ role: 'user', content: userPrompt }],
                        stream: true,
                    });
                    for await (const segment of streamResponse) {
                        if (segment.message && segment.message.content) {
                            responseText += segment.message.content;
                            // Send the accumulated response to the webview
                            panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                        }
                    }
                }
                catch (error) {
                    const errorMessage = (error instanceof Error) ? error.message : String(error);
                    panel.webview.postMessage({ command: 'chatResponse', text: 'Error: ' + errorMessage });
                }
            }
        }, undefined, context.subscriptions);
        // Add the panel to subscriptions to manage its lifecycle
        context.subscriptions.push(panel);
    });
    // Register the disposable command
    context.subscriptions.push(disposable);
}
function deactivate() { }


function getWebviewContent() {
    return /*HTML*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Deep Seek Chat</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #007acc; }
                #chatbox { 
                    border: 1px solid #ddd; 
                    padding: 10px; 
                    height: 300px; 
                    overflow-y: auto; 
                    margin-bottom: 10px; 
                }
                textarea { width: 100%; padding: 8px; margin-top: 10px; resize: vertical; }
                button { padding: 8px 16px; margin-top: 10px; }
                .message { 
                    margin: 5px 0; 
                    white-space: pre-wrap; /* Preserve whitespace and line breaks */
                }
                .user { color: #007acc; }
                .deepseek { color: rgb(97, 175, 212); }
            </style>
        </head>
        <body>
            <h1>Deep Seek Chat</h1>
            <div id="chatbox">
                <!-- Chat messages will appear here -->
            </div>
            <textarea id="prompt" rows="3" placeholder="Type a message..."></textarea>
            <button id="askBtn">Send</button>

            <script>
                const vscode = acquireVsCodeApi();

                document.getElementById('askBtn').addEventListener('click', () => {
                    const text = document.getElementById('prompt').value.trim();
                    if (text) {
                        appendMessage('You', text);
                        vscode.postMessage({ command: 'chat', text });
                        document.getElementById('prompt').value = '';
                    }
                });

                // Listen for messages from the extension
                window.addEventListener('message', event => {
                    const { command, text } = event.data;
                    if (command === 'chatResponse') {
                        updateDeepSeekMessage(text);
                    }
                });

                // Function to append user messages to the chatbox
                function appendMessage(sender, message) {
                    const chatbox = document.getElementById('chatbox');
                    const messageElement = document.createElement('p');
                    messageElement.className = 'message ' + (sender.toLowerCase());
                    messageElement.textContent = sender + ': ' + message; // Use textContent to preserve formatting
                    chatbox.appendChild(messageElement);
                    chatbox.scrollTop = chatbox.scrollHeight;
                }

                // Function to update DeepSeek's message
                function updateDeepSeekMessage(message) {
                    let deepSeekElement = document.getElementById('deepseek-message');
                    if (!deepSeekElement) {
                        deepSeekElement = document.createElement('p');
                        deepSeekElement.id = 'deepseek-message';
                        deepSeekElement.className = 'message deepseek';
                        deepSeekElement.innerHTML = '<strong>DeepSeek:</strong> ';
                        document.getElementById('chatbox').appendChild(deepSeekElement);
                    }
                    // Replace newline characters with <br> for proper formatting
                    const formattedMessage = message.replace(/\\n/g, '<br>');
                    deepSeekElement.innerHTML = '<strong>DeepSeek:</strong> ' + formattedMessage;
                    document.getElementById('chatbox').scrollTop = document.getElementById('chatbox').scrollHeight;
                }
            </script>
        </body>
        </html>
    `;
}