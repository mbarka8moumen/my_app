import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFiltredPosts] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [detailPost, setDetailPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(result => {
        setPosts(result.data);
        setFiltredPosts(result.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    if (searchId === '') {
      setFiltredPosts(posts);
    } else {
      const filtred = posts.filter(post => post.id === parseInt(searchId));
      setFiltredPosts(filtred);
    }
  };

  const viewDetailPost = async (postId) => {
    try {
      const result = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      setDetailPost(result.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetailPost(null);
    setIsEditing(false);
  };

  const addPost = async () => {
    if (newPostTitle && newPostBody) {
      try {
        const result = await axios.post("https://jsonplaceholder.typicode.com/posts", {
          title: newPostTitle,
          body: newPostBody,
        });
        setPosts([result.data, ...posts]);
        setFiltredPosts([result.data, ...filteredPosts]);
        setNewPostTitle('');
        setNewPostBody('');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const editPost = async () => {
    try {
      const result = await axios.put(`https://jsonplaceholder.typicode.com/posts/${detailPost.id}`, {
        title: detailPost.title,
        body: detailPost.body,
      });
      setPosts(posts.map((post) => (post.id === detailPost.id ? result.data : post)));
      setFiltredPosts(filteredPosts.map((post) => (post.id === detailPost.id ? result.data : post)));
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <form>
        <input
          type="text"
          placeholder="Rechercher par ID"
          onChange={(e) => setSearchId(e.target.value)}
          className="form-control m-2"
        />
        <button type="button" className="btn btn-warning m-2" onClick={handleSearch}>Rechercher</button>

        <h2>Ajouter une nouvelle publication</h2>
        <div>
          <input
            type="text"
            placeholder="Titre"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="form-control m-2"
          />
          <textarea
            placeholder="Contenu"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            className="form-control m-2"
          ></textarea>
          <button type="button" className="btn btn-success m-2" onClick={addPost}>Ajouter</button>
        </div>

        <h2>Liste des publications</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredPosts.length > 0 ? filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>
                    <button type="button" className="btn btn-danger m-2" onClick={() => {
                      setFiltredPosts(filteredPosts.filter(item => item !== post));
                      setPosts(posts.filter(item => item.id !== post.id));
                    }}>Supprimer</button>
                    <button type="button" className="btn btn-info m-2" onClick={() => viewDetailPost(post.id)}>
                      Voir Détail
                    </button>
                  </td>
                </tr>
              )) : <td colSpan={3} className="text-center fw-bold">Aucune publication</td>
            }
          </tbody>
        </table>

        {
          isModalOpen && detailPost && (
            <div className="modale">
              <div className="modale-content">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <label>ID : </label>
                <input type="text" className="form-control" readOnly value={detailPost.id} />
                <label>Titre : </label>
                <input
                  type="text"
                  className="form-control"
                  value={detailPost.title}
                  readOnly={!isEditing}
                  onChange={(e) => setDetailPost({ ...detailPost, title: e.target.value })}
                />
                <label>Body : </label>
                <textarea
                  className="form-control"
                  value={detailPost.body}
                  readOnly={!isEditing}
                  onChange={(e) => setDetailPost({ ...detailPost, body: e.target.value })}
                />
                <button type="button" className="btn btn-primary m-2" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Annuler" : "Modifier"}
                </button>
                {isEditing && (
                  <button type="button" className="btn btn-success m-2" onClick={editPost}>
                    Enregistrer
                  </button>
                )}
              </div>
            </div>
          )
        }
      </form>
    </div>
  );
}

export default App;
