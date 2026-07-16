/**
 * VoipCall.jsx — VINORA WebRTC Video Calling
 * ─────────────────────────────────────────────────────────────
 * Features:
 *   • RTCPeerConnection with STUN servers
 *   • SDP Offer / Answer exchange via Socket.IO
 *   • ICE Candidate exchange
 *   • Mute / Unmute microphone
 *   • Camera On / Off
 *   • Screen sharing (switch track without ending call)
 *   • MediaRecorder — record merged local stream, auto-download .webm
 *   • Save recording metadata to MongoDB
 *   • Connection status display
 *   • Reconnect on ICE failure
 *   • JWT-authenticated recording save
 *   • Mobile-friendly UI
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../config/api";
import "./VoipCall.css";

// ─── STUN servers ───────────────────────────────────────────
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" }
  ]
};

// ─── Status helpers ─────────────────────────────────────────
const STATUS = {
  READY:        "ready",
  CALLING:      "calling",
  CONNECTED:    "connected",
  DISCONNECTED: "disconnected",
  RECORDING:    "recording"
};

const STATUS_LABELS = {
  [STATUS.READY]:        "Ready",
  [STATUS.CALLING]:      "Calling…",
  [STATUS.CONNECTED]:    "Connected",
  [STATUS.DISCONNECTED]: "Disconnected",
  [STATUS.RECORDING]:    "Recording"
};

// ─── Random room-ID generator ────────────────────────────────
const generateRoomId = () =>
  "VINORA-" + Math.random().toString(36).substr(2, 6).toUpperCase();

// ════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════
const VoipCall = () => {

  // ── Auth ───────────────────────────────────────────────────
  const token    = localStorage.getItem("token");
  const userRaw  = localStorage.getItem("user");
  const authUser = userRaw ? JSON.parse(userRaw) : null;

  // ── Refs ───────────────────────────────────────────────────
  const localVideoRef  = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef      = useRef(null);
  const pcRef          = useRef(null);         // RTCPeerConnection
  const localStreamRef = useRef(null);         // camera / mic stream
  const screenStreamRef = useRef(null);        // screen share stream
  const recorderRef    = useRef(null);         // MediaRecorder
  const recChunks      = useRef([]);
  const recStartTime   = useRef(null);
  const remotePeerId   = useRef(null);         // socket ID of the other peer

  // ── State ──────────────────────────────────────────────────
  const [roomId, setRoomId]             = useState("");
  const [status, setStatus]             = useState(STATUS.READY);
  const [isMuted, setIsMuted]           = useState(false);
  const [isCamOff, setIsCamOff]         = useState(false);
  const [isSharing, setIsSharing]       = useState(false);
  const [isRecording, setIsRecording]   = useState(false);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [error, setError]               = useState("");
  const [info, setInfo]                 = useState("");
  const [inCall, setInCall]             = useState(false);
  const [hasRemote, setHasRemote]       = useState(false);

  // ── Cleanup on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => {
      cleanupCall();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []); // eslint-disable-line

  // ─────────────────────────────────────────────────────────
  // Create RTCPeerConnection
  // ─────────────────────────────────────────────────────────
  const createPeerConnection = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Remote stream → remote video
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setHasRemote(true);
      }
    };

    // ICE candidate → send to peer
    pc.onicecandidate = (event) => {
      if (event.candidate && remotePeerId.current && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          to: remotePeerId.current,
          candidate: event.candidate
        });
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      const s = pc.connectionState;
      console.log("[WebRTC] Connection state:", s);

      if (s === "connected") {
        setStatus(STATUS.CONNECTED);
        setInfo("✅ Peer connected!");
        setTimeout(() => setInfo(""), 3000);
      } else if (s === "disconnected" || s === "failed") {
        setStatus(STATUS.DISCONNECTED);
        setError("Peer disconnected or connection failed.");
        setHasRemote(false);
      } else if (s === "closed") {
        setStatus(STATUS.READY);
        setHasRemote(false);
      }
    };

    // ICE failure reconnect attempt
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "failed") {
        console.warn("[WebRTC] ICE failed — attempting restart");
        pc.restartIce();
      }
    };

    return pc;
  }, []);

  // ─────────────────────────────────────────────────────────
  // Start local camera + mic
  // ─────────────────────────────────────────────────────────
  const startLocalStream = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Camera/microphone permission denied. Please allow access.");
      } else if (err.name === "NotFoundError") {
        setError("No camera or microphone found.");
      } else {
        setError("Could not access camera: " + err.message);
      }
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // Connect socket & set up all listeners
  // ─────────────────────────────────────────────────────────
  const connectSocket = useCallback((onConnected) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(API, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
      onConnected(socket);
    });

    socket.on("connect_error", (err) => {
      setError("Cannot connect to signaling server: " + err.message);
    });

    // ── Peer joined this room (we are the caller) ──────────
    socket.on("peer-joined", async ({ socketId, userName }) => {
      console.log("[Socket] Peer joined:", socketId, userName);
      remotePeerId.current = socketId;
      setInfo(`${userName || "A user"} joined the room. Creating offer…`);
      setStatus(STATUS.CALLING);

      // Create offer
      const pc = createPeerConnection();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", { to: socketId, offer });
    });

    // ── We received an offer (we are the callee) ───────────
    socket.on("offer", async ({ from, offer }) => {
      console.log("[Socket] Received offer from:", from);
      remotePeerId.current = from;
      setStatus(STATUS.CALLING);

      const pc = createPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { to: from, answer });
    });

    // ── We received an answer ───────────────────────────────
    socket.on("answer", async ({ from, answer }) => {
      console.log("[Socket] Received answer from:", from);
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    // ── ICE candidate ───────────────────────────────────────
    socket.on("ice-candidate", async ({ from, candidate }) => {
      if (pcRef.current && candidate) {
        try {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (e) {
          console.warn("[ICE] Failed to add candidate:", e);
        }
      }
    });

    // ── Room events ─────────────────────────────────────────
    socket.on("room-joined", ({ roomSize }) => {
      console.log("[Socket] Joined room. Size:", roomSize);
      if (roomSize === 1) {
        setInfo("Waiting for someone to join…");
      }
    });

    socket.on("room-full", () => {
      setError("Room is full (max 2 users).");
      setInCall(false);
      socket.disconnect();
    });

    socket.on("peer-left", ({ userName }) => {
      setStatus(STATUS.DISCONNECTED);
      setError(`${userName || "The other user"} left the call.`);
      setHasRemote(false);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    });

    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected from server");
    });
  }, [createPeerConnection]);

  // ─────────────────────────────────────────────────────────
  // START CALL (create room)
  // ─────────────────────────────────────────────────────────
  const handleStartCall = async () => {
    setError("");
    const rid = roomId.trim() || generateRoomId();
    setRoomId(rid);

    const stream = await startLocalStream();
    if (!stream) return;

    setInCall(true);
    setStatus(STATUS.CALLING);

    connectSocket((socket) => {
      socket.emit("join-room", {
        roomId: rid,
        userId: authUser?._id,
        userName: authUser?.name || "User"
      });
    });
  };

  // ─────────────────────────────────────────────────────────
  // JOIN CALL (join existing room)
  // ─────────────────────────────────────────────────────────
  const handleJoinCall = async () => {
    setError("");
    const rid = roomId.trim();
    if (!rid) {
      setError("Please enter a Room ID to join.");
      return;
    }

    const stream = await startLocalStream();
    if (!stream) return;

    setInCall(true);
    setStatus(STATUS.CALLING);

    connectSocket((socket) => {
      socket.emit("join-room", {
        roomId: rid,
        userId: authUser?._id,
        userName: authUser?.name || "User"
      });
    });
  };

  // ─────────────────────────────────────────────────────────
  // END CALL
  // ─────────────────────────────────────────────────────────
  const handleEndCall = () => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("leave-room", { roomId });
    }
    cleanupCall();
    setStatus(STATUS.READY);
    setInCall(false);
    setHasRemote(false);
    setInfo("");
    setError("");
  };

  const cleanupCall = () => {
    // Stop recording if active
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }

    // Stop local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    // Stop screen tracks
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }

    // Close peer connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    remotePeerId.current = null;
    setIsMuted(false);
    setIsCamOff(false);
    setIsSharing(false);
    setIsRecording(false);
  };

  // ─────────────────────────────────────────────────────────
  // MUTE / UNMUTE
  // ─────────────────────────────────────────────────────────
  const toggleMute = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = isMuted; // flip
    });
    setIsMuted(!isMuted);
  };

  // ─────────────────────────────────────────────────────────
  // CAMERA ON / OFF
  // ─────────────────────────────────────────────────────────
  const toggleCamera = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = isCamOff; // flip
    });
    setIsCamOff(!isCamOff);
  };

  // ─────────────────────────────────────────────────────────
  // SCREEN SHARE / STOP SHARE
  // (switches the video track in the RTCPeerConnection)
  // ─────────────────────────────────────────────────────────
  const toggleScreenShare = async () => {
    setError("");
    if (isSharing) {
      // Switch back to camera
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }

      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      if (cameraTrack && pcRef.current) {
        const sender = pcRef.current
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(cameraTrack);
      }

      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      setIsSharing(false);
    } else {
      // Start screen share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        screenStreamRef.current = screenStream;

        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace track in peer connection
        if (pcRef.current) {
          const sender = pcRef.current
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        }

        // Show screen in local preview
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        // Auto-stop when user presses browser stop button
        screenTrack.onended = () => {
          toggleScreenShare();
        };

        setIsSharing(true);
      } catch (err) {
        if (err.name === "NotAllowedError") {
          setError("Screen share permission denied.");
        } else {
          setError("Screen share error: " + err.message);
        }
      }
    }
  };

  // ─────────────────────────────────────────────────────────
  // RECORD / STOP RECORD
  // ─────────────────────────────────────────────────────────
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const stream = localStreamRef.current;
    if (!stream) {
      setError("Start the call first before recording.");
      return;
    }

    setRecordingBlob(null);
    setRecordingUrl("");
    recChunks.current = [];
    recStartTime.current = Date.now();

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

    const recorder = new MediaRecorder(stream, { mimeType });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recChunks.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const duration = Math.round((Date.now() - recStartTime.current) / 1000);

      setRecordingBlob(blob);
      setRecordingUrl(url);
      setIsRecording(false);
      setStatus(STATUS.CONNECTED);

      // Auto-download
      autoDownload(blob, url);

      // Save metadata to MongoDB
      saveRecordingMeta(blob, duration);
    };

    recorder.start(1000); // collect data every second
    recorderRef.current = recorder;
    setIsRecording(true);
    setStatus(STATUS.RECORDING);
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  const autoDownload = (blob, url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `vinora-call-${roomId}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const saveRecordingMeta = async (blob, duration) => {
    if (!token) return;
    try {
      const filename = `vinora-call-${roomId}-${Date.now()}.webm`;
      await fetch(`${API}/api/recordings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId,
          filename,
          duration
        })
      });
    } catch (err) {
      console.warn("Could not save recording metadata:", err);
    }
  };

  // ─────────────────────────────────────────────────────────
  // MANUAL DOWNLOAD (if user wants to re-download)
  // ─────────────────────────────────────────────────────────
  const handleManualDownload = () => {
    if (recordingBlob && recordingUrl) {
      autoDownload(recordingBlob, recordingUrl);
    }
  };

  // ─────────────────────────────────────────────────────────
  // RENDER: not logged in
  // ─────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="voip-page">
        <div className="voip-header">
          <h1>📹 VINORA Video Call</h1>
        </div>
        <div className="voip-auth-required">
          <h2>🔐 Login Required</h2>
          <p>You must be logged in to start or join a video call.</p>
          <Link to="/login">Login to continue</Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // STATUS badge class
  // ─────────────────────────────────────────────────────────
  const badgeClass = `voip-status-badge ${
    isRecording ? STATUS.RECORDING
    : status === STATUS.CONNECTED ? STATUS.CONNECTED
    : status === STATUS.CALLING ? STATUS.CALLING
    : status === STATUS.DISCONNECTED ? STATUS.DISCONNECTED
    : STATUS.READY
  }`;

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="voip-page">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="voip-header">
        <h1>📹 VINORA Video Call</h1>
        <div className={badgeClass}>
          <span className="voip-status-dot" />
          {isRecording ? "Recording" : STATUS_LABELS[status]}
        </div>
      </div>

      {/* ── Error banner ──────────────────────────────────── */}
      {error && (
        <div className="voip-error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* ── Info banner ───────────────────────────────────── */}
      {info && !error && (
        <div className="voip-info-banner">
          ℹ️ {info}
        </div>
      )}

      {/* ── Room panel ────────────────────────────────────── */}
      {!inCall && (
        <div className="voip-room-panel">
          <h2>Enter or create a Room ID</h2>
          <div className="voip-room-input-row">
            <input
              id="voip-room-id-input"
              className="voip-room-input"
              type="text"
              placeholder="e.g. VINORA-ABC123"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              maxLength={24}
            />
            <button
              className="voip-generate-btn"
              onClick={() => setRoomId(generateRoomId())}
            >
              Generate
            </button>
          </div>
        </div>
      )}

      {/* ── Video grid ────────────────────────────────────── */}
      <div className="voip-video-grid">

        {/* Local video */}
        <div className="voip-video-tile" id="local-video-tile">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ display: inCall ? "block" : "none" }}
          />
          {!inCall && (
            <div className="voip-tile-placeholder">
              <svg viewBox="0 0 24 24">
                <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
              <span>Your Camera</span>
            </div>
          )}
          <span className="voip-tile-label">
            {authUser?.name || "You"} {isMuted ? "🔇" : ""} {isCamOff ? "📷✗" : ""}
          </span>
        </div>

        {/* Remote video */}
        <div className="voip-video-tile" id="remote-video-tile">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ display: hasRemote ? "block" : "none" }}
          />
          {!hasRemote && (
            <div className="voip-tile-placeholder">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <span>
                {status === STATUS.CALLING ? "Waiting for peer…" : "Remote Peer"}
              </span>
            </div>
          )}
          <span className="voip-tile-label">Remote</span>
        </div>

      </div>

      {/* ── Controls ──────────────────────────────────────── */}
      <div className="voip-controls" id="voip-controls-bar">

        {/* Start Call */}
        <button
          id="btn-start-call"
          className="voip-btn btn-start"
          onClick={handleStartCall}
          disabled={inCall}
        >
          <svg viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.26.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
          </svg>
          Start Call
        </button>

        {/* Join Call */}
        <button
          id="btn-join-call"
          className="voip-btn btn-join"
          onClick={handleJoinCall}
          disabled={inCall}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
          Join Call
        </button>

        <div className="voip-divider" />

        {/* Mute */}
        <button
          id="btn-mute"
          className={`voip-btn ${isMuted ? "btn-active" : ""}`}
          onClick={toggleMute}
          disabled={!inCall}
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24">
              <path d="M19 11a7 7 0 0 1-.5 2.6l-1.5-1.5c.1-.35.2-.71.2-1.1V5a3.5 3.5 0 1 0-7 0v.4L5.1 1.36 3.66 2.79 22.24 21.38l1.44-1.44L19 15.56V11zm-9 1.7A3.5 3.5 0 0 1 8.5 11V7.2L10 8.69V11a1.5 1.5 0 0 0 .54 1.16l-.54.54zm-1 2.42V18h-1.5v3h7V18H14v-2.88A7 7 0 0 1 5 11H3a9 9 0 0 0 6 8.48V18.5H9v1.5H7.5V18z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm6-3a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.93V21h2v-2.07A8 8 0 0 0 20 11h-2z" />
            </svg>
          )}
          {isMuted ? "Unmute" : "Mute"}
        </button>

        {/* Camera */}
        <button
          id="btn-camera"
          className={`voip-btn ${isCamOff ? "btn-active" : ""}`}
          onClick={toggleCamera}
          disabled={!inCall}
        >
          {isCamOff ? (
            <svg viewBox="0 0 24 24">
              <path d="M21 6.5l-4-4-11.5 11.5L3 17l2.5 2.5L7 18l2 2h12V6.5zm-1 9.5H9.5L20 5.5V16zM3.27 2L2 3.27l2.73 2.73H3L3 18h12l1 1 3 3 1.27-1.27L3.27 2zm10.73 12H5V8h.73l8 8z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          )}
          {isCamOff ? "Cam On" : "Cam Off"}
        </button>

        {/* Screen Share */}
        <button
          id="btn-screen-share"
          className={`voip-btn ${isSharing ? "btn-active" : ""}`}
          onClick={toggleScreenShare}
          disabled={!inCall}
        >
          <svg viewBox="0 0 24 24">
            <path d="M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h6l-2 3v1h8v-1l-2-3h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 13H4V5h16v11z" />
          </svg>
          {isSharing ? "Stop Share" : "Screen Share"}
        </button>

        <div className="voip-divider" />

        {/* Record */}
        <button
          id="btn-record"
          className={`voip-btn ${isRecording ? "btn-active" : "btn-record"}`}
          onClick={toggleRecording}
          disabled={!inCall}
        >
          {isRecording ? (
            <svg viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
          {isRecording ? "Stop Rec" : "Record"}
        </button>

        {/* Download recording */}
        {recordingUrl && (
          <button
            id="btn-download-rec"
            className="voip-btn btn-download"
            onClick={handleManualDownload}
          >
            <svg viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Download
          </button>
        )}

        <div className="voip-divider" />

        {/* End Call */}
        <button
          id="btn-end-call"
          className="voip-btn btn-end"
          onClick={handleEndCall}
          disabled={!inCall}
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
          End Call
        </button>

      </div>

      {/* ── Room info (when in call) ───────────────────────── */}
      {inCall && (
        <div className="voip-info-banner" style={{ marginTop: 16 }}>
          🔑 Room ID: <strong style={{ marginLeft: 8, letterSpacing: 1 }}>{roomId}</strong>
          <span style={{ marginLeft: 10, color: "#888", fontSize: 12 }}>
            (Share this with your friend)
          </span>
        </div>
      )}

    </div>
  );
};

export default VoipCall;
