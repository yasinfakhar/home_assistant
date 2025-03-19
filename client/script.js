// Configuration
// When running with Docker, API requests are proxied through Nginx
const SERVER_URL = '';
const API_ENDPOINT = `/api/process-audio`;

// DOM Elements
const recordBtn = document.getElementById('record-btn');
const processingStatus = document.getElementById('processing-status');
const transcriptElement = document.getElementById('transcript');
const assistantResponseElement = document.getElementById('assistant-response');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const lightCards = document.querySelectorAll('.light-card');
const audioUpload = document.getElementById('audio-upload');
const textCommand = document.getElementById('text-command');
const sendTextBtn = document.getElementById('send-text-btn');

// State variables
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let lightStates = {
    "1": false, // false = off, true = on
    "2": false
};

// Initialize the application
function init() {
    // Add event listeners for manual light control
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', handleManualToggle);
    });
    
    // Add event listeners for voice control
    recordBtn.addEventListener('click', toggleRecording);
    audioUpload.addEventListener('change', handleAudioUpload);
    
    // Add event listeners for text input
    sendTextBtn.addEventListener('click', handleTextCommand);
    textCommand.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleTextCommand();
        }
    });
    
    // Check if the server is running
    checkServerStatus();
}

// Check if the server is running
async function checkServerStatus() {
    try {
        const response = await fetch(`${SERVER_URL}/api/test`);
        if (response.ok) {
            console.log('Server is running');
        } else {
            console.error('Server is not responding correctly');
            showError('Server is not responding correctly. Please check if it\'s running.');
        }
    } catch (error) {
        console.error('Error connecting to server:', error);
        showError('Cannot connect to server. Please make sure the server is running.');
    }
}

// Handle manual light toggle
function handleManualToggle(event) {
    const lightId = event.currentTarget.dataset.lightId;
    const currentState = lightStates[lightId];
    const newState = !currentState;
    
    // Update light state
    updateLightState(lightId, newState ? 'on' : 'off');
}

// Toggle recording state
async function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        try {
            await startRecording();
        } catch (error) {
            console.error('Error starting recording:', error);
            showError('Could not access microphone. Please check permissions.');
        }
    }
}

// Start recording audio
async function startRecording() {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create media recorder
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        // Add event listeners
        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', processAudio);
        
        // Start recording
        mediaRecorder.start();
        isRecording = true;
        
        // Update UI
        recordBtn.classList.add('recording');
        processingStatus.textContent = 'Listening...';
    } catch (error) {
        console.error('Error accessing microphone:', error);
        showError('Could not access microphone. Please use the file upload or text input instead.');
    }
}

// Stop recording audio
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Update UI
        recordBtn.classList.remove('recording');
        processingStatus.textContent = 'Processing...';
    }
}

// Process recorded audio
async function processAudio() {
    try {
        // Create audio blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Convert to base64
        const base64Audio = await blobToBase64(audioBlob);
        
        // Send to server
        await sendAudioToServer(base64Audio);
    } catch (error) {
        console.error('Error processing audio:', error);
        showError('Error processing audio. Please try again.');
        processingStatus.textContent = 'Ready';
    }
}

// Convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Update light state
function updateLightState(lightId, action) {
    const isOn = action === 'on';
    lightStates[lightId] = isOn;
    
    // Update UI
    const lightCard = document.getElementById(`light-${lightId}`);
    const statusText = lightCard.querySelector('.status-text');
    const toggleBtn = lightCard.querySelector('.toggle-btn');
    
    if (isOn) {
        lightCard.classList.add('on');
        statusText.textContent = 'On';
        toggleBtn.textContent = 'Turn Off';
    } else {
        lightCard.classList.remove('on');
        statusText.textContent = 'Off';
        toggleBtn.textContent = 'Turn On';
    }
}

// Handle audio file upload
function handleAudioUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
        showError('Please upload an audio file');
        return;
    }
    
    processingStatus.textContent = 'Processing audio file...';
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const audioData = e.target.result;
        await sendAudioToServer(audioData);
    };
    reader.onerror = () => {
        showError('Error reading the audio file');
    };
    
    reader.readAsDataURL(file);
}

// Handle text command
function handleTextCommand() {
    const text = textCommand.value.trim();
    if (!text) return;
    
    processingStatus.textContent = 'Processing text command...';
    transcriptElement.textContent = text;
    
    // Send text to server for processing
    fetch(`${SERVER_URL}/api/process-text`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        handleAssistantResponse(data);
        textCommand.value = ''; // Clear the input field
    })
    .catch(error => {
        console.error('Error processing text command:', error);
        showError('Error processing text command. Please try again.');
    })
    .finally(() => {
        processingStatus.textContent = 'Ready';
    });
}

// Send audio to server
async function sendAudioToServer(audioData) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ audio: audioData })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        handleAssistantResponse(data);
    } catch (error) {
        console.error('Error processing audio:', error);
        showError('Error processing audio. Please try again.');
    } finally {
        processingStatus.textContent = 'Ready';
    }
}

// Handle assistant response
function handleAssistantResponse(data) {
    // Update UI with transcript and response
    if (data.transcript) {
        transcriptElement.textContent = data.transcript;
    }
    
    if (data.response && data.response.response_text) {
        assistantResponseElement.textContent = data.response.response_text;
        
        // If there's an action to perform, update the light state
        if (data.response.action && data.response.light_id) {
            const { action, light_id } = data.response;
            
            if (light_id === 'all') {
                // Update all lights
                updateLightState('1', action);
                updateLightState('2', action);
            } else {
                // Update specific light
                updateLightState(light_id, action);
            }
        }
    } else {
        assistantResponseElement.textContent = 'No response from assistant';
    }
}

// Show error message
function showError(message) {
    assistantResponseElement.textContent = `Error: ${message}`;
    assistantResponseElement.style.color = 'red';
    
    // Reset after 5 seconds
    setTimeout(() => {
        assistantResponseElement.style.color = '';
    }, 5000);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
