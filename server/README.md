# Socket.io Signaling Server

The backend signaling server for the chat-video-app, built with Express and Socket.io. It handles real-time communication between peers to exchange WebRTC session descriptions.

## 🛠️ Signaling Events

- **`join-room`**: When a user joins a room with a specific `roomID` and `emailID`.
- **`joined-room`**: Confirmation that the user has successfully joined.
- **`user-joined`**: A broadcast to other room participants that a new user has joined.
- **`incomming-user`**: Receives a WebRTC `offer` and routes it to the target peer.
- **`incomming-usercall`**: Emitted to a peer to notify them of an incoming call with an `offer`.
- **`call-accepted`**: Receives a WebRTC `answer` and routes it back to the caller.
- **`call-accepte`**: Emitted to the caller to signal that the call has been accepted.

## ⚙️ Development

```bash
# Install dependencies
npm install

# Start the signaling server
npm start
```

The server will run on:
- Express (API/Static): `http://localhost:8080`
- Socket.io (WebSocket): `http://localhost:8001`

## 📡 Technical Details

- **Port Configuration**: The Express server and the Socket.io server listen on different ports as configured in `index.js`.
- **CORS Support**: CORS is enabled to allow connections from the frontend development server.
- **Peer Lookup**: Uses `Map` to track mappings between personal emails and Socket IDs for efficient routing.
