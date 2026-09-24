import CartaoAviso from "./CartaoAviso";

export default function ListaAvisos({ posts, isLoading, loadError, onEdit, onDelete }) {
  return (
    <section className="lista">
      <div className="lista-cabecalho">
        <h2>Avisos publicados ({posts.length})</h2>
      </div>

      {posts.map((post) => (
        <CartaoAviso key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
      ))}

      {isLoading && <p className="estado estado-carregando">Carregando avisos...</p>}

      {!isLoading && loadError && (
        <p className="estado estado-erro">
          Não foi possível conectar à API (Network Error). Tente novamente.
        </p>
      )}

      {!isLoading && !loadError && posts.length === 0 && (
        <p className="estado estado-vazio">
          Nenhum aviso publicado — seja a primeira pessoa a escrever no mural.
        </p>
      )}
    </section>
  );
}