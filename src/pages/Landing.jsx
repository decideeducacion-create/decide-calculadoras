import './Landing.css'; // opcional, para estilos

export default function Landing() {
  return (
    <div className="landing-container">
      <div className="content">
        <img 
          src="/images/portada.png" 
          alt="Portada del libro El Mapa del Dinero"
          className="portada"
        />
        
        <img 
          src="/images/editorial.png" 
          alt="Logo de Decide Digital"
          className="logo"
        />
      </div>
    </div>
  );
}