import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [recipes, setRecipes] = useState(() => {
      return sampleRecipes();
  });

  const [form, setForm] = useState({ title: "", ingredients: "", steps: "", tags: "" });
  const [query, setQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  function sampleRecipes() {
    return [
      {
        title: "Шоколадные кексы",
        ingredients: "200гр муки, 150гр сахара, 2 яйца, 50гр какао, 120мл молока",
        steps: "Смешать сухие. Добавить яйца и молоко. Выпекать 20 минут при 180°C.",
        tags: "десерт,выпечка",
      },
      {
        title: "Салат Цезарь",
        ingredients: "Листья салата, курица, гренки, пармезан, соус Цезарь",
        steps: "Нарезать курицу и обжарить. Смешать все ингредиенты с соусом.",
        tags: "здоровое",
      },
    ];
  }

  function resetForm() {
    setForm({ title: "", ingredients: "", steps: "", tags: "" });
    setEditingIndex(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) return;

    const newRecipe = { ...form, title: trimmedTitle };

    if (editingIndex !== null) {
      setRecipes((r) => r.map((item, i) => (i === editingIndex ? newRecipe : item)));
    } else {
      setRecipes((r) => [newRecipe, ...r]);
    }
    resetForm();
  }

  function handleDelete(index) {
    if (!window.confirm("Удалить рецепт?")) return;
    setRecipes((r) => r.filter((_, i) => i !== index));
  }

  function handleEdit(index) {
    setEditingIndex(index);
    setForm(recipes[index]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filtered = recipes.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.ingredients.toLowerCase().includes(q) ||
      r.tags.toLowerCase().includes(q) ||
      r.steps.toLowerCase().includes(q)
    );
  });

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Каталог рецептов</h1>
      </header>

      <main className="container">
        <section className="panel form-panel">
          <h2>{editingIndex !== null ? "Редактирование рецепта" : "Новый рецепт"}</h2>
          <form onSubmit={handleSubmit} className="recipe-form">
            <label>
              Название
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder=" Борщ"
              />
            </label>

            <label>
              ИНГРЕДИЕНТЫ
              <textarea
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                rows={3}
                placeholder="мясо, свекла..."
              />
            </label>

            <label>
              ПРИГОТОВЛЕНИЕ
              <textarea
                value={form.steps}
                onChange={(e) => setForm({ ...form, steps: e.target.value })}
                rows={4}
                placeholder="Шаги приготовления"
              />
            </label>

            <label>
              Тэги (через запятую)
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="тэг"
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="btn primary">
                {editingIndex !== null ? "Сохранить" : "Добавить рецепт"}
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  if (Object.values(form).some((v) => v)) resetForm();
                }}
              >
                Очистить
              </button>
            </div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="list-top">
            <input
              className="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию, ингредиентам или тэгам..."
            />
            <div className="counts">Найдено: {filtered.length}</div>
          </div>

          <div className="cards">
            {filtered.length === 0 && <div className="empty">Рецептов не найдено — добавьте первый!</div>}

            {filtered.map((r, i) => (
              <article className="card" key={i}>
                <div className="card-head">
                  <h3>{r.title}</h3>
                  <div className="card-tags">{r.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t, idx) => (
                    <span key={idx} className="tag">{t}</span>
                  ))}</div>
                </div>

                <div className="card-body">
                  <div className="sub">Ингредиенты</div>
                  <p className="ingredients">{r.ingredients}</p>

                  <div className="sub">Приготовление</div>
                  <p className="steps">{r.steps}</p>
                </div>

                <div className="card-actions">
                  <button className="btn small" onClick={() => handleEdit(i)}>Ред.</button>
                  <button className="btn small danger" onClick={() => handleDelete(i)}>Удалить</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


