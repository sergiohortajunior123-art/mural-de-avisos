export default function FormularioAviso({
  form,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  isSaving,
  error,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <section className={`formulario${isEditing ? " formulario-editando" : ""}`}>
      <h2 className="formulario-titulo">{isEditing ? "Editar aviso" : "Novo aviso"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Título do aviso"
          />
        </div>

        <div className="campo">
          <label htmlFor="texto">Texto</label>
          <textarea
            id="texto"
            value={form.body}
            onChange={(e) => onChange("body", e.target.value)}
            placeholder="Escreva o conteúdo do aviso"
            rows={6}
          />
        </div>

        {error && <p className="formulario-erro">{error}</p>}

        <div className="formulario-botoes">
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : isEditing ? "Salvar" : "Publicar aviso"}
          </button>

          {isEditing && (
            <button type="button" className="botao-secundario" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}