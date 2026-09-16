import { useEffect, useRef } from 'react'
import { profile, links, projects } from './data'
import './App.css'

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'div', className = '', children }) {
  const ref = useReveal()
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}

function App() {
  return (
    <>
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />

      <nav className="navbar">
        <span className="brand">{profile.name}.</span>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Work</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#contact">Let's Talk</a>
      </nav>

      <header className="hero">
        <div className="hero-inner">
          <span className="badge">
            <span className="badge-dot" /> {profile.status}
          </span>
          <h1>
            {profile.headlineTop}
            <br />
            <em>{profile.headlineBottom}</em>
          </h1>
          <p className="subtext">{profile.subtext}</p>
          <div className="cta-row">
            <a className="btn-primary" href="#projects">See My Work</a>
            <a className="btn-secondary" href={`mailto:${links.email}`}>Contact Me</a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </header>

      <main>
        <Reveal as="section" className="about-section">
          <h2 id="about">About</h2>
          <p>
            Welcome to my corner of the internet. I'm {profile.name} — I build software
            because I like solving problems and making things that work well. This page
            collects what I've been building, along with ways to reach me.
          </p>
        </Reveal>

        <section id="projects" className="projects-section">
          <Reveal as="h2">Selected Work</Reveal>
          <div className="project-grid">
            {projects.map((project, i) => (
              <Reveal className="project-card" key={project.title}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card-inner"
                >
                  <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal as="section" id="contact" className="contact-section">
          <h2>Get In Touch</h2>
          <p>Have a project in mind, or just want to say hi? I'm around.</p>
          <div className="links">
            <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={`mailto:${links.email}`}>Email</a>
            <a href={links.steam} target="_blank" rel="noreferrer">Steam</a>
          </div>
        </Reveal>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} {profile.name}</p>
      </footer>
    </>
  )
}

export default App
