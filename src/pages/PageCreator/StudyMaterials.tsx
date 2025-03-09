import "./StudyMaterials.css";

export default function StudyMaterials() {
  return (
    <div className="study-materials-page">
      <h2>Materiais de Estudo</h2>
      <ul className="materials-list">
        <li><a href="#">📄 Apostila PDF</a></li>
        <li><a href="#">🎞️ Apresentação em PowerPoint</a></li>
        <li><a href="#">📚 Artigo científico</a></li>
      </ul>
    </div>
  );
}
