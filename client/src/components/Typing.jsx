import "../styles/Message.css";

function Typing() {
  return (
    <div className="message bot">
      <div className="avatar">🤖</div>

      <div className="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default Typing;