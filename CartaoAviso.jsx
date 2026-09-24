export default function CartaoAviso({ post, onEdit, onDelete }) {
  return (
    <article className="cartao">
      <h2>{post.title}</h2>
      <p>{post.body}</p>

      <div className="cartao-rodape">
        <span className="cartao-meta">
          aviso #{post.id} · autor {post.userId}
        </span>
        <div className="cartao-acoes">
          <button type="button" className="botao-outline" onClick={() => onEdit(post)}>
            Editar
          </button>
          <button
            type="button"
            className="botao-outline botao-perigo"
            onClick={() => onDelete(post.id)}
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}