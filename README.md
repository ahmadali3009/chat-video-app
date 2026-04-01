# WebRTC Chat & Video Application

A real-time video and audio chat application built with React, Node.js, Socket.io, and WebRTC. Users can join rooms using an email and a room ID to start a video call with another participant.

## 🚀 Features

- **Real-time Video/Audio**: Peer-to-peer communication using WebRTC.
- **Room System**: Join specific rooms with a room ID.
- **Email Identification**: Identify participants in a room by their email.
- **Dynamic Negotiation**: Handles WebRTC negotiation automatically (offer/answer/ICE candidates).

## 🛠️ Technology Stack

- **Frontend**:
  - React.js (Vite)
  - Socket.io-client (Real-time signaling)
  - WebRTC API (Media streaming)
  - React Router (Routing)
- **Backend**:
  - Node.js
  - Express.js
  - Socket.io (Signaling server)
  - CORS (Cross-Origin Resource Sharing)

## 📁 Project Structure

```text
chat-video-app/
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # Homepage and Roompage components
│   │   ├── context/       # Socket and Peer WebRTC contexts
│   │   └── App.jsx        # Main routing
├── server/                # Node.js backend application
│   └── index.js           # Socket.io signaling logic
└── README.md              # Project documentation
```

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd chat-video-app
```

### 2. Setup the Server
```bash
cd server
npm install
npm start
```
The server will run on:
- Express: `http://localhost:8080`
- Socket.io: `ws://localhost:8001`

### 3. Setup the Client
```bash
cd client
npm install
npm run dev
```
The client will typically run on `http://localhost:5173`.

## 📖 How it Works

1. **Join Room**: Enter your email and a Room ID on the homepage.
2. **Signaling**: The server use Socket.io to exchange WebRTC offers and answers between peers.
3. **Peer Connection**: Once signaling is complete, a direct P2P connection is established for video and audio.
4. **Negotiation**: The app automatically handles `negotiationneeded` events to ensure a stable connection.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the ISC License.
