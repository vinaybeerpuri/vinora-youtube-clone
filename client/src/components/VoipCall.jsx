import React, { useRef, useState } from "react";

const VoipCall = () => {
  const localVideo = useRef(null);
  const screenVideo = useRef(null);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const [status, setStatus] = useState("Ready");
  const [recordingUrl, setRecordingUrl] = useState("");

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = stream;
    setStatus("Video call started");
  };

  const shareScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    screenVideo.current.srcObject = stream;
    setStatus("Screen sharing active");
  };

  const startRecording = () => {
    const stream = screenVideo.current?.srcObject || localVideo.current?.srcObject;
    if (!stream) {
      alert("Start camera or screen sharing first.");
      return;
    }

    chunks.current = [];
    recorder.current = new MediaRecorder(stream);
    recorder.current.ondataavailable = (event) => chunks.current.push(event.data);
    recorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/webm" });
      setRecordingUrl(URL.createObjectURL(blob));
      setStatus("Recording saved locally");
    };
    recorder.current.start();
    setStatus("Recording");
  };

  const stopRecording = () => {
    if (recorder.current?.state === "recording") recorder.current.stop();
  };

  const endCall = () => {
    [localVideo.current?.srcObject, screenVideo.current?.srcObject].forEach((stream) => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    });
    localVideo.current.srcObject = null;
    screenVideo.current.srcObject = null;
    setStatus("Call ended");
  };

  return (
    <section className="call-panel">
      <div className="section-heading">
        <h2>Friends Video Call</h2>
        <span>{status}</span>
      </div>
      <div className="call-grid">
        <video ref={localVideo} autoPlay playsInline muted />
        <video ref={screenVideo} autoPlay playsInline muted />
      </div>
      <div className="button-row">
        <button onClick={startCamera}>Start Call</button>
        <button onClick={shareScreen}>Share YouTube Screen</button>
        <button onClick={startRecording}>Record</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={endCall}>End</button>
      </div>
      {recordingUrl && (
        <a className="download-link" href={recordingUrl} download="realtube-call-recording.webm">
          Download recorded call
        </a>
      )}
    </section>
  );
};

export default VoipCall;
