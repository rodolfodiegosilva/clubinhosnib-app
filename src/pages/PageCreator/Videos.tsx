import "./Videos.css";

export default function Videos() {
  return (
    <div className="videos-page">
      <h2>Vídeo Aulas e Suas Descrições</h2>
      <div className="video-list">
        <div className="video-item">
          <iframe width="300" height="200" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Vídeo Aula 1"></iframe>
          <p>Descrição do vídeo 1</p>
        </div>
        <div className="video-item">
          <iframe width="300" height="200" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Vídeo Aula 2"></iframe>
          <p>Descrição do vídeo 2</p>
        </div>
      </div>
    </div>
  );
}
