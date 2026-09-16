import { profile, links, projects } from './data'
import './App.css'

function App() {
  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <h1>{profile.name}</h1>
          <p className="tagline">{profile.tagline}</p>
          <p className="bio">{profile.bio}</p>
          <div className="links">
            <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={`mailto:${links.email}`}>Email</a>
            <a href={links.steam} target="_blank" rel="noreferrer">Steam</a>
          </div>
        </div>
      </header>

      <main>
        <section id="projects">
          <h2>Projects</h2>
          <div className="project-grid">
            {projects.map((project) => (
              <a
                key={project.title}
                className="project-card"
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} {profile.name}</p>
      </footer>
    </>
  )
}

export default App
