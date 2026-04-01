# React WebRTC Client

The frontend part of the chat-video-app, built with Vite and React. It uses Socket.io-client for signaling and the WebRTC API for peer-to-peer video/audio communication.

## 🛠️ Main Components

- **`Homepage.jsx`**: User entry point where they choose an email and a Room ID.
- **`Roompage.jsx`**: The main interface for the video call. Manages media streams and WebRTC connections.
- **`context/Socket.jsx`**: Provides the Socket.io instance to the entire application.
- **`context/Peer.jsx`**: Encapsulates WebRTC Peer Connection logic, including offer/answer creation and track management.

## 🔑 Key Features

- **Media Access**: Requests camera and microphone permissions on room entry.
- **Auto-Negotiation**: Automatically handles `negotiationneeded` events from the RTCPeerConnection.
- **Dynamic Updates**: Displays the email of the person you are connected to.

## ⚙️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📡 WebRTC Signaling

This client follows a standard WebRTC handshake:
1. `join-room` emitted to server.
2. Server broadcasts `user-joined`.
3. Existing user creates an `offer` and sends it via server.
4. New user receives `offer`, creates an `answer`, and sends it back.
5. `setLocalDescription` and `setRemoteDescription` are called on both sides.
6. ICE candidates are exchanged to establish the P2P connection.
