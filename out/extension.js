// import * as vscode from 'vscode';
// import { Ollama } from 'ollama'; // Ensure this matches how Ollama exports its functionalities
// export function activate(context: vscode.ExtensionContext) {
//     const disposable = vscode.commands.registerCommand('CC-DeepSeek-ext.Deep', () => {
//         // Create a new webview panel
//         const panel = vscode.window.createWebviewPanel(
//             'deepChat',                // Identifies the webview
//             'Deep Seek Chat',          // Title of the panel
//             vscode.ViewColumn.One,      // Where it will open
//             { enableScripts: true }    // Enable JavaScript inside the webview
//         );
//         // Set the webview's content
//         panel.webview.html = getWebviewContent();
//         // Initialize Ollama client
//         const ollama = new Ollama(); // Adjust initialization based on Ollama's documentation
//         // Handle messages from the webview
//         panel.webview.onDidReceiveMessage(
//             async (message: any) => {
//                 if (message.command === 'chat') {
//                     const userPrompt = message.text;
//                     let responseText = '';
//                     try {
//                         const streamResponse = await ollama.chat({
//                             model: 'deepseek-r1:14b',
//                             messages: [{ role: 'user', content: userPrompt }],
//                             stream: true,
//                         });
//                         for await (const segment of streamResponse) {
//                             if (segment.message && segment.message.content) {
//                                 responseText += segment.message.content;
//                                 // Send the accumulated response to the webview
//                                 panel.webview.postMessage({ command: 'chatResponse', text: responseText });
//                             }
//                         }
//                     } catch (error) {
//                         const errorMessage = (error instanceof Error) ? error.message : String(error);
//                         panel.webview.postMessage({ command: 'chatResponse', text: 'Error: ' + errorMessage });
//                     }
//                 }
//             },
//             undefined,
//             context.subscriptions
//         );
//         // Add the panel to subscriptions to manage its lifecycle
//         context.subscriptions.push(panel);
//     });
//     // Register the disposable command
//     context.subscriptions.push(disposable);
// }
// export function deactivate() {}
// // Function to return the HTML content of the webview
// function getWebviewContent() {
//     return /*HTML*/`
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Deep Seek Chat</title>
//             <style>
//                 body { font-family: Arial, sans-serif; padding: 20px; }
//                 h1 { color: #007acc; }
//                 #chatbox { border: 1px solid #ddd; padding: 10px; height: 300px; overflow-y: auto; margin-bottom: 10px; }
//                 textarea { width: 100%; padding: 8px; margin-top: 10px; resize: vertical; }
//                 button { padding: 8px 16px; margin-top: 10px; }
//                 .message { margin: 5px 0; }
//                 .user { color: #007acc; }
//                 .deepseek { color:rgb(97, 175, 212); }
//             </style>
//         </head>
//         <body>
//             <h1>Deep Seek Chat</h1>
//             <div id="chatbox">
//                 <!-- Chat messages will appear here -->
//             </div>
//             <textarea id="prompt" rows="3" placeholder="Type a message..."></textarea>
//             <button id="askBtn">Send</button>
//             <script>
//                 const vscode = acquireVsCodeApi();
//                 document.getElementById('askBtn').addEventListener('click', () => {
//                     const text = document.getElementById('prompt').value.trim();
//                     if (text) {
//                         appendMessage('You', text);
//                         vscode.postMessage({ command: 'chat', text });
//                         document.getElementById('prompt').value = '';
//                     }
//                 });
//                 // Listen for messages from the extension
//                 window.addEventListener('message', event => {
//                     const { command, text } = event.data;
//                     if (command === 'chatResponse') {
//                         updateDeepSeekMessage(text);
//                     }
//                 });
//                 // Function to append user messages to the chatbox
//                 function appendMessage(sender, message) {
//                     const chatbox = document.getElementById('chatbox');
//                     const messageElement = document.createElement('p');
//                     messageElement.className = 'message ' + (sender.toLowerCase());
//                     messageElement.innerHTML = '<strong>' + sender + ':</strong> ' + message;
//                     chatbox.appendChild(messageElement);
//                     chatbox.scrollTop = chatbox.scrollHeight;
//                 }
//                 // Function to update DeepSeek's message
//                 function updateDeepSeekMessage(message) {
//                     let deepSeekElement = document.getElementById('deepseek-message');
//                     if (!deepSeekElement) {
//                         deepSeekElement = document.createElement('p');
//                         deepSeekElement.id = 'deepseek-message';
//                         deepSeekElement.className = 'message deepseek';
//                         deepSeekElement.innerHTML = '<strong>DeepSeek:</strong> ';
//                         document.getElementById('chatbox').appendChild(deepSeekElement);
//                     }
//                     // Update the content
//                     deepSeekElement.innerHTML = '<strong>DeepSeek:</strong> ' + message;
//                     document.getElementById('chatbox').scrollTop = document.getElementById('chatbox').scrollHeight;
//                 }
//             </script>
//         </body>
//         </html>
//     `;
// }
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const { Ollama } = require('ollama');
function activate(context) {
    console.log('DeepSeek Chat Extension is now active!');
    // Initialize Ollama client
    const ollama = new Ollama(); // Adjust initialization based on Ollama's documentation
    // Register the Deep Seek Chat command
    const chatDisposable = vscode.commands.registerCommand('CC-DeepSeek-ext.Deep', () => {
        // Create a new webview panel
        const panel = vscode.window.createWebviewPanel('deepChat', // Identifies the webview
        'Deep Seek Chat', // Title of the panel
        vscode.ViewColumn.One, // Editor column to show the new webview panel in
        { enableScripts: true } // Enable JavaScript in the webview
        );
        // Set the webview's initial HTML content
        panel.webview.html = getWebviewContent();
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
        // Manage the panel's lifecycle
        context.subscriptions.push(panel);
    });
    // Register the Generate Completion command
    const completionDisposable = vscode.commands.registerCommand('CC-DeepSeek-ext.GenerateCompletion', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const document = editor.document;
        const selection = editor.selection;
        // Get the text up to the cursor position
        const cursorPosition = selection.active;
        const range = new vscode.Range(new vscode.Position(0, 0), cursorPosition);
        const codeUpToCursor = document.getText(range);
        // Prepare the prompt for DeepSeek
        const prompt = `Provide a code completion for the following code:\n\n${codeUpToCursor}\n\nCompletion:`;
        try {
            const response = await ollama.chat({
                model: 'deepseek-r1:14b',
                messages: [{ role: 'user', content: prompt }],
                stream: false,
            });
            if (response && response.choices && response.choices.length > 0) {
                const completion = response.choices[0].message.content.trim();
                editor.edit(editBuilder => {
                    editBuilder.insert(cursorPosition, completion);
                });
            }
            else {
                vscode.window.showErrorMessage('No completion received from DeepSeek.');
            }
        }
        catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            vscode.window.showErrorMessage('Error generating completion: ' + errorMessage);
        }
    });
    // Register the Explain Code command
    const explainDisposable = vscode.commands.registerCommand('CC-DeepSeek-ext.ExplainCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const document = editor.document;
        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showErrorMessage('No code selected to explain.');
            return;
        }
        const selectedCode = document.getText(selection);
        // Prepare the prompt for DeepSeek
        const prompt = `Explain the following code in detail:\n\n${selectedCode}`;
        // Show a loading message
        const loading = vscode.window.setStatusBarMessage('DeepSeek: Explaining code...', 5000);
        try {
            const response = await ollama.chat({
                model: 'deepseek-r1:14b',
                messages: [{ role: 'user', content: prompt }],
                stream: false,
            });
            if (response && response.choices && response.choices.length > 0) {
                const explanation = response.choices[0].message.content.trim();
                vscode.window.showInformationMessage('DeepSeek Explanation', explanation);
                // Alternatively, display in the chat panel or another UI component
            }
            else {
                vscode.window.showErrorMessage('No explanation received from DeepSeek.');
            }
        }
        catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            vscode.window.showErrorMessage('Error explaining code: ' + errorMessage);
        }
        finally {
            loading.dispose();
        }
    });
    // Register all disposables
    context.subscriptions.push(chatDisposable, completionDisposable, explainDisposable);
}
/**
 * Deactivates the extension.
 */
function deactivate() { }
/**
 * Returns the HTML content for the webview.
 * @returns {string} - The HTML content.
 */
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
                    messageElement.className = 'message ' + sender.toLowerCase();
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
module.exports = {
    activate,
    deactivate
};
//# sourceMappingURL=extension.js.map